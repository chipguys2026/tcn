// biome-ignore-all lint/a11y/noStaticElementInteractions: Native slider tracks support pointer placement and dragging.
import type { BoxRenderable, KeyEvent, MouseEvent } from '@opentui/core'
import { useRef } from 'react'
import { useFocusable } from '@/lib/ui/focus/use-focusable'
import { useFocusRing } from '@/lib/ui/focus-ring'
import { useComponentStyles } from '@/lib/ui/style-review'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { useBoxSize } from '@/lib/ui/use-box-size'
import { useControllable } from '@/lib/ui/use-controllable'
import { sliderDefaults } from './slider.styles'

export type SliderProps = {
  id?: string
  label?: string
  value?: number[]
  defaultValue?: number[]
  onValueChange?: (value: number[]) => void
  onValueCommit?: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  autoFocus?: boolean
  orientation?: 'horizontal' | 'vertical'
  width?: number | `${number}%`
  height?: number
}
function Thumb({
  id,
  label,
  position,
  orientation,
  disabled,
  autoFocus,
  onKeyDown,
  handleRef,
}: {
  id?: string
  label: string
  position: number
  orientation: 'horizontal' | 'vertical'
  disabled: boolean
  autoFocus: boolean
  onKeyDown: (key: KeyEvent) => void
  handleRef: (handle: { focus: () => void }) => void
}) {
  const styles = useComponentStyles('slider'),
    theme = useTheme()
  const focus = useFocusable<BoxRenderable>({ id, label, disabled, autoFocus })
  const props = focus.getFocusProps()
  handleRef(focus.handle)
  useFocusRing(props.ref, focus.focused && !disabled, theme.ring)
  return (
    <box
      {...props}
      position="absolute"
      left={orientation === 'horizontal' ? position : 0}
      top={orientation === 'vertical' ? position : 0}
      width={sliderDefaults.thumbWidth}
      height={sliderDefaults.thumbHeight}
      zIndex={focus.focused ? 2 : 1}
      onKeyDown={onKeyDown}
      {...styles('SliderThumb', {
        width: sliderDefaults.thumbWidth,
        height: sliderDefaults.thumbHeight,
      })}
    >
      <text
        height={1}
        width={1}
        selectable={false}
        fg={theme.primary}
        {...styles('SliderThumb.text', { fg: theme.primary }, 'text')}
      >
        ●
      </text>
    </box>
  )
}
export function Slider({
  id,
  label = 'Slider',
  value,
  defaultValue = [50],
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  autoFocus = false,
  orientation = 'horizontal',
  width = orientation === 'horizontal' ? sliderDefaults.width : 1,
  height = orientation === 'vertical' ? sliderDefaults.height : 1,
}: SliderProps) {
  const styles = useComponentStyles('slider'),
    theme = useTheme(),
    box = useBoxSize()
  const lower = Number.isFinite(min) ? min : 0,
    upper = Number.isFinite(max) && max > lower ? max : lower + 100
  const increment = Number.isFinite(step) && step > 0 ? step : 1
  const snap = (number: number) =>
    Math.max(
      lower,
      Math.min(
        upper,
        Number(
          (
            lower +
            Math.round((number - lower) / increment) * increment
          ).toFixed(10),
        ),
      ),
    )
  const normalize = (values: number[]) =>
    (values.length ? values : [lower])
      .map((number) => snap(Number.isFinite(number) ? number : lower))
      .sort((a, b) => a - b)
  const [raw, setRaw] = useControllable(value, defaultValue, onValueChange),
    values = normalize(raw)
  const drag = useRef<number | null>(null),
    proposal = useRef(values),
    handles = useRef<{ focus: () => void }[]>([])
  const length = Math.max(
    1,
    orientation === 'horizontal' ? box.width : box.height,
  )
  const offset = (number: number) =>
    Math.round(((number - lower) / (upper - lower)) * (length - 1))
  const position = (number: number) =>
    orientation === 'horizontal' ? offset(number) : length - 1 - offset(number)
  const change = (index: number, number: number) => {
    const next = [...values]
    next[index] = Math.max(
      values[index - 1] ?? lower,
      Math.min(values[index + 1] ?? upper, snap(number)),
    )
    proposal.current = next
    if (next.some((entry, i) => entry !== values[i])) setRaw(next)
    return next
  }
  const numberAt = (event: MouseEvent) => {
    const node = box.ref.current
    const coordinate =
      orientation === 'horizontal'
        ? event.x - (node?.screenX ?? 0)
        : length - 1 - (event.y - (node?.screenY ?? 0))
    return (
      lower +
      (Math.max(0, Math.min(length - 1, coordinate)) /
        Math.max(1, length - 1)) *
        (upper - lower)
    )
  }
  const move = (event: MouseEvent) => {
    if (disabled || drag.current === null) return
    event.preventDefault()
    event.stopPropagation()
    change(drag.current, numberAt(event))
  }
  const finish = (event: MouseEvent) => {
    if (disabled || drag.current === null || event.button !== 0) return
    move(event)
    drag.current = null
    onValueCommit?.(proposal.current)
  }
  const key = (index: number, event: KeyEvent) => {
    if (
      disabled ||
      event.defaultPrevented ||
      event.ctrl ||
      event.meta ||
      event.option ||
      event.eventType === 'release'
    )
      return
    const directions: Record<string, number> = {
      left: -1,
      down: -1,
      right: 1,
      up: 1,
      pageup: 10,
      pagedown: -10,
    }
    if (!(event.name in directions) && !['home', 'end'].includes(event.name))
      return
    event.preventDefault()
    event.stopPropagation()
    const target =
      event.name === 'home'
        ? lower
        : event.name === 'end'
          ? upper
          : (values[index] ?? lower) +
            (directions[event.name] ?? 0) * increment * (event.shift ? 10 : 1)
    const next = change(index, target)
    onValueCommit?.(next)
  }
  const positions = values.map(position),
    first =
      values.length > 1
        ? Math.min(...positions)
        : orientation === 'horizontal'
          ? 0
          : Math.min(...positions),
    last =
      values.length > 1
        ? Math.max(...positions)
        : orientation === 'horizontal'
          ? Math.max(...positions)
          : length - 1
  const glyph = orientation === 'horizontal' ? '─' : '│',
    rangeGlyph = orientation === 'horizontal' ? '━' : '┃'
  return (
    <box
      {...box}
      width={width}
      height={height}
      maxWidth="100%"
      minWidth={0}
      flexShrink={0}
      opacity={disabled ? 0.45 : 1}
      onMouseDown={(event) => {
        if (disabled || event.button !== 0) return
        event.preventDefault()
        event.stopPropagation()
        const target = numberAt(event),
          nearest = values.reduce(
            (best, number, index) =>
              Math.abs(number - target) <
              Math.abs((values[best] ?? lower) - target)
                ? index
                : best,
            0,
          )
        drag.current = nearest
        handles.current[nearest]?.focus()
        change(nearest, target)
      }}
      onMouseDrag={move}
      onMouseUp={finish}
      onMouseDragEnd={finish}
      {...styles('Slider', { width, height })}
    >
      <box
        position="absolute"
        width="100%"
        height="100%"
        {...styles('SliderTrack', { width: '100%', height: '100%' })}
      >
        <text
          selectable={false}
          fg={theme.mutedForeground}
          wrapMode="none"
          {...styles('SliderTrack.text', { fg: theme.mutedForeground }, 'text')}
        >
          {Array.from({ length }, () => glyph).join(
            orientation === 'horizontal' ? '' : '\n',
          )}
        </text>
      </box>
      <box
        position="absolute"
        left={orientation === 'horizontal' ? first : 0}
        top={orientation === 'vertical' ? first : 0}
        width={orientation === 'horizontal' ? last - first + 1 : 1}
        height={orientation === 'vertical' ? last - first + 1 : 1}
        {...styles('SliderRange', {
          width: orientation === 'horizontal' ? last - first + 1 : 1,
          height: orientation === 'vertical' ? last - first + 1 : 1,
        })}
      >
        <text
          selectable={false}
          fg={theme.primary}
          wrapMode="none"
          {...styles('SliderRange.text', { fg: theme.primary }, 'text')}
        >
          {Array.from({ length: last - first + 1 }, () => rangeGlyph).join(
            orientation === 'horizontal' ? '' : '\n',
          )}
        </text>
      </box>
      {values.map((number, index) => (
        <Thumb
          // biome-ignore lint/suspicious/noArrayIndexKey: Thumb identity is its ordered slot, never its changing numeric value.
          key={`${id ?? label}-thumb-${index}`}
          id={id ? `${id}-thumb-${index}` : undefined}
          label={`${label} ${index + 1}: ${number}`}
          position={position(number)}
          orientation={orientation}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          onKeyDown={(event) => key(index, event)}
          handleRef={(handle) => {
            handles.current[index] = handle
          }}
        />
      ))}
    </box>
  )
}
