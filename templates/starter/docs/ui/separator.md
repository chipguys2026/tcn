# separator

A horizontal or vertical content divider.

[Source](../../src/components/ui/separator.tsx) · Gallery: `/gallery/separator` · [Styling status](../styling.md)

## Usage

```tsx
import { Separator } from '@/components/ui/separator'

<Separator orientation="horizontal" />
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Separator`.

| Component | Props contract |
| --- | --- |
| Separator | `{ orientation?: 'horizontal' \| 'vertical'; length?: number; stretch?: boolean; styleSource?: string; stylePart?: string }` |

## State and interaction

No focus or activation.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Draws a line in terminal cells using the border color; length can be supplied. `stretch` uses the parent's cross-axis size instead of a percentage, allowing separators inside content-sized groups. ButtonGroupSeparator and ItemSeparator reuse this component; styleSource/stylePart provide their Tweak identities.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| Separator.orientation | `'horizontal'` |
| Separator.stretch | `false` |
| Separator.styleSource | `'separator'` |
| Separator.stylePart | `'Separator'` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Used as a content divider rather than a component frame.

## TUI boundaries

A line occupies terminal cells; it is not a fractional CSS border.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
