// biome-ignore-all lint/correctness/noComponentHookFactories: Fixtures are created once per test, outside React render.
import { expect, test } from 'bun:test'
import { type BoxRenderable, type InputRenderable, RGBA } from '@opentui/core'
import { testRender } from '@opentui/react/test-utils'
import { act, createRef, type ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input, type InputHandle } from '@/components/ui/input'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import { type ThemeName, themes } from '@/lib/ui/styles'
import { ThemeProvider } from '@/lib/ui/theme/provider'
import { createNavigationStore } from '@/router/navigation-store'
import { RouterView } from '@/router/router-view'

async function render(children: ReactNode, theme: ThemeName = 'dark') {
  const setup = await testRender(
    <ThemeProvider theme={theme}>
      <FocusScope>
        <box width={40} padding={2} gap={2} flexDirection="column">
          {children}
        </box>
      </FocusScope>
    </ThemeProvider>,
    { width: 44, height: 16, kittyKeyboard: true },
  )
  await setup.renderOnce()
  return {
    ...setup,
    node: (id = 'input') =>
      setup.renderer.root.findDescendantById(id) as InputRenderable,
    frame: async () => {
      await setup.renderOnce()
      return setup.captureCharFrame()
    },
    destroy: () => act(() => setup.renderer.destroy()),
  }
}

test.each(['light', 'dark'] as const)(
  '%s input uses semantic placeholder colors and is one row high',
  async (theme) => {
    const setup = await render(
      <Input id="input" placeholder="Your name" width={30} />,
      theme,
    )
    try {
      expect(setup.node().height).toBe(1)
      expect(setup.node().width).toBe(28)
      expect((setup.node().parent as BoxRenderable).width).toBe(30)
      expect(await setup.frame()).toContain('Your name')
      expect(await setup.frame()).not.toContain('┌')
      const span = setup
        .captureSpans()
        .lines.flatMap((line) => line.spans)
        .find((span) => span.text.includes('Your name'))
      expect(span?.fg.equals(RGBA.fromHex(themes[theme].mutedForeground))).toBe(
        true,
      )
      expect(span?.bg.equals(RGBA.fromHex(themes[theme].muted))).toBe(true)
    } finally {
      setup.destroy()
    }
  },
)

test('controlled input supports native typing and editing without duplicate change callbacks', async () => {
  const changes: string[] = []
  function Fixture() {
    const [value, setValue] = useState('')
    return (
      <Input
        id="input"
        autoFocus
        value={value}
        onValueChange={(next) => {
          changes.push(next)
          setValue(next)
        }}
      />
    )
  }
  const setup = await render(<Fixture />)
  try {
    expect(changes).toHaveLength(0)
    await act(async () => setup.mockInput.typeText('abc'))
    expect(setup.node().value).toBe('abc')
    expect(changes).toEqual(['a', 'ab', 'abc'])
    await act(async () => {
      setup.mockInput.pressArrow('left')
      setup.mockInput.pressBackspace()
    })
    expect(setup.node().value).toBe('ac')
    expect(changes.at(-1)).toBe('ac')
    expect(setup.node().focused).toBe(true)
  } finally {
    setup.destroy()
  }
})

test('a controlled owner can reject or transform an edit', async () => {
  let transform = false
  const changes: string[] = []
  function Fixture() {
    const [value, setValue] = useState('fixed')
    return (
      <Input
        id="input"
        autoFocus
        value={value}
        onValueChange={(next) => {
          changes.push(next)
          if (transform) setValue(next.toUpperCase())
        }}
      />
    )
  }
  const setup = await render(<Fixture />)
  try {
    await act(async () => setup.mockInput.typeText('x'))
    expect(changes).toEqual(['fixedx'])
    expect(setup.node().value).toBe('fixed')
    transform = true
    await act(async () => setup.mockInput.typeText('y'))
    expect(setup.node().value).toBe('FIXEDY')
    expect(changes).toEqual(['fixedx', 'fixedy'])
  } finally {
    setup.destroy()
  }
})

test('owner-driven value updates never emit onValueChange', async () => {
  const changes: string[] = []
  let replace = (_value: string) => {}
  function Fixture() {
    const [value, setValue] = useState('Initial')
    replace = setValue
    return (
      <Input
        id="input"
        autoFocus
        value={value}
        onValueChange={(next) => changes.push(next)}
      />
    )
  }
  const setup = await render(<Fixture />)
  try {
    expect(setup.node().value).toBe('Initial')
    expect(changes).toHaveLength(0)
    await act(async () => replace('Replacement'))
    expect(setup.node().value).toBe('Replacement')
    expect(changes).toHaveLength(0)
    expect(setup.node().focused).toBe(true)
  } finally {
    setup.destroy()
  }
})

test('uncontrolled input keeps edits and only uses defaultValue at mount', async () => {
  let update = () => {}
  const changes: string[] = []
  function Fixture() {
    const [seed, setSeed] = useState('Hello')
    update = () => setSeed('New default')
    return (
      <Input
        id="input"
        autoFocus
        defaultValue={seed}
        onValueChange={(next) => changes.push(next)}
      />
    )
  }
  const setup = await render(<Fixture />)
  try {
    expect(setup.node().value).toBe('Hello')
    expect(changes).toHaveLength(0)
    await act(async () => setup.mockInput.typeText('!'))
    expect(setup.node().value).toBe('Hello!')
    await act(async () => update())
    expect(setup.node().value).toBe('Hello!')
    expect(changes).toEqual(['Hello!'])
  } finally {
    setup.destroy()
  }
})

test('Enter submits once without adding a newline or changing the value', async () => {
  const submissions: string[] = []
  const setup = await render(
    <Input
      id="input"
      autoFocus
      defaultValue="Submit me"
      onSubmit={(next) => submissions.push(next)}
    />,
  )
  try {
    await act(async () => setup.mockInput.pressEnter())
    expect(submissions).toEqual(['Submit me'])
    expect(setup.node().value).toBe('Submit me')
    expect(setup.node().height).toBe(1)
  } finally {
    setup.destroy()
  }
})

test('paste is single-line and Unicode deletion uses native editing', async () => {
  const setup = await render(<Input id="input" autoFocus />)
  try {
    await act(async () =>
      setup.mockInput.pasteBracketedText('Tiếng\nViệt\r\n 🧪'),
    )
    expect(setup.node().value).toBe('TiếngViệt 🧪')
    await act(async () => setup.mockInput.pressBackspace())
    expect(setup.node().value).toBe('TiếngViệt ')
  } finally {
    setup.destroy()
  }
})

test('readOnly inputs remain focusable/selectable but reject typing, deleting, paste and undo', async () => {
  let changes = 0
  const setup = await render(
    <Input
      id="input"
      autoFocus
      defaultValue="Read only"
      readOnly
      onValueChange={() => changes++}
    />,
  )
  try {
    expect(setup.node().focused).toBe(true)
    await act(async () => {
      await setup.mockInput.typeText('x')
      setup.mockInput.pressBackspace()
      setup.mockInput.pressKey('z', { ctrl: true })
      await setup.mockInput.pasteBracketedText('paste')
    })
    expect(setup.node().value).toBe('Read only')
    expect(changes).toBe(0)
    await act(async () => setup.mockInput.pressArrow('left'))
    expect(setup.node().focused).toBe(true)
  } finally {
    setup.destroy()
  }
})

test('disabled inputs cannot focus, edit, submit or receive mouse focus', async () => {
  let changes = 0,
    submits = 0
  const ref = createRef<InputHandle>()
  const setup = await render(
    <Input
      id="input"
      ref={ref}
      disabled
      autoFocus
      defaultValue="Disabled"
      onValueChange={() => changes++}
      onSubmit={() => submits++}
    />,
  )
  try {
    const node = setup.node()
    await act(async () => {
      ref.current?.focus()
      await setup.mockMouse.click(node.screenX + 2, node.screenY)
      await setup.mockInput.typeText('x')
      setup.mockInput.pressEnter()
    })
    expect(node.focused).toBe(false)
    expect(node.value).toBe('Disabled')
    expect(changes).toBe(0)
    expect(submits).toBe(0)
  } finally {
    setup.destroy()
  }
})

test.each(['light', 'dark'] as const)(
  '%s invalid input has an outer destructive ring without changing its height',
  async (theme) => {
    const setup = await render(
      <Input id="input" width={12} invalid defaultValue="Invalid" />,
      theme,
    )
    try {
      expect(await setup.frame()).toContain('┌────────────┐')
      expect(setup.node().height).toBe(1)
      const span = setup
        .captureSpans()
        .lines.flatMap((line) => line.spans)
        .find((span) => span.text.includes('┌'))
      expect(span?.fg.equals(RGBA.fromHex(themes[theme].destructive))).toBe(
        true,
      )
    } finally {
      setup.destroy()
    }
  },
)

test('inputs and buttons share Tab traversal, native mouse focus and programmatic handles', async () => {
  const ref = createRef<InputHandle>()
  const setup = await render(
    <>
      <Button id="button" autoFocus>
        First
      </Button>
      <Input id="disabled" disabled />
      <Input id="input" ref={ref} label="Name" />
      <Button id="last">Last</Button>
    </>,
  )
  try {
    await act(async () => setup.mockInput.pressTab())
    expect(setup.node().focused).toBe(true)
    expect(ref.current?.label).toBe('Name')
    expect(await setup.frame()).toContain('┌')
    await act(async () => setup.mockInput.pressTab())
    expect(setup.node('last').focused).toBe(true)
    await act(async () => setup.mockInput.pressTab({ shift: true }))
    expect(setup.node().focused).toBe(true)
    await act(async () => ref.current?.blur())
    expect(setup.node().focused).toBe(false)
    await act(async () =>
      setup.mockMouse.click(setup.node().screenX + 2, setup.node().screenY),
    )
    expect(setup.node().focused).toBe(true)
  } finally {
    setup.destroy()
  }
})

test('long values scroll within a fixed-width, single-row input', async () => {
  const value = 'abcdefghijklmnopqrstuvwxyz'
  const setup = await render(<Input id="input" width={8} autoFocus />)
  try {
    await act(async () => setup.mockInput.typeText(value))
    expect(setup.node().value).toBe(value)
    expect(setup.node().width).toBe(6)
    expect(setup.node().height).toBe(1)
    expect(await setup.frame()).toContain('wxyz')
    expect(setup.node().editorView.getViewport().offsetX).toBeGreaterThan(0)
  } finally {
    setup.destroy()
  }
})

test.each([
  [80, 24],
  [120, 40],
  [60, 18],
])('input gallery accepts and submits text at %sx%s', async (width, height) => {
  const store = createNavigationStore('/gallery/input')
  const setup = await testRender(<RouterView store={store} />, {
    width,
    height,
    kittyKeyboard: true,
  })
  try {
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('Input gallery')
    await act(async () => setup.mockInput.typeText('Lan'))
    await act(async () => setup.mockInput.pressEnter())
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('Submitted: Lan')
  } finally {
    act(() => setup.renderer.destroy())
  }
})
