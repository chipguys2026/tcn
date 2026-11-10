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

Tab navigation stays inside the sheet. Escape or an outside click requests dismissal, and closing restores focus to the previous control when available.

## Appearance

Left and right sheets fill the terminal height; top and bottom sheets fill its width. The borderless surface has a compact header, right-aligned footer and corner close button. The background is dimmed by 55%.

Default values:

| Parameter | Default |
| --- | --- |
| SheetContent.side | `'right'` |

## Usage guidance

Use Sheet for an edge-attached panel that opens over the current screen. Use [Resizable](resizable.md) for a workspace with adjustable panel dimensions.
