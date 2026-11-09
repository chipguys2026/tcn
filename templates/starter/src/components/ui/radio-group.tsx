import type { PropsWithChildren } from 'react'
import { createStrictContext } from '@/lib/ui/create-context'
import { Pressable } from '@/lib/ui/pressable'
import { RovingGroup, useRovingItem } from '@/lib/ui/roving-group'
import { useComponentStyles } from '@/lib/ui/style-review'
import { useControllable } from '@/lib/ui/use-controllable'

const [Context, useGroup] = createStrictContext<{
  value: string
  select: (value: string) => void
  disabled: boolean
}>('RadioGroupItem')
export function RadioGroup({
  children,
  value,
  defaultValue = '',
  onValueChange,
  disabled = false,
  orientation = 'vertical',
}: PropsWithChildren<{
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
}>) {
  const componentStyle = useComponentStyles('radio-group')

  const [selected, select] = useControllable(value, defaultValue, onValueChange)
  return (
    <Context value={{ value: selected, select, disabled }}>
      <RovingGroup
        value={selected || undefined}
        orientation={orientation}
        onMove={select}
      >
        <box
          flexDirection={orientation === 'vertical' ? 'column' : 'row'}
          gap={1}
          {...componentStyle('RadioGroup', { gap: 1 }, 'box')}
        >
          {children}
        </box>
      </RovingGroup>
    </Context>
  )
}
export function RadioGroupItem({
  value,
  label = value,
  disabled = false,
}: {
  value: string
  label?: string
  disabled?: boolean
}) {
  const group = useGroup()
  const inactive = disabled || group.disabled
  const roving = useRovingItem(value, inactive)
  return (
    <Pressable
      styleSource="radio-group"
      stylePart="RadioGroupItem"
      {...roving}
      label={label}
      disabled={inactive}
      onPress={() => group.select(value)}
    >{`${group.value === value ? '\uf192' : '\uf10c'} ${label}`}</Pressable>
  )
}
