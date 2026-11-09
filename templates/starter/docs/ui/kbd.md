# kbd

A visual hint for a key or key combination.

[Source](../../src/components/ui/kbd.tsx) · Gallery: `/gallery/kbd` · [Styling status](../styling.md)

## Usage

```tsx
import { Kbd, KbdGroup } from '@/components/ui/kbd'

<KbdGroup><Kbd>Ctrl</Kbd><Kbd>K</Kbd></KbdGroup>
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Kbd`, `KbdGroup`.

| Component | Props contract |
| --- | --- |
| Kbd | `{ children: string }` |
| KbdGroup | `PropsWithChildren` |

## State and interaction

Display only. It does not register or execute a shortcut.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

One row, muted background/foreground, semicircle caps inside one-cell horizontal padding. KbdGroup spaces hints and can wrap between hints.

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses the same Pill geometry as Badge. CommandShortcut reuses Kbd.

## TUI boundaries

Nerd Font required for the intended cap shapes. Application shortcut registration is separate.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
