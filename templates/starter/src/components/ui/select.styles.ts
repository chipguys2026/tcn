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
