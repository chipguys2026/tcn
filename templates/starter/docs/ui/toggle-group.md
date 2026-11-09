# toggle-group

A group of single or multiple pressed values.

[Source](../../src/components/ui/toggle-group.tsx) · Gallery: `/gallery/toggle-group` · [Styling status](../styling.md)

## Usage

```tsx
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

<ToggleGroup type="multiple"><ToggleGroupItem value="bold" /><ToggleGroupItem value="italic" /></ToggleGroup>
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `ToggleGroup`, `ToggleGroupItem`.

| Component | Props contract |
| --- | --- |
| ToggleGroup | `PropsWithChildren< SelectionProps & { disabled?: boolean orientation?: 'horizontal' \| 'vertical' } >` |
| ToggleGroupItem | `PropsWithChildren<{ value: string; label?: string; disabled?: boolean }>` |

## State and interaction

Arrow navigation moves between enabled items; activation updates selection according to type.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Selected items use the common toggle appearance.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| ToggleGroupItem.disabled | `false` |
| ToggleGroupItem.label | `value` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses shared selection contracts, RovingGroup and Toggle/Pressable composition.

## TUI boundaries

single uses a string; multiple uses a string array. Values must be unique.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
