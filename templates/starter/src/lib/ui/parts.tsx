import { TextAttributes } from '@opentui/core'
import type { BoxProps, TextProps } from '@opentui/react'
import { useComponentStyles } from './style-review'
import { useTheme } from './theme/use-theme'

/** Shared rendering and Tweak observation for passive composition parts. */
export function PartBox({
  source,
  part,
  ...props
}: BoxProps & { source: string; part: string }) {
  const styles = useComponentStyles(source)
  const layout: BoxProps = {
    minWidth: 0,
    maxWidth: '100%',
    flexDirection: 'column',
    ...props,
  }
  return <box {...layout} {...styles(part, { ...layout })} />
}
export function PartText({
  source,
  part,
  tone = 'foreground',
  bold = false,
  ...props
}: TextProps & {
  source: string
  part: string
  tone?: 'foreground' | 'mutedForeground' | 'destructive'
  bold?: boolean
}) {
  const styles = useComponentStyles(source),
    theme = useTheme()
  const appearance = {
    fg: theme[tone],
    attributes: bold ? TextAttributes.BOLD : TextAttributes.NONE,
    ...props,
  }
  return (
    <text
      selectable={false}
      {...appearance}
      {...styles(part, appearance, 'text')}
    />
  )
}
