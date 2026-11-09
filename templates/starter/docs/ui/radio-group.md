# radio-group

A mutually exclusive string-valued selection group.

[Source](../../src/components/ui/radio-group.tsx) · Gallery: `/gallery/radio-group` · [Styling status](../styling.md)

## Usage

```tsx
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

<RadioGroup defaultValue="one"><RadioGroupItem value="one" label="One" /><RadioGroupItem value="two" label="Two" /></RadioGroup>
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `RadioGroup`, `RadioGroupItem`.

| Component | Props contract |
| --- | --- |
| RadioGroup | `PropsWithChildren<{ value?: string defaultValue?: string onValueChange?: (value: string) => void disabled?: boolean orientation?: 'horizontal' \| 'vertical' }>` |
| RadioGroupItem | `{ value: string label?: string disabled?: boolean }` |

## State and interaction

Arrows move and select enabled items; Home/End jump. The group has one Tab stop. Disabled items are skipped.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Semantic selected/unselected indicators and labels.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| RadioGroup.defaultValue | `''` |
| RadioGroup.disabled | `false` |
| RadioGroup.orientation | `'vertical'` |
| RadioGroupItem.label | `value` |
| RadioGroupItem.disabled | `false` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses RovingGroup and the shared interaction/focus helpers.

## TUI boundaries

Values within the group must be unique. It does not submit a form.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
