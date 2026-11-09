import { expect, test } from 'bun:test'
import { type Renderable, ScrollBoxRenderable } from '@opentui/core'
import { testRender } from '@opentui/react/test-utils'
import { act } from 'react'
import { ScrollAreaDemo } from '@/features/gallery/examples/scroll-area'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import { ThemeProvider } from '@/lib/ui/theme/provider'

for (const theme of ['light', 'dark'] as const)
  for (const orientation of ['vertical', 'horizontal', 'both'] as const) {
    test(`${theme} ScrollArea supports ${orientation} keyboard and wheel scrolling`, async () => {
      const setup = await testRender(
        <ThemeProvider theme={theme}>
          <FocusScope>
            <box width={40} padding={2}>
              <ScrollAreaDemo initialOrientation={orientation} />
            </box>
          </FocusScope>
        </ThemeProvider>,
        { width: 50, height: 20, kittyKeyboard: true },
      )
      let scroll: ScrollBoxRenderable | undefined
      function find(node: Renderable) {
        if (node instanceof ScrollBoxRenderable) scroll = node
        for (const child of node.getChildren()) find(child)
      }
      try {
        await setup.renderOnce()
        find(setup.renderer.root)
        if (!scroll) throw new Error('Missing scroll area')
        const area: ScrollBoxRenderable = scroll
        if (orientation !== 'vertical') {
          const bar = area._scrollState().bars[0]
          expect(bar.visible).toBe(true)
          const track = setup.captureCharFrame().split('\n')[bar.track.y]
          expect(track?.slice(bar.track.x, bar.track.x + bar.track.width)).toBe(
            '▄'.repeat(bar.track.width),
          )
          const previous = area.scrollLeft
          await act(async () =>
            setup.mockMouse.drag(
              bar.track.x,
              bar.track.y,
              bar.track.x + Math.floor(bar.track.width / 2),
              bar.track.y,
            ),
          )
          await setup.renderOnce()
          expect(area.scrollLeft).toBeGreaterThan(previous)
          await act(async () => {
            area.scrollLeft = 0
          })
        }
        await act(async () => area.focus())
        await act(async () => setup.mockInput.pressArrow('right'))
        await setup.renderOnce()
        if (orientation !== 'vertical')
          expect(area.scrollLeft).toBeGreaterThan(0)
        else expect(area.scrollLeft).toBe(0)
        await act(async () => setup.mockInput.pressArrow('down'))
        await setup.renderOnce()
        if (orientation !== 'horizontal')
          expect(area.scrollTop).toBeGreaterThan(0)
        else expect(area.scrollTop).toBe(0)
        if (orientation !== 'vertical') {
          const previous = area.scrollLeft
          await act(async () =>
            setup.mockMouse.scroll(area.screenX + 2, area.screenY + 2, 'right'),
          )
          await setup.renderOnce()
          expect(area.scrollLeft).toBeGreaterThan(previous)
        }
      } finally {
        act(() => setup.renderer.destroy())
      }
    })
  }
test('ScrollArea demo switches from vertical to horizontal without changing component code', async () => {
  const setup = await testRender(
    <ThemeProvider theme="dark">
      <FocusScope>
        <box padding={2}>
          <ScrollAreaDemo />
        </box>
      </FocusScope>
    </ThemeProvider>,
    { width: 60, height: 20, kittyKeyboard: true },
  )
  try {
    await setup.renderOnce()
    const lines = setup.captureCharFrame().split('\n'),
      y = lines.findIndex((line) => line.includes('Horizontal')),
      x = lines[y]?.indexOf('Horizontal') ?? -1
    expect(x).toBeGreaterThanOrEqual(0)
    await act(async () => setup.mockMouse.click(x, y))
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('Left/Right')
    expect(setup.captureCharFrame()).toContain('Column 1')
  } finally {
    act(() => setup.renderer.destroy())
  }
})
