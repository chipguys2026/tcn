import type { PropsWithChildren } from 'react'
import { PartBox, PartText } from '@/lib/ui/parts'
import { Button, type ButtonProps } from './button'
import { paginationDefaults } from './pagination.styles'

export function Pagination({ children }: PropsWithChildren) {
  return (
    <PartBox
      source="pagination"
      part="Pagination"
      width="100%"
      alignItems="center"
    >
      {children}
    </PartBox>
  )
}
export function PaginationContent({ children }: PropsWithChildren) {
  return (
    <PartBox
      source="pagination"
      part="PaginationContent"
      flexDirection="row"
      flexWrap="wrap"
      gap={paginationDefaults.gap}
    >
      {children}
    </PartBox>
  )
}
export function PaginationItem({ children }: PropsWithChildren) {
  return (
    <PartBox source="pagination" part="PaginationItem" flexDirection="row">
      {children}
    </PartBox>
  )
}
export type PaginationLinkProps = Omit<
  ButtonProps,
  'children' | 'icon' | 'styleSource' | 'stylePart'
> & { children: string; isActive?: boolean }
export function PaginationLink({
  isActive = false,
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      variant={isActive ? 'secondary' : 'ghost'}
      {...props}
      styleSource="pagination"
      stylePart="PaginationLink"
    />
  )
}
type StepProps = Omit<
  ButtonProps,
  'children' | 'icon' | 'styleSource' | 'stylePart'
> & { text?: string }
export function PaginationPrevious({ text = 'Previous', ...props }: StepProps) {
  return (
    <Button
      variant="ghost"
      {...props}
      styleSource="pagination"
      stylePart="PaginationPrevious"
    >{`‹ ${text}`}</Button>
  )
}
export function PaginationNext({ text = 'Next', ...props }: StepProps) {
  return (
    <Button
      variant="ghost"
      {...props}
      styleSource="pagination"
      stylePart="PaginationNext"
    >{`${text} ›`}</Button>
  )
}
export function PaginationEllipsis() {
  return (
    <PartBox
      source="pagination"
      part="PaginationEllipsis"
      paddingX={paginationDefaults.ellipsisPaddingX}
    >
      <PartText
        source="pagination"
        part="PaginationEllipsis.text"
        height={1}
        tone="mutedForeground"
      >
        …
      </PartText>
    </PartBox>
  )
}
