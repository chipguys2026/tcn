# card

A compound content surface with optional header/footer.

[Source](../../src/components/ui/card.tsx) · Gallery: `/gallery/card` · [Styling status](../styling.md)

## Usage

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

<Card><CardHeader><CardTitle>Project</CardTitle><CardDescription>Project details</CardDescription></CardHeader><CardContent><text>Content</text></CardContent><CardFooter><Button>Open</Button></CardFooter></Card>
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.

| Component | Props contract |
| --- | --- |
| Card | `PropsWithChildren<{ width?: number \| ${number}%; height?: number }>` |
| CardHeader | `PropsWithChildren` |
| CardTitle | `{ children: string }` |
| CardDescription | `{ children: string }` |
| CardContent | `PropsWithChildren` |
| CardFooter | `PropsWithChildren` |

## State and interaction

The surface has no activation policy; children keep their own interactions.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Promoted defaults are defined in [card.styles.ts](../../src/components/ui/card.styles.ts) and consumed by the real component and its observations. No Tweak JSON is loaded here.

Borderless card background with semantic foreground and grouped spacing. Header, title, description, content and footer are separate parts.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| Card.width | `'100%'` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Reuses theme and ordinary layout primitives.

## TUI boundaries

Does not implement scrolling, selection or navigation. Use a suitable container for overflowing content.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
