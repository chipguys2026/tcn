// biome-ignore-all lint/a11y/noStaticElementInteractions: Native TUI surface/backdrop hit testing.
import type {
  BoxRenderable,
  CliRenderer,
  MouseEvent,
  ScrollBoxRenderable,
} from '@opentui/core'
import {
  createPortal,
  flushSync,
  useKeyboard,
  useRenderer,
  useTerminalDimensions,
} from '@opentui/react'
import {
  type PropsWithChildren,
  type ReactNode,
  type RefObject,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  createRegionBackdrop,
  paintModalBackdrop,
  paintPopupBackdrop,
} from './backdrop'
import { FocusScope } from './focus/focus-scope'
import { overlayRect, type Side } from './overlay-placement'
import { boundedSize, intrinsicWidth, type PopupSizing } from './overlay-sizing'
import type { PressableHandle } from './pressable'
import { useComponentStyles, useStyleReview } from './style-review'
import { useTheme } from './theme/use-theme'

type Stack = { ids: symbol[]; next: number }
const stacks = new WeakMap<CliRenderer, Stack>()
function stackFor(renderer: CliRenderer) {
  let stack = stacks.get(renderer)
  if (!stack) {
    stack = { ids: [], next: 0 }
    stacks.set(renderer, stack)
  }
  return stack
}
export type OverlayProps = PropsWithChildren<
  PopupSizing & {
    onClose: () => void
    anchor?: RefObject<PressableHandle | null>
    anchorPoint?: { x: number; y: number }
    corner?: ReactNode
    modal?: boolean
    outsideDismiss?: boolean
    interactive?: boolean
    avoidAnchor?: boolean
    side?: Side
    sheet?: boolean
    paddingX?: number
    paddingY?: number
    gap?: number
    styleSource?: string
    stylePart?: string
    restoreFocus?: boolean
    onOutsidePointer?: (event: MouseEvent) => boolean
    onOutsidePointerMove?: (event: MouseEvent) => void
    onTabExit?: (direction: 1 | -1) => void
  }
>

export function Overlay({
  children,
  onClose,
  anchor,
  anchorPoint,
  width = 40,
  height = 12,
  minWidth = 1,
  maxWidth,
  minHeight = 1,
  maxHeight,
  paddingX = 2,
  paddingY = 1,
  gap = 1,
  corner,
  modal = false,
  outsideDismiss = true,
  interactive = true,
  avoidAnchor = !interactive,
  side = 'bottom',
  sheet = false,
  styleSource = 'overlay',
  stylePart = 'Content',
  restoreFocus = true,
  onOutsidePointer,
  onOutsidePointerMove,
  onTabExit,
}: OverlayProps) {
  const componentStyle = useComponentStyles(styleSource)
  const review = useStyleReview()
  const renderer = useRenderer(),
    terminal = useTerminalDimensions(),
    theme = useTheme(),
    stack = stackFor(renderer)
  const bounds = review?.viewport?.current
  const originX = bounds?.screenX ?? 0,
    originY = bounds?.screenY ?? 0
  const viewport = {
    width: bounds?.width || terminal.width,
    height: bounds?.height || terminal.height,
  }
  const backdrop = useMemo(
    () =>
      bounds
        ? createRegionBackdrop(
            {
              x: originX,
              y: originY,
              width: viewport.width,
              height: viewport.height,
            },
            modal,
          )
        : modal
          ? paintModalBackdrop
          : paintPopupBackdrop,
    [bounds, originX, originY, viewport.width, viewport.height, modal],
  )
  const token = useRef(Symbol('overlay')),
    surface = useRef<BoxRenderable>(null),
    content = useRef<BoxRenderable>(null)
  const scrollBody = useRef<ScrollBoxRenderable>(null)
  const previousViewport = useRef({ width: 0, height: 0 })
  const [layer, setLayer] = useState(0)
  const [measured, setMeasured] = useState({
    width: 0,
    height: 0,
    ready: false,
    x: 0,
    y: 0,
    panelWidth: 0,
    panelHeight: 0,
  })
  const measurement = useRef(measured)
  const presented = useRef(false)
  const node = anchorPoint
    ? { screenX: anchorPoint.x, screenY: anchorPoint.y, width: 0, height: 0 }
    : anchor?.current?.getNode()
  const baseWidth =
    sheet && ['top', 'bottom'].includes(side) ? viewport.width : width
  const baseHeight =
    sheet && ['left', 'right'].includes(side) ? viewport.height : height
  const backgroundColor =
    theme.popover === theme.background ? theme.secondary : theme.popover
  const panelStyle = componentStyle(stylePart, {
    width: baseWidth,
    height: baseHeight,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    paddingX,
    paddingY,
    gap,
    backgroundColor,
  })
  const value = (
    candidate: string | number | undefined,
    fallback: number,
    available: number,
  ) =>
    typeof candidate === 'number'
      ? candidate
      : candidate?.endsWith('%')
        ? (available * Number.parseFloat(candidate)) / 100
        : fallback
  const padLeft = Number(
    panelStyle.paddingLeft ?? panelStyle.paddingX ?? paddingX,
  )
  const padRight = Number(
    panelStyle.paddingRight ?? panelStyle.paddingX ?? paddingX,
  )
  const padTop = Number(
    panelStyle.paddingTop ?? panelStyle.paddingY ?? paddingY,
  )
  const padBottom = Number(
    panelStyle.paddingBottom ?? panelStyle.paddingY ?? paddingY,
  )
  const capWidth = value(
    panelStyle.maxWidth,
    maxWidth ?? viewport.width,
    viewport.width,
  )
  const capHeight = value(
    panelStyle.maxHeight,
    maxHeight ?? viewport.height,
    viewport.height,
  )
  const minimumWidth =
    (panelStyle.minWidth ?? minWidth) === 'trigger'
      ? (node?.width ?? 1)
      : value(
          panelStyle.minWidth,
          typeof minWidth === 'number' ? minWidth : 1,
          viewport.width,
        )
  const minimumHeight = value(panelStyle.minHeight, minHeight, viewport.height)
  const requestedWidth = panelStyle.width ?? baseWidth,
    requestedHeight = panelStyle.height ?? baseHeight
  const autoWidth = requestedWidth === 'auto',
    autoHeight = requestedHeight === 'auto'
  const naturalHeight = measured.height + padTop + padBottom
  const scrollbarWidth =
    interactive &&
    measured.height > 0 &&
    naturalHeight > Math.min(capHeight, viewport.height)
      ? 1
      : 0
  const desiredWidth = autoWidth
    ? measured.ready
      ? measured.width + padLeft + padRight + scrollbarWidth
      : capWidth
    : value(requestedWidth, 40, viewport.width)
  const desiredHeight = autoHeight
    ? (measured.ready ? Math.max(1, measured.height) : interactive ? 10 : 1) +
      padTop +
      padBottom
    : value(requestedHeight, 12, viewport.height)
  const rect = overlayRect(
    viewport,
    boundedSize(
      desiredWidth,
      Math.max(minimumWidth, autoWidth ? padLeft + padRight + 1 : 1),
      capWidth,
      viewport.width,
    ),
    boundedSize(
      desiredHeight,
      Math.max(minimumHeight, autoHeight ? padTop + padBottom + 1 : 1),
      capHeight,
      viewport.height,
    ),
    node
      ? {
          x: node.screenX - originX,
          y: node.screenY - originY,
          width: node.width,
          height: node.height,
        }
      : undefined,
    side,
    sheet,
    avoidAnchor,
  )
  // Terminal/free-region limits win over minimums. Preserve at least one content cell.
  const left = Math.min(padLeft, Math.max(0, rect.width - 1))
  const right = Math.min(padRight, Math.max(0, rect.width - left - 1))
  const top = Math.min(padTop, Math.max(0, rect.height - 1))
  const bottom = Math.min(padBottom, Math.max(0, rect.height - top - 1))
  // Keep the real layout tree mounted, but do not expose the provisional cap
  // or a size measured before wrapping/placement has settled at the new width.
  const readyToShow =
    presented.current ||
    (!autoWidth && !autoHeight) ||
    (measured.ready &&
      measured.panelWidth === rect.width &&
      measured.panelHeight === rect.height &&
      measured.x === rect.x + originX &&
      measured.y === rect.y + originY)
  useLayoutEffect(() => {
    if (readyToShow) presented.current = true
  }, [readyToShow])
  const measure = (beforePaint = false) => {
    const current = content.current
    if (
      !current ||
      current.isDestroyed ||
      !current.visible ||
      current.width <= 0
    )
      return
    const scroll = scrollBody.current
    if (
      scroll &&
      (previousViewport.current.width !== scroll.viewport.width ||
        previousViewport.current.height !== scroll.viewport.height)
    ) {
      previousViewport.current = {
        width: scroll.viewport.width,
        height: scroll.viewport.height,
      }
      const focused = renderer.currentFocusedRenderable
      let ancestor = focused?.parent
      while (ancestor && ancestor !== scroll) ancestor = ancestor.parent
      if (focused && ancestor === scroll)
        scroll.scrollChildIntoView(focused, { inset: 1 })
    }
    if (!autoWidth && !autoHeight) return
    const next = {
      width: Math.ceil(intrinsicWidth(current)),
      height: Math.ceil(current.height),
      ready: true,
      x: surface.current?.screenX ?? 0,
      y: surface.current?.screenY ?? 0,
      panelWidth: surface.current?.width ?? 0,
      panelHeight: surface.current?.height ?? 0,
    }
    if (
      measurement.current.ready &&
      measurement.current.width === next.width &&
      measurement.current.height === next.height &&
      measurement.current.x === next.x &&
      measurement.current.y === next.y &&
      measurement.current.panelWidth === next.panelWidth &&
      measurement.current.panelHeight === next.panelHeight
    )
      return
    measurement.current = next
    // Native resize hooks run after layout and before paint. Commit the measured
    // size now so the renderer can solve wrapping/placement in the same frame.
    if (beforePaint) flushSync(() => setMeasured(next))
    else setMeasured(next)
  }
  useLayoutEffect(measure)
  useLayoutEffect(() => {
    const id = token.current
    setLayer(++stack.next)
    stack.ids.push(id)
    return () => {
      stack.ids = stack.ids.filter((value) => value !== id)
      if (!stack.ids.length) stack.next = 0
    }
  }, [stack])
  useKeyboard((key) => {
    if (bounds && !bounds.visible) return
    if (
      key.name === 'escape' &&
      !key.defaultPrevented &&
      stack.ids.at(-1) === token.current
    ) {
      key.preventDefault()
      key.stopPropagation()
      onClose()
    }
  })
  const items = (
    <box
      ref={content}
      width="100%"
      flexDirection="column"
      flexShrink={0}
      gap={Number(panelStyle.gap ?? gap)}
      onSizeChange={() => measure(true)}
      renderBefore={() => measure()}
      {...componentStyle(`${stylePart}.items`, {
        gap: Number(panelStyle.gap ?? gap),
      })}
    >
      {children}
    </box>
  )
  const panel = (
    <box
      ref={surface}
      visible={interactive ? undefined : bounds?.visible}
      position="absolute"
      left={rect.x + (interactive ? 0 : originX)}
      top={rect.y + (interactive ? 0 : originY)}
      backgroundColor={backgroundColor}
      flexDirection="column"
      zIndex={interactive ? undefined : 1000 + layer * 10}
      onMouseDown={interactive ? (event) => event.stopPropagation() : undefined}
      {...panelStyle}
      opacity={readyToShow ? 1 : 0}
      onSizeChange={() => measure(true)}
      width={rect.width}
      height={rect.height}
      minWidth={0}
      minHeight={0}
      maxWidth={viewport.width}
      maxHeight={viewport.height}
      paddingLeft={left}
      paddingRight={right}
      paddingTop={top}
      paddingBottom={bottom}
    >
      {interactive ? (
        <scrollbox
          ref={scrollBody}
          flexGrow={1}
          minHeight={0}
          scrollY
          scrollX={false}
          focusable={false}
          viewportCulling={false}
        >
          {items}
        </scrollbox>
      ) : (
        <box flexGrow={1} minHeight={0} overflow="hidden">
          {items}
        </box>
      )}
      {corner}
    </box>
  )
  if (rect.width === 0 || rect.height === 0) return null
  if (!interactive) return createPortal(panel, renderer.root, null)
  return createPortal(
    <box
      visible={bounds?.visible ?? true}
      position="absolute"
      overflow={review ? 'hidden' : 'visible'}
      left={originX}
      top={originY}
      width={viewport.width}
      height={viewport.height}
      zIndex={1000 + layer * 10}
      renderBefore={backdrop}
      onMouseMove={(event) => {
        if (stack.ids.at(-1) === token.current) onOutsidePointerMove?.(event)
      }}
      onMouseDown={(event) => {
        if (stack.ids.at(-1) !== token.current) return
        event.preventDefault()
        event.stopPropagation()
        if (event.button === 0 && outsideDismiss && !onOutsidePointer?.(event))
          onClose()
      }}
    >
      <FocusScope
        enabled={readyToShow}
        trap={modal && !review}
        loop={modal && !review}
        autoFocus={readyToShow}
        restoreFocus={restoreFocus && readyToShow}
        onExit={modal && !review ? undefined : (onTabExit ?? onClose)}
      >
        {panel}
      </FocusScope>
    </box>,
    renderer.root,
    null,
  )
}
