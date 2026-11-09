import type { PropsWithChildren } from 'react'
import { PartBox, PartText } from '@/lib/ui/parts'
import { breadcrumbDefaults } from '@/lib/ui/styles'
import { Button, type ButtonProps } from './button'

export function Breadcrumb({ children }: PropsWithChildren) {
  return (
    <PartBox source="breadcrumb" part="Breadcrumb" width="100%">
      {children}
    </PartBox>
  )
}
export function BreadcrumbList({ children }: PropsWithChildren) {
  return (
    <PartBox
      source="breadcrumb"
      part="BreadcrumbList"
      flexDirection="row"
      flexWrap="wrap"
      alignItems="center"
      gap={breadcrumbDefaults.gap}
    >
      {children}
    </PartBox>
  )
}
export function BreadcrumbItem({ children }: PropsWithChildren) {
  return (
    <PartBox source="breadcrumb" part="BreadcrumbItem" flexDirection="row">
      {children}
    </PartBox>
  )
}
export function BreadcrumbLink(props: ButtonProps) {
  return (
    <Button
      variant="ghost"
      paddingX={breadcrumbDefaults.linkPaddingX}
      {...props}
      styleSource="breadcrumb"
      stylePart="BreadcrumbLink"
    />
  )
}
export function BreadcrumbPage({ children }: { children: string }) {
  return (
    <PartText
      source="breadcrumb"
      part="BreadcrumbPage"
      height={1}
      wrapMode="none"
      truncate
    >
      {children}
    </PartText>
  )
}
export function BreadcrumbSeparator({ children = '›' }: { children?: string }) {
  return (
    <PartText
      source="breadcrumb"
      part="BreadcrumbSeparator"
      height={1}
      tone="mutedForeground"
    >
      {children}
    </PartText>
  )
}
export function BreadcrumbEllipsis() {
  return (
    <PartText
      source="breadcrumb"
      part="BreadcrumbEllipsis"
      height={1}
      tone="mutedForeground"
    >
      …
    </PartText>
  )
}
