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

Kbd displays a shortcut hint. Register the corresponding action in application code.

## Appearance

Each hint occupies one row with muted colors and semicircle caps inside one-cell horizontal padding. KbdGroup adds spacing and wraps between hints when necessary.

## Usage guidance

Configure a Nerd Font for the rounded cap glyphs. Register keyboard shortcuts in application code; Kbd displays their labels.
