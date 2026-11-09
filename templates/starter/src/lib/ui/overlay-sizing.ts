import { type Renderable, TextRenderable, Yoga } from '@opentui/core'
import { stringWidth } from 'bun'

export type PopupSizing = {
  width?: number | 'auto'
  height?: number | 'auto'
  minWidth?: number | 'trigger'
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
}

function padding(node: Renderable, edge: Yoga.Edge, axis: Yoga.Edge) {
  for (const key of [edge, axis, Yoga.Edge.All]) {
    const value = node.getPadding(key)
    if (value.unit === Yoga.Unit.Point && Number.isFinite(value.value))
      return value.value
  }
  return 0
}

/** Read intrinsic text/layout widths from the real tree; no duplicate preview tree. */
export function intrinsicWidth(node: Renderable): number {
  if (!node.visible || node.isDestroyed) return 0
  const explicit = node.getWidth()
  if (explicit.unit === Yoga.Unit.Point && Number.isFinite(explicit.value))
    return explicit.value
  if (node instanceof TextRenderable)
    return Math.max(
      0,
      ...node.plainText.split('\n').map((line) => stringWidth(line)),
    )
  const children = node
    .getChildren()
    .filter(
      (child) =>
        child.visible && child.getPositionType() !== Yoga.PositionType.Absolute,
    )
  const row = [Yoga.FlexDirection.Row, Yoga.FlexDirection.RowReverse].includes(
    node.getFlexDirection(),
  )
  const widths = children.map((child) => {
    const left = child.getMargin(Yoga.Edge.Left),
      right = child.getMargin(Yoga.Edge.Right)
    return (
      intrinsicWidth(child) +
      (left.unit === Yoga.Unit.Point ? left.value : 0) +
      (right.unit === Yoga.Unit.Point ? right.value : 0)
    )
  })
  let gap = node.getGap(row ? Yoga.Gutter.Column : Yoga.Gutter.Row)
  if (gap.unit !== Yoga.Unit.Point) gap = node.getGap(Yoga.Gutter.All)
  const content = row
    ? widths.reduce((total, width) => total + width, 0) +
      Math.max(0, widths.length - 1) *
        (gap.unit === Yoga.Unit.Point ? gap.value : 0)
    : Math.max(0, ...widths)
  return (
    content +
    padding(node, Yoga.Edge.Left, Yoga.Edge.Horizontal) +
    padding(node, Yoga.Edge.Right, Yoga.Edge.Horizontal)
  )
}

export function boundedSize(
  content: number,
  minimum: number,
  maximum: number,
  available: number,
) {
  const ceiling = Math.max(0, Math.min(available, maximum))
  return Math.max(
    0,
    Math.floor(Math.min(ceiling, Math.max(1, minimum, content))),
  )
}
