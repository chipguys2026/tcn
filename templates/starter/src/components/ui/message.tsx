import type { BoxRenderable } from '@opentui/core'
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { PartBox } from '@/lib/ui/parts'
import { messageDefaults as d } from '@/lib/ui/styles'

const Align = createContext<'start' | 'end'>('start')
const AvatarAlignment = createContext<{
  offset: number
  setOffset: (n: number) => void
} | null>(null)
export function Message({
  children,
  align = 'start',
}: PropsWithChildren<{ align?: 'start' | 'end' }>) {
  const [offset, setOffset] = useState(0)
  return (
    <Align value={align}>
      <AvatarAlignment value={{ offset, setOffset }}>
        <PartBox
          source="message"
          part="Message"
          width="100%"
          flexDirection={align === 'start' ? 'row' : 'row-reverse'}
          alignItems="flex-end"
          gap={d.gap}
        >
          {children}
        </PartBox>
      </AvatarAlignment>
    </Align>
  )
}
export function MessageGroup({ children }: PropsWithChildren) {
  return (
    <PartBox source="message" part="MessageGroup" width="100%" gap={d.groupGap}>
      {children}
    </PartBox>
  )
}
export function MessageAvatar({ children }: PropsWithChildren) {
  const layout = useContext(AvatarAlignment)
  return (
    <PartBox
      source="message"
      part="MessageAvatar"
      flexShrink={0}
      marginBottom={layout?.offset ?? 0}
    >
      {children}
    </PartBox>
  )
}
export function MessageContent({ children }: PropsWithChildren) {
  const align = useContext(Align)
  return (
    <PartBox
      source="message"
      part="MessageContent"
      flexShrink={1}
      maxWidth="85%"
      alignItems={align === 'start' ? 'flex-start' : 'flex-end'}
      gap={d.contentGap}
    >
      {children}
    </PartBox>
  )
}
export function MessageHeader({ children }: PropsWithChildren) {
  const align = useContext(Align)
  return (
    <PartBox
      source="message"
      part="MessageHeader"
      flexDirection="row"
      flexWrap="wrap"
      justifyContent={align === 'start' ? 'flex-start' : 'flex-end'}
      gap={d.gap}
    >
      {children}
    </PartBox>
  )
}
export function MessageFooter({ children }: PropsWithChildren) {
  const align = useContext(Align),
    layout = useContext(AvatarAlignment),
    ref = useRef<BoxRenderable>(null),
    last = useRef(0),
    setOffset = layout?.setOffset
  useLayoutEffect(() => () => setOffset?.(0), [setOffset])
  const measure = () => {
    const n = ref.current,
      p = n?.parent
    if (!n || !p) return
    const siblings = p.getChildren(),
      previous = siblings[siblings.indexOf(n) - 1],
      offset = previous
        ? Math.max(0, p.screenY + p.height - previous.screenY - previous.height)
        : 0
    if (last.current !== offset) {
      last.current = offset
      setOffset?.(offset)
    }
  }
  return (
    <PartBox
      ref={ref}
      renderBefore={measure}
      source="message"
      part="MessageFooter"
      flexDirection="row"
      flexWrap="wrap"
      justifyContent={align === 'start' ? 'flex-start' : 'flex-end'}
      gap={d.gap}
    >
      {children}
    </PartBox>
  )
}
