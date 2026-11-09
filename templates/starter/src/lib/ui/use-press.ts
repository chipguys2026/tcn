import {
  type KeyEvent,
  MouseButton,
  type MouseEvent,
  type Renderable,
} from '@opentui/core'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'

type PressOptions = {
  disabled?: boolean
  onPress?: () => void
  activationKeys?: readonly string[]
}
const defaultKeys = ['return', 'space'] as const

/** Activation feedback only; focus is handled separately by useFocusable. */
export function usePress<T extends Renderable>({
  disabled = false,
  onPress,
  activationKeys = defaultKeys,
}: PressOptions) {
  const armed = useRef(false)
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const cancelPress = useCallback(() => {
    armed.current = false
    setPressed(false)
  }, [])
  useLayoutEffect(() => {
    if (disabled) {
      cancelPress()
      setHovered(false)
    }
  }, [disabled, cancelPress])

  function contains(node: T, event: MouseEvent) {
    return (
      event.x >= node.screenX &&
      event.x < node.screenX + node.width &&
      event.y >= node.screenY &&
      event.y < node.screenY + node.height
    )
  }
  const handlers = {
    onKeyDown(key: KeyEvent) {
      if (
        disabled ||
        key.defaultPrevented ||
        key.repeated ||
        key.eventType === 'release' ||
        key.ctrl ||
        key.meta ||
        key.option ||
        key.shift ||
        !activationKeys.includes(key.name)
      )
        return
      key.preventDefault()
      key.stopPropagation()
      onPress?.()
    },
    onMouseDown(this: T, event: MouseEvent) {
      if (
        disabled ||
        event.button !== MouseButton.LEFT ||
        !contains(this, event)
      )
        return
      event.preventDefault()
      event.stopPropagation()
      armed.current = true
      setPressed(true)
    },
    onMouseUp(this: T, event: MouseEvent) {
      if (event.button !== MouseButton.LEFT) return
      const activate =
        armed.current && !disabled && contains(this, event) && !event.isDragging
      cancelPress()
      if (activate) {
        event.preventDefault()
        event.stopPropagation()
        onPress?.()
      }
    },
    onMouseOver() {
      if (!disabled) setHovered(true)
    },
    onMouseOut() {
      setHovered(false)
      cancelPress()
    },
  }
  return { hovered, pressed, cancelPress, handlers }
}
