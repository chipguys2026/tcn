# checkbox

A boolean or indeterminate selection control.

[Source](../../src/components/ui/checkbox.tsx) · Gallery: `/gallery/checkbox` · [Styling status](../styling.md)

## Usage

```tsx
import { Checkbox } from '@/components/ui/checkbox'

<Checkbox checked={accepted} onCheckedChange={setAccepted}>Accept terms</Checkbox>
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Checkbox`.

| Component | Props contract |
| --- | --- |
| Checkbox | `CheckboxProps` |

### Declared prop types

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

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Promoted defaults are defined in [checkbox.styles.ts](../../src/components/ui/checkbox.styles.ts) and consumed by the real component and its observations. No Tweak JSON is loaded here.

The outer focus ring surrounds the indicator, not the entire label. Supports checked, unchecked and indeterminate glyph states.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| Checkbox.defaultChecked | `false` |
| Checkbox.disabled | `false` |
| Checkbox.autoFocus | `false` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses usePress and useFocusable, shared with Button without depending on Button visuals.

## TUI boundaries

checked/defaultChecked are mutually exclusive. An unlabeled visual control requires label for focus metadata.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
