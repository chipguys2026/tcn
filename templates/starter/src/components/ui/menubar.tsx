import type { KeyEvent, MouseEvent } from '@opentui/core'
import {
  type ComponentProps,
  type PropsWithChildren,
  type RefObject,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createStrictContext } from '@/lib/ui/create-context'
import { useFocusScope } from '@/lib/ui/focus/focus-scope'
import { createMenuFamily } from '@/lib/ui/menu'
import { PartBox, PartText } from '@/lib/ui/parts'
import { Pressable, type PressableHandle } from '@/lib/ui/pressable'
import { RovingGroup, useRovingItem } from '@/lib/ui/roving-group'
import { menubarDefaults as d } from '@/lib/ui/styles'
import { useControllable } from '@/lib/ui/use-controllable'

type Entry = {
  value: string
  ref: RefObject<PressableHandle | null>
  disabled: boolean
}
const [Bar, useBar] = createStrictContext<{
  value: string
  setValue: (v: string) => void
  entries: Map<string, Entry>
  close: () => void
  move: (key: KeyEvent, from: string) => void
  exit: (direction: 1 | -1) => void
}>('Menubar')
const [Menu, useMenu] = createStrictContext<{ value: string; sub: boolean }>(
  'MenubarMenu',
)
const menu = createMenuFamily('Menubar', 'menubar', d)
const [SubParent, useSubParent] = createStrictContext<{
  value: string
  sub: boolean
  close: () => void
  anchor: RefObject<PressableHandle | null>
}>('MenubarSub')
function useMenuOutsidePointer(hover = false) {
  const bar = useBar()
  return (event: MouseEvent) => {
    for (const entry of bar.entries.values()) {
      const n = entry.ref.current?.getNode()
      if (
        !entry.disabled &&
        n &&
        event.x >= n.screenX &&
        event.x < n.screenX + n.width &&
        event.y >= n.screenY &&
        event.y < n.screenY + n.height
      ) {
        if (bar.value === entry.value) {
          if (!hover) bar.close()
        } else bar.setValue(entry.value)
        return true
      }
    }
    return false
  }
}
function useMenuKeys() {
  const bar = useBar(),
    item = useMenu(),
    state = menu.useFloating()
  return (key: KeyEvent) => {
    if (key.defaultPrevented || key.ctrl || key.meta || key.option) return
    if (item.sub && key.name === 'left') {
      key.preventDefault()
      key.stopPropagation()
      state.setOpen(false)
    } else if (!item.sub && ['left', 'right'].includes(key.name))
      bar.move(key, item.value)
  }
}
export function Menubar({
  children,
  value,
  defaultValue = '',
  onValueChange,
}: PropsWithChildren<{
  value?: string
  defaultValue?: string
  onValueChange?: (v: string) => void
}>) {
  const [selected, setValue] = useControllable(
      value,
      defaultValue,
      onValueChange,
    ),
    entries = useRef(new Map<string, Entry>()).current
  const parent = useFocusScope()
  const close = () => {
    entries.get(selected)?.ref.current?.focus()
    setValue('')
  }
  const move = (key: KeyEvent, from: string) => {
    if (
      key.ctrl ||
      key.meta ||
      key.option ||
      !['left', 'right', 'home', 'end'].includes(key.name)
    )
      return
    const items = [...entries.values()].filter((e) => !e.disabled),
      i = items.findIndex((e) => e.value === from)
    const next =
      items[
        key.name === 'home'
          ? 0
          : key.name === 'end'
            ? items.length - 1
            : (i + (key.name === 'right' ? 1 : -1) + items.length) %
              items.length
      ]
    if (!next) return
    key.preventDefault()
    key.stopPropagation()
    next.ref.current?.focus()
    if (selected) setValue(next.value)
  }
  return (
    <Bar
      value={{
        value: selected,
        setValue,
        entries,
        close,
        move,
        exit: (direction) => {
          const node = entries.get(selected)?.ref.current?.getNode()
          close()
          if (node) parent?.move(direction, node)
        },
      }}
    >
      <RovingGroup orientation="horizontal">
        <PartBox
          source="menubar"
          part="Menubar"
          flexDirection="row"
          gap={d.gap}
        >
          {children}
        </PartBox>
      </RovingGroup>
    </Bar>
  )
}
export function MenubarMenu({
  children,
  value,
}: PropsWithChildren<{ value: string }>) {
  const bar = useBar()
  return (
    <Menu value={{ value, sub: false }}>
      <menu.Root
        open={bar.value === value}
        onOpenChange={(open) => (open ? bar.setValue(value) : bar.close())}
      >
        {children}
      </menu.Root>
    </Menu>
  )
}
export function MenubarTrigger({
  children,
  disabled = false,
}: {
  children: string
  disabled?: boolean
}) {
  const bar = useBar(),
    item = useMenu(),
    floating = menu.useFloating()
  const roving = useRovingItem(item.value, disabled, children)
  useLayoutEffect(() => {
    bar.entries.set(item.value, {
      value: item.value,
      ref: floating.anchor,
      disabled,
    })
    return () => {
      bar.entries.delete(item.value)
    }
  }, [bar.entries, item.value, floating.anchor, disabled])
  return (
    <Pressable
      {...roving}
      ref={(handle) => {
        floating.anchor.current = handle
        roving.ref.current = handle
      }}
      label={children}
      disabled={disabled}
      selected={floating.open}
      styleSource="menubar"
      stylePart="MenubarTrigger"
      onHoverChange={(hover) => {
        if (hover && bar.value) bar.setValue(item.value)
      }}
      onKeyDown={(key) => {
        bar.move(key, item.value)
        if (!key.defaultPrevented && ['down', 'up'].includes(key.name)) {
          key.preventDefault()
          key.stopPropagation()
          bar.setValue(item.value)
        }
      }}
      onPress={() => floating.setOpen(!floating.open)}
    >
      {children}
    </Pressable>
  )
}
export function MenubarContent({
  children,
  ...props
}: ComponentProps<typeof menu.Content>) {
  const bar = useBar()
  const outside = useMenuOutsidePointer()
  const hover = useMenuOutsidePointer(true)
  return (
    <menu.Content
      {...props}
      restoreFocus={false}
      onOutsidePointer={outside}
      onOutsidePointerMove={hover}
      onTabExit={bar.exit}
    >
      {children}
    </menu.Content>
  )
}
export function MenubarItem({
  onSelect,
  closeOnSelect = true,
  ...props
}: ComponentProps<typeof menu.Item>) {
  const bar = useBar(),
    keys = useMenuKeys()
  return (
    <menu.Item
      {...props}
      onKeyDown={(key) => {
        props.onKeyDown?.(key)
        keys(key)
      }}
      closeOnSelect={false}
      onSelect={() => {
        onSelect?.()
        if (closeOnSelect) bar.close()
      }}
    />
  )
}
export function MenubarCheckboxItem({
  onCheckedChange,
  closeOnSelect = true,
  ...props
}: ComponentProps<typeof menu.CheckboxItem>) {
  const bar = useBar(),
    keys = useMenuKeys()
  return (
    <menu.CheckboxItem
      {...props}
      onKeyDown={(key) => {
        props.onKeyDown?.(key)
        keys(key)
      }}
      closeOnSelect={false}
      onCheckedChange={(v) => {
        onCheckedChange?.(v)
        if (closeOnSelect) bar.close()
      }}
    />
  )
}
export const MenubarRadioGroup = menu.RadioGroup
export function MenubarRadioItem({
  onSelect,
  closeOnSelect = true,
  ...props
}: ComponentProps<typeof menu.RadioItem>) {
  const bar = useBar(),
    keys = useMenuKeys()
  return (
    <menu.RadioItem
      {...props}
      onKeyDown={(key) => {
        props.onKeyDown?.(key)
        keys(key)
      }}
      closeOnSelect={false}
      onSelect={() => {
        onSelect?.()
        if (closeOnSelect) bar.close()
      }}
    />
  )
}
export const MenubarGroup = menu.Group
export const MenubarLabel = menu.Label
export { Separator as MenubarSeparator } from './separator'
export function MenubarShortcut({ children }: { children: string }) {
  return (
    <PartText source="menubar" part="MenubarShortcut" tone="mutedForeground">
      {children}
    </PartText>
  )
}
export function MenubarSub({ children }: PropsWithChildren) {
  const parent = useMenu(),
    state = menu.useFloating(),
    anchor = useRef<PressableHandle>(null),
    [open, setOpen] = useState(false)
  return (
    <SubParent value={{ ...parent, close: () => state.setOpen(false), anchor }}>
      <Menu value={{ value: parent.value, sub: true }}>
        <menu.Root
          open={open}
          onOpenChange={(v) => {
            setOpen(v)
            if (!v) anchor.current?.focus()
          }}
        >
          {children}
        </menu.Root>
      </Menu>
    </SubParent>
  )
}
export function MenubarSubTrigger({
  children,
  disabled = false,
}: {
  children: string
  disabled?: boolean
}) {
  const state = menu.useFloating()
  const parent = useSubParent(),
    bar = useBar()
  const roving = useRovingItem(children, disabled, children)
  return (
    <Pressable
      {...roving}
      ref={(handle) => {
        state.anchor.current = handle
        roving.ref.current = handle
        parent.anchor.current = handle
      }}
      label={children}
      disabled={disabled}
      styleSource="menubar"
      stylePart="MenubarSubTrigger"
      width="100%"
      onKeyDown={(key) => {
        roving.onKeyDown(key)
        if (key.defaultPrevented || key.ctrl || key.meta || key.option) return
        if (key.name === 'right') {
          key.preventDefault()
          key.stopPropagation()
          state.setOpen(true)
        } else if (key.name === 'left') {
          if (parent.sub) {
            key.preventDefault()
            key.stopPropagation()
            parent.close()
          } else bar.move(key, parent.value)
        }
      }}
      onPress={() => state.setOpen(!state.open)}
    >{`${children}  ›`}</Pressable>
  )
}
export function MenubarSubContent({
  children,
  ...props
}: ComponentProps<typeof menu.Content>) {
  const bar = useBar(),
    outside = useMenuOutsidePointer(),
    hover = useMenuOutsidePointer(true)
  return (
    <menu.Content
      {...props}
      side="right"
      stylePart="SubContent"
      listPart="MenubarSubContent"
      restoreFocus={false}
      onOutsidePointer={outside}
      onOutsidePointerMove={hover}
      onTabExit={bar.exit}
    >
      {children}
    </menu.Content>
  )
}
