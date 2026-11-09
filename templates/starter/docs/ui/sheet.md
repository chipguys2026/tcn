# sheet

A modal panel attached to a terminal edge.

[Source](../../src/components/ui/sheet.tsx) · Gallery: `/gallery/sheet` · [Styling status](../styling.md)

## Usage

```tsx
import { Sheet, SheetTrigger, SheetContent, SheetClose, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'

<Sheet><SheetTrigger>Settings</SheetTrigger><SheetContent side="right"><SheetHeader><SheetTitle>Settings</SheetTitle><SheetDescription>Project preferences</SheetDescription></SheetHeader><Input label="Name" /><SheetFooter><SheetClose variant="default">Done</SheetClose></SheetFooter></SheetContent></Sheet>
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Sheet`, `SheetTrigger`, `SheetContent`, `SheetClose`, `SheetDescription`, `SheetFooter`, `SheetHeader`, `SheetTitle`.

| Component | Props contract |
| --- | --- |
| SheetContent | `FloatingContentProps` |

## State and interaction

Modal Tab containment, Escape/outside dismissal and focus restoration follow Dialog.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Left/right fill terminal height; top/bottom fill width. Shared compact Header/right-aligned Footer and a one-cell-padded corner close button. Borderless; dimming 55%.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| SheetContent.side | `'right'` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Shares floating family, Header/Footer and Button-based close actions with Dialog/AlertDialog.

## TUI boundaries

This is an edge-attached panel, not a draggable/resizable workspace region.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
