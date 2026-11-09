import type { BoxRenderable, Renderable } from '@opentui/core'
import { useRenderer } from '@opentui/react'
import {
  Children,
  createContext,
  isValidElement,
  type PropsWithChildren,
  type RefObject,
  useContext,
  useLayoutEffect,
  useRef,
} from 'react'
import { createStrictContext } from '@/lib/ui/create-context'
import { PartBox, PartText } from '@/lib/ui/parts'
import { useComponentStyles } from '@/lib/ui/style-review'
import { sidebarDefaults } from '@/lib/ui/styles'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { useBoxSize } from '@/lib/ui/use-box-size'
import { useControllable } from '@/lib/ui/use-controllable'
import { Badge } from './badge'
import { Button, type ButtonHandle, type ButtonProps } from './button'
import { Input, type InputProps } from './input'
import { Separator } from './separator'
import { Skeleton } from './skeleton'

const [Context, readSidebar] = createStrictContext<{
  open: boolean
  state: 'expanded' | 'collapsed'
  setOpen: (open: boolean) => void
  toggleSidebar: () => void
  availableWidth: number
  trigger: RefObject<ButtonHandle | null>
}>('Sidebar part')
const Collapsed = createContext(false)
export function useSidebar() {
  return readSidebar()
}
export function SidebarProvider({
  children,
  open,
  defaultOpen = true,
  onOpenChange,
  width = '100%',
  height = sidebarDefaults.height,
}: PropsWithChildren<{
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  width?: number | `${number}%`
  height?: number | `${number}%`
}>) {
  const [shown, setOpen] = useControllable(open, defaultOpen, onOpenChange),
    trigger = useRef<ButtonHandle>(null),
    box = useBoxSize(),
    styles = useComponentStyles('sidebar')
  const appearance = {
    width,
    height,
    gap: sidebarDefaults.layoutGap,
    ...styles('SidebarProvider', {
      width,
      height,
      gap: sidebarDefaults.layoutGap,
    }),
  }
  return (
    <Context
      value={{
        open: shown,
        state: shown ? 'expanded' : 'collapsed',
        setOpen,
        toggleSidebar: () => setOpen(!shown),
        availableWidth: Math.max(0, box.width - Number(appearance.gap)),
        trigger,
      }}
    >
      <box
        {...box}
        minWidth={0}
        maxWidth="100%"
        flexDirection="row"
        {...appearance}
      >
        {children}
      </box>
    </Context>
  )
}
function visible(node: Renderable) {
  let current: Renderable | null = node
  while (current) {
    if (!current.visible) return false
    current = current.parent
  }
  return true
}
export function Sidebar({
  children,
  id,
  width = sidebarDefaults.width,
  collapsible = 'icon',
}: PropsWithChildren<{
  id?: string
  width?: number
  collapsible?: 'icon' | 'offcanvas' | 'none'
}>) {
  const state = useSidebar(),
    renderer = useRenderer(),
    styles = useComponentStyles('sidebar'),
    theme = useTheme(),
    surface = useRef<BoxRenderable>(null),
    hadFocus = useRef(false)
  let focused = renderer.currentFocusedRenderable
  while (focused && focused !== surface.current) focused = focused.parent
  hadFocus.current = !!focused && focused === surface.current
  const available = Math.max(
    0,
    state.availableWidth -
      Math.min(sidebarDefaults.minInsetWidth, state.availableWidth),
  )
  const collapsed =
    collapsible === 'icon' &&
    (!state.open ||
      Math.min(width, available) < sidebarDefaults.minExpandedWidth)
  const panelWidth = Math.max(
    0,
    Math.min(collapsed ? sidebarDefaults.collapsedWidth : width, available),
  )
  const shown = (state.open || collapsible !== 'offcanvas') && panelWidth > 0
  const previousLayout = useRef({ shown, collapsed })
  useLayoutEffect(() => {
    const hiding =
      (previousLayout.current.shown && !shown) ||
      (!previousLayout.current.collapsed && collapsed)
    previousLayout.current = { shown, collapsed }
    const current = renderer.currentFocusedRenderable
    if (
      (hiding || state.availableWidth > 0) &&
      hadFocus.current &&
      (!current || !visible(current))
    )
      state.trigger.current?.focus()
  }, [renderer, state.trigger, state.availableWidth, shown, collapsed])
  return (
    <Collapsed value={collapsed}>
      <box
        ref={surface}
        id={id}
        visible={shown}
        width={panelWidth}
        height="100%"
        flexShrink={0}
        overflow="hidden"
        flexDirection="column"
        backgroundColor={theme.sidebar}
        {...styles('Sidebar', {
          width: panelWidth,
          height: '100%',
          backgroundColor: theme.sidebar,
        })}
        minWidth={0}
        maxWidth={available}
      >
        {children}
      </box>
    </Collapsed>
  )
}
export function SidebarInset({ children }: PropsWithChildren) {
  return (
    <PartBox
      source="sidebar"
      part="SidebarInset"
      height="100%"
      minWidth={0}
      flexGrow={1}
      flexShrink={1}
      flexBasis={0}
      gap={sidebarDefaults.gap}
      overflow="hidden"
    >
      {children}
    </PartBox>
  )
}
export function SidebarHeader({ children }: PropsWithChildren) {
  const collapsed = useContext(Collapsed)
  return (
    <PartBox
      source="sidebar"
      part="SidebarHeader"
      visible={!collapsed}
      paddingX={sidebarDefaults.paddingX}
      paddingY={sidebarDefaults.paddingY}
      gap={sidebarDefaults.gap}
      flexShrink={0}
    >
      {children}
    </PartBox>
  )
}
export function SidebarFooter({ children }: PropsWithChildren) {
  const collapsed = useContext(Collapsed)
  return (
    <PartBox
      source="sidebar"
      part="SidebarFooter"
      visible={!collapsed}
      paddingX={sidebarDefaults.paddingX}
      paddingY={sidebarDefaults.paddingY}
      gap={sidebarDefaults.gap}
      flexShrink={0}
    >
      {children}
    </PartBox>
  )
}
export function SidebarContent({ children }: PropsWithChildren) {
  const styles = useComponentStyles('sidebar'),
    theme = useTheme()
  return (
    <scrollbox
      flexGrow={1}
      minHeight={0}
      minWidth={0}
      scrollY
      scrollX={false}
      focusable={false}
      viewportCulling={false}
      contentOptions={{
        flexDirection: 'column',
        paddingY: sidebarDefaults.contentPaddingY,
        gap: sidebarDefaults.groupGap,
        ...styles('SidebarContent.items', {
          paddingY: sidebarDefaults.contentPaddingY,
          gap: sidebarDefaults.groupGap,
        }),
      }}
      scrollbarOptions={{
        trackOptions: {
          backgroundColor: theme.sidebar,
          foregroundColor: theme.mutedForeground,
        },
      }}
      {...styles('SidebarContent', {}, 'scrollbox')}
    >
      {children}
    </scrollbox>
  )
}
export function SidebarGroup({ children }: PropsWithChildren) {
  const collapsed = useContext(Collapsed),
    elements = Children.toArray(children)
  const heading = elements.filter(
    (child) =>
      isValidElement(child) &&
      (child.type === SidebarGroupLabel || child.type === SidebarGroupAction),
  )
  const content = elements.filter((child) => !heading.includes(child))
  return (
    <PartBox
      source="sidebar"
      part="SidebarGroup"
      width="100%"
      paddingX={collapsed ? 0 : sidebarDefaults.paddingX}
      gap={collapsed ? 0 : sidebarDefaults.gap}
    >
      {heading.length > 0 && (
        <box
          visible={!collapsed}
          flexDirection="row"
          alignItems="center"
          minWidth={0}
        >
          {heading}
        </box>
      )}
      {content}
    </PartBox>
  )
}
export function SidebarGroupLabel({ children }: { children: string }) {
  const collapsed = useContext(Collapsed)
  return (
    <PartBox
      source="sidebar"
      part="SidebarGroupLabel"
      visible={!collapsed}
      flexGrow={1}
      flexShrink={1}
    >
      <PartText
        source="sidebar"
        part="SidebarGroupLabel.text"
        height={1}
        wrapMode="none"
        truncate
        tone="mutedForeground"
      >
        {children}
      </PartText>
    </PartBox>
  )
}
export function SidebarGroupContent({ children }: PropsWithChildren) {
  return (
    <PartBox
      source="sidebar"
      part="SidebarGroupContent"
      width="100%"
      gap={sidebarDefaults.menuGap}
    >
      {children}
    </PartBox>
  )
}
export function SidebarMenu({ children }: PropsWithChildren) {
  return (
    <PartBox
      source="sidebar"
      part="SidebarMenu"
      width="100%"
      gap={sidebarDefaults.menuGap}
    >
      {children}
    </PartBox>
  )
}
export function SidebarMenuItem({ children }: PropsWithChildren) {
  const elements = Children.toArray(children),
    sub = elements.filter(
      (child) => isValidElement(child) && child.type === SidebarMenuSub,
    )
  return (
    <PartBox
      source="sidebar"
      part="SidebarMenuItem"
      width="100%"
      gap={sidebarDefaults.menuGap}
    >
      <box
        flexDirection="row"
        minWidth={0}
        alignItems="center"
        gap={sidebarDefaults.rowGap}
      >
        {elements.filter((child) => !sub.includes(child))}
      </box>
      {sub}
    </PartBox>
  )
}
export function SidebarMenuButton({
  isActive = false,
  stylePart = 'SidebarMenuButton',
  children,
  icon,
  label,
  ...props
}: ButtonProps & { isActive?: boolean }) {
  const collapsed = useContext(Collapsed),
    name = label ?? children ?? 'Navigation item'
  const content: ButtonProps = collapsed
    ? icon
      ? { icon, label: name }
      : { children: Array.from(name)[0] ?? '•', label: name }
    : typeof children === 'string'
      ? { children, icon, label }
      : { icon: icon ?? 'folder', label: name }
  return (
    <Button
      variant={isActive ? 'secondary' : 'ghost'}
      {...props}
      {...content}
      width="100%"
      styleSource="sidebar"
      stylePart={stylePart}
    />
  )
}
export function SidebarMenuAction(props: ButtonProps) {
  const collapsed = useContext(Collapsed)
  return (
    <PartBox
      source="sidebar"
      part="SidebarMenuActionSlot"
      visible={!collapsed}
      flexShrink={0}
    >
      <Button
        variant="ghost"
        {...props}
        styleSource="sidebar"
        stylePart="SidebarMenuAction"
      />
    </PartBox>
  )
}
export function SidebarGroupAction(props: ButtonProps) {
  const collapsed = useContext(Collapsed)
  return (
    <PartBox
      source="sidebar"
      part="SidebarGroupActionSlot"
      visible={!collapsed}
      flexShrink={0}
    >
      <Button
        variant="ghost"
        {...props}
        styleSource="sidebar"
        stylePart="SidebarGroupAction"
      />
    </PartBox>
  )
}
export function SidebarMenuBadge({ children }: { children: string }) {
  const collapsed = useContext(Collapsed)
  return (
    <PartBox
      source="sidebar"
      part="SidebarMenuBadge"
      visible={!collapsed}
      flexShrink={0}
    >
      <Badge>{children}</Badge>
    </PartBox>
  )
}
export function SidebarMenuSub({ children }: PropsWithChildren) {
  const collapsed = useContext(Collapsed)
  return (
    <PartBox
      source="sidebar"
      part="SidebarMenuSub"
      visible={!collapsed}
      width="100%"
      paddingLeft={sidebarDefaults.subIndent}
      gap={sidebarDefaults.menuGap}
    >
      {children}
    </PartBox>
  )
}
export function SidebarMenuSubItem({ children }: PropsWithChildren) {
  return (
    <PartBox source="sidebar" part="SidebarMenuSubItem" width="100%">
      {children}
    </PartBox>
  )
}
export function SidebarMenuSubButton(
  props: ButtonProps & { isActive?: boolean },
) {
  return <SidebarMenuButton {...props} stylePart="SidebarMenuSubButton" />
}
export function SidebarMenuSkeleton() {
  return (
    <PartBox
      source="sidebar"
      part="SidebarMenuSkeleton"
      width="100%"
      height={1}
    >
      <Skeleton />
    </PartBox>
  )
}
export function SidebarInput(props: InputProps) {
  const collapsed = useContext(Collapsed)
  return (
    <PartBox
      source="sidebar"
      part="SidebarInput"
      width="100%"
      visible={!collapsed}
    >
      <Input {...props} />
    </PartBox>
  )
}
export function SidebarSeparator() {
  const collapsed = useContext(Collapsed)
  return (
    <PartBox source="sidebar" part="SidebarSeparator" visible={!collapsed}>
      <Separator />
    </PartBox>
  )
}
export function SidebarTrigger({
  label = 'Toggle sidebar',
  onPress,
  ...props
}: Omit<ButtonProps, 'children' | 'icon' | 'ref'>) {
  const state = useSidebar()
  return (
    <Button
      variant="ghost"
      {...props}
      icon="menu"
      label={label}
      ref={state.trigger}
      onPress={() => {
        onPress?.()
        state.toggleSidebar()
      }}
      styleSource="sidebar"
      stylePart="SidebarTrigger"
    />
  )
}
