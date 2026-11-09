import {
  type BoxOptions,
  MouseEvent,
  type ScrollBoxRenderable,
} from '@opentui/core'
import { type PropsWithChildren, type Ref, useImperativeHandle } from 'react'
import {
  type FocusableHandle,
  useFocusable,
} from '@/lib/ui/focus/use-focusable'
import { useFocusRing } from '@/lib/ui/focus-ring'
import { createHorizontalScrollbar } from '@/lib/ui/scrollbar'
import { useComponentStyles } from '@/lib/ui/style-review'
import { useTheme } from '@/lib/ui/theme/use-theme'
export type ScrollAreaHandle = FocusableHandle & {
  scrollTo: (position: number) => void
}
export function ScrollArea({
  children,
  width = '100%',
  height = 8,
  orientation = 'vertical',
  focusable = true,
  label = 'Scroll area',
  ref,
}: PropsWithChildren<{
  width?: number | `${number}%`
  height?: number
  orientation?: 'horizontal' | 'vertical' | 'both'
  focusable?: boolean
  label?: string
  ref?: Ref<ScrollAreaHandle>
}>) {
  const componentStyle = useComponentStyles('scroll-area')

  const theme = useTheme()
  const focus = useFocusable<ScrollBoxRenderable>({
    label,
    disabled: !focusable,
  })
  const props = focus.getFocusProps()
  useFocusRing(props.ref, focus.focused, theme.ring)
  useImperativeHandle(
    ref,
    () => ({
      ...focus.handle,
      scrollTo: (position) => {
        const node = props.ref.current
        if (node) {
          if (orientation === 'horizontal') node.scrollLeft = position
          else node.scrollTop = position
        }
      },
    }),
    [focus.handle, props.ref, orientation],
  )
  const style = componentStyle(
    'ScrollArea',
    { width, height, backgroundColor: theme.background },
    'scrollbox',
  )
  const paintScrollbar = createHorizontalScrollbar(
    theme.muted,
    theme.mutedForeground,
  )
  return (
    <box
      width={(style.width ?? width) as BoxOptions['width']}
      height={(style.height ?? height) as BoxOptions['height']}
      maxWidth="100%"
      flexShrink={0}
    >
      <scrollbox
        {...props}
        maxWidth="100%"
        flexShrink={0}
        scrollX={orientation !== 'vertical'}
        scrollY={orientation !== 'horizontal'}
        viewportCulling={false}
        backgroundColor={theme.background}
        scrollbarOptions={{
          trackOptions: {
            backgroundColor: theme.muted,
            foregroundColor: theme.mutedForeground,
          },
        }}
        {...style}
        width="100%"
        height="100%"
      >
        {children}
      </scrollbox>
      {/* A later sibling paints after native bars, within the normal scene layer.
          Keep its cell on the bar and forward pointer events to native scrolling. */}
      <box
        visible={orientation !== 'vertical'}
        position="absolute"
        bottom={0}
        left={0}
        width={1}
        height={1}
        overflow="visible"
        onMouse={(event) => {
          const node = props.ref.current
          if (node) node.processMouseEvent(new MouseEvent(node, event))
          event.stopPropagation()
        }}
        renderAfter={(buffer) => {
          const node = props.ref.current
          if (node) paintScrollbar.call(node, buffer)
        }}
      />
    </box>
  )
}
