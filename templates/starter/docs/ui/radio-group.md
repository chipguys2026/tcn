# Radio Group

A mutually exclusive string-valued selection group.

[Source](../../src/components/ui/radio-group.tsx) · Gallery: `/gallery/radio-group` · [Customization](../styling.md)

## Usage

```tsx
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

<RadioGroup defaultValue="one">
  <RadioGroupItem value="one" label="One" />
  <RadioGroupItem value="two" label="Two" />
</RadioGroup>
```

## API

Exports: `RadioGroup`, `RadioGroupItem`.

| Component | Props contract |
| --- | --- |
| RadioGroup | `PropsWithChildren<{ value?: string defaultValue?: string onValueChange?: (value: string) => void disabled?: boolean orientation?: 'horizontal' \| 'vertical' }>` |
| RadioGroupItem | `{ value: string label?: string disabled?: boolean }` |

## State and interaction

Arrows move and select enabled items; Home/End jump. The group has one Tab stop. Disabled items are skipped.

## Appearance

Semantic selected/unselected indicators and labels.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| RadioGroup.defaultValue | `''` |
| RadioGroup.disabled | `false` |
| RadioGroup.orientation | `'vertical'` |
| RadioGroupItem.label | `value` |
| RadioGroupItem.disabled | `false` |

## Reuse

Uses RovingGroup and the shared interaction/focus helpers.

## Notes

Values within the group must be unique. It does not submit a form.
