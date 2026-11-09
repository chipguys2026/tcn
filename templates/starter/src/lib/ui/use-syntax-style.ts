import { SyntaxStyle } from '@opentui/core'
import { useRenderer } from '@opentui/react'
import { useEffect, useMemo } from 'react'
import { useTheme } from './theme/use-theme'
export function useSyntaxStyle() {
  const renderer = useRenderer(),
    theme = useTheme()
  const style = useMemo(
    () =>
      SyntaxStyle.fromStyles(
        {
          default: { fg: theme.foreground },
          keyword: { fg: theme.primary, bold: true },
          string: { fg: theme.chart2 },
          number: { fg: theme.chart3 },
          comment: { fg: theme.mutedForeground, italic: true },
          function: { fg: theme.chart1 },
          type: { fg: theme.chart4 },
        },
        renderer.nativeScene,
      ),
    [renderer, theme],
  )
  useEffect(() => () => style.destroy(), [style])
  return style
}
