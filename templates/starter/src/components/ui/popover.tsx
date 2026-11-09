import { createFloatingFamily } from '@/lib/ui/floating'
import { popoverDefaults } from './popover.styles'

const family = createFloatingFamily('Popover', {
  modal: false,
  ...popoverDefaults,
})
export const Popover = family.Root
export const PopoverTrigger = family.Trigger
export const PopoverContent = family.Content
export const PopoverClose = family.Close
