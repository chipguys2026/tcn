// biome-ignore-all lint/correctness/noComponentHookFactories: Fixtures are created once per test before rendering.
import { expect, test } from 'bun:test'
import {
  type Renderable,
  ScrollBoxRenderable,
  TextRenderable,
} from '@opentui/core'
import { testRender } from '@opentui/react/test-utils'
import { act, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import { Overlay } from '@/lib/ui/overlay'
import { ThemeProvider } from '@/lib/ui/theme/provider'

function all(node: Renderable): Renderable[] {
  return [node, ...node.getChildren().flatMap(all)]
}

test('the first painted auto menu fits its content while the backdrop stays dim during measurement', async () => {
  const setup = await testRender(
    <ThemeProvider theme="dark">
      <FocusScope autoFocus>
        <box
          width="100%"
          height="100%"
          padding={2}
          gap={2}
          flexDirection="column"
          backgroundColor="#507090"
        >
          <text fg="#f0e0d0">Background content</text>
          <Menubar>
            <MenubarMenu value="file">
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Open project...</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </box>
      </FocusScope>
    </ThemeProvider>,
    { width: 80, height: 24, kittyKeyboard: true },
  )
  const frames: {
    painted: boolean
    width: number
    height: number
    x: number
    y: number
    focused: string | undefined
    background: number
  }[] = []
  const foreground = () => {
    const span = setup
      .captureSpans()
      .lines.flatMap((line) => line.spans)
      .find((span) => span.text.includes('Background content'))
    if (!span) throw new Error('Missing background')
    return span.fg.r
  }
  const capture = () => {
    const scroll = all(setup.renderer.root).find(
      (node) => node instanceof ScrollBoxRenderable,
    )
    if (!scroll?.parent) return
    frames.push({
      painted: setup.captureCharFrame().includes('Open project...'),
      width: scroll.parent.width,
      height: scroll.parent.height,
      x: scroll.parent.screenX,
      y: scroll.parent.screenY,
      focused: setup.renderer.currentFocusedRenderable?.id,
      background: foreground(),
    })
  }
  try {
    await act(async () => setup.renderOnce())
    const before = foreground()
    const trigger = setup.renderer.currentFocusedRenderable
    expect(trigger).toBeDefined()
    setup.renderer.on('frame', capture)
    await act(async () => setup.mockInput.pressEnter())
    for (let pass = 0; pass < 8; pass++)
      await act(async () => setup.renderOnce())
    expect(frames.length).toBeGreaterThan(0)
    const painted = frames.filter((frame) => frame.painted)
    expect(painted.length).toBeGreaterThan(0)
    const finalFrame = painted.at(-1)
    if (!finalFrame) throw new Error('Popup was not painted')
    for (const frame of painted) {
      expect([frame.width, frame.height]).toEqual([19, 3])
      expect([frame.x, frame.y]).toEqual([finalFrame.x, finalFrame.y])
    }
    for (const frame of frames) {
      expect(frame.background).toBeCloseTo(before * 0.72, 2)
      if (!frame.painted) expect(frame.focused).toBe(trigger?.id)
    }
    await act(async () => setup.mockInput.pressEscape())
    await act(async () => setup.renderOnce())
    expect(setup.captureCharFrame()).not.toContain('Open project...')
    expect(foreground()).toBeCloseTo(before, 2)
    expect(setup.renderer.currentFocusedRenderable).toBe(trigger)
  } finally {
    setup.renderer.off('frame', capture)
    act(() => setup.renderer.destroy())
  }
})

test.each([false, true])(
  'auto-sized overlay (modal=%s) defers descendant autofocus and can close before measurement',
  async (modal) => {
    let contentPaints = 0
    function Example() {
      const [open, setOpen] = useState(false)
      return (
        <box padding={2}>
          <Button autoFocus onPress={() => setOpen(true)}>
            Open prompt
          </Button>
          {open && (
            <Overlay
              modal={modal}
              width="auto"
              height="auto"
              maxWidth={28}
              onClose={() => setOpen(false)}
            >
              <box
                flexDirection="column"
                gap={2}
                renderBefore={() => {
                  contentPaints++
                }}
              >
                <text>Ready prompt</text>
                <FocusScope>
                  <Input
                    id="prompt-input"
                    autoFocus
                    label="Prompt"
                    width={20}
                  />
                </FocusScope>
              </box>
            </Overlay>
          )}
        </box>
      )
    }
    const setup = await testRender(
      <ThemeProvider theme="dark">
        <FocusScope>
          <Example />
        </FocusScope>
      </ThemeProvider>,
      { width: 70, height: 24, kittyKeyboard: true },
    )
    const frames: {
      painted: boolean
      focused: string | undefined
      paints: number
    }[] = []
    let previousPaints = 0
    const capture = () => {
      if (
        !all(setup.renderer.root).some(
          (node) => node instanceof ScrollBoxRenderable,
        )
      )
        return
      frames.push({
        painted: setup.captureCharFrame().includes('Ready prompt'),
        focused: setup.renderer.currentFocusedRenderable?.id,
        paints: contentPaints - previousPaints,
      })
      previousPaints = contentPaints
    }
    try {
      await act(async () => setup.renderOnce())
      const trigger = setup.renderer.currentFocusedRenderable
      await act(async () => setup.mockInput.pressEnter())
      expect(setup.renderer.currentFocusedRenderable).toBe(trigger)
      await act(async () => setup.mockInput.pressEscape())
      await act(async () => setup.renderOnce())
      expect(setup.captureCharFrame()).not.toContain('Ready prompt')
      expect(setup.renderer.currentFocusedRenderable).toBe(trigger)

      setup.renderer.on('frame', capture)
      await act(async () => setup.mockInput.pressEnter())
      for (let pass = 0; pass < 8; pass++)
        await act(async () => setup.renderOnce())
      expect(frames.some((frame) => frame.painted)).toBe(true)
      for (const frame of frames) {
        expect(frame.paints).toBe(frame.painted ? 1 : 0)
        if (!frame.painted) expect(frame.focused).toBe(trigger?.id)
      }
      expect(setup.renderer.currentFocusedRenderable?.id).toBe('prompt-input')
      await act(async () => setup.mockInput.pressEscape())
      await act(async () => setup.renderOnce())
      expect(setup.renderer.currentFocusedRenderable).toBe(trigger)
    } finally {
      setup.renderer.off('frame', capture)
      act(() => setup.renderer.destroy())
    }
  },
)

test('wrapped noninteractive popups are placed within terminal bounds before their first paint', async () => {
  function Example() {
    const [open, setOpen] = useState(false)
    return (
      <box padding={2}>
        <Button autoFocus onPress={() => setOpen(true)}>
          Show hint
        </Button>
        {open && (
          <Overlay
            interactive={false}
            width="auto"
            height="auto"
            maxWidth={19}
            maxHeight={9}
            anchorPoint={{ x: 58, y: 17 }}
            onClose={() => setOpen(false)}
          >
            <text id="opening-hint" fg="#f0e0d0">
              A hint with enough words to wrap across several terminal rows.
            </text>
          </Overlay>
        )}
      </box>
    )
  }
  const setup = await testRender(
    <ThemeProvider theme="dark">
      <FocusScope>
        <Example />
      </FocusScope>
    </ThemeProvider>,
    { width: 60, height: 18, kittyKeyboard: true },
  )
  const frames: { width: number; height: number; x: number; y: number }[] = []
  const capture = () => {
    if (!setup.captureCharFrame().includes('A hint')) return
    const text = all(setup.renderer.root).find(
      (node) => node instanceof TextRenderable && node.id === 'opening-hint',
    )
    const panel = text?.parent?.parent?.parent
    if (!panel) throw new Error('Missing hint surface')
    frames.push({
      width: panel.width,
      height: panel.height,
      x: panel.screenX,
      y: panel.screenY,
    })
  }
  try {
    await act(async () => setup.renderOnce())
    const trigger = setup.renderer.currentFocusedRenderable
    setup.renderer.on('frame', capture)
    await act(async () => setup.mockInput.pressEnter())
    for (let pass = 0; pass < 8; pass++)
      await act(async () => setup.renderOnce())
    expect(frames.length).toBeGreaterThan(0)
    const finalFrame = frames.at(-1)
    if (!finalFrame) throw new Error('Hint was not painted')
    for (const frame of frames) {
      expect(frame).toEqual(finalFrame)
      expect(frame.width).toBeLessThanOrEqual(19)
      expect(frame.height).toBeGreaterThan(3)
      expect(frame.height).toBeLessThanOrEqual(9)
      expect(frame.x).toBeGreaterThanOrEqual(0)
      expect(frame.y).toBeGreaterThanOrEqual(0)
      expect(frame.x + frame.width).toBeLessThanOrEqual(60)
      expect(frame.y + frame.height).toBeLessThanOrEqual(18)
    }
    expect(setup.renderer.currentFocusedRenderable).toBe(trigger)
    await act(async () => setup.mockInput.pressEscape())
    await act(async () => setup.renderOnce())
    expect(setup.captureCharFrame()).not.toContain('A hint')
  } finally {
    setup.renderer.off('frame', capture)
    act(() => setup.renderer.destroy())
  }
})
