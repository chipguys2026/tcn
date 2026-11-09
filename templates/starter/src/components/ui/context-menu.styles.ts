import { dropdownMenuDefaults } from './dropdown-menu.styles'
export const contextMenuDefaults = {
  ...dropdownMenuDefaults,
  content: { ...dropdownMenuDefaults.content, minWidth: 12 },
} as const
