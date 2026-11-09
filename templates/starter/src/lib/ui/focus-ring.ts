import {
  type CliRenderer,
  type OptimizedBuffer,
  type Renderable,
  RGBA,
  ScrollBoxRenderable,
} from '@opentui/core'
import { useRenderer } from '@opentui/react'
import { type RefObject, useLayoutEffect } from 'react'

/** Visual paint only; owns no focus policy, layout space, or hit-test region. */
export function createFocusRing(color: string) {
  const borderColor = RGBA.fromHex(color)
  return function paintRing(this: Renderable, buffer: OptimizedBuffer) {
    buffer.drawBox({
      x: this.screenX - 1,
      y: this.screenY - 1,
      width: this.width + 2,
      height: this.height + 2,
      border: true,
      borderStyle: 'single',
      borderColor,
      backgroundColor: RGBA.fromHex('#00000000'),
      shouldFill: false,
    })
  }
}

type Ring = {
  target: RefObject<Renderable | null>
  paint: ReturnType<typeof createFocusRing>
}
type Layer = { rings: Set<Ring>; paint: (buffer: OptimizedBuffer) => void }
const layers = new WeakMap<CliRenderer, Layer>()

function paintTopRing(buffer: OptimizedBuffer, ring: Ring) {
  const node = ring.target.current
  if (
    !node ||
    node.isDestroyed ||
    !node.visible ||
    node.width <= 0 ||
    node.height <= 0
  )
    return
  let left = 0,
    top = 0,
    right = buffer.width,
    bottom = buffer.height
  let ancestor = node.parent
  while (ancestor) {
    if (ancestor.isDestroyed || !ancestor.visible) return
    const clip =
      ancestor instanceof ScrollBoxRenderable
        ? ancestor.viewport
        : ancestor.overflow === 'hidden'
          ? ancestor
          : null
    if (clip) {
      // Fully hidden controls have no ring; a visible control may paint one cell beyond its clip.
      if (
        node.screenX + node.width <= clip.screenX ||
        node.screenX >= clip.screenX + clip.width ||
        node.screenY + node.height <= clip.screenY ||
        node.screenY >= clip.screenY + clip.height
      )
        return
      left = Math.max(left, clip.screenX - 1)
      top = Math.max(top, clip.screenY - 1)
      right = Math.min(right, clip.screenX + clip.width + 1)
      bottom = Math.min(bottom, clip.screenY + clip.height + 1)
    }
    ancestor = ancestor.parent
  }
  if (right <= left || bottom <= top) return
  buffer.pushScissorRect(left, top, right - left, bottom - top)
  try {
    ring.paint.call(node, buffer)
  } finally {
    buffer.popScissorRect()
  }
}

/** Focus visualization is a final paint pass; it creates no hit target or focus policy. */
export function useFocusRing(
  target: RefObject<Renderable | null>,
  active: boolean,
  color: string,
) {
  const renderer = useRenderer()
  useLayoutEffect(() => {
    if (!active) return
    let layer = layers.get(renderer)
    if (!layer) {
      const rings = new Set<Ring>()
      layer = {
        rings,
        paint: (buffer) => {
          for (const ring of rings) paintTopRing(buffer, ring)
        },
      }
      layers.set(renderer, layer)
      renderer.addPostProcessFn(layer.paint)
    }
    const ring: Ring = { target, paint: createFocusRing(color) }
    layer.rings.add(ring)
    renderer.requestRender()
    return () => {
      layer.rings.delete(ring)
      if (!layer.rings.size) {
        renderer.removePostProcessFn(layer.paint)
        layers.delete(renderer)
      }
      renderer.requestRender()
    }
  }, [renderer, target, active, color])
}
