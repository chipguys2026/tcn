// biome-ignore-all lint/correctness/noComponentHookFactories: Test fixtures are instantiated once, outside React render.
import { expect, test } from 'bun:test'
import {
  type BoxRenderable,
  KeyEvent,
  RGBA,
  TextAttributes,
} from '@opentui/core'
import { testRender } from '@opentui/react/test-utils'
import { act, createRef, type ReactNode, useState } from 'react'
import { Button, type ButtonHandle } from '@/components/ui/button'
import type { ButtonVariant } from '@/components/ui/button.styles'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import { icons } from '@/lib/ui/icons'
import { ThemeProvider } from '@/lib/ui/theme/provider'
import { type ThemeName, themes } from '@/lib/ui/theme/tokens'
import { createNavigationStore } from '@/router/navigation-store'
import { RouterView } from '@/router/router-view'

async function render(
  children: ReactNode,
  theme: ThemeName = 'dark',
  width = 80,
  height = 24,
) {
  const setup = await testRender(
    <ThemeProvider theme={theme}>
      <FocusScope>
        <box padding={2} flexDirection="column" gap={2}>
          {children}
        </box>
      </FocusScope>
    </ThemeProvider>,
    { width, height, kittyKeyboard: true },
  )
  await setup.renderOnce()
  return {
    ...setup,
    node: (id: string) =>
      setup.renderer.root.findDescendantById(id) as BoxRenderable,
    frame: async () => {
      await setup.renderOnce()
      return setup.captureCharFrame()
    },
    destroy: () => act(() => setup.renderer.destroy()),
  }
}

for (const theme of ['light', 'dark'] as const) {
  for (const variant of [
    'default',
    'secondary',
    'ghost',
    'destructive',
    'link',
  ] as ButtonVariant[]) {
    test(`${theme} ${variant}: one-row button uses theme colors and no border`, async () => {
      const setup = await render(
        <Button id="button" variant={variant}>
          Save
        </Button>,
        theme,
      )
      try {
        const node = setup.node('button')
        expect(node.height).toBe(1)
        expect(node.width).toBe(6)
        expect(await setup.frame()).toContain('Save')
        expect(await setup.frame()).not.toContain('┌')
        const span = setup
          .captureSpans()
          .lines.flatMap((line) => line.spans)
          .find((span) => span.text.includes('Save'))
        const expectedFg =
          variant === 'default'
            ? themes[theme].primaryForeground
            : variant === 'secondary'
              ? themes[theme].secondaryForeground
              : variant === 'link'
                ? themes[theme].primary
                : variant === 'destructive'
                  ? themes[theme].background
                  : themes[theme].foreground
        expect(span?.fg.equals(RGBA.fromHex(expectedFg))).toBe(true)
        if (variant === 'link')
          expect((span?.attributes ?? 0) & TextAttributes.UNDERLINE).not.toBe(0)
      } finally {
        setup.destroy()
      }
    })
  }
}

test('renders typed Nerd Font icons alone or with text, and exposes their label through the handle', async () => {
  const ref = createRef<ButtonHandle>()
  const setup = await render(
    <>
      <Button id="icon" ref={ref} icon="search" label="Search files" />
      <Button id="with-icon" icon="plus">
        Create
      </Button>
    </>,
  )
  try {
    const frame = await setup.frame()
    expect(frame).toContain(icons.search)
    expect(frame).toContain(`${icons.plus} Create`)
    expect(setup.node('icon').width).toBe(3)
    expect(ref.current?.label).toBe('Search files')
  } finally {
    setup.destroy()
  }
})

test('focus ring extends outside the button without changing layout and disappears on blur', async () => {
  const ref = createRef<ButtonHandle>()
  const setup = await render(
    <box flexDirection="row" gap={0}>
      <Button id="button" ref={ref} autoFocus>
        Save
      </Button>
      <text id="neighbor">Neighbor</text>
    </box>,
  )
  try {
    const x = setup.node('neighbor').screenX
    expect(await setup.frame()).toContain('┌──────┐')
    expect(setup.node('button').height).toBe(1)
    await act(async () => ref.current?.blur())
    expect(await setup.frame()).not.toContain('┌')
    expect(setup.node('neighbor').screenX).toBe(x)
    expect(await setup.frame()).toContain('Neighbor')
  } finally {
    setup.destroy()
  }
})

test('Enter and Space activate once, while modified and repeated keypresses do not', async () => {
  let presses = 0
  const setup = await render(
    <Button id="button" autoFocus onPress={() => presses++}>
      Save
    </Button>,
  )
  try {
    await act(async () => {
      setup.mockInput.pressEnter()
      setup.mockInput.pressKey(' ')
    })
    expect(presses).toBe(2)
    await act(async () => setup.mockInput.pressEnter({ ctrl: true }))
    expect(presses).toBe(2)
    const button = setup.node('button')
    await act(async () =>
      button.onKeyDown?.(
        new KeyEvent({
          name: 'return',
          ctrl: false,
          meta: false,
          shift: false,
          option: false,
          sequence: '\r',
          number: false,
          raw: '\r',
          eventType: 'press',
          source: 'kitty',
          repeated: true,
        }),
      ),
    )
    expect(presses).toBe(2)
  } finally {
    setup.destroy()
  }
})

test('Tab and Shift+Tab skip disabled controls and do not let autoFocus steal focus back', async () => {
  const setup = await render(
    <>
      <Button id="first" autoFocus>
        First
      </Button>
      <Button id="disabled" disabled>
        Disabled
      </Button>
      <Button id="last">Last</Button>
    </>,
  )
  try {
    expect(setup.node('first').focused).toBe(true)
    await act(async () => setup.mockInput.pressTab())
    await setup.renderOnce()
    expect(setup.node('last').focused).toBe(true)
    expect(setup.node('first').focused).toBe(false)
    await act(async () => setup.mockInput.pressTab())
    expect(setup.node('first').focused).toBe(true)
    await act(async () => setup.mockInput.pressTab({ shift: true }))
    expect(setup.node('last').focused).toBe(true)
    expect(setup.node('disabled').focusable).toBe(false)
  } finally {
    setup.destroy()
  }
})

test('mouse click activates; right-click and releasing a drag outside do not', async () => {
  let presses = 0
  const setup = await render(
    <Button id="button" onPress={() => presses++}>
      Save
    </Button>,
  )
  try {
    const node = setup.node('button'),
      x = node.screenX + 2,
      y = node.screenY
    await act(async () => setup.mockMouse.click(x, y))
    expect(presses).toBe(1)
    expect(node.focused).toBe(true)
    await act(async () => setup.mockMouse.click(x, y, 2))
    expect(presses).toBe(1)
    await act(async () => setup.mockMouse.drag(x, y, x + 20, y + 2))
    expect(presses).toBe(1)
  } finally {
    setup.destroy()
  }
})

test('painting the ring over a neighbor does not intercept that neighbor’s mouse clicks', async () => {
  let top = 0,
    bottom = 0
  const setup = await render(
    <box gap={0} flexDirection="column">
      <Button id="top" onPress={() => top++}>
        Top
      </Button>
      <Button id="bottom" autoFocus onPress={() => bottom++}>
        Bottom
      </Button>
    </box>,
  )
  try {
    const node = setup.node('top')
    expect(await setup.frame()).toContain('┌')
    await act(async () => setup.mockMouse.click(node.screenX + 2, node.screenY))
    expect(top).toBe(1)
    expect(bottom).toBe(0)
  } finally {
    setup.destroy()
  }
})

test('disabled buttons cannot focus or activate with keyboard, mouse, or their handle', async () => {
  let presses = 0
  const ref = createRef<ButtonHandle>()
  const setup = await render(
    <Button id="button" ref={ref} disabled autoFocus onPress={() => presses++}>
      Save
    </Button>,
  )
  try {
    const node = setup.node('button')
    await act(async () => {
      ref.current?.focus()
      setup.mockInput.pressEnter()
      await setup.mockMouse.click(node.screenX + 2, node.screenY)
    })
    expect(node.focused).toBe(false)
    expect(presses).toBe(0)
    expect(await setup.frame()).not.toContain('┌')
  } finally {
    setup.destroy()
  }
})

test('disabling a focused button moves focus to the next enabled control', async () => {
  let disable = () => {}
  function Fixture() {
    const [disabled, setDisabled] = useState(false)
    disable = () => setDisabled(true)
    return (
      <>
        <Button id="first" autoFocus disabled={disabled}>
          First
        </Button>
        <Button id="second">Second</Button>
      </>
    )
  }
  const setup = await render(<Fixture />)
  try {
    await act(async () => disable())
    expect(setup.node('first').focused).toBe(false)
    expect(setup.node('second').focused).toBe(true)
  } finally {
    setup.destroy()
  }
})

test('changing button text or a scope callback preserves focus and Tab order', async () => {
  let update = () => {}
  function Fixture() {
    const [text, setText] = useState('Save')
    update = () => setText('Saved')
    return (
      <FocusScope onFocusChange={() => {}}>
        <Button id="first" autoFocus>
          {text}
        </Button>
        <Button id="second">Next</Button>
      </FocusScope>
    )
  }
  const setup = await render(<Fixture />)
  try {
    await act(async () => update())
    expect(setup.node('first').focused).toBe(true)
    expect(await setup.frame()).toContain('Saved')
    await act(async () => setup.mockInput.pressTab())
    expect(setup.node('second').focused).toBe(true)
  } finally {
    setup.destroy()
  }
})

test('long labels truncate to the container and Unicode labels use terminal cell widths', async () => {
  const setup = await render(
    <>
      <box width={10}>
        <Button id="long">A very long button label</Button>
      </box>
      <Button id="wide">保存</Button>
    </>,
  )
  try {
    expect(setup.node('long').width).toBe(10)
    expect(setup.node('long').height).toBe(1)
    expect(setup.node('wide').width).toBe(6)
  } finally {
    setup.destroy()
  }
})

test('home gallery button navigates through its owning router', async () => {
  const store = createNavigationStore('/')
  const setup = await testRender(<RouterView store={store} />, {
    width: 80,
    height: 24,
  })
  try {
    await setup.renderOnce()
    await act(async () => setup.mockInput.pressEnter())
    expect(store.getState().pathname).toBe('/gallery')
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('Component catalog /')
  } finally {
    act(() => setup.renderer.destroy())
  }
})

test.each([
  [80, 24],
  [120, 40],
  [60, 18],
])(
  'gallery supports keyboard navigation and activation at %sx%s',
  async (width, height) => {
    const store = createNavigationStore('/gallery/button')
    const setup = await testRender(<RouterView store={store} />, {
      width,
      height,
    })
    try {
      await setup.renderOnce()
      expect(setup.captureCharFrame()).toContain('Button gallery /')
      await act(async () => setup.mockInput.pressEnter())
      await setup.renderOnce()
      expect(setup.captureCharFrame()).toContain('Presses: 1')
      for (let index = 0; index < 16; index++)
        await act(async () => setup.mockInput.pressTab())
      await setup.renderOnce()
      expect(setup.captureCharFrame()).toContain('Save changes')
    } finally {
      act(() => setup.renderer.destroy())
    }
  },
)
