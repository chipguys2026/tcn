import { TextAttributes } from '@opentui/core'
import type { PropsWithChildren } from 'react'
import { createStrictContext } from '@/lib/ui/create-context'
import { icons } from '@/lib/ui/icons'
import { Pressable } from '@/lib/ui/pressable'
import { useComponentStyles } from '@/lib/ui/style-review'
import { collapsibleDefaults } from '@/lib/ui/styles'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { useControllable } from '@/lib/ui/use-controllable'

const [Context, useCollapsible] = createStrictContext<{
  open: boolean
  toggle: () => void
  disabled: boolean
}>('Collapsible child')
export function Collapsible({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
}: PropsWithChildren<{
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
}>) {
  const componentStyle = useComponentStyles('collapsible')

  const [shown, setShown] = useControllable(open, defaultOpen, onOpenChange)
  return (
    <Context value={{ open: shown, toggle: () => setShown(!shown), disabled }}>
      <box
        flexDirection="column"
        width="100%"
        gap={1}
        {...componentStyle('Collapsible', { width: '100%', gap: 1 }, 'box')}
      >
        {children}
      </box>
    </Context>
  )
}
export function CollapsibleTrigger({
  children,
  label = 'Toggle details',
}: PropsWithChildren<{ label?: string }>) {
  const state = useCollapsible()
  const theme = useTheme()
  const componentStyle = useComponentStyles('collapsible')
  return (
    <box
      width="100%"
      flexDirection="row"
      alignItems="center"
      gap={2}
      {...componentStyle('CollapsibleHeader', { width: '100%', gap: 2 }, 'box')}
    >
      <box flexGrow={1} flexShrink={1} minWidth={0}>
        {typeof children === 'string' || children === undefined ? (
          <text
            height={1}
            wrapMode="none"
            truncate
            fg={theme.foreground}
            attributes={TextAttributes.BOLD}
            opacity={state.disabled ? 0.45 : 1}
            {...componentStyle(
              'CollapsibleLabel',
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
      <Pressable
        styleSource="collapsible"
        stylePart="CollapsibleTrigger"
        label={label}
        paddingX={1}
        disabled={state.disabled}
        onPress={state.toggle}
      >
        <text
          height={1}
          width={1}
          selectable={false}
          fg={theme.mutedForeground}
          {...componentStyle(
            'CollapsibleTrigger.text',
            { height: 1, width: 1, fg: theme.mutedForeground },
            'text',
          )}
        >
          {state.open ? icons.chevronUp : icons.chevronDown}
        </text>
      </Pressable>
    </box>
  )
}
export function CollapsibleContent({
  children,
  forceMount = false,
}: PropsWithChildren<{ forceMount?: boolean }>) {
  const componentStyle = useComponentStyles('collapsible')

  const state = useCollapsible()
  if (!state.open && !forceMount) return null
  return (
    <box
      visible={state.open}
      {...collapsibleDefaults.content}
      flexDirection="column"
      gap={1}
      {...componentStyle(
        'CollapsibleContent',
        { ...collapsibleDefaults.content, gap: 1 },
        'box',
      )}
    >
      {children}
    </box>
  )
}
