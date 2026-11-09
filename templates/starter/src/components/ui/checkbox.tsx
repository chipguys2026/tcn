import type { BoxRenderable } from '@opentui/core'
import {
  type Ref,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  type FocusableHandle,
  useFocusable,
} from '@/lib/ui/focus/use-focusable'
import { useFocusRing } from '@/lib/ui/focus-ring'
import { icons } from '@/lib/ui/icons'
import { useComponentStyles } from '@/lib/ui/style-review'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { usePress } from '@/lib/ui/use-press'
import { checkboxDefaults } from './checkbox.styles'

export type CheckedState = boolean | 'indeterminate'
export type CheckboxHandle = FocusableHandle
type CheckboxStateProps =
  | { checked: CheckedState; defaultChecked?: never }
  | { checked?: never; defaultChecked?: CheckedState }
type CheckboxLabelProps =
  | { children: string; label?: string }
  | { children?: never; label: string }
export type CheckboxProps = CheckboxStateProps &
  CheckboxLabelProps & {
    id?: string
    ref?: Ref<CheckboxHandle>
    disabled?: boolean
    autoFocus?: boolean
    onCheckedChange?: (checked: CheckedState) => void
  }
const activationKeys = ['space'] as const

export function Checkbox({
  id,
  ref,
  children,
  label,
  checked,
  defaultChecked = false,
  disabled = false,
  autoFocus = false,
  onCheckedChange,
}: CheckboxProps) {
  const componentStyle = useComponentStyles('checkbox')

  const theme = useTheme()
  const controlled = checked !== undefined
  const [internal, setInternal] = useState<CheckedState>(defaultChecked)
  const state = controlled ? checked : internal
  const current = useRef(state)
  useLayoutEffect(() => {
    current.current = state
  }, [state])
  const { hovered, pressed, cancelPress, handlers } = usePress<BoxRenderable>({
    disabled,
    activationKeys,
    onPress: () => {
      const next = current.current === 'indeterminate' || !current.current
      if (!controlled) {
        current.current = next
        setInternal(next)
      }
      onCheckedChange?.(next)
    },
  })
  const { onMouseDown, ...pressProps } = handlers
  const { focused, handle, getFocusProps } = useFocusable<BoxRenderable>({
    id,
    label: label ?? children ?? 'Checkbox',
    disabled,
    autoFocus,
    onBlur: cancelPress,
  })
  useImperativeHandle(ref, () => handle, [handle])
  const focusProps = getFocusProps({ onMouseDown })
  const indicatorRef = useRef<BoxRenderable>(null)
  useFocusRing(indicatorRef, focused && !disabled, theme.ring)
  const selected = state !== false
  const active = !disabled && (hovered || pressed)
  const indicator =
    state === 'indeterminate' ? icons.minus : state ? icons.check : ' '

  return (
    <box
      {...focusProps}
      {...pressProps}
      height={1}
      flexDirection="row"
      alignSelf="flex-start"
      maxWidth="100%"
      flexShrink={1}
      {...checkboxDefaults}
      overflow="visible"
      opacity={disabled ? 0.45 : 1}
      zIndex={focused ? 10 : 0}
      {...componentStyle('Checkbox', { height: 1, ...checkboxDefaults }, 'box')}
    >
      <box
        ref={indicatorRef}
        id={`${focusProps.id}:indicator`}
        width={3}
        height={1}
        flexShrink={0}
        justifyContent="center"
        flexDirection="row"
        alignItems="center"
        backgroundColor={
          selected ? theme.primary : active ? theme.accent : theme.muted
        }
        {...componentStyle(
          'Checkbox.box2',
          {
            width: 3,
            height: 1,
            backgroundColor: selected
              ? theme.primary
              : active
                ? theme.accent
                : theme.muted,
          },
          'box',
        )}
      >
        <text
          height={1}
          selectable={false}
          fg={selected ? theme.primaryForeground : theme.foreground}
          {...componentStyle(
            'Checkbox.text',
            {
              height: 1,
              fg: selected ? theme.primaryForeground : theme.foreground,
            },
            'text',
          )}
        >
          {indicator}
        </text>
      </box>
      {children !== undefined && (
        <text
          height={1}
          flexShrink={1}
          wrapMode="none"
          truncate
          selectable={false}
          fg={theme.foreground}
          {...componentStyle(
            'Checkbox.text2',
            { height: 1, fg: theme.foreground },
            'text',
          )}
        >
          {children}
        </text>
      )}
    </box>
  )
}
