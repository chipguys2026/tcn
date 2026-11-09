import type { BoxRenderable, ScrollBoxRenderable } from '@opentui/core'
import {
  type PropsWithChildren,
  type RefObject,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createStrictContext } from '@/lib/ui/create-context'
import { useFocusable } from '@/lib/ui/focus/use-focusable'
import { useFocusRing } from '@/lib/ui/focus-ring'
import { PartBox } from '@/lib/ui/parts'
import { useComponentStyles } from '@/lib/ui/style-review'
import { messageScrollerDefaults as d } from '@/lib/ui/styles'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { Button } from './button'

type Snapshot = {
  top: number
  height: number
  viewport: number
  first?: string
  anchor?: string
  offset: number
  bottom: boolean
}
const [Context, useScroller] = createStrictContext<{
  viewport: RefObject<ScrollBoxRenderable | null>
  items: Map<string, BoxRenderable>
  atBottom: boolean
  setAtBottom: (v: boolean) => void
  following: RefObject<boolean>
  scrollToBottom: () => void
  scrollToMessage: (id: string) => boolean
}>('MessageScrollerProvider')
export function MessageScrollerProvider({ children }: PropsWithChildren) {
  const viewport = useRef<ScrollBoxRenderable>(null),
    items = useRef(new Map<string, BoxRenderable>()).current,
    following = useRef(true),
    [atBottom, setAtBottom] = useState(true)
  const scrollToBottom = () => {
    const v = viewport.current
    if (!v || v.isDestroyed) return
    following.current = true
    v.scrollTo({ x: 0, y: Math.max(0, v.scrollHeight - v.viewport.height) })
    setAtBottom(true)
  }
  const scrollToMessage = (id: string) => {
    const v = viewport.current,
      item = items.get(id)
    if (!v || !item) return false
    following.current = false
    v.scrollChildIntoView(item, { align: 'start' })
    return true
  }
  return (
    <Context
      value={{
        viewport,
        items,
        atBottom,
        setAtBottom,
        following,
        scrollToBottom,
        scrollToMessage,
      }}
    >
      {children}
    </Context>
  )
}
export function useMessageScroller() {
  const s = useScroller()
  return {
    atBottom: s.atBottom,
    scrollToBottom: s.scrollToBottom,
    scrollToMessage: s.scrollToMessage,
  }
}
export function MessageScroller({
  children,
  height = d.height,
}: PropsWithChildren<{ height?: number | 'auto' }>) {
  return (
    <PartBox
      source="message-scroller"
      part="MessageScroller"
      width="100%"
      height={height}
      minHeight={3}
      gap={d.gap}
    >
      {children}
    </PartBox>
  )
}
export function MessageScrollerViewport({
  children,
  label = 'Messages',
  id,
}: PropsWithChildren<{ label?: string; id?: string }>) {
  const s = useScroller(),
    theme = useTheme(),
    styles = useComponentStyles('message-scroller'),
    focus = useFocusable<ScrollBoxRenderable>({ id, label }),
    props = focus.getFocusProps(),
    previous = useRef<Snapshot | null>(null)
  useFocusRing(props.ref, focus.focused, theme.ring)
  useLayoutEffect(() => {
    s.viewport.current = props.ref.current
    return () => {
      s.viewport.current = null
    }
  }, [s.viewport, props.ref])
  const measure = () => {
    const v = props.ref.current
    if (!v || v.isDestroyed || !v.visible) return
    const ordered = [...s.items.entries()]
        .filter(([, n]) => !n.isDestroyed)
        .sort((a, b) => a[1].screenY - b[1].screenY),
      first = ordered[0]?.[0],
      old = previous.current
    const changed =
      !!old &&
      (old.height !== v.scrollHeight ||
        old.viewport !== v.viewport.height ||
        old.first !== first)
    if (changed && old) {
      if (old.first !== first && old.anchor && !old.bottom) {
        const anchor = s.items.get(old.anchor)
        if (anchor)
          v.scrollTo({
            x: 0,
            y: v.scrollTop + anchor.screenY - v.viewport.screenY - old.offset,
          })
      } else if (
        s.following.current &&
        old.bottom &&
        Math.abs(v.scrollTop - old.top) <= 1
      )
        v.scrollTo({ x: 0, y: Math.max(0, v.scrollHeight - v.viewport.height) })
    } else if (!old && s.following.current)
      v.scrollTo({ x: 0, y: Math.max(0, v.scrollHeight - v.viewport.height) })
    const bottom =
      v.scrollHeight - v.viewport.height - v.scrollTop <= d.threshold
    s.following.current = bottom
    if (bottom !== s.atBottom) s.setAtBottom(bottom)
    const anchor = ordered.find(
      ([, n]) => n.screenY + n.height > v.viewport.screenY,
    )
    previous.current = {
      top: v.scrollTop,
      height: v.scrollHeight,
      viewport: v.viewport.height,
      first,
      anchor: anchor?.[0],
      offset: anchor ? anchor[1].screenY - v.viewport.screenY : 0,
      bottom,
    }
  }
  return (
    <scrollbox
      {...props}
      flexGrow={1}
      minHeight={1}
      width="100%"
      scrollY
      scrollX={false}
      viewportCulling={false}
      renderBefore={measure}
      {...styles('MessageScrollerViewport', { flexGrow: 1, minHeight: 1 })}
    >
      {children}
    </scrollbox>
  )
}
export function MessageScrollerContent({ children }: PropsWithChildren) {
  return (
    <PartBox
      source="message-scroller"
      part="MessageScrollerContent"
      width="100%"
      gap={d.gap}
      flexShrink={0}
    >
      {children}
    </PartBox>
  )
}
export function MessageScrollerItem({
  children,
  id,
}: PropsWithChildren<{ id: string }>) {
  const s = useScroller(),
    ref = useRef<BoxRenderable>(null)
  useLayoutEffect(() => {
    const n = ref.current
    if (!n) return
    if (s.items.has(id)) throw new Error(`Duplicate message ID: ${id}`)
    s.items.set(id, n)
    return () => {
      s.items.delete(id)
    }
  }, [s.items, id])
  return (
    <PartBox
      ref={ref}
      source="message-scroller"
      part="MessageScrollerItem"
      width="100%"
      flexShrink={0}
    >
      {children}
    </PartBox>
  )
}
export function MessageScrollerButton({
  children = 'Jump to latest',
}: {
  children?: string
}) {
  const s = useScroller()
  return (
    <PartBox
      source="message-scroller"
      part="MessageScrollerButton"
      height={1}
      flexShrink={0}
      alignItems="flex-end"
    >
      {!s.atBottom && (
        <Button variant="secondary" onPress={s.scrollToBottom}>
          {children}
        </Button>
      )}
    </PartBox>
  )
}
