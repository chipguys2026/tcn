// biome-ignore-all lint/a11y/noStaticElementInteractions: Native TUI control; keyboard and focus are composed through usePress/useFocusable.
// biome-ignore-all lint/a11y/useKeyWithMouseEvents: Native focus events are subscribed by useFocusable rather than DOM onFocus props.
import type { BoxRenderable, KeyEvent, MouseEvent } from '@opentui/core'
import { type PropsWithChildren, type Ref, useImperativeHandle } from 'react'
import { type FocusableHandle, useFocusable } from './focus/use-focusable'
import { useFocusRing } from './focus-ring'
import { useComponentStyles } from './style-review'
import { useTheme } from './theme/use-theme'
import { usePress } from './use-press'

export type PressableHandle = FocusableHandle & {
  getNode: () => BoxRenderable | null
}
export type PressableProps = PropsWithChildren<{
  id?: string
  label: string
  disabled?: boolean
  autoFocus?: boolean
  tabStop?: boolean
  selected?: boolean
  ring?: boolean
  highlight?: boolean
  paddingX?: number
  paddingY?: number
  gap?: number
  width?: number | 'auto' | `${number}%`
  ref?: Ref<PressableHandle>
  onPress?: () => void
  onContextMenu?: (event: MouseEvent) => void
  onKeyDown?: (key: KeyEvent) => void
  onFocus?: () => void
  onBlur?: () => void
  onHoverChange?: (hovered: boolean) => void
  styleSource?: string
  stylePart?: string
}>
export function Pressable({
  id,
  label,
  disabled = false,
  autoFocus,
  tabStop,
  selected = false,
  ring = true,
  highlight = true,
  paddingX = 1,
  paddingY = 0,
  gap = 0,
  width,
  ref,
  onPress,
  onContextMenu,
  onKeyDown,
  onFocus,
  onBlur,
  onHoverChange,
  children,
  styleSource = 'pressable',
  stylePart = 'Pressable',
}: PressableProps) {
  const componentStyle = useComponentStyles(styleSource)
  const theme = useTheme()
  const press = usePress<BoxRenderable>({ disabled, onPress })
  const focus = useFocusable<BoxRenderable>({
    id,
    label,
    disabled,
    autoFocus,
    tabStop,
    onFocus,
    onBlur: () => {
      press.cancelPress()
      onBlur?.()
    },
  })
  const { onMouseDown, ...events } = press.handlers
  const props = focus.getFocusProps({ onMouseDown })
  useFocusRing(props.ref, ring && focus.focused && !disabled, theme.ring)
  useImperativeHandle(
    ref,
    () => ({ ...focus.handle, getNode: () => props.ref.current }),
    [focus.handle, props.ref],
  )
  return (
    <box
      {...props}
      {...events}
      onMouseDown={(event) => {
        if (event.button === 2 && !disabled && onContextMenu) {
          event.preventDefault()
          event.stopPropagation()
          focus.handle.focus()
          onContextMenu(event)
          return
        }
        props.onMouseDown?.call(props.ref.current as BoxRenderable, event)
      }}
      width={width}
      height={1 + paddingY * 2}
      alignSelf="flex-start"
      flexDirection="row"
      flexShrink={1}
      maxWidth="100%"
      paddingX={paddingX}
      paddingY={paddingY}
      gap={gap}
      overflow="visible"
      opacity={disabled ? 0.45 : 1}
      backgroundColor={
        !highlight
          ? undefined
          : selected
            ? theme.primary
            : press.hovered || press.pressed || focus.focused
              ? theme.accent
              : undefined
      }
      zIndex={focus.focused ? 10 : 0}
      onKeyDown={(key) => {
        onKeyDown?.(key)
        events.onKeyDown(key)
      }}
      onMouseOver={() => {
        events.onMouseOver()
        if (!disabled) onHoverChange?.(true)
      }}
      onMouseOut={() => {
        events.onMouseOut()
        onHoverChange?.(false)
      }}
      {...componentStyle(stylePart, {
        width,
        height: 1 + paddingY * 2,
        paddingX,
        paddingY,
        gap,
        backgroundColor: !highlight
          ? undefined
          : selected
            ? theme.primary
            : press.hovered || press.pressed || focus.focused
              ? theme.accent
              : undefined,
      })}
    >
      {typeof children === 'string' || children === undefined ? (
        <text
          height={1}
          wrapMode="none"
          truncate
          selectable={false}
          fg={selected ? theme.primaryForeground : theme.foreground}
          {...componentStyle(
            `${stylePart}.text`,
            {
              fg: selected ? theme.primaryForeground : theme.foreground,
              height: 1,
            },
            'text',
          )}
        >
          {children ?? label}
        </text>
      ) : (
        children
      )}
    </box>
  )
}
