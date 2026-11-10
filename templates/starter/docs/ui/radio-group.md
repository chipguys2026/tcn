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
| RadioGroup | Children; controlled `value` or initial `defaultValue`; `onValueChange`; `disabled`; `orientation="horizontal"` or `"vertical"` |
| RadioGroupItem | Required `value`; optional `label` and `disabled` |

## State and interaction

Use arrow keys to move to and select an enabled item. Home and End select the first and last enabled items. The group occupies one Tab stop and skips disabled options.

## Appearance

Distinct indicators show the selected and unselected options alongside their labels.

Default values:

| Parameter | Default |
| --- | --- |
| RadioGroup.defaultValue | `''` |
| RadioGroup.disabled | `false` |
| RadioGroup.orientation | `'vertical'` |
| RadioGroupItem.label | `value` |
| RadioGroupItem.disabled | `false` |

## Usage guidance

Give every option a unique value. Use the group's value in your application state and submit it through your own action handler.
