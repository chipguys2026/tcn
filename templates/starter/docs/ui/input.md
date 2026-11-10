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

Typing or pasting edits the value, and Enter invokes `onSubmit`. Read-only fields allow focus, navigation and selection; disabled fields are skipped during navigation. Programmatic value changes do not invoke edit callbacks.

## Appearance

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

Input occupies one content row and fills its container width by default. It has a continuous muted background. Setting `invalid` displays a destructive-colored outline.

Default values:

| Parameter | Default |
| --- | --- |
| Input.placeholder | `''` |
| Input.width | `'100%'` |
| Input.disabled | `false` |
| Input.readOnly | `false` |
| Input.invalid | `false` |
| Input.autoFocus | `false` |
| Input.defaultValue | `''` |

## Usage guidance

Use either `value` with `onValueChange` or `defaultValue` for an initial value. Set `invalid` from your validation result. Text editing and selection follow OpenTUI's native editor behavior.
