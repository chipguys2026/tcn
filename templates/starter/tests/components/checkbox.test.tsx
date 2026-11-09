// biome-ignore-all lint/correctness/noComponentHookFactories: Fixtures are created once per test, outside React render.
import { expect, test } from 'bun:test'
import { type BoxRenderable, RGBA } from '@opentui/core'
import { testRender } from '@opentui/react/test-utils'
import { act, createRef, type ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Checkbox,
  type CheckboxHandle,
  type CheckedState,
} from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import { icons } from '@/lib/ui/icons'
import { type ThemeName, themes } from '@/lib/ui/styles'
import { ThemeProvider } from '@/lib/ui/theme/provider'
import { createNavigationStore } from '@/router/navigation-store'
import { RouterView } from '@/router/router-view'

async function render(children: ReactNode, theme: ThemeName = 'dark') {
  const setup = await testRender(
    <ThemeProvider theme={theme}>
      <FocusScope>
        <box padding={2} gap={2} flexDirection="column">
          {children}
        </box>
      </FocusScope>
    </ThemeProvider>,
    { width: 60, height: 18, kittyKeyboard: true },
  )
  await setup.renderOnce()
  return {
    ...setup,
    node: (id = 'checkbox') =>
      setup.renderer.root.findDescendantById(id) as BoxRenderable,
    frame: async () => {
      await setup.renderOnce()
      return setup.captureCharFrame()
    },
    destroy: () => act(() => setup.renderer.destroy()),
  }
}

for (const theme of ['light', 'dark'] as const) {
  for (const state of [false, true, 'indeterminate'] as const) {
    test(`${theme} ${state}: indicator uses semantic colors and the control stays one row`, async () => {
      const setup = await render(
        <Checkbox id="checkbox" checked={state}>
          Choice
        </Checkbox>,
        theme,
      )
      try {
        expect(setup.node().height).toBe(1)
        expect(setup.node().width).toBe(10)
        const indicator = setup.node('checkbox:indicator')
        expect(indicator.width).toBe(3)
        expect(
          indicator.backgroundColor.equals(
            RGBA.fromHex(
              state === false ? themes[theme].muted : themes[theme].primary,
            ),
          ),
        ).toBe(true)
        const frame = await setup.frame()
        expect(frame).toContain('Choice')
        if (state === true) expect(frame).toContain(icons.check)
        if (state === 'indeterminate') expect(frame).toContain(icons.minus)
        if (state === false) {
          expect(frame).not.toContain(icons.check)
          expect(frame).not.toContain(icons.minus)
        }
      } finally {
        setup.destroy()
      }
    })
  }
}

test('uncontrolled toggles work for rapid Space presses and callbacks are edit-only', async () => {
  const changes: CheckedState[] = []
  const setup = await render(
    <Checkbox
      id="checkbox"
      autoFocus
      onCheckedChange={(next) => changes.push(next)}
    >
      Choice
    </Checkbox>,
  )
  try {
    expect(changes).toHaveLength(0)
    await act(async () => {
      setup.mockInput.pressKey(' ')
      setup.mockInput.pressKey(' ')
    })
    expect(changes).toEqual([true, false])
    expect(await setup.frame()).not.toContain(icons.check)
    await act(async () => setup.mockInput.pressKey(' '))
    expect(await setup.frame()).toContain(icons.check)
  } finally {
    setup.destroy()
  }
})

test('controlled owners can reject changes, replace state, and accept later proposals', async () => {
  let accept = false
  let replace = (_state: CheckedState) => {}
  const changes: CheckedState[] = []
  function Fixture() {
    const [state, setState] = useState<CheckedState>(false)
    replace = setState
    return (
      <Checkbox
        id="checkbox"
        checked={state}
        autoFocus
        onCheckedChange={(next) => {
          changes.push(next)
          if (accept) setState(next)
        }}
      >
        Choice
      </Checkbox>
    )
  }
  const setup = await render(<Fixture />)
  try {
    await act(async () => setup.mockInput.pressKey(' '))
    expect(changes).toEqual([true])
    expect(await setup.frame()).not.toContain(icons.check)
    await act(async () => replace('indeterminate'))
    expect(changes).toEqual([true])
    expect(await setup.frame()).toContain(icons.minus)
    accept = true
    await act(async () => setup.mockInput.pressKey(' '))
    expect(await setup.frame()).toContain(icons.check)
    await act(async () => setup.mockInput.pressKey(' '))
    expect(await setup.frame()).not.toContain(icons.check)
    expect(changes).toEqual([true, true, false])
  } finally {
    setup.destroy()
  }
})

test('defaultChecked only initializes once, and indeterminate activates to checked', async () => {
  let update = () => {}
  function Fixture() {
    const [initial, setInitial] = useState<CheckedState>('indeterminate')
    update = () => setInitial(true)
    return (
      <Checkbox id="checkbox" defaultChecked={initial} autoFocus>
        Choice
      </Checkbox>
    )
  }
  const setup = await render(<Fixture />)
  try {
    expect(await setup.frame()).toContain(icons.minus)
    await act(async () => setup.mockInput.pressKey(' '))
    expect(await setup.frame()).toContain(icons.check)
    await act(async () => setup.mockInput.pressKey(' '))
    await act(async () => update())
    expect(await setup.frame()).not.toContain(icons.check)
    expect(await setup.frame()).not.toContain(icons.minus)
  } finally {
    setup.destroy()
  }
})

test('clicking the label or indicator toggles, but Enter/right-click/drag-out do not', async () => {
  const changes: CheckedState[] = []
  const setup = await render(
    <Checkbox
      id="checkbox"
      autoFocus
      onCheckedChange={(next) => changes.push(next)}
    >
      Accept terms
    </Checkbox>,
  )
  try {
    const node = setup.node(),
      x = node.screenX,
      y = node.screenY
    await act(async () => setup.mockInput.pressEnter())
    expect(changes).toHaveLength(0)
    await act(async () => setup.mockMouse.click(x + 8, y))
    expect(changes).toEqual([true])
    await act(async () => setup.mockMouse.click(x + 1, y))
    expect(changes).toEqual([true, false])
    await act(async () => setup.mockMouse.click(x + 1, y, 2))
    await act(async () => setup.mockMouse.drag(x + 1, y, x + 25, y + 2))
    expect(changes).toEqual([true, false])
  } finally {
    setup.destroy()
  }
})

test('focus ring surrounds only the indicator, does not shift the label, and disappears on blur', async () => {
  const ref = createRef<CheckboxHandle>()
  const setup = await render(
    <Checkbox id="checkbox" ref={ref} autoFocus>
      Choice
    </Checkbox>,
  )
  try {
    const width = setup.node().width
    expect(await setup.frame()).toContain('┌───┐')
    expect(await setup.frame()).toContain('Choice')
    expect(ref.current?.label).toBe('Choice')
    await act(async () => ref.current?.blur())
    expect(await setup.frame()).not.toContain('┌')
    expect(setup.node().width).toBe(width)
  } finally {
    setup.destroy()
  }
})

test('a standalone checkbox requires no visible label and has a compact hit target', async () => {
  const ref = createRef<CheckboxHandle>()
  const setup = await render(
    <Checkbox id="checkbox" ref={ref} label="Select row" defaultChecked />,
  )
  try {
    expect(setup.node().width).toBe(3)
    expect(ref.current?.label).toBe('Select row')
    expect(await setup.frame()).toContain(icons.check)
    await act(async () =>
      setup.mockMouse.click(setup.node().screenX + 1, setup.node().screenY),
    )
    expect(await setup.frame()).not.toContain(icons.check)
  } finally {
    setup.destroy()
  }
})

test('disabled checkboxes keep their state but cannot focus or toggle', async () => {
  let changes = 0
  const ref = createRef<CheckboxHandle>()
  const setup = await render(
    <Checkbox
      id="checkbox"
      ref={ref}
      disabled
      defaultChecked
      autoFocus
      onCheckedChange={() => changes++}
    >
      Choice
    </Checkbox>,
  )
  try {
    const node = setup.node()
    await act(async () => {
      ref.current?.focus()
      setup.mockInput.pressKey(' ')
      await setup.mockMouse.click(node.screenX + 1, node.screenY)
    })
    expect(node.focused).toBe(false)
    expect(changes).toBe(0)
    expect(await setup.frame()).toContain(icons.check)
    expect(await setup.frame()).not.toContain('┌')
  } finally {
    setup.destroy()
  }
})

test('checkboxes share focus with inputs/buttons without stealing Space from text entry', async () => {
  let changes = 0
  const setup = await render(
    <>
      <Checkbox id="checkbox" autoFocus onCheckedChange={() => changes++}>
        Choice
      </Checkbox>
      <Checkbox id="disabled" disabled>
        Disabled
      </Checkbox>
      <Input id="input" />
      <Button id="button">Next</Button>
    </>,
  )
  try {
    await act(async () => setup.mockInput.pressTab())
    expect(setup.node('input').focused).toBe(true)
    await act(async () => setup.mockInput.typeText('a b'))
    expect(changes).toBe(0)
    await act(async () => setup.mockInput.pressTab())
    expect(setup.node('button').focused).toBe(true)
    await act(async () => setup.mockInput.pressTab())
    expect(setup.node().focused).toBe(true)
  } finally {
    setup.destroy()
  }
})

test.each([
  [80, 24],
  [120, 40],
  [60, 18],
])(
  'checkbox gallery supports controlled and grouped changes at %sx%s',
  async (width, height) => {
    const setup = await testRender(
      <RouterView store={createNavigationStore('/gallery/checkbox')} />,
      { width, height, kittyKeyboard: true },
    )
    try {
      await setup.renderOnce()
      expect(setup.captureCharFrame()).toContain('Checkbox gallery')
      await act(async () => setup.mockInput.pressKey(' '))
      await setup.renderOnce()
      expect(setup.captureCharFrame()).toContain('Accepted: true')
      await act(async () => {
        setup.mockInput.pressTab()
        setup.mockInput.pressTab()
        setup.mockInput.pressKey(' ')
      })
      await setup.renderOnce()
      expect(setup.captureCharFrame()).toContain('Permissions: 3/3')
      await act(async () => {
        setup.mockInput.pressTab()
        setup.mockInput.pressKey(' ')
      })
      await setup.renderOnce()
      expect(setup.captureCharFrame()).toContain('Permissions: 2/3')
    } finally {
      act(() => setup.renderer.destroy())
    }
  },
)
