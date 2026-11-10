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

Separator divides content and is skipped during keyboard navigation.

## Appearance

The line uses the theme border color. Set `length` to control its extent. `stretch` uses the parent's cross-axis size instead of a percentage, allowing separators inside content-sized groups.

Default values:

| Parameter | Default |
| --- | --- |
| Separator.orientation | `'horizontal'` |
| Separator.stretch | `false` |
| Separator.styleSource | `'separator'` |
| Separator.stylePart | `'Separator'` |

## Usage guidance

Separators occupy terminal cells. Account for their row or column when sizing adjacent content.
