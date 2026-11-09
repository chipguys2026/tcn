export type ChartDatum = Record<string, string | number | null | undefined>
export type ChartCell = { char: string; series?: string; active?: boolean }
export type ChartModelOptions = {
  data: ChartDatum[]
  keys: string[]
  indexKey: string
  width: number
  height: number
  kind: 'bar' | 'line'
  horizontal?: boolean
  stacked?: boolean
  grid?: boolean
  dots?: boolean
  active?: number
}
export function chartDomain(
  data: ChartDatum[],
  keys: string[],
  stacked = false,
): [number, number] {
  let min = 0,
    max = 0
  for (const row of data) {
    let positive = 0,
      negative = 0
    for (const key of keys) {
      const n = row[key]
      if (typeof n !== 'number' || !Number.isFinite(n)) continue
      if (stacked) {
        if (n >= 0) positive += n
        else negative += n
      } else {
        min = Math.min(min, n)
        max = Math.max(max, n)
      }
    }
    if (stacked) {
      min = Math.min(min, negative)
      max = Math.max(max, positive)
    }
  }
  return min === max ? [min, max + 1] : [min, max]
}
function chartBounds(o: ChartModelOptions) {
  const w = Math.max(1, Math.floor(o.width)),
    h = Math.max(1, Math.floor(o.height)),
    [min, max] = chartDomain(o.data, o.keys, o.stacked),
    tick = (n: number) => Number(n.toFixed(1)).toString()
  const left = o.horizontal
    ? Math.min(10, Math.max(1, Math.floor(w / 3)))
    : Math.min(
        Math.max(tick(min).length, tick(max).length) + 1,
        Math.max(1, w - 3),
      )
  return {
    w,
    h,
    min,
    max,
    tick,
    left,
    pw: Math.max(1, w - left),
    ph: Math.max(1, h - 1),
  }
}
export function chartHitIndex(o: ChartModelOptions, x: number, y: number) {
  const b = chartBounds(o),
    p = o.horizontal
      ? y / Math.max(1, b.ph)
      : (x - b.left) / Math.max(1, b.pw - (o.kind === 'line' ? 1 : 0))
  return Math.max(
    0,
    Math.min(
      o.data.length - 1,
      o.kind === 'line'
        ? Math.round(p * Math.max(0, o.data.length - 1))
        : Math.floor(p * o.data.length),
    ),
  )
}
/** Coalesce adjacent cells so each row creates spans per color run, not per cell. */
export function chartRuns(row: ChartCell[]) {
  const runs: (ChartCell & { start: number })[] = []
  row.forEach((cell, i) => {
    const last = runs.at(-1)
    if (last && last.series === cell.series && last.active === cell.active)
      last.char += cell.char
    else runs.push({ ...cell, start: i })
  })
  return runs
}
/** Pure cell renderer. Axes, bars and line rasterization share one bounded plot. */
export function chartModel(o: ChartModelOptions): ChartCell[][] {
  const { w, h, min, max, tick, left, pw, ph } = chartBounds(o),
    cells = Array.from({ length: h }, () =>
      Array.from({ length: w }, () => ({ char: ' ' }) as ChartCell),
    )
  const put = (
    x: number,
    y: number,
    char: string,
    series?: string,
    active?: boolean,
  ) => {
    const row = cells[y]
    if (x >= 0 && x < w && row) row[x] = { char, series, active }
  }
  const y = (n: number) => Math.round(((max - n) / (max - min)) * (ph - 1)),
    x = (n: number) => left + Math.round(((n - min) / (max - min)) * (pw - 1))
  if (!o.horizontal)
    for (const value of [max, (max + min) / 2, min]) {
      const row = y(value),
        label = tick(value)
          .slice(0, left - 1)
          .padStart(left - 1)
      ;[...label].forEach((c, i) => {
        put(i, row, c)
      })
      put(left - 1, row, '│')
      if (o.grid) for (let i = left; i < w; i++) put(i, row, '┄')
    }
  else
    for (const n of [min, (min + max) / 2, max]) {
      const xx = x(n),
        label = tick(n),
        start = Math.max(left, Math.min(w - label.length, xx))
      ;[...label].forEach((c, j) => {
        put(start + j, h - 1, c)
      })
      if (o.grid) for (let yy = 0; yy < ph; yy++) put(xx, yy, '┆')
    }
  if (o.kind === 'bar') {
    o.data.forEach((row, i) => {
      const slot = (o.horizontal ? ph : pw) / Math.max(1, o.data.length),
        start = (o.horizontal ? 0 : left) + Math.floor(i * slot),
        size = Math.max(1, Math.floor(slot) - 1)
      if (o.horizontal) {
        const label = String(row[o.indexKey] ?? i)
          .slice(0, Math.max(0, left - 1))
          .padEnd(left - 1)
        ;[...label].forEach((c, j) => {
          put(j, Math.floor(i * slot), c)
        })
      }
      let positive = 0,
        negative = 0
      o.keys.forEach((key, k) => {
        const n = row[key]
        if (typeof n !== 'number' || !Number.isFinite(n) || n === 0) return
        const from = o.stacked ? (n >= 0 ? positive : negative) : 0,
          to = from + n
        if (n >= 0) positive = to
        else negative = to
        const lane = o.stacked
            ? 0
            : Math.floor((k * size) / Math.max(1, o.keys.length)),
          thickness = o.stacked
            ? size
            : Math.max(1, Math.floor(size / Math.max(1, o.keys.length)))
        if (o.horizontal) {
          const a = x(from),
            b = x(to)
          for (
            let yy = start + lane;
            yy < Math.min(ph, start + lane + thickness);
            yy++
          )
            for (let xx = Math.min(a, b); xx <= Math.max(a, b); xx++)
              put(xx, yy, '█', key, o.active === i)
        } else {
          const a = y(from),
            b = y(to)
          for (
            let xx = start + lane;
            xx < Math.min(w, start + lane + thickness);
            xx++
          )
            for (let yy = Math.min(a, b); yy <= Math.max(a, b); yy++)
              if (n !== 0) put(xx, yy, '█', key, o.active === i)
        }
      })
      if (!o.horizontal) {
        const label = String(row[o.indexKey] ?? i).slice(
          0,
          Math.max(1, Math.floor(slot) - 1),
        )
        ;[...label].forEach((c, j) => {
          put(start + j, h - 1, c)
        })
      }
    })
  } else {
    const pixels = new Map<string, { bits: number; series: string }>(),
      bits = [
        [1, 8],
        [2, 16],
        [4, 32],
        [64, 128],
      ]
    const pixel = (xx: number, yy: number, key: string) => {
      const cx = left + Math.floor(xx / 2),
        cy = Math.floor(yy / 4)
      if (cx >= w || cy >= ph) return
      const id = `${cx},${cy}`,
        old = pixels.get(id)
      pixels.set(id, {
        bits: (old?.bits ?? 0) | (bits[yy % 4]?.[xx % 2] ?? 0),
        series: key,
      })
    }
    o.keys.forEach((key) => {
      let prev: { x: number; y: number } | undefined
      o.data.forEach((row, i) => {
        const n = row[key]
        if (typeof n !== 'number' || !Number.isFinite(n)) {
          prev = undefined
          return
        }
        const p = {
          x: Math.round((i / Math.max(1, o.data.length - 1)) * (pw * 2 - 1)),
          y: Math.round(((max - n) / (max - min)) * (ph * 4 - 1)),
        }
        if (prev) {
          const steps = Math.max(
            Math.abs(p.x - prev.x),
            Math.abs(p.y - prev.y),
            1,
          )
          for (let j = 0; j <= steps; j++)
            pixel(
              Math.round(prev.x + ((p.x - prev.x) * j) / steps),
              Math.round(prev.y + ((p.y - prev.y) * j) / steps),
              key,
            )
        } else pixel(p.x, p.y, key)
        prev = p
      })
    })
    for (const [id, p] of pixels) {
      const [xx, yy] = id.split(',').map(Number)
      if (xx !== undefined && yy !== undefined)
        put(xx, yy, String.fromCharCode(0x2800 + p.bits), p.series)
    }
    o.data.forEach((row, i) => {
      const xx =
        left + Math.round((i / Math.max(1, o.data.length - 1)) * (pw - 1))
      if (o.dots)
        for (const key of o.keys) {
          const n = row[key]
          if (typeof n === 'number' && Number.isFinite(n))
            put(xx, y(n), '●', key, o.active === i)
        }
      const label = String(row[o.indexKey] ?? i).slice(
        0,
        Math.max(1, Math.floor(pw / Math.max(1, o.data.length)) - 1),
      )
      const labelStart = Math.max(left, Math.min(w - label.length, xx))
      ;[...label].forEach((c, j) => {
        put(labelStart + j, h - 1, c)
      })
    })
  }
  return cells
}
