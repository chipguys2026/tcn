# Chart

Display numeric series with native Bar and Line charts, a legend and keyboard or pointer value inspection.

[Source](../../src/components/ui/chart.tsx) · [Defaults](../../src/lib/ui/styles.ts) · Gallery: `/gallery/chart`

## Usage

```tsx
import {
  BarChart,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
} from '@/components/ui/chart'

const data = [
  { month: 'Jan', desktop: 24, mobile: 18 },
  { month: 'Feb', desktop: 32, mobile: 26 },
]

const config = {
  desktop: { label: 'Desktop' },
  mobile: { label: 'Mobile' },
}

export function ActivityChart() {
  return (
    <ChartContainer config={config} height={10}>
      <BarChart data={data} indexKey="month" />
      <ChartLegend />
      <ChartTooltip />
    </ChartContainer>
  )
}
```

## API

| Component | Key props |
| --- | --- |
| `ChartContainer` | Required `config`; `width="100%"`, `height=10`, `minHeight=4`, `maxHeight=30`. |
| `BarChart` | `data`, `indexKey`, optional `series`; `layout="vertical"` or `"horizontal"`, `stacked=false`. |
| `LineChart` | `data`, `indexKey`, optional `series`; `dots=true`. |
| Both plots | `label="Chart"`, `grid=true`. |
| `ChartLegend` | Default legend; custom children can replace its content. |
| `ChartTooltip` | Inline inspection row; custom children can replace its content. |

`config` maps numeric data keys to optional labels and colors. Unspecified colors use `chart1` through `chart5` from the current theme. Config keys select the plotted series unless you supply `series`.

Each data row maps keys to strings, numbers, null or undefined. `indexKey` selects category labels. Missing and nonfinite numeric values are skipped. Negative values are supported; stacked bars accumulate positive and negative values separately.

## Interaction and sizing

Tab focuses the plot. Arrow keys and Home/End change the inspected datum; pointer movement can inspect it too. The legend and tooltip show configured labels, colors and values.

The plot uses terminal cells and recomputes its grid on resize. Container height is clamped to its minimum/maximum; legend and tooltip occupy additional rows. Line charts use Unicode Braille strokes.

Use BarChart or LineChart for the plot and compose ChartLegend and ChartTooltip alongside it.
