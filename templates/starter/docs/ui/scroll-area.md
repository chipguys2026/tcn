# Scroll Area

A native scroll region for overflowing content.

[Source](../../src/components/ui/scroll-area.tsx) · Gallery: `/gallery/scroll-area` · [Customization](../styling.md)

## Usage

```tsx
import { ScrollArea } from '@/components/ui/scroll-area'

<ScrollArea orientation="both" height={8}>
  <box width={120} height={30} flexShrink={0}>
    <text>Wide content</text>
  </box>
</ScrollArea>
```

## API

Exports: `ScrollArea`.

| Component | Props contract |
| --- | --- |
| ScrollArea | `PropsWithChildren<{ width?: number \| ${number}% height?: number orientation?: 'horizontal' \| 'vertical' \| 'both' focusable?: boolean label?: string ref?: Ref<ScrollAreaHandle> }>` |

### Prop types

```ts
type ScrollAreaHandle = FocusableHandle & {
  scrollTo: (position: number) => void
}
```

## State and interaction

Focus the region for arrow scrolling. Wheel, native track clicking/dragging and imperative scrollTo are supported.

## Appearance

Vertical is the default; horizontal/both enable the X axis. Horizontal bars paint half-height blocks while retaining a full-row native hit area.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| ScrollArea.width | `'100%'` |
| ScrollArea.height | `8` |
| ScrollArea.orientation | `'vertical'` |
| ScrollArea.focusable | `true` |
| ScrollArea.label | `'Scroll area'` |

## Reuse

Uses the native ScrollBox with a visual horizontal bar skin and shared focus ring.

## Notes

Content must actually overflow and resist unintended shrinking. The native two-track corner remains unchanged; the rejected corner paint-over was removed. scrollTo targets X only in horizontal mode, otherwise Y.
