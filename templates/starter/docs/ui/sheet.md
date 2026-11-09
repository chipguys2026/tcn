# Sheet

A modal panel attached to a terminal edge.

[Source](../../src/components/ui/sheet.tsx) · Gallery: `/gallery/sheet` · [Customization](../styling.md)

## Usage

```tsx
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'

<Sheet>
  <SheetTrigger>Settings</SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
      <SheetDescription>Project preferences</SheetDescription>
    </SheetHeader>
    <Input label="Name" />
    <SheetFooter>
      <SheetClose variant="default">Done</SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

## API

Exports: `Sheet`, `SheetTrigger`, `SheetContent`, `SheetClose`, `SheetDescription`, `SheetFooter`, `SheetHeader`, `SheetTitle`.

| Component | Props contract |
| --- | --- |
| SheetContent | `FloatingContentProps` |

## State and interaction

Modal Tab containment, Escape/outside dismissal and focus restoration follow Dialog.

## Appearance

Left/right fill terminal height; top/bottom fill width. Shared compact Header/right-aligned Footer and a one-cell-padded corner close button. Borderless; dimming 55%.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| SheetContent.side | `'right'` |

## Reuse

Shares floating family, Header/Footer and Button-based close actions with Dialog/AlertDialog.

## Notes

This is an edge-attached panel, not a draggable/resizable workspace region.
