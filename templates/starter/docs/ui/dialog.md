# dialog

A modal surface for a focused task.

[Source](../../src/components/ui/dialog.tsx) · Gallery: `/gallery/dialog` · [Styling status](../styling.md)

## Usage

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

<Dialog>
  <DialogTrigger>Edit</DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>Edit profile</DialogTitle><DialogDescription>Update your details.</DialogDescription></DialogHeader>
    <Input label="Name" />
    <DialogFooter><DialogClose>Cancel</DialogClose><DialogClose variant="default">Save</DialogClose></DialogFooter>
  </DialogContent>
</Dialog>
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogClose`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogTitle`.

The compound parts use the shared floating-family contracts; see [interaction](../interaction.md) and the linked source.

## State and interaction

Tab stays inside; Escape/outside click/corner close request dismissal. Focus returns to the prior valid control. Controlled open may reject a close request.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Promoted defaults are defined in [dialog.styles.ts](../../src/components/ui/dialog.styles.ts) and consumed by the real component and its observations. No Tweak JSON is loaded here.

Centered, width 48, auto height clamped to the terminal. Borderless background, compact Header, right-aligned Footer and a fixed corner close button with one-cell horizontal padding. Dims underlying content 55%.

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses the shared floating family, Overlay, FocusScope and Button-based close actions.

## TUI boundaries

showCloseButton=false omits the corner close. Overflow scrolls. Loading async work and committing form data remain caller responsibilities.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
