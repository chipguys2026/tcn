# Chart

[Source](../../src/components/ui/chart.tsx) · [Defaults](../../src/components/ui/chart.styles.ts) · [Cell renderer](../../src/lib/ui/chart-model.ts) · Gallery: `/gallery/chart`

```tsx
const config = { desktop: { label: 'Desktop' }, mobile: { label: 'Mobile' } }
<ChartContainer config={config} height={10}>
  <BarChart data={data} indexKey="month" />
  <ChartLegend />
  <ChartTooltip />
</ChartContainer>
```

Import parts from `@/components/ui/chart`. ChartContainer supplies a config keyed by numeric data keys, each with optional label/color. Default colors use theme.chart1…chart5. Config keys determine series unless the plot supplies `series: string[]`. Data rows map string keys to string/number/null/undefined; indexKey supplies category labels. Missing/nonfinite values are skipped. Negative values are supported; stacked bars accumulate positive/negative values separately.

Only **BarChart and LineChart** are included. BarChart layout=vertical/horizontal, stacked=false. LineChart dots=true uses native Unicode Braille strokes and optional points. Common props are data, indexKey, series, label='Chart', grid=true. Axes and category labels are drawn in terminal cells and clip to measured bounds. ChartContainer width=100% (number/auto/percentage), plot height=10 clamped by minHeight=4/maxHeight=30. Legend/tooltip rows are additional layout slots; resizing recomputes the real cell grid.

ChartLegend defaults to ChartLegendContent; ChartTooltip defaults to ChartTooltipContent. Children can replace either. Tooltip is an inline inspection row, avoiding another popup/focus scope. Focus the plot with Tab; arrows/Home/End change the inspected datum. Pointer motion also updates it. Config labels, colors and values are displayed in the legend/tooltip.

The composition follows shadcn chart wrappers, with a native TUI renderer instead of DOM/Recharts. This is not a Recharts API compatibility layer. No pie/area/radar charts, SVG, animation, browser tooltips or runtime Tweak JSON are included. Model generation is pure and separate from native focus/rendering.
