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

Add `onSelect` to make a row keyboard- and pointer-accessible. Set `selected` from application state to show its selection. Rows without an action are skipped during focus navigation.

## Appearance

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

Bottom dividers separate rows, and the footer keeps the surrounding background. Selected rows use primary-colored text while preserving their background.

Default values:

| Parameter | Default |
| --- | --- |
| TableRow.selected | `false` |
| TableRow.label | `'Select row'` |
| TableRow.disabled | `false` |

## Usage guidance

Prepare sorting, filtering and pagination in application code before passing rows to Table. Wrap large or wide tables in a [Scroll Area](scroll-area.md).
