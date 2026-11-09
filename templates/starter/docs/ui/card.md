# Card

A compound content surface with optional header/footer.

[Source](../../src/components/ui/card.tsx) · Gallery: `/gallery/card` · [Customization](../styling.md)

## Usage

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

<Card>
  <CardHeader>
    <CardTitle>Project</CardTitle>
    <CardDescription>Project details</CardDescription>
  </CardHeader>
  <CardContent>
    <text>Content</text>
  </CardContent>
  <CardFooter>
    <Button>Open</Button>
  </CardFooter>
</Card>
```

## API

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

## Appearance

Defaults are defined in [card.styles.ts](../../src/components/ui/card.styles.ts). Edit this local file to change appearance across your application.

Borderless card background with semantic foreground and grouped spacing. Header, title, description, content and footer are separate parts.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| Card.width | `'100%'` |

## Reuse

Reuses theme and ordinary layout primitives.

## Notes

Does not implement scrolling, selection or navigation. Use a suitable container for overflowing content.
