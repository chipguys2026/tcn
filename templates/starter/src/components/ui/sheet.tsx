import type { FloatingContentProps } from '@/lib/ui/floating'
import { createFloatingFamily } from '@/lib/ui/floating'

const family = createFloatingFamily('Sheet', {
  modal: true,
  sheet: true,
  showCloseButton: true,
})
export const Sheet = family.Root
export const SheetTrigger = family.Trigger
export function SheetContent({
  side = 'right',
  ...props
}: FloatingContentProps) {
  return <family.Content {...props} side={side} />
}
export const SheetClose = family.Close
export {
  FloatingDescription as SheetDescription,
  FloatingFooter as SheetFooter,
  FloatingHeader as SheetHeader,
  FloatingTitle as SheetTitle,
} from '@/lib/ui/floating'
