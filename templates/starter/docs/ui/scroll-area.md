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
| ScrollArea | Children; optional `width` in cells or a percentage, `height` in rows, `orientation`, `focusable`, `label` and `ref` |

### Prop types

```ts
type ScrollAreaHandle = FocusableHandle & {
  scrollTo: (position: number) => void
}
```

## State and interaction

Focus the region to scroll with arrow keys. You can also use the mouse wheel, click or drag the scrollbar, or call `scrollTo` through a ref.

## Appearance

Set `orientation` to `vertical`, `horizontal` or `both`. The default is vertical. Horizontal scrollbars use half-height block glyphs with a full row available for pointer interaction.

Default values:

| Parameter | Default |
| --- | --- |
| ScrollArea.width | `'100%'` |
| ScrollArea.height | `8` |
| ScrollArea.orientation | `'vertical'` |
| ScrollArea.focusable | `true` |
| ScrollArea.label | `'Scroll area'` |

## Usage guidance

Ensure content can exceed the viewport; prevent flex children from shrinking away the intended overflow. `scrollTo` targets the horizontal axis in horizontal mode and the vertical axis otherwise.
