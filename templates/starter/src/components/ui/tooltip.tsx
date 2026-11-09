import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react'
import { createStrictContext } from '@/lib/ui/create-context'
import { Overlay, type PopupSizing, type Side } from '@/lib/ui/overlay'
import { Pressable, type PressableHandle } from '@/lib/ui/pressable'
import { useComponentStyles, useStyleReview } from '@/lib/ui/style-review'
import { tooltipDefaults } from '@/lib/ui/styles'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { useControllable } from '@/lib/ui/use-controllable'

const Delay = createContext(350)
const [Context, useTooltip] = createStrictContext<{
  open: boolean
  setOpen: (open: boolean) => void
  anchor: React.RefObject<PressableHandle | null>
  delay: number
}>('Tooltip child')
export function TooltipProvider({
  children,
  delayDuration = 350,
}: PropsWithChildren<{ delayDuration?: number }>) {
  return <Delay value={delayDuration}>{children}</Delay>
}
export function Tooltip({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  delayDuration,
}: PropsWithChildren<{
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  delayDuration?: number
}>) {
  const [shown, setOpen] = useControllable(open, defaultOpen, onOpenChange)
  const inspecting = useStyleReview()?.openPopups ?? false
  const anchor = useRef<PressableHandle>(null)
  const delay = useContext(Delay)
  return (
    <Context
      value={{
        open: shown || inspecting,
        setOpen,
        anchor,
        delay: delayDuration ?? delay,
      }}
    >
      {children}
    </Context>
  )
}
export function TooltipTrigger({
  children,
  label,
  disabled = false,
  onPress,
}: PropsWithChildren<{
  label: string
  disabled?: boolean
  onPress?: () => void
}>) {
  const state = useTooltip()
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const cancel = useCallback(() => {
    clearTimeout(timer.current)
    timer.current = undefined
  }, [])
  function show() {
    cancel()
    timer.current = setTimeout(
      () => state.setOpen(true),
      Math.max(0, state.delay),
    )
  }
  const setOpen = state.setOpen
  const hide = useCallback(() => {
    cancel()
    setOpen(false)
  }, [cancel, setOpen])
  useEffect(() => () => cancel(), [cancel])
  useEffect(() => {
    if (disabled) hide()
  }, [disabled, hide])
  return (
    <Pressable
      styleSource="tooltip"
      stylePart="TooltipTrigger"
      ref={state.anchor}
      label={label}
      disabled={disabled}
      onPress={() => {
        hide()
        onPress?.()
      }}
      onFocus={show}
      onBlur={hide}
      onHoverChange={(hovered) => (hovered ? show() : hide())}
    >
      {children ?? label}
    </Pressable>
  )
}
export function TooltipContent({
  children,
  side = 'top',
  ...sizing
}: {
  children: string
  side?: Side
} & PopupSizing) {
  const componentStyle = useComponentStyles('tooltip')

  const state = useTooltip()
  const theme = useTheme()
  if (!state.open) return null
  return (
    <Overlay
      styleSource="tooltip"
      stylePart="TooltipContent"
      anchor={state.anchor}
      {...tooltipDefaults}
      {...sizing}
      interactive={false}
      side={side}
      onClose={() => state.setOpen(false)}
    >
      <text
        fg={theme.popoverForeground}
        {...componentStyle(
          'TooltipContent.text',
          { fg: theme.popoverForeground },
          'text',
        )}
      >
        {children}
      </text>
    </Overlay>
  )
}
