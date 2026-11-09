import { useComponentStyles } from '@/lib/ui/style-review'
import { useTheme } from '@/lib/ui/theme/use-theme'
export function Progress({
  value,
  max = 100,
  width = 24,
  showValue = true,
}: {
  value: number
  max?: number
  width?: number
  showValue?: boolean
}) {
  const componentStyle = useComponentStyles('progress')

  const theme = useTheme(),
    total = Number.isFinite(max) && max > 0 ? max : 100
  const normalized = Number.isFinite(value)
    ? Math.min(total, Math.max(0, value)) / total
    : 0
  const length = Math.max(
      1,
      Math.min(120, Math.floor(Number.isFinite(width) ? width : 24)),
    ),
    filled = Math.round(length * normalized)
  return (
    <box
      flexDirection="row"
      gap={1}
      maxWidth="100%"
      {...componentStyle('Progress', { gap: 1 }, 'box')}
    >
      <text
        height={1}
        wrapMode="none"
        truncate
        {...componentStyle('Progress.text', { height: 1 }, 'text')}
      >
        <span fg={theme.primary}>{'━'.repeat(filled)}</span>
        <span fg={theme.mutedForeground}>{'─'.repeat(length - filled)}</span>
      </text>
      {showValue && (
        <text
          fg={theme.foreground}
          {...componentStyle(
            'Progress.text2',
            { fg: theme.foreground },
            'text',
          )}
        >
          {Math.round(normalized * 100)}%
        </text>
      )}
    </box>
  )
}
