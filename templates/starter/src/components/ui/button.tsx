import { type BoxRenderable, TextAttributes } from '@opentui/core'
import { type Ref, useImperativeHandle } from 'react'
import {
  type FocusableHandle,
  useFocusable,
} from '@/lib/ui/focus/use-focusable'
import { useFocusRing } from '@/lib/ui/focus-ring'
import { type IconName, icons } from '@/lib/ui/icons'
import { useComponentStyles } from '@/lib/ui/style-review'
import {
  type ButtonVariant,
  buttonDefaults,
  buttonStyles,
} from '@/lib/ui/styles'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { usePress } from '@/lib/ui/use-press'

export type ButtonHandle = FocusableHandle
type SharedProps = {
  id?: string
  ref?: Ref<ButtonHandle>
  variant?: ButtonVariant
  disabled?: boolean
  autoFocus?: boolean
  onPress?: () => void
  onFocus?: () => void
  onBlur?: () => void
  styleSource?: string
  stylePart?: string
  paddingX?: number
  width?: number | 'auto' | `${number}%`
}
export type ButtonProps = SharedProps &
  (
    | { children: string; icon?: IconName; label?: string }
    | { children?: never; icon: IconName; label: string }
  )

export function Button({
  id,
  ref,
  children,
  icon,
  label,
  variant = 'default',
  disabled = false,
  autoFocus = false,
  onPress,
  onFocus,
  onBlur,
  styleSource = 'button',
  stylePart = `Button.${variant}`,
  paddingX = buttonDefaults.paddingX,
  width,
}: ButtonProps) {
  const componentStyle = useComponentStyles(styleSource)

  const { hovered, pressed, cancelPress, handlers } = usePress<BoxRenderable>({
    disabled,
    onPress,
  })
  const { onMouseDown, ...pressProps } = handlers
  const theme = useTheme()
  const name = label ?? children ?? ''
  const { focused, handle, getFocusProps } = useFocusable<BoxRenderable>({
    id,
    label: name,
    disabled,
    autoFocus,
    onFocus,
    onBlur: () => {
      cancelPress()
      onBlur?.()
    },
  })
  const content = icon
    ? `${icons[icon]}${children ? ` ${children}` : ''}`
    : children
  const styles = buttonStyles(theme, variant, !disabled && (hovered || pressed))
  const focusProps = getFocusProps({ onMouseDown })
  useFocusRing(focusProps.ref, focused && !disabled, theme.ring)

  useImperativeHandle(ref, () => handle, [handle])

  return (
    <box
      {...focusProps}
      {...pressProps}
      height={1}
      width={width}
      flexDirection="row"
      alignSelf="flex-start"
      maxWidth="100%"
      flexShrink={1}
      paddingX={paddingX}
      paddingY={buttonDefaults.paddingY}
      overflow="visible"
      backgroundColor={styles.background}
      opacity={disabled ? 0.45 : 1}
      zIndex={focused && !disabled ? 10 : 0}
      {...componentStyle(
        stylePart,
        {
          height: 1,
          width,
          paddingX,
          paddingY: buttonDefaults.paddingY,
          backgroundColor: styles.background,
        },
        'box',
      )}
    >
      <text
        fg={styles.foreground}
        height={1}
        flexShrink={1}
        wrapMode="none"
        truncate
        selectable={false}
        attributes={
          variant === 'link' ? TextAttributes.UNDERLINE : TextAttributes.NONE
        }
        {...componentStyle(
          `${stylePart}.text`,
          { fg: styles.foreground, height: 1 },
          'text',
        )}
      >
        {content}
      </text>
    </box>
  )
}
