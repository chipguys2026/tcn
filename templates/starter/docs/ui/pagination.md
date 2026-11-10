# Pagination

Compose page navigation controls around application-owned page state.

[Source](../../src/components/ui/pagination.tsx) · [Defaults](../../src/lib/ui/styles.ts) · Gallery: `/gallery/pagination`

## Usage

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from '@/components/ui/pagination'

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious disabled={page === 1} onPress={previous} />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink isActive={page === 2} onPress={() => setPage(2)}>
        2
      </PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext disabled={page === total} onPress={next} />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

## API and behavior

| Part | Contract |
| --- | --- |
| Pagination | Children; full-width centered container |
| PaginationContent | Children; wrapping row, gap one |
| PaginationItem | Children; one navigation slot |
| PaginationLink | String children; `isActive=false`; Button props except icon/internal style source |
| PaginationPrevious, PaginationNext | Button action props, optional `text` defaulting to Previous/Next |
| PaginationEllipsis | Passive ellipsis with one cell horizontal padding |

## State and interaction

Active links use the secondary variant; inactive controls use ghost. Set `variant` for a different appearance. Controls support normal Tab navigation, Enter, Space and click activation, and disabled states. Ellipses are skipped during focus navigation. Controls wrap on narrow terminals.

Track the current page and total page count in application state. Disable Previous on the first page and Next on the last. Use `onPress` to update the page, fetch its data or navigate to its route.

Pagination actions use Button defaults. See [styling](../styling.md) for appearance changes.
