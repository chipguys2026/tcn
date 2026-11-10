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

Tab navigation stays inside the dialog, and Cancel receives initial focus by default. Outside clicks leave the dialog open. Escape requests dismissal. Action and Cancel invoke their callbacks before requesting a close.

## Appearance

The dialog is centered and borderless, with a default width of 52 columns and height fitted to its content. It has a compact header and right-aligned footer actions. Users close it through its actions or Escape. The background is dimmed by 55%.

## Usage guidance

For asynchronous confirmation, control `open` and close the dialog after the operation succeeds. Implement the operation in your action handler and display errors before allowing another attempt. `AlertDialogAction` uses the primary Button variant by default.
