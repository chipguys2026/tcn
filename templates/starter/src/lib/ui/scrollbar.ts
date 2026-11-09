import {
  type OptimizedBuffer,
  RGBA,
  type ScrollBoxRenderable,
} from '@opentui/core'

/** Half-height paint; native layout, scrolling, and pointer targets stay intact. */
export function createHorizontalScrollbar(
  trackColor: string,
  thumbColor: string,
) {
  const track = RGBA.fromHex(trackColor)
  const thumb = RGBA.fromHex(thumbColor)
  return function paintScrollbar(
    this: ScrollBoxRenderable,
    buffer: OptimizedBuffer,
  ) {
    // OpenTUI exposes native thumb geometry in half-cell units. Read it rather
    // than duplicating its rounding and diverging from native drag hit testing.
    const bar = this._scrollState().bars[0]
    if (!bar.visible) return
    const start = Math.floor(bar.thumbStart / 2)
    const end = Math.ceil((bar.thumbStart + bar.thumbSize) / 2)
    for (let x = 0; x < bar.track.width; x++) {
      buffer.drawText(
        '▄',
        bar.track.x + x,
        bar.track.y,
        x >= start && x < end ? thumb : track,
        this.backgroundColor,
      )
    }
  }
}
