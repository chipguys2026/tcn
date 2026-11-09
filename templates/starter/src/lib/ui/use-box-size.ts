import type { BoxRenderable } from '@opentui/core'
import {
  type RefObject,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

/** Measure the real layout only when its cell dimensions change. */
export function useBoxSize(provided?: RefObject<BoxRenderable | null>) {
  const own = useRef<BoxRenderable>(null),
    ref = provided ?? own
  const [size, setSize] = useState({ width: 0, height: 0 }),
    last = useRef(size)
  const measure = useCallback(() => {
    const node = ref.current
    if (!node || node.isDestroyed) return
    if (
      last.current.width === node.width &&
      last.current.height === node.height
    )
      return
    last.current = { width: node.width, height: node.height }
    setSize(last.current)
  }, [ref])
  useLayoutEffect(measure)
  return { ref, ...size, onSizeChange: measure, renderBefore: measure }
}
