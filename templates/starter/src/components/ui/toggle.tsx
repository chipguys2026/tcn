import type { PropsWithChildren } from 'react'
import { Pressable } from '@/lib/ui/pressable'
import { useControllable } from '@/lib/ui/use-controllable'
export type ToggleProps = PropsWithChildren<{
  label: string
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  disabled?: boolean
  autoFocus?: boolean
}>
export function Toggle({
  pressed,
  defaultPressed = false,
  onPressedChange,
  ...props
}: ToggleProps) {
  const [on, setOn] = useControllable(pressed, defaultPressed, onPressedChange)
  return (
    <Pressable
      styleSource="toggle"
      stylePart="Toggle"
      {...props}
      selected={on}
      onPress={() => setOn(!on)}
    />
  )
}
