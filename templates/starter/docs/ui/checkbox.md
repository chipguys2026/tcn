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

Space and left click on the mark or label toggle; Enter does not. Activating indeterminate proposes true. Disabled items are skipped. Ref exposes focus/blur/label.

## Appearance

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

The outer focus ring surrounds the indicator, not the entire label. Supports checked, unchecked and indeterminate glyph states.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| Checkbox.defaultChecked | `false` |
| Checkbox.disabled | `false` |
| Checkbox.autoFocus | `false` |

## Reuse

Uses usePress and useFocusable, shared with Button without depending on Button visuals.

## Notes

checked/defaultChecked are mutually exclusive. An unlabeled visual control requires label for focus metadata.
