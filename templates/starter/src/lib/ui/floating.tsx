// biome-ignore-all lint/correctness/noComponentHookFactories: Each family is constructed once at module initialization, never inside render.
import { TextAttributes } from '@opentui/core'
import {
  createContext,
  type PropsWithChildren,
  type RefObject,
  useContext,
  useRef,
} from 'react'
import { Button, type ButtonProps } from '@/components/ui/button'
import type { ButtonVariant } from '@/lib/ui/styles'
import { createStrictContext } from './create-context'
import type { IconName } from './icons'
import { Overlay, type OverlayProps, type PopupSizing } from './overlay'
import { Pressable, type PressableHandle } from './pressable'
import { useComponentStyles, useStyleReview } from './style-review'
import { useTheme } from './theme/use-theme'
import { useControllable } from './use-controllable'

const FamilyStyle = createContext('dialog')
export type FloatingRootProps = PropsWithChildren<{
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}>
export type FloatingContentProps = Omit<
  OverlayProps,
  'onClose' | 'anchor' | 'modal' | 'sheet' | 'interactive'
> & { showCloseButton?: boolean }
type FloatingState = {
  open: boolean
  setOpen: (open: boolean) => void
  anchor: RefObject<PressableHandle | null>
}
// Each family gets its own context, so nested dialogs/popovers do not cross-wire.
export function createFloatingFamily(
  name: string,
  options: PopupSizing & {
    modal: boolean
    sheet?: boolean
    outsideDismiss?: boolean
    paddingX?: number
    paddingY?: number
    gap?: number
    avoidAnchor?: boolean
    showCloseButton?: boolean
  },
) {
  const styleSource = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  const [Context, useFloating] = createStrictContext<FloatingState>(name)
  function Root({
    children,
    open,
    defaultOpen = false,
    onOpenChange,
  }: FloatingRootProps) {
    const inspecting = useStyleReview()?.openPopups ?? false
    const [shown, setOpen] = useControllable(open, defaultOpen, onOpenChange)
    const anchor = useRef<PressableHandle>(null)
    return (
      <Context value={{ open: shown || inspecting, setOpen, anchor }}>
        <FamilyStyle value={styleSource}>{children}</FamilyStyle>
      </Context>
    )
  }
  function Trigger({
    children,
    label = `Open ${name}`,
    disabled = false,
    openOnArrow = false,
  }: PropsWithChildren<{
    label?: string
    disabled?: boolean
    openOnArrow?: boolean
  }>) {
    const state = useFloating()
    return (
      <Pressable
        styleSource={styleSource}
        stylePart="Trigger"
        ref={state.anchor}
        label={label}
        disabled={disabled}
        onKeyDown={(key) => {
          if (
            openOnArrow &&
            !disabled &&
            !key.ctrl &&
            !key.meta &&
            !key.option &&
            ['up', 'down'].includes(key.name)
          ) {
            key.preventDefault()
            key.stopPropagation()
            state.setOpen(true)
          }
        }}
        onPress={() => state.setOpen(!state.open)}
      >
        {children ?? label}
      </Pressable>
    )
  }
  function Content({
    children,
    outsideDismiss = options.outsideDismiss ?? true,
    width = options.width,
    height = options.height,
    showCloseButton = options.showCloseButton ?? false,
    ...props
  }: FloatingContentProps) {
    const state = useFloating()
    if (!state.open) return null
    return (
      <Overlay
        styleSource={styleSource}
        {...props}
        minWidth={props.minWidth ?? options.minWidth}
        maxWidth={props.maxWidth ?? options.maxWidth}
        minHeight={props.minHeight ?? options.minHeight}
        maxHeight={props.maxHeight ?? options.maxHeight}
        paddingX={props.paddingX ?? options.paddingX}
        paddingY={props.paddingY ?? options.paddingY}
        gap={props.gap ?? options.gap}
        avoidAnchor={props.avoidAnchor ?? options.avoidAnchor}
        width={width}
        height={height}
        corner={
          props.corner ??
          (showCloseButton ? (
            <box position="absolute" top={1} right={1}>
              <Close icon="close" label={`Close ${styleSource}`} />
            </box>
          ) : undefined)
        }
        modal={options.modal}
        sheet={options.sheet}
        outsideDismiss={outsideDismiss}
        anchor={options.modal ? undefined : state.anchor}
        onClose={() => state.setOpen(false)}
      >
        {children}
      </Overlay>
    )
  }
  function Close({
    children,
    label = 'Close',
    onPress,
    autoFocus = false,
    stylePart,
    variant = 'ghost',
    icon,
  }: PropsWithChildren<{
    label?: string
    onPress?: () => void
    autoFocus?: boolean
    stylePart?: string
    variant?: ButtonVariant
    icon?: IconName
  }>) {
    const state = useFloating()
    const close = () => {
      onPress?.()
      state.setOpen(false)
    }
    if (
      options.modal &&
      (typeof children === 'string' || children === undefined)
    ) {
      const content: ButtonProps =
        typeof children === 'string'
          ? { children, icon, label }
          : icon
            ? { icon, label }
            : { children: label }
      return (
        <Button
          {...content}
          styleSource={styleSource}
          stylePart={stylePart ?? (icon && !children ? 'CloseIcon' : 'Close')}
          paddingX={icon && !children ? 1 : undefined}
          variant={variant}
          autoFocus={autoFocus}
          onPress={close}
        />
      )
    }
    return (
      <Pressable
        styleSource={styleSource}
        stylePart={stylePart ?? 'Close'}
        autoFocus={autoFocus}
        label={label}
        onPress={close}
      >
        {children ?? label}
      </Pressable>
    )
  }
  return { Root, Trigger, Content, Close, useFloating }
}
export function FloatingHeader({ children }: PropsWithChildren) {
  const source = useContext(FamilyStyle)
  const style = useComponentStyles(source)
  const paddingRight = source === 'alert-dialog' ? 0 : 4
  return (
    <box
      flexDirection="column"
      gap={0}
      paddingRight={paddingRight}
      {...style('Header', { gap: 0, paddingRight })}
    >
      {children}
    </box>
  )
}
export function FloatingFooter({ children }: PropsWithChildren) {
  const style = useComponentStyles(useContext(FamilyStyle))
  return (
    <box
      flexDirection="row"
      gap={1}
      marginTop={1}
      justifyContent="flex-end"
      flexWrap="wrap"
      {...style('Footer', { gap: 1, marginTop: 1 })}
    >
      {children}
    </box>
  )
}
export function FloatingTitle({ children }: { children: string }) {
  const style = useComponentStyles(useContext(FamilyStyle))
  const theme = useTheme()
  return (
    <text
      fg={theme.popoverForeground}
      attributes={TextAttributes.BOLD}
      {...style('Title', { fg: theme.popoverForeground }, 'text')}
    >
      {children}
    </text>
  )
}
export function FloatingDescription({ children }: { children: string }) {
  const style = useComponentStyles(useContext(FamilyStyle))
  const theme = useTheme()
  return (
    <text
      fg={theme.mutedForeground}
      {...style('Description', { fg: theme.mutedForeground }, 'text')}
    >
      {children}
    </text>
  )
}
