# table

A presentation table with optional row activation.

[Source](../../src/components/ui/table.tsx) · Gallery: `/gallery/table` · [Styling status](../styling.md)

## Usage

```tsx
import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption } from '@/components/ui/table'

<Table columnWidths={[16, 12]}><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Project</TableCell><TableCell>Ready</TableCell></TableRow></TableBody></Table>
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`.

| Component | Props contract |
| --- | --- |
| Table | `PropsWithChildren<{ columnWidths?: readonly number[] }>` |
| TableHeader | `PropsWithChildren` |
| TableBody | `PropsWithChildren` |
| TableFooter | `PropsWithChildren` |
| TableRow | `PropsWithChildren<{ selected?: boolean onSelect?: () => void label?: string disabled?: boolean }>` |
| TableHead | `CellProps` |
| TableCell | `CellProps` |
| TableCaption | `{ children: string }` |

### Declared prop types

```ts
type CellProps = {
  children: ReactNode
  width?: number
  columnIndex?: number
  align?: 'left' | 'center' | 'right'
}
```

## State and interaction

Rows with onSelect use shared keyboard/mouse activation. selected is owner-controlled. Noninteractive rows have no focus policy.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Promoted defaults are defined in [table.styles.ts](../../src/components/ui/table.styles.ts) and consumed by the real component and its observations. No Tweak JSON is loaded here.

Bottom row dividers replace background differentiation. Footer has no default fill. Selected row text uses the primary color; interactive row highlight is suppressed.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| TableRow.selected | `false` |
| TableRow.label | `'Select row'` |
| TableRow.disabled | `false` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses shared column context, cells and Pressable for selectable rows.

## TUI boundaries

No sorting, filtering, pagination, editing or virtualization. Wrap wide/large tables in an appropriate ScrollArea.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
