export type PanelLimit = { min: number; max: number }
const clamp = (number: number, min: number, max: number) =>
  Math.max(min, Math.min(max, number))
export function feasiblePanelLimits(limits: PanelLimit[]) {
  const minimums = limits.map((limit) =>
    clamp(Number.isFinite(limit.min) ? limit.min : 0, 0, 100),
  )
  const minTotal = minimums.reduce((sum, value) => sum + value, 0)
  if (minTotal > 100)
    for (let i = 0; i < minimums.length; i++)
      minimums[i] = ((minimums[i] ?? 0) / minTotal) * 100
  const maximums = limits.map((limit, index) =>
    clamp(
      Number.isFinite(limit.max) ? limit.max : 100,
      minimums[index] ?? 0,
      100,
    ),
  )
  const maxTotal = maximums.reduce((sum, value) => sum + value, 0)
  if (maxTotal < 100)
    for (let i = 0; i < maximums.length; i++)
      maximums[i] = (maximums[i] ?? 0) + (100 - maxTotal) / maximums.length
  return minimums.map((min, index) => ({ min, max: maximums[index] ?? 100 }))
}
/** Project percentage weights onto feasible panel bounds without losing the total. */
export function fitPanelLayout(weights: number[], limits: PanelLimit[]) {
  if (!limits.length) return []
  const feasible = feasiblePanelLimits(limits),
    minimums = feasible.map((limit) => limit.min),
    maximums = feasible.map((limit) => limit.max)
  const raw = limits.map((_, index) =>
    Number.isFinite(weights[index]) ? Math.max(0, weights[index] ?? 0) : 1,
  )
  const total = raw.reduce((sum, value) => sum + value, 0)
  const result = raw.map((value, index) =>
    clamp(
      total ? (value / total) * 100 : 100 / raw.length,
      minimums[index] ?? 0,
      maximums[index] ?? 100,
    ),
  )
  for (let pass = 0; pass <= limits.length; pass++) {
    const delta = 100 - result.reduce((sum, value) => sum + value, 0)
    if (Math.abs(delta) < 0.000001) break
    const indices = result.flatMap((value, index) =>
      delta > 0
        ? value < (maximums[index] ?? 100) - 0.000001
          ? [index]
          : []
        : value > (minimums[index] ?? 0) + 0.000001
          ? [index]
          : [],
    )
    if (!indices.length) break
    for (const index of indices)
      result[index] = clamp(
        (result[index] ?? 0) + delta / indices.length,
        minimums[index] ?? 0,
        maximums[index] ?? 100,
      )
  }
  return result
}
export function resizePanelPair(
  layout: number[],
  limits: PanelLimit[],
  index: number,
  next: number,
) {
  if (index < 0 || index >= layout.length - 1 || !Number.isFinite(next))
    return layout
  limits = feasiblePanelLimits(limits)
  const sum = (layout[index] ?? 0) + (layout[index + 1] ?? 0)
  const low = Math.max(
      limits[index]?.min ?? 0,
      sum - (limits[index + 1]?.max ?? 100),
    ),
    high = Math.min(
      limits[index]?.max ?? 100,
      sum - (limits[index + 1]?.min ?? 0),
    )
  if (low > high) return layout
  const left = clamp(next, low, high),
    result = [...layout]
  result[index] = left
  result[index + 1] = sum - left
  return result
}
