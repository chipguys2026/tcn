# alert-dialog

A modal confirmation with explicit cancel and action controls.

[Source](../../src/components/ui/alert-dialog.tsx) · Gallery: `/gallery/alert-dialog` · [Styling status](../styling.md)

## Usage

```tsx
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogCancel, AlertDialogAction, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

<AlertDialog>
  <AlertDialogTrigger>Delete</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader><AlertDialogTitle>Delete project?</AlertDialogTitle></AlertDialogHeader>
    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onPress={remove}>Delete</AlertDialogAction></AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogCancel`, `AlertDialogAction`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogHeader`, `AlertDialogTitle`.

| Component | Props contract |
| --- | --- |
| AlertDialogCancel | `CloseProps` |
| AlertDialogAction | `CloseProps` |

### Declared prop types

```ts
type CloseProps = Omit<ComponentProps<typeof family.Close>, 'stylePart'>
```

## State and interaction

Tab is contained; Cancel receives initial focus by default. Outside clicks are ignored. Escape requests closing. Action/Cancel invoke their callback and then request close.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Centered borderless modal, width 52 and auto height by default. Shared compact Header and right-aligned Footer. No corner close icon. Underlying content is dimmed 55%.

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Shares the floating family, overlay stack and Header/Footer with Dialog/Sheet. Actions reuse Button; Action defaults to the primary variant.

## TUI boundaries

Keep open controlled for asynchronous work that must complete before closing. The component never performs deletion itself.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
