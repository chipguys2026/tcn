// biome-ignore-all lint/a11y/noStaticElementInteractions: Native chart focus and pointer handling.
// biome-ignore-all lint/suspicious/noArrayIndexKey: Keys are fixed grid coordinates, not data item positions.
import type { BoxRenderable } from '@opentui/core'
import {
  type PropsWithChildren,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import {
  type ChartDatum,
  chartHitIndex,
  chartModel,
  chartRuns,
} from '@/lib/ui/chart-model'
import { createStrictContext } from '@/lib/ui/create-context'
import { useFocusable } from '@/lib/ui/focus/use-focusable'
import { useFocusRing } from '@/lib/ui/focus-ring'
import { PartBox, PartText } from '@/lib/ui/parts'
import { useComponentStyles } from '@/lib/ui/style-review'
import { chartDefaults as d } from '@/lib/ui/styles'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { useBoxSize } from '@/lib/ui/use-box-size'
export type ChartConfig = Record<string, { label?: string; color?: string }>
type Data = { data: ChartDatum[]; keys: string[]; indexKey: string }
const [Context, useChart] = createStrictContext<{
  config: ChartConfig
  height: number
  active: number
  setActive: (i: number) => void
  dataset: Data
  setDataset: (v: Data) => void
}>('ChartContainer')
export function ChartContainer({
  children,
  config,
  height = d.height,
  minHeight = d.minHeight,
  maxHeight = d.maxHeight,
  width = '100%',
}: PropsWithChildren<{
  config: ChartConfig
  height?: number
  minHeight?: number
  maxHeight?: number
  width?: number | 'auto' | `${number}%`
}>) {
  const [active, setActive] = useState(0),
    [dataset, setDataset] = useState<Data>({ data: [], keys: [], indexKey: '' })
  return (
    <Context
      value={{
        config,
        height: Math.max(minHeight, Math.min(maxHeight, height)),
        active,
        setActive,
        dataset,
        setDataset,
      }}
    >
      <PartBox source="chart" part="ChartContainer" width={width} gap={d.gap}>
        {children}
      </PartBox>
    </Context>
  )
}
export type ChartProps = {
  data: ChartDatum[]
  indexKey: string
  series?: string[]
  label?: string
  grid?: boolean
}
function Plot({
  data,
  indexKey,
  series,
  label = 'Chart',
  grid = true,
  kind,
  horizontal = false,
  stacked = false,
  dots = true,
}: ChartProps & {
  kind: 'bar' | 'line'
  horizontal?: boolean
  stacked?: boolean
  dots?: boolean
}) {
  const c = useChart(),
    theme = useTheme(),
    styles = useComponentStyles('chart'),
    focus = useFocusable<BoxRenderable>({ label }),
    props = focus.getFocusProps(),
    size = useBoxSize(props.ref),
    keys = series ?? Object.keys(c.config),
    signature = keys.join('\u0000')
  useFocusRing(props.ref, focus.focused, theme.ring)
  useLayoutEffect(() => {
    c.setDataset({
      data,
      indexKey,
      keys: signature.split('\u0000').filter(Boolean),
    })
  }, [data, indexKey, signature, c.setDataset])
  const cells = useMemo(
    () =>
      chartModel({
        data,
        indexKey,
        keys: signature.split('\u0000').filter(Boolean),
        width: size.width,
        height: size.height,
        kind,
        horizontal,
        stacked,
        grid,
        dots,
        active: c.active,
      }),
    [
      data,
      indexKey,
      signature,
      size.width,
      size.height,
      kind,
      horizontal,
      stacked,
      grid,
      dots,
      c.active,
    ],
  )
  const palette = [
      theme.chart1,
      theme.chart2,
      theme.chart3,
      theme.chart4,
      theme.chart5,
    ],
    color = (key?: string) =>
      key
        ? (c.config[key]?.color ??
          palette[Math.max(0, keys.indexOf(key)) % palette.length])
        : theme.mutedForeground
  return (
    <box
      {...props}
      width="100%"
      height={c.height}
      minWidth={1}
      overflow="hidden"
      onSizeChange={size.onSizeChange}
      renderBefore={size.renderBefore}
      {...styles(kind === 'bar' ? 'BarChart' : 'LineChart', {
        height: c.height,
      })}
      onKeyDown={(key) => {
        if (
          key.ctrl ||
          key.meta ||
          key.option ||
          !['left', 'right', 'up', 'down', 'home', 'end'].includes(key.name)
        )
          return
        key.preventDefault()
        key.stopPropagation()
        c.setActive(
          key.name === 'home'
            ? 0
            : key.name === 'end'
              ? Math.max(0, data.length - 1)
              : Math.max(
                  0,
                  Math.min(
                    data.length - 1,
                    c.active + (['right', 'down'].includes(key.name) ? 1 : -1),
                  ),
                ),
        )
      }}
      onMouseMove={(e) => {
        const n = props.ref.current
        if (!n || !data.length) return
        c.setActive(
          chartHitIndex(
            {
              data,
              indexKey,
              keys,
              width: n.width,
              height: n.height,
              kind,
              horizontal,
              stacked,
            },
            e.x - n.screenX,
            e.y - n.screenY,
          ),
        )
      }}
    >
      <box width="100%" flexDirection="column">
        {cells.map((row, y) => (
          <text key={y} height={1} wrapMode="none" selectable={false}>
            {chartRuns(row).map((cell) => (
              <span
                key={cell.start}
                fg={color(cell.series)}
                bg={cell.active ? theme.accent : undefined}
              >
                {cell.char}
              </span>
            ))}
          </text>
        ))}
      </box>
    </box>
  )
}
export function BarChart(
  props: ChartProps & { layout?: 'horizontal' | 'vertical'; stacked?: boolean },
) {
  return (
    <Plot {...props} kind="bar" horizontal={props.layout === 'horizontal'} />
  )
}
export function LineChart(props: ChartProps & { dots?: boolean }) {
  return <Plot {...props} kind="line" />
}
export function ChartLegend({ children }: PropsWithChildren) {
  return (
    <PartBox
      source="chart"
      part="ChartLegend"
      flexDirection="row"
      flexWrap="wrap"
      gap={d.gap}
    >
      {children ?? <ChartLegendContent />}
    </PartBox>
  )
}
export function ChartLegendContent() {
  const c = useChart(),
    theme = useTheme(),
    palette = [
      theme.chart1,
      theme.chart2,
      theme.chart3,
      theme.chart4,
      theme.chart5,
    ]
  return (
    <PartBox
      source="chart"
      part="ChartLegendContent"
      flexDirection="row"
      flexWrap="wrap"
      gap={d.gap}
    >
      {Object.entries(c.config).map(([key, s], i) => (
        <text
          key={key}
          fg={s.color ?? palette[i % palette.length]}
        >{`■ ${s.label ?? key}`}</text>
      ))}
    </PartBox>
  )
}
export function ChartTooltip({ children }: PropsWithChildren) {
  return (
    <PartBox source="chart" part="ChartTooltip" width="100%">
      {children ?? <ChartTooltipContent />}
    </PartBox>
  )
}
export function ChartTooltipContent() {
  const c = useChart(),
    row = c.dataset.data[Math.min(c.active, c.dataset.data.length - 1)]
  return (
    <PartBox
      source="chart"
      part="ChartTooltipContent"
      flexDirection="row"
      flexWrap="wrap"
      gap={d.gap}
    >
      <PartText source="chart" part="ChartTooltipContent.label" bold>
        {row ? String(row[c.dataset.indexKey] ?? '') : 'No data'}
      </PartText>
      {c.dataset.keys.map((key) => (
        <PartText
          key={key}
          source="chart"
          part="ChartTooltipContent.value"
          tone="mutedForeground"
        >{`${c.config[key]?.label ?? key}: ${row?.[key] ?? '—'}`}</PartText>
      ))}
    </PartBox>
  )
}
