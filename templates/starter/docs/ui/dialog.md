# Dialog

A modal surface for a focused task.

[Source](../../src/components/ui/dialog.tsx) · Gallery: `/gallery/dialog` · [Customization](../styling.md)

## Usage

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

<Dialog>
  <DialogTrigger>Edit</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Update your details.</DialogDescription>
    </DialogHeader>
    <Input label="Name" />
    <DialogFooter>
      <DialogClose>Cancel</DialogClose>
      <DialogClose variant="default">Save</DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## API

Exports: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogClose`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogTitle`.

The compound parts use the shared floating-family contracts; see [interaction](../interaction.md) and the linked source.

## State and interaction

Tab stays inside; Escape/outside click/corner close request dismissal. Focus returns to the prior valid control. Controlled open may reject a close request.

## Appearance

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

Centered, width 48, auto height clamped to the terminal. Borderless background, compact Header, right-aligned Footer and a fixed corner close button with one-cell horizontal padding. Dims underlying content 55%.

## Reuse

Uses the shared floating family, Overlay, FocusScope and Button-based close actions.

## Notes

showCloseButton=false omits the corner close. Overflow scrolls. Loading async work and committing form data remain caller responsibilities.
