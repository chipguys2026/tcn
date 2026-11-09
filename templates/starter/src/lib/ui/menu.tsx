// biome-ignore-all lint/correctness/noComponentHookFactories: Families are created once at module initialization.
import type { KeyEvent } from '@opentui/core'
import {
  Children,
  isValidElement,
  type PropsWithChildren,
  type ReactNode,
} from 'react'
import { createStrictContext } from './create-context'
import { createFloatingFamily, type FloatingContentProps } from './floating'
import type { PopupSizing } from './overlay'
import { Pressable } from './pressable'
import { RovingGroup, useRovingItem } from './roving-group'
import { useComponentStyles } from './style-review'
import { useTheme } from './theme/use-theme'
import { useControllable } from './use-controllable'

function menuText(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) =>
      typeof child === 'string' || typeof child === 'number'
        ? String(child)
        : isValidElement<{ children?: ReactNode }>(child)
          ? menuText(child.props.children)
          : '',
    )
    .join(' ')
}
export type MenuItemProps = {
  children: ReactNode
  id?: string
  disabled?: boolean
  onSelect?: () => void
  closeOnSelect?: boolean
  value?: string
  textValue?: string
  onKeyDown?: (key: KeyEvent) => void
}
type MenuDefaults = {
  content: PopupSizing & { paddingX: number; paddingY: number }
  item: { width: '100%' }
  radioGroup: { width: '100%' }
}
/** Shared menu interaction/selection engine. Each family keeps an isolated context. */
export function createMenuFamily(
  name: string,
  source: string,
  defaults: MenuDefaults,
) {
  const family = createFloatingFamily(name, {
    modal: false,
    ...defaults.content,
    avoidAnchor: true,
  })
  function Content({
    children,
    listPart = `${name}Content`,
    ...props
  }: FloatingContentProps & { listPart?: string }) {
    const style = useComponentStyles(source)
    return (
      <family.Content {...props}>
        <RovingGroup orientation="vertical">
          <box flexDirection="column" gap={1} {...style(listPart, { gap: 1 })}>
            {children}
          </box>
        </RovingGroup>
      </family.Content>
    )
  }
  function MenuItem({
    children,
    disabled = false,
    onSelect,
    closeOnSelect = true,
    value = menuText(children),
    textValue = menuText(children),
    stylePart = `${name}Item`,
    id,
    onKeyDown,
  }: MenuItemProps & { stylePart?: string }) {
    const state = family.useFloating(),
      roving = useRovingItem(value, disabled, textValue)
    return (
      <Pressable
        id={id}
        styleSource={source}
        stylePart={stylePart}
        {...defaults.item}
        {...roving}
        onKeyDown={(key) => {
          onKeyDown?.(key)
          if (!key.defaultPrevented) roving.onKeyDown(key)
        }}
        label={textValue}
        disabled={disabled}
        onPress={() => {
          onSelect?.()
          if (closeOnSelect) state.setOpen(false)
        }}
      >
        {children}
      </Pressable>
    )
  }
  function Item(props: MenuItemProps) {
    return <MenuItem {...props} />
  }
  function CheckboxItem({
    children,
    checked,
    defaultChecked = false,
    onCheckedChange,
    ...props
  }: Omit<MenuItemProps, 'onSelect'> & {
    checked?: boolean
    defaultChecked?: boolean
    onCheckedChange?: (checked: boolean) => void
  }) {
    const [on, setOn] = useControllable(
      checked,
      defaultChecked,
      onCheckedChange,
    )
    return (
      <MenuItem
        stylePart={`${name}CheckboxItem`}
        {...props}
        value={props.value ?? menuText(children)}
        textValue={props.textValue ?? menuText(children)}
        onSelect={() => setOn(!on)}
      >
        {typeof children === 'string' ? (
          `${on ? '\uf00c' : ' '} ${children}`
        ) : (
          <box flexDirection="row" gap={1}>
            <text>{on ? '\uf00c' : ' '}</text>
            {children}
          </box>
        )}
      </MenuItem>
    )
  }
  const [Radio, useRadio] = createStrictContext<{
    value: string
    select: (value: string) => void
  }>(`${name}RadioItem`)
  function RadioGroup({
    children,
    value,
    defaultValue = '',
    onValueChange,
  }: PropsWithChildren<{
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
  }>) {
    const style = useComponentStyles(source),
      [selected, select] = useControllable(value, defaultValue, onValueChange)
    return (
      <Radio value={{ value: selected, select }}>
        <box
          flexDirection="column"
          gap={1}
          {...defaults.radioGroup}
          {...style(`${name}RadioGroup`, { gap: 1, ...defaults.radioGroup })}
        >
          {children}
        </box>
      </Radio>
    )
  }
  function RadioItem({
    value,
    children,
    ...props
  }: MenuItemProps & { value: string }) {
    const state = useRadio()
    return (
      <MenuItem
        stylePart={`${name}RadioItem`}
        {...props}
        value={value}
        textValue={props.textValue ?? menuText(children)}
        onSelect={() => {
          state.select(value)
          props.onSelect?.()
        }}
      >
        {typeof children === 'string' ? (
          `${state.value === value ? '\uf192' : '\uf10c'} ${children}`
        ) : (
          <box flexDirection="row" gap={1}>
            <text>{state.value === value ? '\uf192' : '\uf10c'}</text>
            {children}
          </box>
        )}
      </MenuItem>
    )
  }
  function Label({ children }: { children: string }) {
    const style = useComponentStyles(source),
      theme = useTheme()
    return (
      <text
        fg={theme.mutedForeground}
        {...style(`${name}Label`, { fg: theme.mutedForeground }, 'text')}
      >
        {children}
      </text>
    )
  }
  function Group({ children }: PropsWithChildren) {
    const style = useComponentStyles(source)
    return (
      <box
        flexDirection="column"
        gap={1}
        {...style(`${name}Group`, { gap: 1 })}
      >
        {children}
      </box>
    )
  }
  return {
    ...family,
    Content,
    Item,
    CheckboxItem,
    RadioGroup,
    RadioItem,
    Label,
    Group,
  }
}
