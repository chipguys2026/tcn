# textarea

A native multiline editor with controlled/uncontrolled state.

[Source](../../src/components/ui/textarea.tsx) · Gallery: `/gallery/textarea` · [Styling status](../styling.md)

## Usage

```tsx
import { Textarea } from '@/components/ui/textarea'

<Textarea label="Notes" value={notes} onValueChange={setNotes} height={6} />
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Textarea`.

| Component | Props contract |
| --- | --- |
| Textarea | `TextareaProps` |

### Declared prop types

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

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Promoted defaults are defined in [textarea.styles.ts](../../src/components/ui/textarea.styles.ts) and consumed by the real component and its observations. No Tweak JSON is loaded here.

Default width 100%, height 4 with minimum 2. Padding insets the text viewport inside a continuous surface; background and focus ring retain the outer bounds.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| Textarea.placeholder | `''` |
| Textarea.width | `'100%'` |
| Textarea.height | `4` |
| Textarea.disabled | `false` |
| Textarea.readOnly | `false` |
| Textarea.invalid | `false` |
| Textarea.defaultValue | `''` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses the native editor and shared focus/rings. Outer surface paints the background once, including disabled opacity.

## TUI boundaries

value/defaultValue are exclusive. invalid is visual, not validation. Native wrapping, cursor and selection follow OpenTUI.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
