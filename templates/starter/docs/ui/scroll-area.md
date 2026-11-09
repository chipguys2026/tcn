# scroll-area

A native scroll region for overflowing content.

[Source](../../src/components/ui/scroll-area.tsx) · Gallery: `/gallery/scroll-area` · [Styling status](../styling.md)

## Usage

```tsx
import { ScrollArea } from '@/components/ui/scroll-area'

<ScrollArea orientation="both" height={8}><box width={120} height={30} flexShrink={0}><text>Wide content</text></box></ScrollArea>
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `ScrollArea`.

| Component | Props contract |
| --- | --- |
| ScrollArea | `PropsWithChildren<{ width?: number \| ${number}% height?: number orientation?: 'horizontal' \| 'vertical' \| 'both' focusable?: boolean label?: string ref?: Ref<ScrollAreaHandle> }>` |

### Declared prop types

```ts
type ScrollAreaHandle = FocusableHandle & {
  scrollTo: (position: number) => void
}
```

## State and interaction

Focus the region for arrow scrolling. Wheel, native track clicking/dragging and imperative scrollTo are supported.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Vertical is the default; horizontal/both enable the X axis. Horizontal bars paint half-height blocks while retaining a full-row native hit area.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| ScrollArea.width | `'100%'` |
| ScrollArea.height | `8` |
| ScrollArea.orientation | `'vertical'` |
| ScrollArea.focusable | `true` |
| ScrollArea.label | `'Scroll area'` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses the native ScrollBox with a visual horizontal bar skin and shared focus ring.

## TUI boundaries

Content must actually overflow and resist unintended shrinking. The native two-track corner remains unchanged; the rejected corner paint-over was removed. scrollTo targets X only in horizontal mode, otherwise Y.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
