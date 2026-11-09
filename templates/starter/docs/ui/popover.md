# Popover

An anchored nonmodal surface.

[Source](../../src/components/ui/popover.tsx) · Gallery: `/gallery/popover` · [Customization](../styling.md)

## Usage

```tsx
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

<Popover>
  <PopoverTrigger>Filters</PopoverTrigger>
  <PopoverContent>
    <Input label="Filter" />
    <PopoverClose>Apply</PopoverClose>
  </PopoverContent>
</Popover>
```

## API

Exports: `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverClose`.

The compound parts use the shared floating-family contracts; see [interaction](../interaction.md) and the linked source.

## State and interaction

Escape, outside click or Tab beyond the last control closes and continues focus appropriately. Controlled open can reject changes.

## Appearance

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

Borderless anchored popup with placement/clamping and 28% dimming.

## Reuse

Uses the floating family and Overlay. React context is preserved through the portal.

## Notes

Not a modal focus trap. Supply suitable dimensions and meaningful controls.
