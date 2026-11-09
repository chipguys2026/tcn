import type { ComponentProps } from 'react'
import { createMenuFamily } from '@/lib/ui/menu'
import { dropdownMenuDefaults } from './dropdown-menu.styles'

const menu = createMenuFamily(
  'DropdownMenu',
  'dropdown-menu',
  dropdownMenuDefaults,
)
export const DropdownMenu = menu.Root
export function DropdownMenuTrigger(
  props: Omit<ComponentProps<typeof menu.Trigger>, 'openOnArrow'>,
) {
  return <menu.Trigger {...props} openOnArrow />
}
export const DropdownMenuContent = menu.Content
export const DropdownMenuItem = menu.Item
export const DropdownMenuCheckboxItem = menu.CheckboxItem
export const DropdownMenuRadioGroup = menu.RadioGroup
export const DropdownMenuRadioItem = menu.RadioItem
export const DropdownMenuLabel = menu.Label
export const DropdownMenuGroup = menu.Group
export { Separator as DropdownMenuSeparator } from './separator'
