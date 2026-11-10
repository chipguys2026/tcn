import type { PropsWithChildren } from 'react'
import { type IconValue, resolveIcon } from '@/lib/ui/icons'
import { useComponentStyles } from '@/lib/ui/style-review'
import { emptyDefaults } from '@/lib/ui/styles'
import { useTheme } from '@/lib/ui/theme/use-theme'
export function Empty({ children }: PropsWithChildren) {
  const componentStyle = useComponentStyles('empty')

  const theme = useTheme()
  return (
    <box
      width="100%"
      {...emptyDefaults}
      gap={1}
      alignItems="center"
      flexDirection="column"
      backgroundColor={theme.muted}
      {...componentStyle(
        'Empty',
        {
          width: '100%',
          ...emptyDefaults,
          gap: 1,
          backgroundColor: theme.muted,
        },
        'box',
      )}
    >
      {children}
    </box>
  )
}
export function EmptyHeader({ children }: PropsWithChildren) {
  const componentStyle = useComponentStyles('empty')

  return (
    <box
      flexDirection="column"
      alignItems="center"
      gap={1}
      {...componentStyle('EmptyHeader', { gap: 1 }, 'box')}
    >
      {children}
    </box>
  )
}
export function EmptyMedia({ icon }: { icon: IconValue }) {
  const componentStyle = useComponentStyles('empty')

  const theme = useTheme()
  return (
    <text
      fg={theme.mutedForeground}
      {...componentStyle('EmptyMedia', { fg: theme.mutedForeground }, 'text')}
    >
      {resolveIcon(icon)}
    </text>
  )
}
export function EmptyTitle({ children }: { children: string }) {
  const componentStyle = useComponentStyles('empty')

  const theme = useTheme()
  return (
    <text
      fg={theme.foreground}
      {...componentStyle('EmptyTitle', { fg: theme.foreground }, 'text')}
    >
      {children}
    </text>
  )
}
export function EmptyDescription({ children }: { children: string }) {
  const componentStyle = useComponentStyles('empty')

  const theme = useTheme()
  return (
    <text
      fg={theme.mutedForeground}
      {...componentStyle(
        'EmptyDescription',
        { fg: theme.mutedForeground },
        'text',
      )}
    >
      {children}
    </text>
  )
}
export function EmptyContent({ children }: PropsWithChildren) {
  const componentStyle = useComponentStyles('empty')

  return (
    <box
      flexDirection="row"
      gap={2}
      flexWrap="wrap"
      {...componentStyle('EmptyContent', { gap: 2 }, 'box')}
    >
      {children}
    </box>
  )
}
