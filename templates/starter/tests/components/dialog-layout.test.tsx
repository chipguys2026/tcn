import { expect, test } from 'bun:test'
import {
  BoxRenderable,
  type Renderable,
  ScrollBoxRenderable,
} from '@opentui/core'
import { testRender } from '@opentui/react/test-utils'
import { act } from 'react'
import { DialogDemo } from '@/features/gallery/examples/dialog'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import { icons } from '@/lib/ui/icons'
import { ThemeProvider } from '@/lib/ui/theme/provider'

for (const theme of ['light', 'dark'] as const) {
  test(`${theme} dialog fits content, centers, and keeps its compact close button reachable after resize`, async () => {
    const setup = await testRender(
      <ThemeProvider theme={theme}>
        <FocusScope>
          <DialogDemo />
        </FocusScope>
      </ThemeProvider>,
      { width: 80, height: 24, kittyKeyboard: true },
    )
    function descendants(node: Renderable): Renderable[] {
      return [node, ...node.getChildren().flatMap(descendants)]
    }
    try {
      await act(async () => setup.renderOnce())
      const trigger = setup
        .captureCharFrame()
        .split('\n')
        .findIndex((line) => line.includes('Edit profile'))
      await act(async () => setup.mockMouse.click(3, trigger))
      await act(async () => setup.renderOnce())
      const scroll = descendants(setup.renderer.root).find(
        (node) => node instanceof ScrollBoxRenderable,
      )
      const panel = scroll?.parent
      if (!(panel instanceof BoxRenderable))
        throw new Error('Missing dialog surface')
      expect(panel.height).toBeLessThan(24)
      expect(panel.height).toBe(
        (scroll as ScrollBoxRenderable).scrollHeight + 2,
      )
      expect(panel.screenY).toBe(Math.floor((24 - panel.height) / 2))
      expect(setup.captureCharFrame()).toContain('Save changes')
      await act(async () => {
        setup.renderer.resize(28, 9)
      })
      await act(async () => setup.renderOnce())
      expect(panel.height).toBeLessThanOrEqual(9)
      expect(panel.width).toBeLessThanOrEqual(28)
      const lines = setup.captureCharFrame().split('\n')
      const y = lines.findIndex((line) => line.includes(icons.close))
      const x = lines[y]?.indexOf(icons.close) ?? -1
      expect(x).toBeGreaterThanOrEqual(0)
      const close = descendants(panel).find(
        (node) =>
          node instanceof BoxRenderable &&
          node.screenX === x - 1 &&
          node.screenY === y &&
          node.width === 3 &&
          node.height === 1,
      )
      expect(Boolean(close)).toBe(true)
      await act(async () => setup.mockMouse.click(x - 1, y))
      await act(async () => setup.renderOnce())
      expect(setup.captureCharFrame()).not.toContain(icons.close)
    } finally {
      act(() => setup.renderer.destroy())
    }
  })
}
