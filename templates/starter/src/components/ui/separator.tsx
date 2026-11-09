import { useComponentStyles } from '@/lib/ui/style-review'
import { useTheme } from '@/lib/ui/theme/use-theme'
export function Separator({
  orientation = 'horizontal',
  length,
  stretch = false,
  styleSource = 'separator',
  stylePart = 'Separator',
}: {
  orientation?: 'horizontal' | 'vertical'
  length?: number
  stretch?: boolean
  styleSource?: string
  stylePart?: string
}) {
  const componentStyle = useComponentStyles(styleSource)

  const theme = useTheme()
  return (
    <box
      width={
        orientation === 'vertical'
          ? 1
          : (length ?? (stretch ? undefined : '100%'))
      }
      height={
        orientation === 'horizontal'
          ? 1
          : (length ?? (stretch ? undefined : '100%'))
      }
      alignSelf={stretch ? 'stretch' : undefined}
      border={orientation === 'horizontal' ? ['bottom'] : ['left']}
      borderColor={theme.border}
      flexShrink={0}
      {...componentStyle(
        stylePart,
        {
          width:
            orientation === 'vertical'
              ? 1
              : (length ?? (stretch ? undefined : '100%')),
          height:
            orientation === 'horizontal'
              ? 1
              : (length ?? (stretch ? undefined : '100%')),
        },
        'box',
      )}
    />
  )
}
