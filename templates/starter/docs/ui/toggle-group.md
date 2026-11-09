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
| ToggleGroup | `PropsWithChildren< SelectionProps & { disabled?: boolean orientation?: 'horizontal' \| 'vertical' } >` |
| ToggleGroupItem | `PropsWithChildren<{ value: string; label?: string; disabled?: boolean }>` |

## State and interaction

Arrow navigation moves between enabled items; activation updates selection according to type.

## Appearance

Selected items use the common toggle appearance.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| ToggleGroupItem.disabled | `false` |
| ToggleGroupItem.label | `value` |

## Reuse

Uses shared selection contracts, RovingGroup and Toggle/Pressable composition.

## Notes

single uses a string; multiple uses a string array. Values must be unique.
