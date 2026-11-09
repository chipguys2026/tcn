import type {
  BoxRenderable,
  InputRenderable,
  KeyEvent,
  PasteEvent,
} from '@opentui/core'
import {
  type Ref,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import { EditorGroupContext } from '@/lib/ui/editor-group'
import {
  type FocusableHandle,
  useFocusable,
} from '@/lib/ui/focus/use-focusable'
import { createFocusRing, useFocusRing } from '@/lib/ui/focus-ring'
import { useComponentStyles } from '@/lib/ui/style-review'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { inputDefaults } from './input.styles'

export type InputHandle = FocusableHandle
type SharedProps = {
  id?: string
  ref?: Ref<InputHandle>
  label?: string
  placeholder?: string
  width?: number | `${number}%`
  disabled?: boolean
  readOnly?: boolean
  invalid?: boolean
  autoFocus?: boolean
  onValueChange?: (value: string) => void
  onSubmit?: (value: string) => void
}
export type InputProps = SharedProps &
  (
    | { value: string; defaultValue?: never }
    | { value?: never; defaultValue?: string }
  )

const singleLine = (text: string) => text.replace(/[\r\n]/g, '')

export function Input({
  id,
  ref,
  label,
  placeholder = '',
  width = '100%',
  disabled: disabledProp = false,
  readOnly = false,
  invalid: invalidProp = false,
  autoFocus = false,
  value,
  defaultValue = '',
  onValueChange,
  onSubmit,
}: InputProps) {
  const group = useContext(EditorGroupContext)
  const disabled = disabledProp || !!group?.disabled
  const invalid = invalidProp || !!group?.invalid
  const componentStyle = useComponentStyles('input')

  const theme = useTheme()
  const controlled = value !== undefined
  const [internalValue, setInternalValue] = useState(() =>
    singleLine(defaultValue),
  )
  // A native edit can happen even when a controlled owner rejects the new value.
  const [, reconcile] = useReducer((revision) => revision + 1, 0)
  const syncing = useRef(false)
  const displayedValue = singleLine(controlled ? value : internalValue)
  const { focused, handle, getFocusProps } = useFocusable<InputRenderable>({
    id,
    label: (label ?? placeholder) || 'Input',
    disabled,
    autoFocus,
  })
  const focusProps = getFocusProps()
  const nativeRef = focusProps.ref
  useImperativeHandle(ref, () => handle, [handle])

  // Reconcile every commit, including rejected edits with an unchanged value prop.
  useLayoutEffect(() => {
    const node = nativeRef.current
    if (!node || node.isDestroyed || node.value === displayedValue) return
    // Native value assignment emits input too; owner-driven updates are not edits.
    syncing.current = true
    try {
      node.value = displayedValue
    } finally {
      syncing.current = false
    }
  })

  function onInput(next: string) {
    if (syncing.current) return
    if (disabled || readOnly) {
      reconcile()
      return
    }
    if (controlled) reconcile()
    else setInternalValue(next)
    onValueChange?.(next)
  }

  function onKeyDown(key: KeyEvent) {
    if (disabled) {
      key.preventDefault()
      key.stopPropagation()
      return
    }
    if (!readOnly) return
    const navigation = [
      'left',
      'right',
      'up',
      'down',
      'home',
      'end',
      'tab',
      'escape',
      'return',
      'linefeed',
      'kpenter',
    ].includes(key.name)
    const selectionOrCopy =
      (key.ctrl || key.meta) && (key.name === 'a' || key.name === 'c')
    if (!navigation && !selectionOrCopy) {
      key.preventDefault()
      key.stopPropagation()
    }
  }

  function onPaste(event: PasteEvent) {
    if (disabled || readOnly) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  const surface = useRef<BoxRenderable>(null)
  useFocusRing(
    group?.surface ?? surface,
    focused && !disabled,
    invalid ? theme.destructive : theme.ring,
  )
  // One surface owner: repainting the editor background would blend twice under disabled opacity.
  return (
    <box
      ref={surface}
      width={width}
      height={1}
      minWidth={3}
      maxWidth="100%"
      flexShrink={1}
      overflow="visible"
      backgroundColor={group?.background ?? theme.muted}
      paddingX={inputDefaults.paddingX}
      opacity={disabled ? 0.45 : 1}
      zIndex={focused ? 10 : invalid ? 1 : 0}
      renderAfter={
        invalid && !focused && !disabled && !group
          ? createFocusRing(theme.destructive)
          : undefined
      }
      {...componentStyle(
        'Input',
        {
          width: width,
          height: 1,
          paddingX: inputDefaults.paddingX,
          backgroundColor: group?.background ?? theme.muted,
        },
        'box',
      )}
    >
      <input
        {...focusProps}
        width="100%"
        backgroundColor="#00000000"
        focusedBackgroundColor="#00000000"
        textColor={theme.foreground}
        focusedTextColor={theme.foreground}
        placeholder={singleLine(placeholder)}
        placeholderColor={theme.mutedForeground}
        selectionBg={theme.primary}
        selectionFg={theme.primaryForeground}
        cursorColor={theme.foreground}
        onInput={onInput}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onSubmit={(next) => {
          if (!disabled)
            onSubmit?.(
              typeof next === 'string'
                ? next
                : (nativeRef.current?.value ?? displayedValue),
            )
        }}
        {...componentStyle(
          'Input.input',
          {
            width: '100%',
            backgroundColor: '#00000000',
            focusedBackgroundColor: '#00000000',
            textColor: theme.foreground,
            focusedTextColor: theme.foreground,
            placeholderColor: theme.mutedForeground,
            cursorColor: theme.foreground,
          },
          'input',
        )}
      />
    </box>
  )
}
