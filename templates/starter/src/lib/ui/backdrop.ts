import type { OptimizedBuffer } from '@opentui/core'

// Paint before the popup so only previously drawn layers are dimmed.
// Affect both foreground and background while preserving glyphs and alpha.
const black = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])
export function paintPopupBackdrop(buffer: OptimizedBuffer) {
  buffer.colorMatrixUniform(black, 0.28)
}
export function paintModalBackdrop(buffer: OptimizedBuffer) {
  buffer.colorMatrixUniform(black, 0.55)
}

/** The inspector stays readable while the preview still shows the real dimming. */
export function createRegionBackdrop(
  rect: { x: number; y: number; width: number; height: number },
  modal: boolean,
) {
  const mask = new Float32Array(Math.max(0, rect.width * rect.height * 3))
  let index = 0
  for (let y = rect.y; y < rect.y + rect.height; y++)
    for (let x = rect.x; x < rect.x + rect.width; x++) {
      mask[index++] = x
      mask[index++] = y
      mask[index++] = 1
    }
  return (buffer: OptimizedBuffer) =>
    buffer.colorMatrix(black, mask, modal ? 0.55 : 0.28)
}
