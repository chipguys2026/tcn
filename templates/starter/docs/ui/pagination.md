# Pagination

Page navigation composition inspired by [shadcn Pagination](https://ui.shadcn.com/docs/components/pagination).

[Source](../../src/components/ui/pagination.tsx) · [Defaults](../../src/components/ui/pagination.styles.ts) · Gallery: `/gallery/pagination`

```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem><PaginationPrevious disabled={page === 1} onPress={previous} /></PaginationItem>
    <PaginationItem><PaginationLink isActive={page === 2} onPress={() => setPage(2)}>2</PaginationLink></PaginationItem>
    <PaginationItem><PaginationEllipsis /></PaginationItem>
    <PaginationItem><PaginationNext disabled={page === total} onPress={next} /></PaginationItem>
  </PaginationContent>
</Pagination>
```

Import from `@/components/ui/pagination`.

| Part | Contract |
| --- | --- |
| Pagination | Children; full-width centered container |
| PaginationContent | Children; wrapping row, gap one |
| PaginationItem | Children; one navigation slot |
| PaginationLink | String children; `isActive=false`; Button props except icon/internal style source |
| PaginationPrevious, PaginationNext | Button action props, optional `text` defaulting to Previous/Next |
| PaginationEllipsis | Passive ellipsis with one cell horizontal padding |

Links and previous/next reuse Button. Active links use the secondary background; inactive controls use ghost. Explicit variant overrides are allowed. Every action preserves normal Tab, Enter/Space/click and disabled behavior. Ellipsis has no focus target. Controls wrap on narrow terminals.

The application owns page state, boundary disabling, fetching and routing. This component does not infer a page count, clamp state, fetch data or mutate the router; use `onPress` for those operations. Unlike browser shadcn links, there is no href/anchor API.

Every listed part is available in Tweak. Button geometry inherits shared Button proposals; per-part colors can be reviewed separately. No size or rounded variant is introduced. See [styling](../styling.md).
