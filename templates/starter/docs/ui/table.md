# Table

A presentation table with optional row activation.

[Source](../../src/components/ui/table.tsx) · Gallery: `/gallery/table` · [Customization](../styling.md)

## Usage

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/ui/table'

<Table columnWidths={[16, 12]}>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Project</TableCell>
      <TableCell>Ready</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## API

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

### Prop types

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

## Appearance

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

Bottom row dividers replace background differentiation. Footer has no default fill. Selected row text uses the primary color; interactive row highlight is suppressed.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| TableRow.selected | `false` |
| TableRow.label | `'Select row'` |
| TableRow.disabled | `false` |

## Reuse

Uses shared column context, cells and Pressable for selectable rows.

## Notes

No sorting, filtering, pagination, editing or virtualization. Wrap wide/large tables in an appropriate ScrollArea.
