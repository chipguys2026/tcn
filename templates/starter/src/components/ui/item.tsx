import {
  Children,
  isValidElement,
  type PropsWithChildren,
  type ReactNode,
} from 'react'
import { PartBox, PartText } from '@/lib/ui/parts'
import { useComponentStyles } from '@/lib/ui/style-review'
import { itemDefaults } from '@/lib/ui/styles'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { Separator } from './separator'

export function Item({
  children,
  variant = 'default',
}: PropsWithChildren<{ variant?: 'default' | 'muted' }>) {
  const theme = useTheme()
  const styles = useComponentStyles('item')
  const defaults = {
    width: '100%' as const,
    paddingX: itemDefaults.paddingX,
    paddingY: itemDefaults.paddingY,
    gap: itemDefaults.gap,
    backgroundColor: variant === 'muted' ? theme.muted : undefined,
  }
  const appearance = { ...defaults, ...styles('Item', defaults) }
  const slots: Record<
    'header' | 'content' | 'actions' | 'footer',
    ReactNode[]
  > = {
    header: [],
    content: [],
    actions: [],
    footer: [],
  }
  for (const child of Children.toArray(children)) {
    const slot = isValidElement(child)
      ? child.type === ItemHeader
        ? 'header'
        : child.type === ItemFooter
          ? 'footer'
          : child.type === ItemActions
            ? 'actions'
            : 'content'
      : 'content'
    slots[slot].push(child)
  }
  return (
    <box minWidth={0} maxWidth="100%" flexDirection="column" {...appearance}>
      {slots.header}
      <box
        minWidth={0}
        width="100%"
        flexDirection="row"
        flexWrap="wrap"
        alignItems="flex-start"
        gap={Number(appearance.gap)}
      >
        <box
          minWidth={0}
          maxWidth="100%"
          flexDirection="row"
          alignItems="flex-start"
          flexGrow={1}
          flexShrink={1}
          flexBasis={itemDefaults.contentBasis}
          gap={Number(appearance.gap)}
        >
          {slots.content}
        </box>
        {slots.actions}
      </box>
      {slots.footer}
    </box>
  )
}
export function ItemGroup({ children }: PropsWithChildren) {
  return (
    <PartBox
      source="item"
      part="ItemGroup"
      width="100%"
      gap={itemDefaults.groupGap}
    >
      {children}
    </PartBox>
  )
}
export function ItemMedia({
  children,
  variant = 'default',
}: PropsWithChildren<{ variant?: 'default' | 'icon' }>) {
  return (
    <PartBox
      source="item"
      part="ItemMedia"
      flexDirection="row"
      flexShrink={0}
      width={variant === 'icon' ? itemDefaults.iconWidth : undefined}
      height={variant === 'icon' ? 1 : undefined}
    >
      {children}
    </PartBox>
  )
}
export function ItemContent({ children }: PropsWithChildren) {
  return (
    <PartBox
      source="item"
      part="ItemContent"
      flexGrow={1}
      flexShrink={1}
      flexBasis={0}
      gap={itemDefaults.contentGap}
    >
      {children}
    </PartBox>
  )
}
export function ItemTitle({ children }: { children: string }) {
  return (
    <PartText source="item" part="ItemTitle" bold>
      {children}
    </PartText>
  )
}
export function ItemDescription({ children }: { children: string }) {
  return (
    <PartText source="item" part="ItemDescription" tone="mutedForeground">
      {children}
    </PartText>
  )
}
export function ItemActions({ children }: PropsWithChildren) {
  return (
    <PartBox
      source="item"
      part="ItemActions"
      flexDirection="row"
      flexWrap="wrap"
      marginLeft="auto"
      gap={itemDefaults.gap}
    >
      {children}
    </PartBox>
  )
}
export function ItemHeader({ children }: PropsWithChildren) {
  return (
    <PartBox
      source="item"
      part="ItemHeader"
      width="100%"
      flexDirection="row"
      gap={itemDefaults.gap}
    >
      {children}
    </PartBox>
  )
}
export function ItemFooter({ children }: PropsWithChildren) {
  return (
    <PartBox
      source="item"
      part="ItemFooter"
      width="100%"
      flexDirection="row"
      gap={itemDefaults.gap}
    >
      {children}
    </PartBox>
  )
}
export function ItemSeparator() {
  return <Separator styleSource="item" stylePart="ItemSeparator" />
}
