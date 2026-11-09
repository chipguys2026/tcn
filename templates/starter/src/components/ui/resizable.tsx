// biome-ignore-all lint/a11y/noStaticElementInteractions: Native splitter handles support pointer dragging and keyboard resizing.
import type { BoxRenderable, KeyEvent, MouseEvent } from '@opentui/core'
import {
  Children,
  isValidElement,
  type PropsWithChildren,
  type ReactElement,
  useRef,
} from 'react'
import { createStrictContext } from '@/lib/ui/create-context'
import { useFocusable } from '@/lib/ui/focus/use-focusable'
import { useFocusRing } from '@/lib/ui/focus-ring'
import { icons } from '@/lib/ui/icons'
import {
  fitPanelLayout,
  type PanelLimit,
  resizePanelPair,
} from '@/lib/ui/panel-layout'
import { PartText } from '@/lib/ui/parts'
import { useComponentStyles } from '@/lib/ui/style-review'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { useBoxSize } from '@/lib/ui/use-box-size'
import { useControllable } from '@/lib/ui/use-controllable'
import { resizableDefaults } from './resizable.styles'

type PanelProps = PropsWithChildren<{
  id?: string
  defaultSize?: number
  minSize?: number
  maxSize?: number
}>
const [Group, useGroup] = createStrictContext<{
  orientation: 'horizontal' | 'vertical'
  layout: number[]
  disabled: boolean
  extent: () => number
  resize: (index: number, next: number) => void
}>('Resizable part')
const [Index, useIndex] = createStrictContext<number>(
  'Resizable panel/handle position',
)
export function ResizablePanelGroup({
  children,
  orientation = 'horizontal',
  layout,
  defaultLayout,
  onLayoutChange,
  disabled = false,
  width = '100%',
  height = resizableDefaults.height,
}: PropsWithChildren<{
  orientation?: 'horizontal' | 'vertical'
  layout?: number[]
  defaultLayout?: number[]
  onLayoutChange?: (layout: number[]) => void
  disabled?: boolean
  width?: number | `${number}%`
  height?: number | `${number}%`
}>) {
  const styles = useComponentStyles('resizable'),
    box = useBoxSize()
  const elements = Children.toArray(children)
  const panels = elements.filter(
    (child): child is ReactElement<PanelProps> =>
      isValidElement<PanelProps>(child) && child.type === ResizablePanel,
  )
  if (
    !panels.length ||
    elements.length !== panels.length * 2 - 1 ||
    elements.some(
      (child, index) =>
        !isValidElement(child) ||
        child.type !== (index % 2 === 0 ? ResizablePanel : ResizableHandle),
    )
  )
    throw new Error(
      'ResizablePanelGroup requires alternating direct ResizablePanel and ResizableHandle children',
    )
  const limits: PanelLimit[] = panels.map((panel) => ({
    min: panel.props.minSize ?? resizableDefaults.minSize,
    max: panel.props.maxSize ?? resizableDefaults.maxSize,
  }))
  const initial =
    defaultLayout ??
    panels.map(
      (panel) =>
        panel.props.defaultSize ??
        Math.max(
          0,
          100 -
            panels.reduce(
              (sum, item) => sum + (item.props.defaultSize ?? 0),
              0,
            ),
        ) /
          Math.max(
            1,
            panels.filter((item) => item.props.defaultSize === undefined)
              .length,
          ),
    )
  const [raw, setRaw] = useControllable(layout, initial, onLayoutChange),
    fitted = fitPanelLayout(raw, limits)
  const appearance = {
    width,
    height,
    gap: resizableDefaults.gap,
    ...styles('ResizablePanelGroup', {
      width,
      height,
      gap: resizableDefaults.gap,
    }),
  }
  const extent = () => {
    const node = box.ref.current,
      nodes = node?.getChildren() ?? []
    const handleSpace = nodes
      .filter((_, index) => index % 2 === 1)
      .reduce(
        (sum, child) =>
          sum + (orientation === 'horizontal' ? child.width : child.height),
        0,
      )
    return Math.max(
      1,
      (orientation === 'horizontal'
        ? (node?.width ?? 0)
        : (node?.height ?? 0)) -
        handleSpace -
        Math.max(0, elements.length - 1) * Number(appearance.gap),
    )
  }
  return (
    <Group
      value={{
        orientation,
        layout: fitted,
        disabled,
        extent,
        resize: (index, next) => {
          if (disabled) return
          const updated = resizePanelPair(fitted, limits, index, next)
          if (
            updated.some(
              (number, i) => Math.abs(number - (fitted[i] ?? 0)) > 0.000001,
            )
          )
            setRaw(updated)
        },
      }}
    >
      <box
        {...box}
        minWidth={0}
        maxWidth="100%"
        minHeight={0}
        flexShrink={0}
        flexDirection={orientation === 'horizontal' ? 'row' : 'column'}
        {...appearance}
      >
        {elements.map((child, index) => (
          <Index
            key={isValidElement(child) ? (child.key ?? index) : index}
            value={Math.floor(index / 2)}
          >
            {child}
          </Index>
        ))}
      </box>
    </Group>
  )
}
export function ResizablePanel({ children, id }: PanelProps) {
  const group = useGroup(),
    index = useIndex(),
    styles = useComponentStyles('resizable')
  return (
    <box
      id={id}
      visible={(group.layout[index] ?? 0) > 0}
      flexDirection="column"
      flexBasis={0}
      flexGrow={group.layout[index] ?? 0}
      flexShrink={1}
      minWidth={0}
      minHeight={0}
      overflow="hidden"
      {...styles('ResizablePanel', {})}
    >
      {children}
    </box>
  )
}
export function ResizableHandle({
  id,
  label = 'Resize panels',
  disabled = false,
  withHandle = false,
  autoFocus = false,
}: {
  id?: string
  label?: string
  disabled?: boolean
  withHandle?: boolean
  autoFocus?: boolean
}) {
  const group = useGroup(),
    index = useIndex(),
    styles = useComponentStyles('resizable'),
    theme = useTheme()
  const inactive = disabled || group.disabled
  const focus = useFocusable<BoxRenderable>({
    id,
    label,
    disabled: inactive,
    autoFocus,
  })
  const props = focus.getFocusProps(),
    box = useBoxSize(props.ref)
  useFocusRing(props.ref, focus.focused && !inactive, theme.ring)
  const drag = useRef<{
    coordinate: number
    value: number
    extent: number
  } | null>(null)
  const horizontal = group.orientation === 'horizontal'
  const coordinate = (event: MouseEvent) => (horizontal ? event.x : event.y)
  const move = (event: MouseEvent) => {
    if (inactive || !drag.current) return
    event.preventDefault()
    event.stopPropagation()
    group.resize(
      index,
      drag.current.value +
        ((coordinate(event) - drag.current.coordinate) / drag.current.extent) *
          100,
    )
  }
  const finish = (event: MouseEvent) => {
    if (event.button !== 0 || !drag.current) return
    move(event)
    drag.current = null
  }
  const key = (event: KeyEvent) => {
    if (
      inactive ||
      event.defaultPrevented ||
      event.ctrl ||
      event.meta ||
      event.option ||
      event.eventType === 'release'
    )
      return
    const backward = horizontal ? 'left' : 'up',
      forward = horizontal ? 'right' : 'down'
    if (![backward, forward, 'home', 'end'].includes(event.name)) return
    event.preventDefault()
    event.stopPropagation()
    group.resize(
      index,
      event.name === 'home'
        ? 0
        : event.name === 'end'
          ? 100
          : (group.layout[index] ?? 0) +
            (((event.name === backward ? -1 : 1) * (event.shift ? 10 : 1)) /
              group.extent()) *
              100,
    )
  }
  const length = Math.max(1, horizontal ? box.height : box.width)
  const line = Array.from({ length }, (_, i) =>
    withHandle && i === Math.floor(length / 2)
      ? horizontal
        ? icons.arrowsHorizontal
        : icons.arrowsVertical
      : horizontal
        ? '│'
        : '─',
  ).join(horizontal ? '\n' : '')
  return (
    <box
      {...props}
      onSizeChange={box.onSizeChange}
      renderBefore={box.renderBefore}
      width={horizontal ? resizableDefaults.handleWidth : '100%'}
      height={horizontal ? '100%' : resizableDefaults.handleHeight}
      flexShrink={0}
      opacity={inactive ? 0.45 : 1}
      onMouseDown={(event) => {
        props.onMouseDown(event)
        if (inactive || event.button !== 0) return
        event.preventDefault()
        event.stopPropagation()
        drag.current = {
          coordinate: coordinate(event),
          value: group.layout[index] ?? 0,
          extent: group.extent(),
        }
      }}
      onMouseDrag={move}
      onMouseUp={finish}
      onMouseDragEnd={finish}
      onKeyDown={key}
      {...styles('ResizableHandle', {
        width: horizontal ? resizableDefaults.handleWidth : '100%',
        height: horizontal ? '100%' : resizableDefaults.handleHeight,
      })}
    >
      <PartText
        source="resizable"
        part="ResizableHandle.text"
        fg={focus.focused ? theme.primary : theme.mutedForeground}
        wrapMode="none"
      >
        {line}
      </PartText>
    </box>
  )
}
