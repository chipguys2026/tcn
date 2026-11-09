import { TextAttributes } from '@opentui/core'
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  type PropsWithChildren,
  type ReactNode,
  useContext,
} from 'react'
import { Pressable } from '@/lib/ui/pressable'
import { useComponentStyles } from '@/lib/ui/style-review'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { tableDefaults } from './table.styles'

const Columns = createContext<readonly number[] | undefined>(undefined)
const SelectedRow = createContext(false)
export function Table({
  children,
  columnWidths,
}: PropsWithChildren<{ columnWidths?: readonly number[] }>) {
  const componentStyle = useComponentStyles('table')

  return (
    <Columns value={columnWidths}>
      <box
        width="100%"
        flexDirection="column"
        {...componentStyle('Table', { width: '100%' }, 'box')}
      >
        {children}
      </box>
    </Columns>
  )
}
export function TableHeader({ children }: PropsWithChildren) {
  const componentStyle = useComponentStyles('table')

  return (
    <box flexDirection="column" {...componentStyle('TableHeader', {}, 'box')}>
      {children}
    </box>
  )
}
export function TableBody({ children }: PropsWithChildren) {
  const componentStyle = useComponentStyles('table')

  return (
    <box flexDirection="column" {...componentStyle('TableBody', {}, 'box')}>
      {children}
    </box>
  )
}
export function TableFooter({ children }: PropsWithChildren) {
  const componentStyle = useComponentStyles('table')

  return (
    <box flexDirection="column" {...componentStyle('TableFooter', {}, 'box')}>
      {children}
    </box>
  )
}
export function TableRow({
  children,
  selected = false,
  onSelect,
  label = 'Select row',
  disabled = false,
}: PropsWithChildren<{
  selected?: boolean
  onSelect?: () => void
  label?: string
  disabled?: boolean
}>) {
  const componentStyle = useComponentStyles('table')

  const theme = useTheme()
  const cells = Children.map(children, (child, index) =>
    isValidElement<{ columnIndex?: number }>(child)
      ? cloneElement(child, { columnIndex: index })
      : child,
  )
  return (
    <SelectedRow value={selected}>
      <box
        width="100%"
        flexDirection="column"
        flexShrink={0}
        border={['bottom']}
        borderColor={theme.border}
        {...componentStyle('TableRow', { width: '100%' }, 'box')}
      >
        {onSelect ? (
          <Pressable
            styleSource="table"
            stylePart="TableRow.control"
            width="100%"
            paddingX={0}
            label={label}
            selected={selected}
            highlight={false}
            onPress={onSelect}
            disabled={disabled}
          >
            {cells}
          </Pressable>
        ) : (
          <box height={1} width="100%" flexDirection="row">
            {cells}
          </box>
        )}
      </box>
    </SelectedRow>
  )
}
type CellProps = {
  children: ReactNode
  width?: number
  columnIndex?: number
  align?: 'left' | 'center' | 'right'
}
function Cell({
  children,
  width,
  columnIndex = 0,
  align = 'left',
  heading = false,
}: CellProps & { heading?: boolean }) {
  const componentStyle = useComponentStyles('table')

  const columns = useContext(Columns)
  const selected = useContext(SelectedRow)
  const theme = useTheme()
  const fixed = width ?? columns?.[columnIndex]
  return (
    <box
      width={fixed}
      flexGrow={fixed === undefined ? 1 : 0}
      flexBasis={fixed === undefined ? 0 : undefined}
      flexShrink={1}
      minWidth={1}
      height={1}
      {...tableDefaults.cell}
      {...componentStyle(
        heading ? 'TableHead' : 'TableCell',
        { width: fixed, height: 1, ...tableDefaults.cell },
        'box',
      )}
    >
      {typeof children === 'string' || typeof children === 'number' ? (
        <text
          height={1}
          wrapMode="none"
          truncate
          textAlign={align}
          attributes={heading ? TextAttributes.BOLD : undefined}
          fg={
            selected
              ? theme.primary
              : heading
                ? theme.mutedForeground
                : theme.foreground
          }
          {...componentStyle(
            heading ? 'TableHead.text' : 'TableCell.text',
            {
              height: 1,
              fg: selected
                ? theme.primary
                : heading
                  ? theme.mutedForeground
                  : theme.foreground,
            },
            'text',
          )}
        >
          {String(children)}
        </text>
      ) : (
        children
      )}
    </box>
  )
}
export function TableHead(props: CellProps) {
  return <Cell {...props} heading />
}
export function TableCell(props: CellProps) {
  return <Cell {...props} />
}
export function TableCaption({ children }: { children: string }) {
  const componentStyle = useComponentStyles('table')

  const theme = useTheme()
  return (
    <text
      fg={theme.mutedForeground}
      {...componentStyle('TableCaption', { fg: theme.mutedForeground }, 'text')}
    >
      {children}
    </text>
  )
}
