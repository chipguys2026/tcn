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

Badge displays status text and is skipped during keyboard navigation.

## Appearance

Badge occupies one row with Nerd Font semicircle caps. A cap counts inside each side's horizontal padding: padding 1 is the cap; padding 2 adds one space; padding 0 omits the cap. Available variants are `default`, `secondary`, `ghost` and `destructive`.

Default values:

| Parameter | Default |
| --- | --- |
| Badge.variant | `'default'` |

## Usage guidance

Long labels truncate to the available width. Rounded caps are visible on opaque backgrounds, and their shape depends on the terminal font.
