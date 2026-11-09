import { TextAttributes } from '@opentui/core'
import { type PropsWithChildren, useState } from 'react'
import { createStrictContext } from '@/lib/ui/create-context'
import { icons } from '@/lib/ui/icons'
import { Pressable } from '@/lib/ui/pressable'
import { RovingGroup, useRovingItem } from '@/lib/ui/roving-group'
import type { SelectionProps } from '@/lib/ui/selection'
import { useComponentStyles } from '@/lib/ui/style-review'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { useControllable } from '@/lib/ui/use-controllable'

const [Context, useAccordion] = createStrictContext<{
  selected: string[]
  toggle: (value: string) => void
  disabled: boolean
}>('AccordionItem')
const [Item, useItem] = createStrictContext<{
  value: string
  disabled: boolean
}>('Accordion child')
export function Accordion(
  props: PropsWithChildren<
    SelectionProps & { disabled?: boolean; collapsible?: boolean }
  >,
) {
  const componentStyle = useComponentStyles('accordion')

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
        toggle: (item) => {
          if (props.type === 'single') {
            if (value !== item || props.collapsible)
              setValue(value === item ? '' : item)
          } else
            setValue(
              selected.includes(item)
                ? selected.filter((v) => v !== item)
                : [...selected, item],
            )
        },
      }}
    >
      <RovingGroup orientation="vertical" singleTabStop={false}>
        <box
          flexDirection="column"
          width="100%"
          gap={0}
          {...componentStyle('Accordion', { width: '100%', gap: 0 }, 'box')}
        >
          {props.children}
        </box>
      </RovingGroup>
    </Context>
  )
}
export function AccordionItem({
  children,
  value,
  disabled = false,
}: PropsWithChildren<{ value: string; disabled?: boolean }>) {
  const componentStyle = useComponentStyles('accordion')

  const accordion = useAccordion()
  const theme = useTheme()
  return (
    <Item value={{ value, disabled: disabled || accordion.disabled }}>
      <box
        flexDirection="column"
        width="100%"
        flexShrink={0}
        gap={0}
        border={['bottom']}
        borderColor={theme.border}
        {...componentStyle('AccordionItem', { width: '100%', gap: 0 }, 'box')}
      >
        {children}
      </box>
    </Item>
  )
}
export function AccordionTrigger({
  children,
  label,
}: PropsWithChildren<{ label: string }>) {
  const item = useItem()
  const group = useAccordion()
  const roving = useRovingItem(item.value, item.disabled, label)
  const [hovered, setHovered] = useState(false)
  const theme = useTheme()
  const componentStyle = useComponentStyles('accordion')
  return (
    <Pressable
      styleSource="accordion"
      stylePart="AccordionTrigger"
      {...roving}
      label={label}
      width="100%"
      paddingX={0}
      paddingY={1}
      highlight={false}
      disabled={item.disabled}
      onHoverChange={setHovered}
      onPress={() => group.toggle(item.value)}
    >
      <box flexGrow={1} flexShrink={1} minWidth={0} paddingRight={2}>
        {typeof children === 'string' || children === undefined ? (
          <text
            height={1}
            wrapMode="none"
            truncate
            selectable={false}
            fg={theme.foreground}
            attributes={
              hovered && !item.disabled
                ? TextAttributes.UNDERLINE
                : TextAttributes.NONE
            }
            {...componentStyle(
              'AccordionTrigger.text',
              { height: 1, fg: theme.foreground },
              'text',
            )}
          >
            {children ?? label}
          </text>
        ) : (
          children
        )}
      </box>
      <text
        width={1}
        height={1}
        flexShrink={0}
        selectable={false}
        fg={theme.mutedForeground}
        {...componentStyle(
          'AccordionTrigger.icon',
          { width: 1, height: 1, fg: theme.mutedForeground },
          'text',
        )}
      >
        {group.selected.includes(item.value)
          ? icons.chevronUp
          : icons.chevronDown}
      </text>
    </Pressable>
  )
}
export function AccordionContent({
  children,
  forceMount = false,
}: PropsWithChildren<{ forceMount?: boolean }>) {
  const componentStyle = useComponentStyles('accordion')

  const item = useItem()
  const group = useAccordion()
  const open = group.selected.includes(item.value)
  if (!open && !forceMount) return null
  return (
    <box
      visible={open}
      paddingLeft={0}
      paddingTop={1}
      paddingBottom={1}
      flexDirection="column"
      gap={1}
      {...componentStyle(
        'AccordionContent',
        { paddingLeft: 0, paddingTop: 1, paddingBottom: 1, gap: 1 },
        'box',
      )}
    >
      {children}
    </box>
  )
}
