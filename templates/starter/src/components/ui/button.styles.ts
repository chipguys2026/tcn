import type { ThemeTokens } from '@/lib/ui/theme/tokens'
export const buttonDefaults = { paddingX: 1, paddingY: 0 } as const

export type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'ghost'
  | 'destructive'
  | 'link'

function luminance(hex: string) {
  const values = [1, 3, 5].map((index) => {
    const channel = Number.parseInt(hex.slice(index, index + 2), 16) / 255
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  })
  return (
    (values[0] ?? 0) * 0.2126 +
    (values[1] ?? 0) * 0.7152 +
    (values[2] ?? 0) * 0.0722
  )
}
function contrast(a: string, b: string) {
  const x = luminance(a),
    y = luminance(b)
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}
function blend(a: string, b: string, amount: number) {
  return `#${[1, 3, 5]
    .map((index) =>
      Math.round(
        Number.parseInt(a.slice(index, index + 2), 16) * (1 - amount) +
          Number.parseInt(b.slice(index, index + 2), 16) * amount,
      )
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`
}
export function buttonStyles(
  theme: ThemeTokens,
  variant: ButtonVariant,
  active: boolean,
) {
  const destructiveForeground =
    contrast(theme.destructive, theme.foreground) >
    contrast(theme.destructive, theme.background)
      ? theme.foreground
      : theme.background
  const styles = {
    default: { background: theme.primary, foreground: theme.primaryForeground },
    secondary: {
      background: theme.secondary,
      foreground: theme.secondaryForeground,
    },
    ghost: {
      background: active ? theme.accent : undefined,
      foreground: active ? theme.accentForeground : theme.foreground,
    },
    destructive: {
      background: theme.destructive,
      foreground: destructiveForeground,
    },
    link: { background: undefined, foreground: theme.primary },
  }[variant]
  return {
    ...styles,
    background:
      active && styles.background && variant !== 'ghost'
        ? blend(styles.background, styles.foreground, 0.12)
        : styles.background,
  }
}
