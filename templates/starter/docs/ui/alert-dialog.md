# Alert Dialog

A modal confirmation with explicit cancel and action controls.

[Source](../../src/components/ui/alert-dialog.tsx) · Gallery: `/gallery/alert-dialog` · [Customization](../styling.md)

## Usage

```tsx
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

<AlertDialog>
  <AlertDialogTrigger>Delete</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete project?</AlertDialogTitle>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onPress={remove}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## API

Exports: `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogCancel`, `AlertDialogAction`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogHeader`, `AlertDialogTitle`.

| Component | Props contract |
| --- | --- |
| AlertDialogCancel | `CloseProps` |
| AlertDialogAction | `CloseProps` |

### Prop types

```ts
type CloseProps = Omit<ComponentProps<typeof family.Close>, 'stylePart'>
```

## State and interaction

Tab is contained; Cancel receives initial focus by default. Outside clicks are ignored. Escape requests closing. Action/Cancel invoke their callback and then request close.

## Appearance

Centered borderless modal, width 52 and auto height by default. Shared compact Header and right-aligned Footer. No corner close icon. Underlying content is dimmed 55%.

## Reuse

Shares the floating family, overlay stack and Header/Footer with Dialog/Sheet. Actions reuse Button; Action defaults to the primary variant.

## Notes

Keep open controlled for asynchronous work that must complete before closing. The component never performs deletion itself.
