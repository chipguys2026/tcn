# Separator

A horizontal or vertical content divider.

[Source](../../src/components/ui/separator.tsx) · Gallery: `/gallery/separator` · [Customization](../styling.md)

## Usage

```tsx
import { Separator } from '@/components/ui/separator'

<Separator orientation="horizontal" />
```

## API

Exports: `Separator`.

| Component | Props contract |
| --- | --- |
| Separator | `{ orientation?: 'horizontal' \| 'vertical'; length?: number; stretch?: boolean; styleSource?: string; stylePart?: string }` |

## State and interaction

No focus or activation.

## Appearance

Draws a line in terminal cells using the border color; length can be supplied. `stretch` uses the parent's cross-axis size instead of a percentage, allowing separators inside content-sized groups. ButtonGroupSeparator and ItemSeparator reuse this component; styleSource/stylePart provide their Tweak identities.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| Separator.orientation | `'horizontal'` |
| Separator.stretch | `false` |
| Separator.styleSource | `'separator'` |
| Separator.stylePart | `'Separator'` |

## Reuse

Used as a content divider rather than a component frame.

## Notes

A line occupies terminal cells; it is not a fractional CSS border.
