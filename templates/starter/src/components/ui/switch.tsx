import { pillCaps } from '@/lib/ui/icons'
import { Pressable } from '@/lib/ui/pressable'
import { useComponentStyles } from '@/lib/ui/style-review'
import { switchDefaults } from '@/lib/ui/styles'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { useControllable } from '@/lib/ui/use-controllable'
export type SwitchProps = {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  autoFocus?: boolean
  label: string
  id?: string
}
export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  label,
  ...props
}: SwitchProps) {
  const [on, setOn] = useControllable(checked, defaultChecked, onCheckedChange)
  const theme = useTheme()
  const componentStyle = useComponentStyles('switch')
  const trackStyle = componentStyle(
    'Track',
    { width: 4, height: 1, backgroundColor: on ? theme.primary : theme.muted },
    'box',
  )
  const thumbStyle = componentStyle('Thumb', { fg: theme.foreground }, 'text')
  const track =
    typeof trackStyle.backgroundColor === 'string'
      ? trackStyle.backgroundColor
      : on
        ? theme.primary
        : theme.muted
  const thumb =
    typeof thumbStyle.fg === 'string' ? thumbStyle.fg : theme.foreground
  return (
    <Pressable
      styleSource="switch"
      stylePart="Switch"
      {...props}
      label={label}
      selected={on}
      paddingX={0}
      gap={switchDefaults.gap}
      highlight={false}
      onPress={() => setOn(!on)}
    >
      <box width={4} minWidth={4} height={1} flexDirection="row" flexShrink={0}>
        <text width={1} height={1} fg={on ? track : thumb} selectable={false}>
          {pillCaps.left}
        </text>
        <text width={2} height={1} fg={thumb} bg={track} selectable={false}>
          {on ? ` ${pillCaps.left}` : `${pillCaps.right} `}
        </text>
        <text width={1} height={1} fg={on ? thumb : track} selectable={false}>
          {pillCaps.right}
        </text>
      </box>
      <text
        height={1}
        flexShrink={1}
        wrapMode="none"
        truncate
        selectable={false}
        fg={theme.foreground}
        {...componentStyle(
          'Switch.text',
          { height: 1, fg: theme.foreground },
          'text',
        )}
      >
        {label}
      </text>
    </Pressable>
  )
}
