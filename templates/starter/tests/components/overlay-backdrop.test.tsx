import { expect, test } from 'bun:test'
import { RGBA } from '@opentui/core'
import { testRender } from '@opentui/react/test-utils'
import { act, useState } from 'react'
import { Button } from '@/components/ui/button'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import { Overlay } from '@/lib/ui/overlay'
import { ThemeProvider } from '@/lib/ui/theme/provider'

function Fixture({ mode }: { mode: 'modal' | 'popup' | 'tooltip' }) {
  const [open, setOpen] = useState(false)
  return (
    <box
      width="100%"
      height="100%"
      backgroundColor="#507090"
      padding={1}
      flexDirection="column"
      gap={1}
    >
      <text fg="#f0e0d0">Background content</text>
      <Button autoFocus onPress={() => setOpen(true)}>
        Open
      </Button>
      {open && (
        <Overlay
          modal={mode === 'modal'}
          interactive={mode !== 'tooltip'}
          onClose={() => setOpen(false)}
          width={36}
          height={10}
        >
          <text fg="#f0e0d0">Popup content</text>
          <Button onPress={() => setOpen(false)}>Close</Button>
        </Overlay>
      )}
    </box>
  )
}

for (const theme of ['light', 'dark'] as const)
  for (const mode of ['modal', 'popup', 'tooltip'] as const) {
    test(`${theme} ${mode} dims only the content behind it and restores colors on close`, async () => {
      const setup = await testRender(
        <ThemeProvider theme={theme}>
          <FocusScope>
            <Fixture mode={mode} />
          </FocusScope>
        </ThemeProvider>,
        { width: 80, height: 24, kittyKeyboard: true },
      )
      function span(label: string) {
        const found = setup
          .captureSpans()
          .lines.flatMap((line) => line.spans)
          .find((item) => item.text.includes(label))
        if (!found) throw new Error(`Missing rendered text: ${label}`)
        return found
      }
      try {
        await setup.renderOnce()
        const before = span('Background content')
        await act(async () => setup.mockInput.pressEnter())
        await setup.renderOnce()
        const behind = span('Background content'),
          keep = mode === 'modal' ? 0.45 : mode === 'popup' ? 0.72 : 1
        expect(behind.fg.r).toBeCloseTo(before.fg.r * keep, 2)
        expect(behind.bg.b).toBeCloseTo(before.bg.b * keep, 2)
        expect(span('Popup content').fg.equals(RGBA.fromHex('#f0e0d0'))).toBe(
          true,
        )
        // Retained paints and resizing must not apply dimming repeatedly.
        await setup.renderOnce()
        expect(span('Background content').fg.equals(behind.fg)).toBe(true)
        await act(async () => setup.resize(60, 18))
        await setup.renderOnce()
        expect(span('Background content').fg.equals(behind.fg)).toBe(true)
        await act(async () => setup.mockInput.pressEscape())
        await setup.renderOnce()
        expect(span('Background content').fg.equals(before.fg)).toBe(true)
        expect(span('Background content').bg.equals(before.bg)).toBe(true)
      } finally {
        act(() => setup.renderer.destroy())
      }
    })
  }

function NestedFixture() {
  const [outer, setOuter] = useState(true),
    [inner, setInner] = useState(false)
  return (
    <box width="100%" height="100%" backgroundColor="#507090" padding={1}>
      <text fg="#f0e0d0">Background content</text>
      {outer && (
        <Overlay modal width={50} height={18} onClose={() => setOuter(false)}>
          <text fg="#f0e0d0">Outer content</text>
          <Button onPress={() => setInner(true)}>Open inner</Button>
          {inner && (
            <Overlay width={30} height={8} onClose={() => setInner(false)}>
              <text fg="#f0e0d0">Inner content</text>
              <Button>Inner action</Button>
            </Overlay>
          )}
        </Overlay>
      )}
    </box>
  )
}
test('nested popup dims its parent, and each Escape restores the previous layer', async () => {
  const setup = await testRender(
    <ThemeProvider theme="dark">
      <FocusScope>
        <NestedFixture />
      </FocusScope>
    </ThemeProvider>,
    { width: 80, height: 24, kittyKeyboard: true },
  )
  function foreground(label: string) {
    const found = setup
      .captureSpans()
      .lines.flatMap((line) => line.spans)
      .find((item) => item.text.includes(label))
    if (!found) throw new Error(`Missing rendered text: ${label}`)
    return found.fg
  }
  try {
    await setup.renderOnce()
    const base = foreground('Background content'),
      outer = foreground('Outer content')
    await act(async () => setup.mockInput.pressEnter())
    await setup.renderOnce()
    expect(foreground('Outer content').r).toBeCloseTo(outer.r * 0.72, 2)
    expect(foreground('Background content').r).toBeCloseTo(base.r * 0.72, 2)
    expect(foreground('Inner content').equals(outer)).toBe(true)
    await act(async () => setup.mockInput.pressEscape())
    await setup.renderOnce()
    expect(foreground('Outer content').equals(outer)).toBe(true)
    expect(foreground('Background content').equals(base)).toBe(true)
    await act(async () => setup.mockInput.pressEscape())
    await setup.renderOnce()
    expect(
      foreground('Background content').equals(RGBA.fromHex('#f0e0d0')),
    ).toBe(true)
  } finally {
    act(() => setup.renderer.destroy())
  }
})
