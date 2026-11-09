// biome-ignore-all lint/a11y/noStaticElementInteractions: Native toast hover events pause its renderer-clock timer.
import type { BoxRenderable } from '@opentui/core'
import {
  createPortal,
  useRenderer,
  useTerminalDimensions,
} from '@opentui/react'
import {
  type PropsWithChildren,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createStrictContext } from '@/lib/ui/create-context'
import { getFocusCoordinator } from '@/lib/ui/focus/coordinator'
import { icons } from '@/lib/ui/icons'
import { PartBox, PartText } from '@/lib/ui/parts'
import { useComponentStyles, useStyleReview } from '@/lib/ui/style-review'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { useControllable } from '@/lib/ui/use-controllable'
import { Button, type ButtonProps } from './button'
import { toastDefaults } from './toast.styles'

export type ToastOptions = {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
  action?: { label: string; onPress: () => void }
}
type Entry = ToastOptions & { id: number }
type ToastManager = {
  toasts: Entry[]
  toast: (options: ToastOptions) => number
  update: (id: number, options: Partial<ToastOptions>) => void
  dismiss: (id?: number) => void
}
const [Manager, useManager] = createStrictContext<ToastManager>('Toast')
const [State, useToastState] = createStrictContext<{
  close: () => void
  focus: (paused: boolean) => void
  variant: 'default' | 'destructive'
}>('Toast part')
export function ToastProvider({
  children,
  limit = toastDefaults.limit,
}: PropsWithChildren<{ limit?: number }>) {
  const [toasts, setToasts] = useState<Entry[]>([]),
    next = useRef(0)
  const toast = useCallback(
    (options: ToastOptions) => {
      const id = ++next.current
      setToasts((current) =>
        [{ ...options, id }, ...current].slice(0, Math.max(1, limit)),
      )
      return id
    },
    [limit],
  )
  const update = useCallback(
    (id: number, options: Partial<ToastOptions>) =>
      setToasts((current) =>
        current.map((entry) =>
          entry.id === id ? { ...entry, ...options } : entry,
        ),
      ),
    [],
  )
  const dismiss = useCallback(
    (id?: number) =>
      setToasts((current) =>
        id === undefined ? [] : current.filter((entry) => entry.id !== id),
      ),
    [],
  )
  const value = useMemo(
    () => ({ toasts, toast, update, dismiss }),
    [toasts, toast, update, dismiss],
  )
  return <Manager value={value}>{children}</Manager>
}
export function useToast() {
  return useManager()
}
export function Toast({
  children,
  open,
  defaultOpen = true,
  onOpenChange,
  duration = toastDefaults.duration,
  variant = 'default',
}: PropsWithChildren<{
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  duration?: number
  variant?: 'default' | 'destructive'
}>) {
  const [shown, setShown] = useControllable(open, defaultOpen, onOpenChange)
  const [hovered, hover] = useState(false),
    [focused, focus] = useState(false)
  const renderer = useRenderer(),
    theme = useTheme(),
    styles = useComponentStyles('toast')
  const surface = useRef<BoxRenderable>(null),
    previous = useRef(renderer.currentFocusedRenderable),
    remaining = useRef(duration)
  const restoreOwnedFocus = useCallback(
    (node: BoxRenderable | null) => {
      let current = renderer.currentFocusedRenderable
      while (current && current !== node) current = current.parent
      const target = previous.current,
        coordinator = getFocusCoordinator(renderer),
        owner = coordinator.owner(target)
      if (
        node &&
        current === node &&
        target &&
        !target.isDestroyed &&
        target.visible &&
        target.focusable &&
        (!owner || coordinator.allowed(owner))
      )
        target.focus()
    },
    [renderer],
  )
  useLayoutEffect(() => {
    remaining.current = shown ? duration : 0
  }, [duration, shown])
  useLayoutEffect(() => {
    if (!shown || duration <= 0 || hovered || focused) return
    const started = renderer.clock.now(),
      timer = renderer.clock.setTimeout(
        () => setShown(false),
        Math.max(0, remaining.current),
      )
    return () => {
      renderer.clock.clearTimeout(timer)
      remaining.current = Math.max(
        0,
        remaining.current - (renderer.clock.now() - started),
      )
    }
  }, [renderer, shown, duration, hovered, focused, setShown])
  useLayoutEffect(() => {
    if (!shown) return
    const node = surface.current
    previous.current = renderer.currentFocusedRenderable
    return () => restoreOwnedFocus(node)
  }, [renderer, shown, restoreOwnedFocus])
  if (!shown) return null
  const appearance = {
    paddingX: toastDefaults.paddingX,
    paddingY: toastDefaults.paddingY,
    gap: toastDefaults.gap,
    backgroundColor:
      theme.popover === theme.background ? theme.secondary : theme.popover,
  }
  return (
    <State
      value={{
        close: () => {
          restoreOwnedFocus(surface.current)
          setShown(false)
        },
        focus,
        variant,
      }}
    >
      <box
        ref={surface}
        width="100%"
        minWidth={0}
        flexDirection="column"
        flexShrink={0}
        onMouseOver={() => hover(true)}
        onMouseOut={() => hover(false)}
        {...appearance}
        {...styles('Toast', appearance)}
      >
        {children}
      </box>
    </State>
  )
}
export function ToastTitle({ children }: { children: string }) {
  const { variant } = useToastState(),
    theme = useTheme()
  return (
    <PartText
      source="toast"
      part="ToastTitle"
      height={1}
      wrapMode="none"
      truncate
      bold
      fg={variant === 'destructive' ? theme.destructive : theme.foreground}
    >
      {children}
    </PartText>
  )
}
export function ToastDescription({ children }: { children: string }) {
  const theme = useTheme()
  return (
    <PartText
      source="toast"
      part="ToastDescription"
      maxHeight={toastDefaults.maxDescriptionHeight}
      fg={theme.mutedForeground}
    >
      {children}
    </PartText>
  )
}
export function ToastIcon() {
  const { variant } = useToastState(),
    theme = useTheme()
  return (
    <PartBox
      source="toast"
      part="ToastIcon"
      width={toastDefaults.iconWidth}
      height={1}
      flexShrink={0}
    >
      <PartText
        source="toast"
        part="ToastIcon.text"
        height={1}
        fg={variant === 'destructive' ? theme.destructive : theme.foreground}
      >
        {variant === 'destructive' ? icons.error : icons.info}
      </PartText>
    </PartBox>
  )
}
export function ToastContent({ children }: PropsWithChildren) {
  return (
    <PartBox
      source="toast"
      part="ToastContent"
      flexGrow={1}
      flexShrink={1}
      flexBasis={0}
      gap={toastDefaults.gap}
    >
      {children}
    </PartBox>
  )
}
export function ToastAction(props: ButtonProps) {
  const state = useToastState()
  return (
    <Button
      variant="secondary"
      {...props}
      onFocus={() => {
        state.focus(true)
        props.onFocus?.()
      }}
      onBlur={() => {
        state.focus(false)
        props.onBlur?.()
      }}
      onPress={() => {
        props.onPress?.()
        state.close()
      }}
      styleSource="toast"
      stylePart="ToastAction"
    />
  )
}
export function ToastClose({
  label = 'Dismiss notification',
}: {
  label?: string
}) {
  const state = useToastState()
  return (
    <Button
      icon="close"
      label={label}
      variant="ghost"
      onFocus={() => state.focus(true)}
      onBlur={() => state.focus(false)}
      onPress={state.close}
      styleSource="toast"
      stylePart="ToastClose"
    />
  )
}
export function ToastViewport({
  children,
  width = toastDefaults.width,
}: PropsWithChildren<{ width?: number }>) {
  const renderer = useRenderer(),
    terminal = useTerminalDimensions(),
    review = useStyleReview(),
    styles = useComponentStyles('toast')
  const bounds = review?.viewport?.current
  const availableWidth = bounds?.width ?? terminal.width,
    availableHeight = bounds?.height ?? terminal.height
  const appearance = {
    width: Math.max(0, Math.min(width, availableWidth - 2)),
    maxHeight: Math.max(0, availableHeight - 2),
    gap: toastDefaults.viewportGap,
  }
  const proposal = styles('ToastViewport', appearance)
  const cells = (
    value: string | number | undefined,
    fallback: number,
    available: number,
  ) =>
    typeof value === 'number' && Number.isFinite(value)
      ? value
      : typeof value === 'string' && value.endsWith('%')
        ? (available * Number.parseFloat(value)) / 100
        : fallback
  const panelWidth = Math.max(
    0,
    Math.min(
      cells(proposal.width, appearance.width, availableWidth),
      availableWidth - 2,
    ),
  )
  const viewport = (
    <box
      visible={bounds?.visible}
      position="absolute"
      left={
        (bounds?.screenX ?? 0) + Math.max(0, availableWidth - panelWidth - 1)
      }
      top={undefined}
      bottom={bounds ? terminal.height - bounds.screenY - bounds.height + 1 : 1}
      flexDirection="column"
      overflow="hidden"
      zIndex={900}
      {...appearance}
      {...proposal}
      width={panelWidth}
      minWidth={0}
      maxWidth={Math.max(0, availableWidth - 2)}
      maxHeight={Math.max(
        0,
        Math.min(
          cells(proposal.maxHeight, appearance.maxHeight, availableHeight),
          availableHeight - 2,
        ),
      )}
    >
      {panelWidth >= 3 && availableHeight >= 5 ? children : null}
    </box>
  )
  return createPortal(viewport, renderer.root, null)
}
export function Toaster() {
  const { toasts, dismiss } = useManager()
  const terminal = useTerminalDimensions(),
    review = useStyleReview()
  const budget = Math.max(
    0,
    (review?.viewport?.current?.height ?? terminal.height) - 2,
  )
  const count = Math.max(
    1,
    Math.floor(
      (budget + toastDefaults.viewportGap) /
        (toastDefaults.maxToastHeight + toastDefaults.viewportGap),
    ),
  )
  return (
    <ToastViewport>
      {toasts
        .slice(0, count)
        .toReversed()
        .map((entry) => (
          <Toast
            key={entry.id}
            duration={entry.duration}
            variant={entry.variant}
            onOpenChange={(open) => {
              if (!open) dismiss(entry.id)
            }}
          >
            <PartBox
              source="toast"
              part="ToastBody"
              flexDirection="row"
              flexWrap="wrap"
              alignItems="flex-start"
              gap={toastDefaults.bodyGap}
            >
              <PartBox
                source="toast"
                part="ToastHeader"
                flexDirection="row"
                alignItems="flex-start"
                flexGrow={1}
                flexShrink={1}
                flexBasis={toastDefaults.contentBasis}
                gap={toastDefaults.bodyGap}
              >
                <ToastIcon />
                <ToastContent>
                  <ToastTitle>{entry.title}</ToastTitle>
                  {entry.description && budget >= 5 && (
                    <ToastDescription>{entry.description}</ToastDescription>
                  )}
                </ToastContent>
              </PartBox>
              {entry.action && budget >= toastDefaults.maxToastHeight && (
                <PartBox
                  source="toast"
                  part="ToastActions"
                  flexDirection="row"
                  marginLeft="auto"
                  gap={toastDefaults.bodyGap}
                >
                  <ToastAction onPress={entry.action.onPress}>
                    {entry.action.label}
                  </ToastAction>
                </PartBox>
              )}
            </PartBox>
            <box position="absolute" right={0} top={0}>
              <ToastClose />
            </box>
          </Toast>
        ))}
    </ToastViewport>
  )
}
