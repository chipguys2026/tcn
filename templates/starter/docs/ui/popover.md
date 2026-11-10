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

Escape or an outside click dismisses the popup. Tab beyond its last control dismisses it and continues navigation after the trigger. In controlled mode, update `open` to accept a change.

## Appearance

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

The borderless popup appears beside its trigger and stays within the available terminal region. The background is dimmed by 28%.

## Usage guidance

Give the popup dimensions appropriate to its content and include focusable controls for actions. Keyboard users can leave the popup with Tab. React context remains available inside the popup.
