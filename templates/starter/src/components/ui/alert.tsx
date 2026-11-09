import { TextAttributes } from '@opentui/core'
import { createContext, type PropsWithChildren, useContext } from 'react'
import { type IconName, icons } from '@/lib/ui/icons'
import { useComponentStyles } from '@/lib/ui/style-review'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { alertDefaults } from './alert.styles'

const AlertContext = createContext(false)
export function Alert({
  children,
  variant = 'default',
  icon,
}: PropsWithChildren<{
  variant?: 'default' | 'destructive'
  icon?: IconName
}>) {
  const componentStyle = useComponentStyles('alert')

  const theme = useTheme(),
    destructive = variant === 'destructive'
  return (
    <AlertContext value={destructive}>
      <box
        width="100%"
        paddingX={alertDefaults.paddingX}
        paddingY={1}
        backgroundColor={
          destructive
            ? `${theme.destructive}1A`
            : theme.card === theme.background
              ? theme.secondary
              : theme.card
        }
        flexDirection="row"
        gap={alertDefaults.gap}
        {...componentStyle(
          'Alert',
          {
            width: '100%',
            paddingX: alertDefaults.paddingX,
            paddingY: 1,
            backgroundColor: destructive
              ? `${theme.destructive}1A`
              : theme.card === theme.background
                ? theme.secondary
                : theme.card,
            gap: alertDefaults.gap,
          },
          'box',
        )}
      >
        {icon && (
          <text
            fg={destructive ? theme.destructive : theme.foreground}
            {...componentStyle(
              'Alert.text',
              { fg: destructive ? theme.destructive : theme.foreground },
              'text',
            )}
          >
            {icons[icon]}
          </text>
        )}
        <box
          flexGrow={1}
          flexDirection="column"
          gap={1}
          {...componentStyle('Alert.box2', { gap: 1 }, 'box')}
        >
          {children}
        </box>
      </box>
    </AlertContext>
  )
}
export function AlertTitle({ children }: { children: string }) {
  const componentStyle = useComponentStyles('alert')

  const theme = useTheme(),
    error = useContext(AlertContext)
  return (
    <text
      attributes={TextAttributes.BOLD}
      fg={error ? theme.destructive : theme.foreground}
      {...componentStyle(
        'AlertTitle',
        { fg: error ? theme.destructive : theme.foreground },
        'text',
      )}
    >
      {children}
    </text>
  )
}
export function AlertDescription({ children }: { children: string }) {
  const componentStyle = useComponentStyles('alert')

  const theme = useTheme()
  return (
    <text
      fg={theme.mutedForeground}
      {...componentStyle(
        'AlertDescription',
        { fg: theme.mutedForeground },
        'text',
      )}
    >
      {children}
    </text>
  )
}
