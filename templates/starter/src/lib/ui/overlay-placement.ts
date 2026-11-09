export type Side = 'top' | 'bottom' | 'left' | 'right'
type Rect = { x: number; y: number; width: number; height: number }
function avoidAnchorRect(
  viewport: { width: number; height: number },
  width: number,
  height: number,
  anchor: Rect,
  side: Side,
): Rect {
  const clamp = (value: number, maximum: number) =>
    Math.max(0, Math.min(value, maximum))
  const top = clamp(anchor.y - 1, viewport.height)
  const bottom = clamp(anchor.y + anchor.height + 1, viewport.height)
  const left = clamp(anchor.x - 1, viewport.width)
  const right = clamp(anchor.x + anchor.width + 1, viewport.width)
  const regions: Record<Side, Rect> = {
    top: { x: 0, y: 0, width: viewport.width, height: top },
    bottom: {
      x: 0,
      y: bottom,
      width: viewport.width,
      height: viewport.height - bottom,
    },
    left: { x: 0, y: 0, width: left, height: viewport.height },
    right: {
      x: right,
      y: 0,
      width: viewport.width - right,
      height: viewport.height,
    },
  }
  const opposite: Record<Side, Side> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  }
  const order = [
    side,
    opposite[side],
    ...(['top', 'bottom', 'left', 'right'] as const).filter(
      (value) => value !== side && value !== opposite[side],
    ),
  ]
  const fits = order.find(
    (value) => regions[value].width >= width && regions[value].height >= height,
  )
  const area = (value: Side) =>
    Math.min(width, regions[value].width) *
    Math.min(height, regions[value].height)
  const chosen =
    fits ??
    order.reduce((best, value) => (area(value) > area(best) ? value : best))
  const region = regions[chosen]
  const w = Math.min(width, region.width),
    h = Math.min(height, region.height)
  // With no free region, omit the visual rather than covering its hover target.
  if (!w || !h) return { x: 0, y: 0, width: 0, height: 0 }
  return {
    x:
      chosen === 'left'
        ? region.x + region.width - w
        : chosen === 'right'
          ? region.x
          : region.x + clamp(anchor.x - region.x, region.width - w),
    y:
      chosen === 'top'
        ? region.y + region.height - h
        : chosen === 'bottom'
          ? region.y
          : region.y + clamp(anchor.y - region.y, region.height - h),
    width: w,
    height: h,
  }
}
export function overlayRect(
  viewport: { width: number; height: number },
  width: number,
  height: number,
  anchor?: Rect,
  side: Side = 'bottom',
  sheet = false,
  avoidAnchor = false,
): Rect {
  const w = Math.max(1, Math.min(viewport.width, Math.floor(width))),
    h = Math.max(1, Math.min(viewport.height, Math.floor(height)))
  if (avoidAnchor && anchor && !sheet)
    return avoidAnchorRect(viewport, w, h, anchor, side)
  let x = Math.floor((viewport.width - w) / 2),
    y = Math.floor((viewport.height - h) / 2)
  if (sheet) {
    x = side === 'left' ? 0 : side === 'right' ? viewport.width - w : 0
    y = side === 'top' ? 0 : side === 'bottom' ? viewport.height - h : 0
  } else if (anchor) {
    x = anchor.x
    y = anchor.y + anchor.height + 1
    if (
      side === 'top' ||
      (side === 'bottom' && y + h > viewport.height && anchor.y >= h + 1)
    )
      y = anchor.y - h - 1
    if (side === 'left' || side === 'right') {
      y = anchor.y
      x = side === 'left' ? anchor.x - w - 1 : anchor.x + anchor.width + 1
      if (side === 'right' && x + w > viewport.width) x = anchor.x - w - 1
    }
  }
  return {
    x: Math.max(0, Math.min(x, viewport.width - w)),
    y: Math.max(0, Math.min(y, viewport.height - h)),
    width: w,
    height: h,
  }
}
