// biome-ignore-all lint/correctness/noComponentHookFactories: Test fixtures are created once before rendering.
import { expect, test } from 'bun:test'
import {
  BoxRenderable,
  type Renderable,
  ScrollBoxRenderable,
  TextRenderable,
} from '@opentui/core'
import { testRender } from '@opentui/react/test-utils'
import { act, type ReactNode, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import { boundedSize } from '@/lib/ui/overlay-sizing'
import { ThemeProvider } from '@/lib/ui/theme/provider'

function all(node: Renderable): Renderable[] {
  return [node, ...node.getChildren().flatMap(all)]
}
async function fixture(children: ReactNode, theme: 'light' | 'dark' = 'dark') {
  const setup = await testRender(
    <ThemeProvider theme={theme}>
      <FocusScope>
        <box padding={2}>{children}</box>
      </FocusScope>
    </ThemeProvider>,
    { width: 70, height: 32, kittyKeyboard: true },
  )
  const frame = async () => {
    for (let pass = 0; pass < 5; pass++)
      await act(async () => setup.renderOnce())
  }
  await frame()
  return { ...setup, frame, destroy: () => act(() => setup.renderer.destroy()) }
}
function popup(setup: Awaited<ReturnType<typeof fixture>>) {
  const scroll = all(setup.renderer.root).find(
    (node) => node instanceof ScrollBoxRenderable,
  ) as ScrollBoxRenderable | undefined
  const panel = scroll?.parent
  if (!(panel instanceof BoxRenderable) || !scroll)
    throw new Error('Missing popup surface')
  return { scroll, panel }
}

for (const theme of ['light', 'dark'] as const) {
  test(`${theme} short Select fits content including padding and matches the trigger minimum`, async () => {
    const setup = await fixture(
      <Select defaultOpen>
        <SelectTrigger>A longer trigger</SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
          <SelectItem value="b">B</SelectItem>
        </SelectContent>
      </Select>,
      theme,
    )
    try {
      const { panel, scroll } = popup(setup)
      const trigger = all(setup.renderer.root).find(
        (node) =>
          node.focusable && !node.parent?.parent?.id.includes('overlay'),
      )
      expect(panel.height).toBe(5)
      expect(panel.width).toBe(18)
      expect(panel.width).toBeGreaterThanOrEqual(trigger?.width ?? 1)
      expect(scroll.scrollHeight).toBe(scroll.viewport.height)
    } finally {
      setup.destroy()
    }
  })
}

test('Menu grows and shrinks with real content, caps height, and reveals keyboard-focused items', async () => {
  let changeCount = (_count: number) => {}
  function Example() {
    const [count, setCount] = useState(2)
    changeCount = setCount
    return (
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          {Array.from({ length: count }, (_, index) => ({
            value: String(index),
            label: `Item ${index}`,
          })).map((item) => (
            <DropdownMenuItem key={item.value} value={item.value}>
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  const setup = await fixture(<Example />)
  try {
    expect(popup(setup).panel.height).toBe(5)
    await act(async () => changeCount(25))
    await setup.frame()
    const { panel, scroll } = popup(setup)
    expect(panel.height).toBe(16)
    expect(panel.width).toBeLessThanOrEqual(32)
    expect(scroll.scrollHeight).toBeGreaterThan(scroll.viewport.height)
    for (let index = 0; index < 24; index++)
      await act(async () => setup.mockInput.pressArrow('down'))
    await setup.frame()
    const focused = setup.renderer.currentFocusedRenderable
    expect(focused?.screenY).toBeGreaterThanOrEqual(scroll.viewport.screenY)
    expect(
      (focused?.screenY ?? 0) + (focused?.height ?? 0),
    ).toBeLessThanOrEqual(scroll.viewport.screenY + scroll.viewport.height)
    await act(async () => setup.renderer.resize(70, 12))
    await setup.frame()
    expect(
      (focused?.screenY ?? 0) + (focused?.height ?? 0),
    ).toBeLessThanOrEqual(scroll.viewport.screenY + scroll.viewport.height)
    await act(async () => changeCount(1))
    await setup.frame()
    expect(popup(setup).panel.height).toBe(3)
  } finally {
    setup.destroy()
  }
})

test('explicit limits override trigger minimum and terminal bounds override minimum dimensions', async () => {
  const setup = await fixture(
    <Select defaultOpen>
      <SelectTrigger>
        A very long trigger that exceeds the popup maximum
      </SelectTrigger>
      <SelectContent
        minWidth="trigger"
        maxWidth={20}
        minHeight={8}
        maxHeight={10}
      >
        <SelectItem value="one">One</SelectItem>
      </SelectContent>
    </Select>,
  )
  try {
    expect(popup(setup).panel.width).toBe(20)
    expect(popup(setup).panel.height).toBe(8)
    await act(async () => setup.renderer.resize(12, 6))
    await setup.frame()
    const { panel } = popup(setup)
    expect(panel.width).toBeLessThanOrEqual(12)
    expect(panel.height).toBeLessThanOrEqual(6)
    expect(panel.screenX + panel.width).toBeLessThanOrEqual(12)
    expect(panel.screenY + panel.height).toBeLessThanOrEqual(6)
  } finally {
    setup.destroy()
  }
})

test('Tooltip measures Unicode text, wraps at max width, updates content and has no scrollbox', async () => {
  let changeText = (_text: string) => {}
  function Example() {
    const [text, setText] = useState('中中中')
    changeText = setText
    return (
      <Tooltip open>
        <TooltipTrigger label="Hint">Hint</TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    )
  }
  const setup = await fixture(<Example />)
  try {
    let text = all(setup.renderer.root).find(
      (node) => node instanceof TextRenderable && node.plainText === '中中中',
    ) as TextRenderable
    let panel = text.parent?.parent?.parent as BoxRenderable
    expect(panel.width).toBe(8)
    expect(panel.height).toBe(3)
    await act(async () =>
      changeText('Long hints wrap into multiple rows and remain readable.'),
    )
    await setup.frame()
    text = all(setup.renderer.root).find(
      (node) =>
        node instanceof TextRenderable &&
        node.plainText.startsWith('Long hints'),
    ) as TextRenderable
    panel = text.parent?.parent?.parent as BoxRenderable
    expect(panel.width).toBe(32)
    expect(panel.height).toBeGreaterThan(3)
    expect(all(panel).some((node) => node instanceof ScrollBoxRenderable)).toBe(
      false,
    )
    expect(setup.captureCharFrame()).toContain('readable.')
  } finally {
    setup.destroy()
  }
})

test('size bounds honor maximum and available space even when minimum is larger', () => {
  expect(boundedSize(5, 10, 8, 20)).toBe(8)
  expect(boundedSize(50, 10, 32, 7)).toBe(7)
  expect(boundedSize(5, 1, 32, 0)).toBe(0)
})
