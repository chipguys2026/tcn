# Textarea

A native multiline editor with controlled/uncontrolled state.

[Source](../../src/components/ui/textarea.tsx) · Gallery: `/gallery/textarea` · [Customization](../styling.md)

## Usage

```tsx
import { Textarea } from '@/components/ui/textarea'

<Textarea label="Notes" value={notes} onValueChange={setNotes} height={6} />
```

## API

Exports: `Textarea`.

| Component | Props contract |
| --- | --- |
| Textarea | `TextareaProps` |

### Prop types

```ts
type TextareaHandle = FocusableHandle

type Common = {
  id?: string
  ref?: Ref<TextareaHandle>
  label?: string
  placeholder?: string
  width?: number | `${number}%`
  height?: number
  disabled?: boolean
  readOnly?: boolean
  invalid?: boolean
  autoFocus?: boolean
  onValueChange?: (value: string) => void
  onSubmit?: (value: string) => void
}

type TextareaProps = Common &
  (
    | { value: string; defaultValue?: never }
    | { value?: never; defaultValue?: string }
  )
```

## State and interaction

Enter inserts a newline; Ctrl or Meta+Enter invokes `onSubmit`. Read-only editors allow navigation and selection. Disabled editors cannot be edited or focused. Clicking the padding focuses the editor and places the cursor; wheel input over the padding scrolls its content.

## Appearance

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

Textarea fills its container width by default and has a height of four rows, with a minimum of two. Padding insets the text viewport inside a continuous surface; background and focus ring retain the outer bounds.

Default values:

| Parameter | Default |
| --- | --- |
| Textarea.placeholder | `''` |
| Textarea.width | `'100%'` |
| Textarea.height | `4` |
| Textarea.disabled | `false` |
| Textarea.readOnly | `false` |
| Textarea.invalid | `false` |
| Textarea.defaultValue | `''` |

## Usage guidance

Use either `value` with `onValueChange` or `defaultValue` for an initial value. Set `invalid` from your validation result. Wrapping, cursor movement and selection follow OpenTUI's native editor behavior.
