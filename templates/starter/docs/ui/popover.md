# popover

An anchored nonmodal surface.

[Source](../../src/components/ui/popover.tsx) · Gallery: `/gallery/popover` · [Styling status](../styling.md)

## Usage

```tsx
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

<Popover><PopoverTrigger>Filters</PopoverTrigger><PopoverContent><Input label="Filter" /><PopoverClose>Apply</PopoverClose></PopoverContent></Popover>
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverClose`.

The compound parts use the shared floating-family contracts; see [interaction](../interaction.md) and the linked source.

## State and interaction

Escape, outside click or Tab beyond the last control closes and continues focus appropriately. Controlled open can reject changes.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Promoted defaults are defined in [popover.styles.ts](../../src/components/ui/popover.styles.ts) and consumed by the real component and its observations. No Tweak JSON is loaded here.

Borderless anchored popup with placement/clamping and 28% dimming.

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses the floating family and Overlay. React context is preserved through the portal.

## TUI boundaries

Not a modal focus trap. Supply suitable dimensions and meaningful controls.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
