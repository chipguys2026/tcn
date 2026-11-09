import { expect, test } from 'bun:test'
import { testRender } from '@opentui/react/test-utils'
import { act } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import { overlayRect } from '@/lib/ui/overlay'
import { ThemeProvider } from '@/lib/ui/theme/provider'

test('tooltip remains open under a stationary pointer near the top edge', async () => {
  const changes: boolean[] = []
  const setup = await testRender(
    <ThemeProvider theme="dark">
      <FocusScope>
        <box padding={2}>
          <Tooltip
            delayDuration={2}
            onOpenChange={(open) => changes.push(open)}
          >
            <TooltipTrigger label="Hint">Hover here</TooltipTrigger>
            <TooltipContent>Stable tooltip</TooltipContent>
          </Tooltip>
        </box>
      </FocusScope>
    </ThemeProvider>,
    { width: 50, height: 14 },
  )
  try {
    await act(async () => setup.renderOnce())
    await act(async () => setup.mockMouse.moveTo(4, 2))
    for (let frame = 0; frame < 6; frame++) {
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 8))
        await setup.renderOnce()
      })
    }
    expect(changes).toEqual([true])
    expect(setup.captureCharFrame()).toContain('Stable tooltip')
    await act(async () => setup.renderer.resize(50, 8))
    for (let frame = 0; frame < 4; frame++) {
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 8))
        await setup.renderOnce()
      })
    }
    expect(changes).toEqual([true])
    expect(setup.captureCharFrame()).toContain('Stable tooltip')
    await act(async () => setup.mockMouse.moveTo(49, 7))
    await act(async () => setup.renderOnce())
    expect(changes).toEqual([true, false])
  } finally {
    act(() => setup.renderer.destroy())
  }
})

test('passive overlay placement stays inside the viewport without covering its anchor', () => {
  for (const [width, height] of [
    [1, 1],
    [8, 4],
    [50, 14],
  ] as const) {
    for (let x = 0; x < width; x += Math.max(1, Math.floor(width / 4))) {
      for (let y = 0; y < height; y++) {
        const anchor = { x, y, width: Math.min(8, width - x), height: 1 }
        for (const side of ['top', 'bottom', 'left', 'right'] as const) {
          const rect = overlayRect(
            { width, height },
            30,
            5,
            anchor,
            side,
            false,
            true,
          )
          expect(rect.x).toBeGreaterThanOrEqual(0)
          expect(rect.y).toBeGreaterThanOrEqual(0)
          expect(rect.x + rect.width).toBeLessThanOrEqual(width)
          expect(rect.y + rect.height).toBeLessThanOrEqual(height)
          if (rect.width && rect.height) {
            expect(
              rect.x + rect.width <= anchor.x ||
                rect.x >= anchor.x + anchor.width ||
                rect.y + rect.height <= anchor.y ||
                rect.y >= anchor.y + anchor.height,
            ).toBe(true)
          }
        }
      }
    }
  }
})
