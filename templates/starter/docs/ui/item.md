# Item

Compose a list entry with media, descriptive content and actions.

[Source](../../src/components/ui/item.tsx) · [Defaults](../../src/lib/ui/styles.ts) · Gallery: `/gallery/item`

## Usage

```tsx
import {
  ItemGroup,
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemSeparator,
} from '@/components/ui/item'
import { Button } from '@/components/ui/button'
import { icons } from '@/lib/ui/icons'

<ItemGroup>
  <Item variant="muted">
    <ItemMedia variant="icon">
      <text>{icons.folder}</text>
    </ItemMedia>
    <ItemContent>
      <ItemTitle>Project</ItemTitle>
      <ItemDescription>A terminal application.</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button onPress={open}>Open</Button>
    </ItemActions>
  </Item>
  <ItemSeparator />
</ItemGroup>
```

## API and behavior

| Part | Contract |
| --- | --- |
| Item | Children; `variant="default"` (transparent) or `"muted"` |
| ItemGroup | Children; stacks items with zero gap |
| ItemMedia | Children; `variant="default"` (content-sized) or `"icon"` (two columns, one row) |
| ItemContent | Children; growing/shrinking text column with zero gap |
| ItemTitle, ItemDescription | String children; bold title, muted description |
| ItemActions | Children; horizontal wrapping action group |
| ItemHeader, ItemFooter | Children; full-width row above/below item content |
| ItemSeparator | No props; reused horizontal Separator |

## Layout

Item keeps one cell/row padding and a gap of one. Icon and actions align with the first title row. Media stays beside its content; descriptions wrap within that column. The combined media/content area has a preferred basis of 16 cells and grows to use the free width. When the action cannot fit beside that area, it moves below the content and remains aligned to the right. On narrower terminals the media/content area can shrink below that basis without separating the icon from its title.

Optional ItemHeader/ItemFooter occupy separate full-width rows above/below the body. Place ItemHeader, ItemFooter and ItemActions directly under Item so their slots can be identified. The basic gallery examples use media/content/actions; a separate example demonstrates header/footer metadata. Use the shared `icons` tokens from `@/lib/ui/icons` with the icon media variant.

Item is a passive layout. Place reusable Buttons inside ItemActions to open or modify an entry; the row adds no nested click target or tab stop. See [styling](../styling.md).
