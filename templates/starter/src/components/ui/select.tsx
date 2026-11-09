import { Children, isValidElement, type PropsWithChildren, useRef } from 'react'
import { createStrictContext } from '@/lib/ui/create-context'
import { Overlay, type PopupSizing } from '@/lib/ui/overlay'
import { Pressable, type PressableHandle } from '@/lib/ui/pressable'
import { RovingGroup, useRovingItem } from '@/lib/ui/roving-group'
import { useComponentStyles, useStyleReview } from '@/lib/ui/style-review'
import { selectDefaults } from '@/lib/ui/styles'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { useControllable } from '@/lib/ui/use-controllable'

const [Context, useSelect] = createStrictContext<{
  value: string
  select: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  disabled: boolean
  anchor: React.RefObject<PressableHandle | null>
  labels: Map<string, string>
}>('Select child')
type ItemProps = { value: string; children?: string; disabled?: boolean }
function labelsIn(
  children: React.ReactNode,
  labels = new Map<string, string>(),
) {
  Children.forEach(children, (child) => {
    if (!isValidElement<{ children?: React.ReactNode; value?: string }>(child))
      return
    if (child.type === SelectItem && child.props.value)
      labels.set(
        child.props.value,
        typeof child.props.children === 'string'
          ? child.props.children
          : child.props.value,
      )
    else labelsIn(child.props.children, labels)
  })
  return labels
}
export function Select({
  children,
  value,
  defaultValue = '',
  onValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
}: PropsWithChildren<{
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
}>) {
  const [selected, select] = useControllable(value, defaultValue, onValueChange)
  const inspecting = useStyleReview()?.openPopups ?? false
  const [shown, setOpen] = useControllable(open, defaultOpen, onOpenChange)
  const anchor = useRef<PressableHandle>(null)
  return (
    <Context
      value={{
        value: selected,
        select,
        open: shown || inspecting,
        setOpen,
        disabled,
        anchor,
        labels: labelsIn(children),
      }}
    >
      {children}
    </Context>
  )
}
export function SelectTrigger({
  children,
  label = 'Choose an option',
  disabled = false,
}: PropsWithChildren<{ label?: string; disabled?: boolean }>) {
  const state = useSelect()
  return (
    <Pressable
      styleSource="select"
      stylePart="SelectTrigger"
      {...selectDefaults.trigger}
      ref={state.anchor}
      label={label}
      disabled={disabled || state.disabled}
      onKeyDown={(key) => {
        if (['up', 'down'].includes(key.name)) {
          key.preventDefault()
          key.stopPropagation()
          state.setOpen(true)
        }
      }}
      onPress={() => state.setOpen(!state.open)}
    >
      {children ?? <SelectValue placeholder={label} />}
    </Pressable>
  )
}
export function SelectValue({
  placeholder = 'Choose an option',
}: {
  placeholder?: string
}) {
  const componentStyle = useComponentStyles('select')

  const state = useSelect()
  const theme = useTheme()
  return (
    <text
      fg={state.value ? theme.foreground : theme.mutedForeground}
      {...componentStyle(
        'SelectValue',
        { fg: state.value ? theme.foreground : theme.mutedForeground },
        'text',
      )}
    >{`${state.labels.get(state.value) ?? (state.value || placeholder)} \uf0d7`}</text>
  )
}
export function SelectContent({
  children,
  ...sizing
}: PropsWithChildren<PopupSizing>) {
  const state = useSelect()
  if (!state.open || state.disabled) return null
  return (
    <Overlay
      styleSource="select"
      stylePart="SelectContent"
      anchor={state.anchor}
      {...selectDefaults.content}
      {...sizing}
      avoidAnchor
      onClose={() => state.setOpen(false)}
    >
      <RovingGroup orientation="vertical" value={state.value || undefined}>
        {children}
      </RovingGroup>
    </Overlay>
  )
}
export function SelectItem({
  value,
  children = value,
  disabled = false,
}: ItemProps) {
  const state = useSelect()
  const roving = useRovingItem(value, disabled, children)
  return (
    <Pressable
      styleSource="select"
      stylePart="SelectItem"
      {...selectDefaults.item}
      {...roving}
      label={children}
      disabled={disabled}
      selected={state.value === value}
      onPress={() => {
        state.select(value)
        state.setOpen(false)
      }}
    >{`${state.value === value ? '\uf00c' : ' '} ${children}`}</Pressable>
  )
}
export function SelectGroup({ children }: PropsWithChildren) {
  const componentStyle = useComponentStyles('select')

  return (
    <box
      flexDirection="column"
      gap={1}
      {...componentStyle('SelectGroup', { gap: 1 }, 'box')}
    >
      {children}
    </box>
  )
}
export function SelectLabel({ children }: { children: string }) {
  const componentStyle = useComponentStyles('select')

  const theme = useTheme()
  return (
    <text
      fg={theme.mutedForeground}
      {...componentStyle('SelectLabel', { fg: theme.mutedForeground }, 'text')}
    >
      {children}
    </text>
  )
}
export { Separator as SelectSeparator } from './separator'
