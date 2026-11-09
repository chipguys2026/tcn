import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from 'react'
import type { FloatingContentProps, FloatingRootProps } from '@/lib/ui/floating'
import { createMenuFamily } from '@/lib/ui/menu'
import { Pressable } from '@/lib/ui/pressable'
import { contextMenuDefaults } from '@/lib/ui/styles'

const menu = createMenuFamily(
  'ContextMenu',
  'context-menu',
  contextMenuDefaults,
)
const Point = createContext<{
  point?: { x: number; y: number }
  setPoint: (point?: { x: number; y: number }) => void
}>({ setPoint: () => {} })
export function ContextMenu({ children, ...props }: FloatingRootProps) {
  const [point, setPoint] = useState<{ x: number; y: number }>()
  return (
    <Point value={{ point, setPoint }}>
      <menu.Root {...props}>{children}</menu.Root>
    </Point>
  )
}
export function ContextMenuTrigger({
  children,
  label = 'Open context menu',
  disabled = false,
  autoFocus = false,
  id,
}: PropsWithChildren<{
  label?: string
  disabled?: boolean
  autoFocus?: boolean
  id?: string
}>) {
  const state = menu.useFloating(),
    { setPoint } = useContext(Point)
  return (
    <Pressable
      id={id}
      ref={state.anchor}
      styleSource="context-menu"
      stylePart="Trigger"
      label={label}
      disabled={disabled}
      autoFocus={autoFocus}
      onContextMenu={(event) => {
        setPoint({ x: event.x, y: event.y })
        state.setOpen(true)
      }}
      onKeyDown={(key) => {
        if (disabled || key.ctrl || key.meta || key.option || key.repeated)
          return
        if (
          (key.name === 'f10' && key.shift) ||
          ['menu', 'contextmenu'].includes(key.name)
        ) {
          key.preventDefault()
          key.stopPropagation()
          setPoint(undefined)
          state.setOpen(true)
        }
      }}
    >
      {children ?? label}
    </Pressable>
  )
}
export function ContextMenuContent(props: FloatingContentProps) {
  const { point } = useContext(Point)
  return (
    <menu.Content
      side={point ? 'right' : 'bottom'}
      {...props}
      anchorPoint={point}
    />
  )
}
export const ContextMenuItem = menu.Item
export const ContextMenuCheckboxItem = menu.CheckboxItem
export const ContextMenuRadioGroup = menu.RadioGroup
export const ContextMenuRadioItem = menu.RadioItem
export const ContextMenuLabel = menu.Label
export const ContextMenuGroup = menu.Group
export { Separator as ContextMenuSeparator } from './separator'
