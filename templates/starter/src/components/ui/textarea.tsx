// biome-ignore-all lint/a11y/noStaticElementInteractions: Native TUI surface delegates padding clicks and wheel input to its editor.
import {
  type BoxRenderable,
  type KeyEvent,
  MouseEvent,
  type PasteEvent,
  type TextareaRenderable,
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
import { textareaDefaults } from '@/lib/ui/styles'
import { useTheme } from '@/lib/ui/theme/use-theme'
export type TextareaHandle = FocusableHandle
const paddingFields = [
  'paddingX',
  'paddingY',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
] as const
function textPadding(styles: Record<string, string | number>) {
  const style = { ...styles }
  const padding: Partial<Record<(typeof paddingFields)[number], number>> = {}
  for (const key of paddingFields) {
    const value = style[key]
    if (typeof value === 'number') padding[key] = value
    delete style[key]
  }
  return { style, padding }
}
type Common = {
  id?: string
  ref?: Ref<TextareaHandle>
  label?: string
  placeholder?: string
  width?: number | `${number}%`
  height?: number
  disabled?: boolean
  readOnly?: boolean
  invalid?: boolean
  autoFocus?: boolean
  onValueChange?: (value: string) => void
  onSubmit?: (value: string) => void
}
export type TextareaProps = Common &
  (
    | { value: string; defaultValue?: never }
    | { value?: never; defaultValue?: string }
  )
export function Textarea({
  id,
  ref,
  label,
  placeholder = '',
  width = '100%',
  height = 4,
  disabled: disabledProp = false,
  readOnly = false,
  invalid: invalidProp = false,
  autoFocus,
  value,
  defaultValue = '',
  onValueChange,
  onSubmit,
}: TextareaProps) {
  const group = useContext(EditorGroupContext)
  const disabled = disabledProp || !!group?.disabled
  const invalid = invalidProp || !!group?.invalid
  const componentStyle = useComponentStyles('textarea')

  const theme = useTheme(),
    [internal, setInternal] = useState(defaultValue),
    [, reconcile] = useReducer((n) => n + 1, 0)
  const shown = value ?? internal,
    programmatic = useRef<string | null>(null)
  const focus = useFocusable<TextareaRenderable>({
    id,
    label: label ?? (placeholder || 'Textarea'),
    disabled,
    autoFocus,
  })
  const props = focus.getFocusProps(),
    native = props.ref
  useImperativeHandle(ref, () => focus.handle, [focus.handle])
  useLayoutEffect(() => {
    const node = native.current
    if (node && !node.isDestroyed && node.plainText !== shown) {
      programmatic.current = shown
      node.setText(shown)
    }
  })
  function contentChanged() {
    const text = native.current?.plainText ?? ''
    if (programmatic.current === text) {
      programmatic.current = null
      return
    }
    programmatic.current = null
    if (disabled || readOnly) {
      reconcile()
      return
    }
    if (value === undefined) setInternal(text)
    else reconcile()
    onValueChange?.(text)
  }
  function keyDown(key: KeyEvent) {
    if ((key.ctrl || key.meta) && key.name === 'return' && !disabled) {
      key.preventDefault()
      key.stopPropagation()
      onSubmit?.(native.current?.plainText ?? shown)
      return
    }
    const navigation =
      [
        'left',
        'right',
        'up',
        'down',
        'home',
        'end',
        'pageup',
        'pagedown',
        'tab',
        'escape',
      ].includes(key.name) ||
      ((key.ctrl || key.meta) && ['a', 'c'].includes(key.name))
    if (disabled || (readOnly && !navigation)) {
      key.preventDefault()
      key.stopPropagation()
    }
  }
  function paste(event: PasteEvent) {
    if (disabled || readOnly) {
      event.preventDefault()
      event.stopPropagation()
    }
  }
  const surface = useRef<BoxRenderable>(null)
  useFocusRing(
    group?.surface ?? surface,
    focus.focused && !disabled,
    invalid ? theme.destructive : theme.ring,
  )
  const surfaceStyle = textPadding(
    componentStyle(
      'Textarea',
      {
        width,
        height: Math.max(2, height),
        paddingX: textareaDefaults.paddingX,
        backgroundColor: group?.background ?? theme.muted,
      },
      'box',
    ),
  )
  const editorStyle = textPadding(
    componentStyle(
      'Textarea.textarea',
      {
        width: '100%',
        height: '100%',
        backgroundColor: '#00000000',
        focusedBackgroundColor: '#00000000',
        textColor: theme.foreground,
        focusedTextColor: theme.foreground,
        placeholderColor: theme.mutedForeground,
        cursorColor: theme.foreground,
      },
      'textarea',
    ),
  )
  return (
    <box
      ref={surface}
      width={width}
      height={Math.max(2, height)}
      minWidth={3}
      maxWidth="100%"
      flexShrink={0}
      backgroundColor={group?.background ?? theme.muted}
      onMouseDown={(event) => {
        const node = native.current
        if (disabled || event.button !== 0 || !node || event.target === node)
          return
        focus.handle.focus()
        const x = Math.max(0, Math.min(node.width - 1, event.x - node.screenX))
        const y = Math.max(0, Math.min(node.height - 1, event.y - node.screenY))
        node.editorView.setLocalSelection(
          x,
          y,
          x,
          y,
          undefined,
          undefined,
          true,
          false,
        )
        node.clearSelection()
        node.requestRender()
      }}
      onMouseScroll={(event) => {
        const node = native.current
        if (!disabled && node && event.target !== node) {
          node.processMouseEvent(new MouseEvent(node, event))
          event.stopPropagation()
        }
      }}
      opacity={disabled ? 0.45 : 1}
      overflow="visible"
      zIndex={focus.focused ? 10 : 0}
      renderAfter={
        !disabled && !focus.focused && invalid && !group
          ? createFocusRing(theme.destructive)
          : undefined
      }
      {...surfaceStyle.style}
    >
      <box
        width="100%"
        height="100%"
        paddingX={textareaDefaults.paddingX}
        {...surfaceStyle.padding}
        {...editorStyle.padding}
      >
        <textarea
          {...props}
          width="100%"
          height="100%"
          backgroundColor="#00000000"
          focusedBackgroundColor="#00000000"
          textColor={theme.foreground}
          focusedTextColor={theme.foreground}
          placeholder={placeholder}
          placeholderColor={theme.mutedForeground}
          selectionBg={theme.primary}
          selectionFg={theme.primaryForeground}
          cursorColor={theme.foreground}
          onContentChange={contentChanged}
          onKeyDown={keyDown}
          onPaste={paste}
          {...editorStyle.style}
        />
      </box>
    </box>
  )
}
