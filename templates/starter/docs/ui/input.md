# Input

A controlled or uncontrolled single-line native editor.

[Source](../../src/components/ui/input.tsx) · Gallery: `/gallery/input` · [Customization](../styling.md)

## Usage

```tsx
import { Input } from '@/components/ui/input'

<Input
  label="Name"
  value={name}
  onValueChange={setName}
  placeholder="Your name"
/>
```

## API

Exports: `Input`.

| Component | Props contract |
| --- | --- |
| Input | `InputProps` |

### Prop types

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

## Appearance

Defaults are defined in [input.styles.ts](../../src/components/ui/input.styles.ts). Edit this local file to change appearance across your application.

One content row, width 100% by default. The outer surface paints the muted background once; native editor backgrounds are transparent. invalid is a visual destructive ring.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| Input.placeholder | `''` |
| Input.width | `'100%'` |
| Input.disabled | `false` |
| Input.readOnly | `false` |
| Input.invalid | `false` |
| Input.autoFocus | `false` |
| Input.defaultValue | `''` |

## Reuse

Uses the native editor, useFocusable and shared rings. CommandInput and Combobox search reuse Input.

## Notes

value and defaultValue are mutually exclusive. Native text editing and selection follow OpenTUI behavior. invalid does not validate data.
