import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function DialogDemo({
  report = () => {},
}: {
  report?: (message: string) => void
}) {
  return (
    <Dialog>
      <DialogTrigger>Edit profile</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update your profile. Save when you're done.
          </DialogDescription>
        </DialogHeader>
        <box flexDirection="column" gap={1}>
          <Label htmlFor="dialog-profile-name">Name</Label>
          <Input
            id="dialog-profile-name"
            label="Profile name"
            defaultValue="Khiem"
          />
        </box>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <DialogClose
            variant="default"
            onPress={() => report('Profile saved')}
          >
            Save changes
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
