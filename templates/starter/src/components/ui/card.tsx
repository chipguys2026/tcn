import { TextAttributes } from '@opentui/core'
import type { PropsWithChildren } from 'react'
import { useComponentStyles } from '@/lib/ui/style-review'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { cardDefaults } from './card.styles'
export function Card({
  children,
  width = '100%',
  height,
}: PropsWithChildren<{ width?: number | `${number}%`; height?: number }>) {
  const componentStyle = useComponentStyles('card')

  const theme = useTheme()
  return (
    <box
      width={width}
      height={height}
      maxWidth="100%"
      flexDirection="column"
      paddingX={cardDefaults.paddingX}
      paddingY={1}
      gap={1}
      backgroundColor={
        theme.card === theme.background ? theme.secondary : theme.card
      }
      {...componentStyle(
        'Card',
        {
          width: width,
          height: height,
          paddingX: cardDefaults.paddingX,
          paddingY: 1,
          gap: 1,
          backgroundColor:
            theme.card === theme.background ? theme.secondary : theme.card,
        },
        'box',
      )}
    >
      {children}
    </box>
  )
}
export function CardHeader({ children }: PropsWithChildren) {
  const componentStyle = useComponentStyles('card')

  return (
    <box
      flexDirection="column"
      gap={1}
      {...componentStyle('CardHeader', { gap: 1 }, 'box')}
    >
      {children}
    </box>
  )
}
export function CardTitle({ children }: { children: string }) {
  const componentStyle = useComponentStyles('card')

  const theme = useTheme()
  return (
    <text
      fg={theme.cardForeground}
      attributes={TextAttributes.BOLD}
      {...componentStyle('CardTitle', { fg: theme.cardForeground }, 'text')}
    >
      {children}
    </text>
  )
}
export function CardDescription({ children }: { children: string }) {
  const componentStyle = useComponentStyles('card')

  const theme = useTheme()
  return (
    <text
      fg={theme.mutedForeground}
      {...componentStyle(
        'CardDescription',
        { fg: theme.mutedForeground },
        'text',
      )}
    >
      {children}
    </text>
  )
}
export function CardContent({ children }: PropsWithChildren) {
  const componentStyle = useComponentStyles('card')

  return (
    <box
      flexDirection="column"
      gap={1}
      {...componentStyle('CardContent', { gap: 1 }, 'box')}
    >
      {children}
    </box>
  )
}
export function CardFooter({ children }: PropsWithChildren) {
  const componentStyle = useComponentStyles('card')

  return (
    <box
      flexDirection="row"
      gap={2}
      flexWrap="wrap"
      {...componentStyle('CardFooter', { gap: 2 }, 'box')}
    >
      {children}
    </box>
  )
}
