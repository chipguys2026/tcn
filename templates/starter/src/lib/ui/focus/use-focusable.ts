import {
  MouseButton,
  type MouseEvent,
  type Renderable,
  RenderableEvents,
} from '@opentui/core'
import {
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { revealFocusedNode, useFocusScope } from './focus-scope'

export type FocusableHandle = {
  focus: () => void
  blur: () => void
  label: string
}

type FocusableOptions = {
  id?: string
  label: string
  disabled?: boolean
  autoFocus?: boolean
  onBlur?: () => void
  onFocus?: () => void
  tabStop?: boolean
}

type FocusHandlers<T extends Renderable> = {
  onMouseDown?: (this: T, event: MouseEvent) => void
}

/** Native focus adapter shared by controls. No activation or visual behavior. */
export function useFocusable<T extends Renderable = Renderable>({
  id,
  label,
  disabled = false,
  autoFocus = false,
  onBlur,
  onFocus,
  tabStop = true,
}: FocusableOptions) {
  const generatedId = useId()
  const nodeRef = useRef<T>(null)
  const labelRef = useRef(label)
  const onBlurRef = useRef(onBlur)
  const onFocusRef = useRef(onFocus)
  const tabStopRef = useRef(tabStop)
  useLayoutEffect(() => {
    onFocusRef.current = onFocus
    tabStopRef.current = tabStop
  }, [onFocus, tabStop])
  const [focused, setFocused] = useState(false)
  const scope = useFocusScope()

  useLayoutEffect(() => {
    onBlurRef.current = onBlur
  }, [onBlur])
  useLayoutEffect(() => {
    labelRef.current = label
    if (nodeRef.current?.focused) scope?.announce(label)
  }, [label, scope])

  useLayoutEffect(() => {
    const node = nodeRef.current
    if (!node) return
    const unregister = scope?.register(node, () => tabStopRef.current)
    const handleFocus = () => {
      setFocused(true)
      scope?.announce(labelRef.current)
      revealFocusedNode(node)
      onFocusRef.current?.()
    }
    const handleBlur = () => {
      setFocused(false)
      onBlurRef.current?.()
    }
    node.on(RenderableEvents.FOCUSED, handleFocus)
    node.on(RenderableEvents.BLURRED, handleBlur)
    setFocused(node.focused)
    return () => {
      node.off(RenderableEvents.FOCUSED, handleFocus)
      node.off(RenderableEvents.BLURRED, handleBlur)
      unregister?.()
      if (!node.isDestroyed) node.blur()
    }
  }, [scope])

  useLayoutEffect(() => {
    const node = nodeRef.current
    if (!node || !disabled) return
    if (focused) scope?.move(1, node)
    node.blur()
  }, [disabled, focused, scope])

  useLayoutEffect(() => {
    if (autoFocus && !disabled && (!scope || scope.canFocus()))
      nodeRef.current?.focus()
  }, [autoFocus, disabled, scope])

  const focus = useCallback(() => {
    const node = nodeRef.current
    if (!disabled && node && !node.isDestroyed && (!scope || scope.canFocus()))
      node.focus()
  }, [disabled, scope])
  const blur = useCallback(() => {
    const node = nodeRef.current
    if (node && !node.isDestroyed) node.blur()
  }, [])
  const handle = useMemo<FocusableHandle>(
    () => ({ focus, blur, label }),
    [focus, blur, label],
  )

  function getFocusProps(handlers: FocusHandlers<T> = {}) {
    return {
      ref: nodeRef,
      id: id ?? generatedId,
      focusable: !disabled,
      onMouseDown(event: MouseEvent) {
        const node = nodeRef.current
        if (
          !event.defaultPrevented &&
          event.button === MouseButton.LEFT &&
          node &&
          event.x >= node.screenX &&
          event.x < node.screenX + node.width &&
          event.y >= node.screenY &&
          event.y < node.screenY + node.height
        )
          focus()
        if (node) handlers.onMouseDown?.call(node, event)
      },
    }
  }

  return { focused, handle, getFocusProps }
}
