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

Tab navigation stays inside the dialog. Escape, an outside click or the close button requests dismissal. Closing restores focus to the previous control when it is still available. In controlled mode, update `open` to accept a close request.

## Appearance

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

The dialog is centered with a default width of 48 columns and height fitted to the content and terminal. Its borderless surface includes a compact header, right-aligned footer and corner close button. The background is dimmed by 55%.

## Usage guidance

Set `showCloseButton={false}` to hide the corner close button. Content scrolls when it exceeds the available height. Manage loading, validation and persistence in application code.
