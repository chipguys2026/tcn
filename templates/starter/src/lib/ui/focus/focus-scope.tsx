import { type Renderable, ScrollBoxRenderable } from '@opentui/core'
import { useKeyboard, useRenderer } from '@opentui/react'
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'
import { type FocusRecord, getFocusCoordinator } from './coordinator'

type FocusContextValue = {
  record: FocusRecord
  register: (node: Renderable, tabStop?: () => boolean) => () => void
  canFocus: () => boolean
  move: (direction: 1 | -1, from?: Renderable) => boolean
  announce: (label: string) => void
}

const FocusContext = createContext<FocusContextValue | null>(null)
export const useFocusScope = () => useContext(FocusContext)

export function revealFocusedNode(node: Renderable) {
  let parent = node.parent
  while (parent) {
    if (parent instanceof ScrollBoxRenderable)
      parent.scrollChildIntoView(node, { inset: 1 })
    parent = parent.parent
  }
}

export function FocusScope({
  children,
  onFocusChange,
  loop = true,
  trap = false,
  autoFocus = false,
  restoreFocus = false,
  onExit,
}: PropsWithChildren<{
  onFocusChange?: (label: string) => void
  loop?: boolean
  trap?: boolean
  autoFocus?: boolean
  restoreFocus?: boolean
  onExit?: (direction: 1 | -1) => void
}>) {
  const renderer = useRenderer()
  const parent = useFocusScope()
  const coordinator = getFocusCoordinator(renderer)
  const previous = useRef(renderer.currentFocusedRenderable)
  const exitDirection = useRef<1 | -1 | null>(null)
  const record = useMemo<FocusRecord>(
    () => ({ parent: parent?.record ?? null, nodes: new Map(), loop, trap }),
    [parent?.record, loop, trap],
  )
  const onFocusChangeRef = useRef(onFocusChange)
  useLayoutEffect(() => {
    onFocusChangeRef.current = onFocusChange
  }, [onFocusChange])
  const context = useMemo<FocusContextValue>(
    () => ({
      record,
      canFocus: () => coordinator.allowed(record),
      register(node, tabStop = () => true) {
        coordinator.records.add(record)
        record.nodes.set(node, tabStop)
        return () => {
          record.nodes.delete(node)
        }
      },
      move(direction, from) {
        if (!coordinator.allowed(record)) return false
        // Registration time differs from visual order when disclosures mount later.
        const entries: Renderable[] = []
        function visit(node: Renderable) {
          if (record.nodes.has(node)) entries.push(node)
          for (const child of node.getChildren()) visit(child)
        }
        visit(renderer.root)
        const current = entries.findIndex(
          (node) => node === from || (!from && node.focused),
        )
        const start = current < 0 ? (direction === 1 ? -1 : 0) : current
        for (let step = 1; step <= entries.length; step++) {
          const rawIndex = start + direction * step
          if (!record.loop && (rawIndex < 0 || rawIndex >= entries.length))
            return false
          const node =
            entries[
              (start + direction * step + entries.length) % entries.length
            ]
          if (
            !node ||
            node.isDestroyed ||
            !node.focusable ||
            !node.visible ||
            !record.nodes.get(node)?.()
          )
            continue
          let parent = node.parent
          let visible = true
          while (parent) {
            if (!parent.visible) visible = false
            parent = parent.parent
          }
          if (!visible) continue
          node.focus()
          revealFocusedNode(node)
          return true
        }
        return false
      },
      announce: (label) => {
        coordinator.active = record
        onFocusChangeRef.current?.(label)
      },
    }),
    [record, coordinator, renderer],
  )

  useLayoutEffect(() => {
    coordinator.records.add(record)
    if (record.trap) coordinator.traps.push(record)
    if (
      autoFocus &&
      !record.nodes.has(renderer.currentFocusedRenderable as Renderable)
    ) {
      if (!context.move(1) && trap) renderer.currentFocusedRenderable?.blur()
    }
    return () => {
      const wasTop = coordinator.traps.at(-1) === record
      coordinator.remove(record)
      const target = previous.current
      const owner = coordinator.owner(target)
      if (
        restoreFocus &&
        (!trap || wasTop) &&
        target &&
        !target.isDestroyed &&
        target.focusable &&
        target.visible &&
        (!owner || coordinator.allowed(owner))
      ) {
        target.focus()
        if (exitDirection.current && parent)
          parent.move(exitDirection.current, target)
      }
    }
  }, [
    record,
    coordinator,
    renderer,
    context,
    autoFocus,
    restoreFocus,
    trap,
    parent,
  ])

  useKeyboard((key) => {
    if (
      key.defaultPrevented ||
      key.name !== 'tab' ||
      key.ctrl ||
      key.meta ||
      key.option
    )
      return
    if (!coordinator.handles(record)) return
    if (context.move(key.shift ? -1 : 1)) {
      key.preventDefault()
      key.stopPropagation()
    } else if (onExit) {
      exitDirection.current = key.shift ? -1 : 1
      key.preventDefault()
      key.stopPropagation()
      onExit(key.shift ? -1 : 1)
    }
  })
  return <FocusContext value={context}>{children}</FocusContext>
}
