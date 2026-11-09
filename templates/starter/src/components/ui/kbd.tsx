import type { PropsWithChildren } from 'react'
import { Pill } from '@/lib/ui/pill'
import { useComponentStyles } from '@/lib/ui/style-review'
import { useTheme } from '@/lib/ui/theme/use-theme'
export function Kbd({ children }: { children: string }) {
  const componentStyle = useComponentStyles('kbd')

  const theme = useTheme()
  const { fg, bg, ...surfaceStyle } = componentStyle(
    'Kbd',
    { height: 1, fg: theme.mutedForeground, bg: theme.muted },
    'text',
  )
  return (
    <Pill
      foregroundColor={typeof fg === 'string' ? fg : theme.mutedForeground}
      backgroundColor={typeof bg === 'string' ? bg : theme.muted}
      surfaceStyle={surfaceStyle}
    >
      {children}
    </Pill>
  )
}
export function KbdGroup({ children }: PropsWithChildren) {
  const componentStyle = useComponentStyles('kbd')

  return (
    <box
      flexDirection="row"
      gap={1}
      flexWrap="wrap"
      {...componentStyle('KbdGroup', { gap: 1 }, 'box')}
    >
      {children}
    </box>
  )
}
