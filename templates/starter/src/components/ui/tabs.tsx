import type { PropsWithChildren } from 'react'
import { createStrictContext } from '@/lib/ui/create-context'
import { Pressable } from '@/lib/ui/pressable'
import { RovingGroup, useRovingItem } from '@/lib/ui/roving-group'
import { useComponentStyles } from '@/lib/ui/style-review'
import { useControllable } from '@/lib/ui/use-controllable'
import { tabsDefaults } from './tabs.styles'

type State = {
  value: string
  select: (value: string) => void
  orientation: 'horizontal' | 'vertical'
  activationMode: 'automatic' | 'manual'
}
const [Context, useTabs] = createStrictContext<State>('Tabs child')
export function Tabs({
  children,
  value,
  defaultValue = '',
  onValueChange,
  orientation = 'horizontal',
  activationMode = 'automatic',
}: PropsWithChildren<{
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: State['orientation']
  activationMode?: State['activationMode']
}>) {
  const componentStyle = useComponentStyles('tabs')

  const [selected, select] = useControllable(value, defaultValue, onValueChange)
  return (
    <Context value={{ value: selected, select, orientation, activationMode }}>
      <box
        flexDirection="column"
        gap={1}
        {...componentStyle('Tabs', { gap: 1 }, 'box')}
      >
        {children}
      </box>
    </Context>
  )
}
export function TabsList({ children }: PropsWithChildren) {
  const componentStyle = useComponentStyles('tabs')

  const tabs = useTabs()
  return (
    <RovingGroup
      orientation={tabs.orientation}
      value={tabs.value || undefined}
      onMove={tabs.activationMode === 'automatic' ? tabs.select : undefined}
    >
      <box
        flexDirection={tabs.orientation === 'horizontal' ? 'row' : 'column'}
        gap={tabsDefaults.list.gap}
        {...componentStyle('TabsList', { ...tabsDefaults.list }, 'box')}
      >
        {children}
      </box>
    </RovingGroup>
  )
}
export function TabsTrigger({
  children,
  value,
  disabled = false,
  label = value,
}: PropsWithChildren<{ value: string; label?: string; disabled?: boolean }>) {
  const tabs = useTabs()
  const roving = useRovingItem(value, disabled)
  return (
    <Pressable
      styleSource="tabs"
      stylePart="TabsTrigger"
      {...roving}
      label={label}
      disabled={disabled}
      selected={tabs.value === value}
      onPress={() => tabs.select(value)}
    >
      {children ?? label}
    </Pressable>
  )
}
export function TabsContent({
  children,
  value,
  forceMount = false,
}: PropsWithChildren<{ value: string; forceMount?: boolean }>) {
  const componentStyle = useComponentStyles('tabs')

  const tabs = useTabs()
  if (tabs.value !== value && !forceMount) return null
  return (
    <box
      visible={tabs.value === value}
      flexDirection="column"
      gap={1}
      {...componentStyle('TabsContent', { gap: 1 }, 'box')}
    >
      {children}
    </box>
  )
}
