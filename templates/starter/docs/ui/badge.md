# badge

A noninteractive semantic status label.

[Source](../../src/components/ui/badge.tsx) · Gallery: `/gallery/badge` · [Styling status](../styling.md)

## Usage

```tsx
import { Badge } from '@/components/ui/badge'

<Badge variant="secondary">Draft</Badge>
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Badge`.

| Component | Props contract |
| --- | --- |
| Badge | `{ children: string variant?: Exclude<ButtonVariant, 'link'> }` |

## State and interaction

No keyboard activation or focus registration.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Single row with Nerd Font semicircle caps. A cap counts inside each side's horizontal padding: padding 1 is the cap; padding 2 adds one space; padding 0 omits the cap. Variants: default, secondary, ghost, destructive.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| Badge.variant | `'default'` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses Pill and the Button semantic color resolver.

## TUI boundaries

Transparent backgrounds have no visible caps. Long labels truncate; cap rasterization depends on the terminal font.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
