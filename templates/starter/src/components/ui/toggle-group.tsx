import type { PropsWithChildren } from 'react'
import { createStrictContext } from '@/lib/ui/create-context'
import { Pressable } from '@/lib/ui/pressable'
import { RovingGroup, useRovingItem } from '@/lib/ui/roving-group'
import type { SelectionProps } from '@/lib/ui/selection'
import { useComponentStyles } from '@/lib/ui/style-review'
import { useControllable } from '@/lib/ui/use-controllable'

const [Context, useGroup] = createStrictContext<{
  selected: string[]
  toggle: (value: string) => void
  disabled: boolean
}>('ToggleGroupItem')
export function ToggleGroup(
  props: PropsWithChildren<
    SelectionProps & {
      disabled?: boolean
      orientation?: 'horizontal' | 'vertical'
    }
  >,
) {
  const componentStyle = useComponentStyles('toggle-group')

  const [value, setValue] = useControllable<string | string[]>(
    props.value,
    props.defaultValue ?? (props.type === 'multiple' ? [] : ''),
    (next) => {
      if (props.type === 'single' && typeof next === 'string')
        props.onValueChange?.(next)
      if (props.type === 'multiple' && Array.isArray(next))
        props.onValueChange?.(next)
    },
  )
  const selected = Array.isArray(value) ? value : [value]
  return (
    <Context
      value={{
        selected,
        disabled: props.disabled ?? false,
        toggle: (item) =>
          setValue(
            props.type === 'single'
              ? value === item
                ? ''
                : item
              : selected.includes(item)
                ? selected.filter((v) => v !== item)
                : [...selected, item],
          ),
      }}
    >
      <RovingGroup orientation={props.orientation}>
        <box
          flexDirection={props.orientation === 'vertical' ? 'column' : 'row'}
          gap={2}
          {...componentStyle('ToggleGroup', { gap: 2 }, 'box')}
        >
          {props.children}
        </box>
      </RovingGroup>
    </Context>
  )
}
export function ToggleGroupItem({
  value,
  children,
  disabled = false,
  label = value,
}: PropsWithChildren<{ value: string; label?: string; disabled?: boolean }>) {
  const group = useGroup()
  const inactive = disabled || group.disabled
  const roving = useRovingItem(value, inactive)
  return (
    <Pressable
      styleSource="toggle-group"
      stylePart="ToggleGroupItem"
      {...roving}
      label={label}
      disabled={inactive}
      selected={group.selected.includes(value)}
      onPress={() => group.toggle(value)}
    >
      {children ?? label}
    </Pressable>
  )
}
