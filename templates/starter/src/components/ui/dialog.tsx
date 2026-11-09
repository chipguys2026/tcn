import { createFloatingFamily } from '@/lib/ui/floating'
import { dialogDefaults } from '@/lib/ui/styles'

const family = createFloatingFamily('Dialog', {
  modal: true,
  ...dialogDefaults,
  showCloseButton: true,
})
export const Dialog = family.Root
export const DialogTrigger = family.Trigger
export const DialogContent = family.Content
export const DialogClose = family.Close
export {
  FloatingDescription as DialogDescription,
  FloatingFooter as DialogFooter,
  FloatingHeader as DialogHeader,
  FloatingTitle as DialogTitle,
} from '@/lib/ui/floating'
