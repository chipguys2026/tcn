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

Controls inside the card keep their normal keyboard and pointer interactions. The card itself is skipped during focus navigation.

## Appearance

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

Card uses a borderless surface with theme colors and spacing between its sections. Header, title, description, content and footer are separate parts.

Default values:

| Parameter | Default |
| --- | --- |
| Card.width | `'100%'` |

## Usage guidance

Place overflowing content in a [Scroll Area](scroll-area.md). Add controls inside the card for actions, selection or navigation.
