# Kbd

A visual hint for a key or key combination.

[Source](../../src/components/ui/kbd.tsx) · Gallery: `/gallery/kbd` · [Customization](../styling.md)

## Usage

```tsx
import { Kbd, KbdGroup } from '@/components/ui/kbd'

<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>
```

## API

Exports: `Kbd`, `KbdGroup`.

| Component | Props contract |
| --- | --- |
| Kbd | `{ children: string }` |
| KbdGroup | `PropsWithChildren` |

## State and interaction

Display only. It does not register or execute a shortcut.

## Appearance

One row, muted background/foreground, semicircle caps inside one-cell horizontal padding. KbdGroup spaces hints and can wrap between hints.

## Reuse

Uses the same Pill geometry as Badge. CommandShortcut reuses Kbd.

## Notes

Nerd Font required for the intended cap shapes. Application shortcut registration is separate.
