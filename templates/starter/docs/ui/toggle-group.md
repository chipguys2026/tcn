# Toggle Group

A group of single or multiple pressed values.

[Source](../../src/components/ui/toggle-group.tsx) · Gallery: `/gallery/toggle-group` · [Customization](../styling.md)

## Usage

```tsx
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

<ToggleGroup type="multiple">
  <ToggleGroupItem value="bold" />
  <ToggleGroupItem value="italic" />
</ToggleGroup>
```

## API

Exports: `ToggleGroup`, `ToggleGroupItem`.

| Component | Props contract |
| --- | --- |
| ToggleGroup | Children; `type="single"` or `"multiple"`; controlled `value` or initial `defaultValue`; `onValueChange`; `disabled`; `orientation="horizontal"` or `"vertical"` |
| ToggleGroupItem | `PropsWithChildren<{ value: string; label?: string; disabled?: boolean }>` |

## State and interaction

Arrow navigation moves between enabled items; activation updates selection according to type.

## Appearance

Selected items use the common toggle appearance.

Default values:

| Parameter | Default |
| --- | --- |
| ToggleGroupItem.disabled | `false` |
| ToggleGroupItem.label | `value` |

## Usage guidance

Use a string value for `single` mode and an array of strings for `multiple` mode. Give every item a unique value.
