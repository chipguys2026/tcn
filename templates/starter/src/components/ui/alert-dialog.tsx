import type { ComponentProps } from 'react'
import { createFloatingFamily } from '@/lib/ui/floating'

const family = createFloatingFamily('AlertDialog', {
  modal: true,
  outsideDismiss: false,
  width: 52,
  height: 'auto',
})
export const AlertDialog = family.Root
export const AlertDialogTrigger = family.Trigger
export const AlertDialogContent = family.Content
type CloseProps = Omit<ComponentProps<typeof family.Close>, 'stylePart'>
export function AlertDialogCancel(props: CloseProps) {
  return <family.Close autoFocus {...props} stylePart="AlertDialogCancel" />
}
export function AlertDialogAction(props: CloseProps) {
  return (
    <family.Close variant="default" {...props} stylePart="AlertDialogAction" />
  )
}
export {
  FloatingDescription as AlertDialogDescription,
  FloatingFooter as AlertDialogFooter,
  FloatingHeader as AlertDialogHeader,
  FloatingTitle as AlertDialogTitle,
} from '@/lib/ui/floating'
