# Badge

A noninteractive semantic status label.

[Source](../../src/components/ui/badge.tsx) · Gallery: `/gallery/badge` · [Customization](../styling.md)

## Usage

```tsx
import { Badge } from '@/components/ui/badge'

<Badge variant="secondary">Draft</Badge>
```

## API

Exports: `Badge`.

| Component | Props contract |
| --- | --- |
| Badge | `{ children: string variant?: Exclude<ButtonVariant, 'link'> }` |

## State and interaction

No keyboard activation or focus registration.

## Appearance

Single row with Nerd Font semicircle caps. A cap counts inside each side's horizontal padding: padding 1 is the cap; padding 2 adds one space; padding 0 omits the cap. Variants: default, secondary, ghost, destructive.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| Badge.variant | `'default'` |

## Reuse

Uses Pill and the Button semantic color resolver.

## Notes

Transparent backgrounds have no visible caps. Long labels truncate; cap rasterization depends on the terminal font.
