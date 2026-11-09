import { Pill } from '@/lib/ui/pill'
import { useComponentStyles } from '@/lib/ui/style-review'
import { type ButtonVariant, buttonStyles } from '@/lib/ui/styles'
import { useTheme } from '@/lib/ui/theme/use-theme'
export function Badge({
  children,
  variant = 'default',
}: {
  children: string
  variant?: Exclude<ButtonVariant, 'link'>
}) {
  const componentStyle = useComponentStyles('badge')

  const theme = useTheme(),
    style = buttonStyles(theme, variant, false)
  return (
    <Pill
      backgroundColor={style.background}
      foregroundColor={style.foreground}
      surfaceStyle={componentStyle(
        `Badge.${variant}`,
        { height: 1, paddingX: 1, backgroundColor: style.background },
        'box',
      )}
      textStyle={componentStyle(
        `Badge.${variant}.text`,
        { height: 1, fg: style.foreground },
        'text',
      )}
    >
      {children}
    </Pill>
  )
}
