// Shared theme palettes and component defaults.
// Customize this file to change the appearance of your application.

// Generated reference palette: OKLCH to sRGB hex.
// Out-of-gamut colors are mapped by reducing chroma while preserving lightness and hue.
export const themes = {
  light: {
    background: '#FFFFFF',
    foreground: '#0C090C',
    card: '#FFFFFF',
    cardForeground: '#0C090C',
    popover: '#FFFFFF',
    popoverForeground: '#0C090C',
    primary: '#8200D9',
    primaryForeground: '#FAF5FF',
    secondary: '#F4F4F5',
    secondaryForeground: '#18181B',
    muted: '#F3F1F3',
    mutedForeground: '#79697B',
    accent: '#F3F1F3',
    accentForeground: '#1D161E',
    destructive: '#E40016',
    border: '#E7E4E7',
    input: '#E7E4E7',
    ring: '#A89EA9',
    chart1: '#D8B4FF',
    chart2: '#AB4EFF',
    chart3: '#9810FA',
    chart4: '#8200D9',
    chart5: '#6E11B0',
    sidebar: '#FAFAFA',
    sidebarForeground: '#0C090C',
    sidebarPrimary: '#9810FA',
    sidebarPrimaryForeground: '#FAF5FF',
    sidebarAccent: '#F3F1F3',
    sidebarAccentForeground: '#1D161E',
    sidebarBorder: '#E7E4E7',
    sidebarRing: '#A89EA9',
  },
  dark: {
    background: '#0C090C',
    foreground: '#FAFAFA',
    card: '#1D161E',
    cardForeground: '#FAFAFA',
    popover: '#1D161E',
    popoverForeground: '#FAFAFA',
    primary: '#6E11B0',
    primaryForeground: '#FAF5FF',
    secondary: '#27272A',
    secondaryForeground: '#FAFAFA',
    muted: '#2A212C',
    mutedForeground: '#A89EA9',
    accent: '#2A212C',
    accentForeground: '#FAFAFA',
    destructive: '#FF6568',
    border: '#FFFFFF1A',
    input: '#FFFFFF26',
    ring: '#79697B',
    chart1: '#D8B4FF',
    chart2: '#AB4EFF',
    chart3: '#9810FA',
    chart4: '#8200D9',
    chart5: '#6E11B0',
    sidebar: '#1D161E',
    sidebarForeground: '#FAFAFA',
    sidebarPrimary: '#AB4EFF',
    sidebarPrimaryForeground: '#FAF5FF',
    sidebarAccent: '#2A212C',
    sidebarAccentForeground: '#FAFAFA',
    sidebarBorder: '#FFFFFF1A',
    sidebarRing: '#79697B',
  },
} as const

export type ThemeName = keyof typeof themes
export type ThemeTokens = (typeof themes)[ThemeName]

// Alert
export const alertDefaults = { paddingX: 1, gap: 1 } as const

// Breadcrumb
export const breadcrumbDefaults = { gap: 1, linkPaddingX: 0 } as const

// Button Group
export const buttonGroupDefaults = { gap: 0, textPaddingX: 1 } as const

// Button
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

// Card
export const cardDefaults = { paddingX: 1 } as const

// Chart
export const chartDefaults = { height: 10, minHeight: 4, maxHeight: 30, gap: 1 }

// Checkbox
export const checkboxDefaults = { paddingX: 0, gap: 1 } as const

// Code Block
export const codeBlockDefaults = {
  paddingX: 1,
  paddingY: 1,
  gap: 1,
  maxHeight: 12,
} as const

// Collapsible
export const collapsibleDefaults = { content: { paddingLeft: 0 } } as const

// Command
export const commandDefaults = {
  list: { width: '100%' },
  item: { width: '100%' },
} as const

// Dropdown Menu
export const dropdownMenuDefaults = {
  content: {
    width: 'auto',
    height: 'auto',
    minWidth: 'trigger',
    maxWidth: 32,
    minHeight: 3,
    maxHeight: 16,
    paddingX: 1,
    paddingY: 1,
  },
  item: { width: '100%' },
  radioGroup: { width: '100%' },
} as const

// Context Menu
export const contextMenuDefaults = {
  ...dropdownMenuDefaults,
  content: { ...dropdownMenuDefaults.content, minWidth: 12 },
} as const

// Dialog
export const dialogDefaults = {
  width: 48,
  height: 'auto',
  paddingX: 1,
} as const

// Empty
export const emptyDefaults = { paddingX: 1, paddingY: 1 } as const

// Field
export const fieldDefaults = {
  gap: 1,
  groupGap: 1,
  paddingX: 0,
  paddingY: 0,
} as const

// Input Group
export const inputGroupDefaults = {
  paddingX: 0,
  paddingY: 0,
  gap: 0,
  addonPaddingX: 1,
  addonGap: 1,
} as const

// Input
export const inputDefaults = { paddingX: 1 } as const

// Item
export const itemDefaults = {
  paddingX: 1,
  paddingY: 1,
  gap: 1,
  groupGap: 0,
  contentGap: 0,
  contentBasis: 16,
  iconWidth: 2,
} as const

// Marker
export const markerDefaults = { gap: 1, paddingX: 0 } as const

// Menubar
export const menubarDefaults = {
  gap: 1,
  content: {
    width: 'auto' as const,
    height: 'auto' as const,
    minWidth: 'trigger' as const,
    maxWidth: 40,
    maxHeight: 20,
    paddingX: 1,
    paddingY: 1,
  },
  item: { width: '100%' as const },
  radioGroup: { width: '100%' as const },
}

// Message Scroller
export const messageScrollerDefaults = { height: 12, gap: 1, threshold: 1 }

// Message
export const messageDefaults = { gap: 1, groupGap: 1, contentGap: 1 } as const

// Pagination
export const paginationDefaults = { gap: 1, ellipsisPaddingX: 1 } as const

// Popover
export const popoverDefaults = { paddingX: 1 } as const

// Questionnaire
export const questionnaireDefaults = { gap: 1 }

// Resizable
export const resizableDefaults = {
  height: 10,
  gap: 0,
  handleWidth: 1,
  handleHeight: 1,
  minSize: 0,
  maxSize: 100,
} as const

// Select
export const selectDefaults = {
  trigger: { width: 'auto' },
  content: {
    width: 'auto',
    height: 'auto',
    minWidth: 'trigger',
    maxWidth: 32,
    minHeight: 3,
    maxHeight: 16,
    paddingX: 1,
    paddingY: 1,
    gap: 1,
  },
  item: { width: '100%' },
} as const

// Sidebar
export const sidebarDefaults = {
  width: 24,
  collapsedWidth: 4,
  minInsetWidth: 8,
  minExpandedWidth: 16,
  height: 16,
  gap: 1,
  layoutGap: 2,
  contentPaddingY: 1,
  groupGap: 2,
  paddingX: 1,
  paddingY: 1,
  menuGap: 1,
  rowGap: 1,
  subIndent: 2,
} as const

// Skeleton
export const skeletonDefaults = { width: '100%', height: 1 } as const

// Slider
export const sliderDefaults = {
  width: 24,
  height: 8,
  thumbWidth: 1,
  thumbHeight: 1,
} as const

// Switch
export const switchDefaults = { gap: 1 } as const

// Table
export const tableDefaults = { cell: { paddingX: 1 } } as const

// Tabs
export const tabsDefaults = { list: { gap: 1 } } as const

// Textarea
export const textareaDefaults = { paddingX: 1 } as const

// Toast
export const toastDefaults = {
  duration: 5000,
  limit: 3,
  width: 38,
  paddingX: 1,
  paddingY: 1,
  gap: 0,
  bodyGap: 1,
  contentBasis: 16,
  iconWidth: 1,
  maxDescriptionHeight: 2,
  maxToastHeight: 7,
  viewportGap: 1,
} as const

// Tooltip
export const tooltipDefaults = {
  width: 'auto',
  height: 'auto',
  minWidth: 3,
  maxWidth: 32,
  minHeight: 3,
  paddingX: 1,
  paddingY: 1,
} as const

// Trace
export const traceDefaults = { gap: 1, indent: 2 } as const
