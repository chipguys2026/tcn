// biome-ignore-all lint/correctness/noComponentHookFactories: Fixtures are created once per test outside render.
import { expect, spyOn, test } from 'bun:test'
import type { BoxRenderable, ScrollBoxRenderable } from '@opentui/core'
import { testRender } from '@opentui/react/test-utils'
import { act, createRef, useState } from 'react'
import { Button, type ButtonHandle } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import { ThemeProvider } from '@/lib/ui/theme/provider'

test('focus ring paints above a later sibling in a higher parent layer', async () => {
  const ref = createRef<ButtonHandle>()
  const setup = await testRender(
    <ThemeProvider theme="dark">
      <FocusScope>
        <box width="100%" height="100%">
          <box
            position="absolute"
            left={3}
            top={3}
            width={20}
            height={3}
            padding={1}
          >
            <Button id="ring-target" ref={ref} autoFocus>
              Go
            </Button>
          </box>
          <box
            position="absolute"
            left={0}
            top={5}
            width={40}
            height={1}
            zIndex={999}
            backgroundColor="#334455"
          >
            <text>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</text>
          </box>
        </box>
      </FocusScope>
    </ThemeProvider>,
    { width: 45, height: 12, kittyKeyboard: true },
  )
  try {
    await setup.renderOnce()
    const node = setup.renderer.root.findDescendantById(
      'ring-target',
    ) as BoxRenderable
    expect(
      setup
        .captureCharFrame()
        .split('\n')
        [node.screenY + 1]?.slice(
          node.screenX - 1,
          node.screenX + node.width + 1,
        ),
    ).toBe(`└${'─'.repeat(node.width)}┘`)
    await act(async () => ref.current?.blur())
    await setup.renderOnce()
    expect(
      setup
        .captureCharFrame()
        .split('\n')
        [node.screenY + 1]?.slice(
          node.screenX - 1,
          node.screenX + node.width + 1,
        ),
    ).toBe('X'.repeat(node.width + 2))
  } finally {
    act(() => setup.renderer.destroy())
  }
})
test('an input ring can extend one cell outside a clipped scrolling viewport', async () => {
  const setup = await testRender(
    <ThemeProvider theme="dark">
      <FocusScope>
        <box width="100%" height="100%" padding={3}>
          <scrollbox
            width={22}
            height={5}
            scrollY
            scrollX={false}
            focusable={false}
            viewportCulling={false}
          >
            <Input id="scroll-input" autoFocus width={16} />
          </scrollbox>
        </box>
      </FocusScope>
    </ThemeProvider>,
    { width: 40, height: 14, kittyKeyboard: true },
  )
  try {
    await setup.renderOnce()
    const input = setup.renderer.root.findDescendantById('scroll-input'),
      surface = input?.parent
    if (!surface) throw new Error('Missing input surface')
    expect(
      setup
        .captureCharFrame()
        .split('\n')
        [surface.screenY - 1]?.slice(
          surface.screenX - 1,
          surface.screenX + surface.width + 1,
        ),
    ).toBe(`┌${'─'.repeat(surface.width)}┐`)
  } finally {
    act(() => setup.renderer.destroy())
  }
})

test('scrolling a focused control out of view hides its ring and scrolling back restores it', async () => {
  const setup = await testRender(
    <ThemeProvider theme="dark">
      <FocusScope>
        <box width="100%" height="100%" padding={3}>
          <scrollbox
            id="ring-scroll"
            width={24}
            height={5}
            scrollY
            scrollX={false}
            focusable={false}
            viewportCulling={false}
          >
            <box flexDirection="column">
              <Button autoFocus>Target</Button>
              {Array.from({ length: 20 }, (_, index) => `Row ${index}`).map(
                (row) => (
                  <text key={row}>{row}</text>
                ),
              )}
            </box>
          </scrollbox>
        </box>
      </FocusScope>
    </ThemeProvider>,
    { width: 40, height: 14, kittyKeyboard: true },
  )
  try {
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('┌')
    const scroll = setup.renderer.root.findDescendantById(
      'ring-scroll',
    ) as ScrollBoxRenderable
    await act(async () => {
      scroll.scrollTop = 10
    })
    await setup.renderOnce()
    expect(setup.captureCharFrame()).not.toContain('┌')
    await act(async () => {
      scroll.scrollTop = 0
    })
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('┌')
    await act(async () => setup.resize(60, 18))
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('┌')
  } finally {
    act(() => setup.renderer.destroy())
  }
})
test('unmounting a focused control removes its final paint pass and leaves no stale ring', async () => {
  const handle = createRef<ButtonHandle>()
  let hide = () => {}
  function Fixture() {
    const [shown, setShown] = useState(true)
    hide = () => setShown(false)
    return (
      <box padding={3}>
        {shown ? (
          <Button ref={handle}>Temporary</Button>
        ) : (
          <text>After removal</text>
        )}
      </box>
    )
  }
  const setup = await testRender(
    <ThemeProvider theme="dark">
      <FocusScope>
        <Fixture />
      </FocusScope>
    </ThemeProvider>,
    { width: 40, height: 12 },
  )
  const add = spyOn(setup.renderer, 'addPostProcessFn'),
    remove = spyOn(setup.renderer, 'removePostProcessFn')
  try {
    await setup.renderOnce()
    await act(async () => handle.current?.focus())
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('┌')
    await act(async () => hide())
    await setup.renderOnce()
    expect(setup.captureCharFrame()).not.toContain('┌')
    expect(setup.captureCharFrame()).toContain('After removal')
    expect(add).toHaveBeenCalledTimes(1)
    expect(remove).toHaveBeenCalledTimes(1)
  } finally {
    add.mockRestore()
    remove.mockRestore()
    act(() => setup.renderer.destroy())
  }
})
