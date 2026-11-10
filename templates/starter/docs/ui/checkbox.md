# Checkbox

A boolean or indeterminate selection control.

[Source](../../src/components/ui/checkbox.tsx) · Gallery: `/gallery/checkbox` · [Customization](../styling.md)

## Usage

```tsx
import { Checkbox } from '@/components/ui/checkbox'

<Checkbox checked={accepted} onCheckedChange={setAccepted}>
  Accept terms
</Checkbox>
```

## API

Exports: `Checkbox`.

| Component | Props contract |
| --- | --- |
| Checkbox | `CheckboxProps` |

### Prop types

```ts
type CheckedState = boolean | 'indeterminate'

type CheckboxHandle = FocusableHandle

type CheckboxProps = CheckboxStateProps &
  CheckboxLabelProps & {
    id?: string
    ref?: Ref<CheckboxHandle>
    disabled?: boolean
    autoFocus?: boolean
    onCheckedChange?: (checked: CheckedState) => void
  }
```

## State and interaction

Press Space or click the indicator or label to toggle. Enter leaves the value unchanged. Activating an indeterminate checkbox requests a checked value of `true`. Disabled checkboxes are skipped during keyboard navigation. A ref exposes `focus()`, `blur()` and `label`.

## Appearance

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

The outer focus ring surrounds the indicator, not the entire label. Distinct glyphs indicate checked, unchecked and indeterminate states.

Default values:

| Parameter | Default |
| --- | --- |
| Checkbox.defaultChecked | `false` |
| Checkbox.disabled | `false` |
| Checkbox.autoFocus | `false` |

## Usage guidance

Use either `checked` with `onCheckedChange` or `defaultChecked` for an initial value. Provide `label` when the checkbox has no visible text.
