# input

A controlled or uncontrolled single-line native editor.

[Source](../../src/components/ui/input.tsx) · Gallery: `/gallery/input` · [Styling status](../styling.md)

## Usage

```tsx
import { Input } from '@/components/ui/input'

<Input label="Name" value={name} onValueChange={setName} placeholder="Your name" />
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Input`.

| Component | Props contract |
| --- | --- |
| Input | `InputProps` |

### Declared prop types

```ts
type InputHandle = FocusableHandle

type SharedProps = {
  id?: string
  ref?: Ref<InputHandle>
  label?: string
  placeholder?: string
  width?: number | `${number}%`
  disabled?: boolean
  readOnly?: boolean
  invalid?: boolean
  autoFocus?: boolean
  onValueChange?: (value: string) => void
  onSubmit?: (value: string) => void
}

type InputProps = SharedProps &
  (
    | { value: string; defaultValue?: never }
    | { value?: never; defaultValue?: string }
  )
```

## State and interaction

Typing and paste edit the value; Enter invokes onSubmit. Read-only fields allow focus/navigation/selection; disabled fields are skipped. Programmatic value changes do not emit edit callbacks.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Promoted defaults are defined in [input.styles.ts](../../src/components/ui/input.styles.ts) and consumed by the real component and its observations. No Tweak JSON is loaded here.

One content row, width 100% by default. The outer surface paints the muted background once; native editor backgrounds are transparent. invalid is a visual destructive ring.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| Input.placeholder | `''` |
| Input.width | `'100%'` |
| Input.disabled | `false` |
| Input.readOnly | `false` |
| Input.invalid | `false` |
| Input.autoFocus | `false` |
| Input.defaultValue | `''` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses the native editor, useFocusable and shared rings. CommandInput and Combobox search reuse Input.

## TUI boundaries

value and defaultValue are mutually exclusive. Native text editing and selection follow OpenTUI behavior. invalid does not validate data.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
