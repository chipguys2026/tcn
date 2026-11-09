import { useAnimationTick } from '@opentui/react'
import { useState } from 'react'
import { useComponentStyles } from '@/lib/ui/style-review'
import { useTheme } from '@/lib/ui/theme/use-theme'

const frames = Array.from({ length: 8 }, (_, index) =>
  String.fromCodePoint(0xf0a9e + index),
)
export function Spinner({
  label = 'Loading',
  paused = false,
}: {
  label?: string
  paused?: boolean
}) {
  const componentStyle = useComponentStyles('spinner')

  const [frame, setFrame] = useState(0),
    theme = useTheme()
  useAnimationTick(paused ? undefined : 8, () =>
    setFrame((value) => (value + 1) % frames.length),
  )
  return (
    <text
      height={1}
      fg={theme.primary}
      {...componentStyle('Spinner', { height: 1, fg: theme.primary }, 'text')}
    >
      {frames[frame]}
      {label ? ` ${label}` : ''}
    </text>
  )
}
