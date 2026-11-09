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

Enter inserts a newline. Ctrl/Meta+Enter invokes onSubmit. Read-only allows navigation/selection; disabled blocks edits/focus. Padding clicks focus/place the cursor; wheel input in padding scrolls the editor.

## Appearance

Defaults are defined in [textarea.styles.ts](../../src/components/ui/textarea.styles.ts). Edit this local file to change appearance across your application.

Default width 100%, height 4 with minimum 2. Padding insets the text viewport inside a continuous surface; background and focus ring retain the outer bounds.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| Textarea.placeholder | `''` |
| Textarea.width | `'100%'` |
| Textarea.height | `4` |
| Textarea.disabled | `false` |
| Textarea.readOnly | `false` |
| Textarea.invalid | `false` |
| Textarea.defaultValue | `''` |

## Reuse

Uses the native editor and shared focus/rings. Outer surface paints the background once, including disabled opacity.

## Notes

value/defaultValue are exclusive. invalid is visual, not validation. Native wrapping, cursor and selection follow OpenTUI.
