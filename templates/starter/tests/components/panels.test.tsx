// biome-ignore-all lint/correctness/noComponentHookFactories: Fixtures are instantiated once per test outside render.
import { expect, test } from 'bun:test'
import type { BoxRenderable, Renderable } from '@opentui/core'
import { testRender } from '@opentui/react/test-utils'
import { act, type ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Slider } from '@/components/ui/slider'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import {
  feasiblePanelLimits,
  fitPanelLayout,
  resizePanelPair,
} from '@/lib/ui/panel-layout'
import { ThemeProvider } from '@/lib/ui/theme/provider'

async function fixture(
  children: ReactNode,
  width = 80,
  theme: 'light' | 'dark' = 'dark',
) {
  const setup = await testRender(
    <ThemeProvider theme={theme}>
      <FocusScope>
        <box padding={2} gap={2} flexDirection="column">
          {children}
        </box>
      </FocusScope>
    </ThemeProvider>,
    { width, height: 36, kittyKeyboard: true },
  )
  const frame = async () => {
    for (let pass = 0; pass < 5; pass++)
      await act(async () => setup.renderOnce())
    return setup.captureCharFrame()
  }
  await frame()
  return {
    ...setup,
    frame,
    node: (id: string) =>
      setup.renderer.root.findDescendantById(id) as BoxRenderable,
    destroy: () => act(() => setup.renderer.destroy()),
  }
}
function ancestorsVisible(node: Renderable) {
  let current: Renderable | null = node
  while (current) {
    if (!current.visible) return false
    current = current.parent
  }
  return true
}

for (const theme of ['light', 'dark'] as const) {
  test(`${theme} slider snaps decimal steps and preserves the focused thumb across updates`, async () => {
    const changes: number[][] = [],
      commits: number[][] = []
    const setup = await fixture(
      <Slider
        id="slider"
        label="Volume"
        autoFocus
        min={0}
        max={1}
        step={0.1}
        defaultValue={[0]}
        onValueChange={(value) => changes.push(value)}
        onValueCommit={(value) => commits.push(value)}
      />,
      80,
      theme,
    )
    try {
      for (let key = 0; key < 3; key++)
        await act(async () => setup.mockInput.pressArrow('right'))
      expect(changes.at(-1)).toEqual([0.3])
      expect(commits.at(-1)).toEqual([0.3])
      expect(setup.renderer.currentFocusedRenderable?.id).toBe('slider-thumb-0')
      await act(async () => setup.mockInput.pressKey('END'))
      expect(changes.at(-1)).toEqual([1])
      await act(async () => setup.mockInput.pressKey('HOME'))
      expect(changes.at(-1)).toEqual([0])
      await setup.frame()
      expect(setup.node('slider-thumb-0').width).toBe(1)
    } finally {
      setup.destroy()
    }
  })
}
test('controlled range slider proposals never cross a neighboring thumb or change rejected values', async () => {
  const changes: number[][] = []
  const setup = await fixture(
    <Slider
      id="range"
      autoFocus
      value={[20, 80]}
      step={5}
      onValueChange={(value) => changes.push(value)}
    />,
  )
  try {
    const start = setup.node('range-thumb-0').screenX
    await act(async () => setup.mockInput.pressArrow('right'))
    await act(async () => setup.mockInput.pressArrow('right'))
    expect(changes).toEqual([
      [25, 80],
      [25, 80],
    ])
    await setup.frame()
    expect(setup.node('range-thumb-0').screenX).toBe(start)
    await act(async () => setup.mockInput.pressKey('END'))
    expect(changes.at(-1)).toEqual([80, 80])
    await act(async () => setup.mockInput.pressTab())
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('range-thumb-1')
    await act(async () => setup.mockInput.pressKey('HOME'))
    expect(changes.at(-1)).toEqual([20, 20])
  } finally {
    setup.destroy()
  }
})
test('slider pointer drag updates and commits once, disabled sliders remain skipped', async () => {
  const changes: number[][] = [],
    commits: number[][] = []
  const setup = await fixture(
    <>
      <Slider
        id="slider"
        defaultValue={[0]}
        width={21}
        onValueChange={(value) => changes.push(value)}
        onValueCommit={(value) => commits.push(value)}
      />
      <Slider id="disabled" disabled defaultValue={[50]} />
      <Button id="after">After</Button>
    </>,
  )
  try {
    const thumb = setup.node('slider-thumb-0'),
      root = thumb.parent
    if (!root) throw new Error('Missing slider root')
    await act(async () =>
      setup.mockMouse.drag(
        root.screenX,
        root.screenY,
        root.screenX + 20,
        root.screenY,
      ),
    )
    expect(changes.at(-1)).toEqual([100])
    expect(commits).toEqual([[100]])
    expect(setup.node('disabled-thumb-0').focusable).toBe(false)
    await act(async () => setup.mockInput.pressTab())
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('after')
  } finally {
    setup.destroy()
  }
})
test('vertical slider maps the top to max and the bottom to min inside a narrow terminal', async () => {
  const changes: number[][] = []
  const setup = await fixture(
    <Slider
      id="vertical"
      orientation="vertical"
      height={7}
      defaultValue={[50]}
      onValueChange={(value) => changes.push(value)}
    />,
    16,
  )
  try {
    const root = setup.node('vertical-thumb-0').parent
    if (!root) throw new Error('Missing vertical slider')
    await act(async () => setup.mockMouse.click(root.screenX, root.screenY))
    expect(changes.at(-1)).toEqual([100])
    await act(async () => setup.mockMouse.click(root.screenX, root.screenY + 6))
    expect(changes.at(-1)).toEqual([0])
    await setup.frame()
    expect(setup.node('vertical-thumb-0').screenY).toBe(root.screenY + 6)
  } finally {
    setup.destroy()
  }
})
test('resizable panels divide the remaining cells, honor limits and resize one cell per arrow', async () => {
  const setup = await fixture(
    <ResizablePanelGroup width={41} height={5}>
      <ResizablePanel id="left" defaultSize={30} minSize={25} maxSize={75}>
        <text>Left</text>
      </ResizablePanel>
      <ResizableHandle id="handle" autoFocus withHandle />
      <ResizablePanel id="right" minSize={25}>
        <text>Right</text>
      </ResizablePanel>
    </ResizablePanelGroup>,
  )
  try {
    expect(setup.node('left').width).toBe(12)
    expect(setup.node('right').width).toBe(28)
    expect(setup.node('handle').width).toBe(1)
    await act(async () => setup.mockInput.pressArrow('right'))
    await setup.frame()
    expect(setup.node('left').width).toBe(13)
    expect(setup.node('right').width).toBe(27)
    await act(async () => setup.mockInput.pressKey('END'))
    await setup.frame()
    expect(setup.node('left').width).toBe(30)
    await act(async () => setup.mockInput.pressKey('HOME'))
    await setup.frame()
    expect(setup.node('left').width).toBe(10)
    expect(
      setup.node('left').width +
        setup.node('handle').width +
        setup.node('right').width,
    ).toBe(41)
  } finally {
    setup.destroy()
  }
})
test('resizable drag clamps its adjacent pair and controlled owners may reject proposals', async () => {
  const proposals: number[][] = []
  const setup = await fixture(
    <ResizablePanelGroup
      width={41}
      height={5}
      layout={[50, 50]}
      onLayoutChange={(value) => proposals.push(value)}
    >
      <ResizablePanel id="left" minSize={20}>
        <text>Left</text>
      </ResizablePanel>
      <ResizableHandle id="handle" autoFocus />
      <ResizablePanel id="right" minSize={20}>
        <text>Right</text>
      </ResizablePanel>
    </ResizablePanelGroup>,
  )
  try {
    const handle = setup.node('handle')
    await act(async () =>
      setup.mockMouse.drag(
        handle.screenX,
        handle.screenY + 1,
        handle.screenX + 30,
        handle.screenY + 1,
      ),
    )
    expect(proposals.at(-1)).toEqual([80, 20])
    await setup.frame()
    expect(setup.node('left').width).toBe(20)
    expect(setup.node('right').width).toBe(20)
  } finally {
    setup.destroy()
  }
})
test('vertical resizable handles support keyboard and disabled handles cannot change layout', async () => {
  const changes: number[][] = []
  const setup = await fixture(
    <>
      <ResizablePanelGroup orientation="vertical" height={11}>
        <ResizablePanel id="top">
          <text>Top</text>
        </ResizablePanel>
        <ResizableHandle id="vertical" autoFocus />
        <ResizablePanel id="bottom">
          <text>Bottom</text>
        </ResizablePanel>
      </ResizablePanelGroup>
      <ResizablePanelGroup
        disabled
        height={3}
        onLayoutChange={(value) => changes.push(value)}
      >
        <ResizablePanel>
          <text>One</text>
        </ResizablePanel>
        <ResizableHandle id="disabled" />
        <ResizablePanel>
          <text>Two</text>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>,
  )
  try {
    expect(setup.node('top').height).toBe(5)
    await act(async () => setup.mockInput.pressArrow('down'))
    await setup.frame()
    expect(setup.node('top').height).toBe(6)
    expect(setup.node('bottom').height).toBe(4)
    const disabled = setup.node('disabled')
    expect(disabled.focusable).toBe(false)
    await act(async () =>
      setup.mockMouse.drag(
        disabled.screenX,
        disabled.screenY,
        disabled.screenX + 5,
        disabled.screenY,
      ),
    )
    expect(changes).toEqual([])
  } finally {
    setup.destroy()
  }
})
test('panel layout normalization preserves total and feasible bounds including impossible input', () => {
  for (const input of [
    [80, 10, 10],
    [0, 0, 0],
    [Number.NaN, -1, Number.POSITIVE_INFINITY],
  ]) {
    const limits = [
        { min: 20, max: 60 },
        { min: 10, max: 50 },
        { min: 10, max: 50 },
      ],
      layout = fitPanelLayout(input, limits)
    expect(layout.reduce((sum, value) => sum + value, 0)).toBeCloseTo(100)
    layout.forEach((value, i) => {
      expect(value).toBeGreaterThanOrEqual(limits[i]?.min ?? 0)
      expect(value).toBeLessThanOrEqual(limits[i]?.max ?? 100)
    })
    const resized = resizePanelPair(layout, limits, 0, 100)
    expect(resized[2]).toBe(layout[2])
    expect(resized.reduce((sum, value) => sum + value, 0)).toBeCloseTo(100)
  }
  const limits = [
      { min: 80, max: 90 },
      { min: 80, max: 90 },
    ],
    feasible = feasiblePanelLimits(limits)
  expect(feasible.map((limit) => limit.min)).toEqual([50, 50])
  expect(fitPanelLayout([90, 10], limits)).toEqual([50, 50])
})
for (const theme of ['light', 'dark'] as const) {
  test(`${theme} sidebar collapses to icons while retaining normal menu actions and disabled states`, async () => {
    let selections = 0
    const setup = await fixture(
      <SidebarProvider height={12}>
        <Sidebar id="nav">
          <SidebarHeader>
            <SidebarInput id="search" placeholder="Search navigation" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  id="projects"
                  icon="folder"
                  isActive
                  onPress={() => selections++}
                >
                  Projects
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton id="disabled" disabled>
                  Disabled
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger id="toggle" />
          <text>Main</text>
        </SidebarInset>
      </SidebarProvider>,
      80,
      theme,
    )
    try {
      expect(setup.node('nav').width).toBe(24)
      const project = setup.node('projects')
      await act(async () =>
        setup.mockMouse.click(project.screenX + 1, project.screenY),
      )
      expect(selections).toBe(1)
      expect(setup.node('disabled').focusable).toBe(false)
      const trigger = setup.node('toggle')
      await act(async () =>
        setup.mockMouse.click(trigger.screenX, trigger.screenY),
      )
      await setup.frame()
      expect(setup.node('nav').width).toBe(4)
      expect(ancestorsVisible(setup.node('search'))).toBe(false)
      expect(ancestorsVisible(setup.node('projects'))).toBe(true)
      expect(await setup.frame()).not.toContain('Projects')
      expect(setup.renderer.currentFocusedRenderable?.id).toBe('toggle')
    } finally {
      setup.destroy()
    }
  })
}
test('externally collapsing an offcanvas sidebar restores hidden focus and skips its controls', async () => {
  let collapse: () => void = () => {}
  function Fixture() {
    const [open, setOpen] = useState(true)
    collapse = () => setOpen(false)
    return (
      <SidebarProvider open={open} onOpenChange={setOpen} height={12}>
        <Sidebar id="nav" collapsible="offcanvas">
          <SidebarHeader>
            <SidebarInput id="search" autoFocus />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton id="project">Project</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger id="toggle" />
          <Button id="after">After</Button>
        </SidebarInset>
      </SidebarProvider>
    )
  }
  const setup = await fixture(<Fixture />)
  try {
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('search')
    await act(async () => collapse())
    await setup.frame()
    expect(setup.node('nav').visible).toBe(false)
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('toggle')
    await act(async () => setup.mockInput.pressTab())
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('after')
  } finally {
    setup.destroy()
  }
})
test('a narrow sidebar redirects hidden autofocus and expands on resize without taking focus back', async () => {
  const setup = await fixture(
    <SidebarProvider height={12}>
      <Sidebar id="nav">
        <SidebarHeader>
          <SidebarInput id="search" autoFocus />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton icon="folder">Projects</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger id="toggle" />
        <text>Main</text>
      </SidebarInset>
    </SidebarProvider>,
    20,
  )
  try {
    expect(setup.node('nav').width).toBe(4)
    expect(ancestorsVisible(setup.node('search'))).toBe(false)
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('toggle')
    await act(async () => setup.renderer.resize(80, 36))
    await setup.frame()
    expect(setup.node('nav').width).toBe(24)
    expect(ancestorsVisible(setup.node('search'))).toBe(true)
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('toggle')
  } finally {
    setup.destroy()
  }
})

test('sidebar constrained by a narrow terminal leaves room for its inset and controlled owners can reject toggles', async () => {
  const proposals: boolean[] = []
  const setup = await fixture(
    <SidebarProvider
      open
      onOpenChange={(value) => proposals.push(value)}
      height={10}
    >
      <Sidebar id="nav">
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton icon="folder">Projects</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger id="toggle" autoFocus />
        <text>Main</text>
      </SidebarInset>
    </SidebarProvider>,
    20,
  )
  try {
    const nav = setup.node('nav'),
      inset = setup.node('toggle').parent
    expect(nav.width).toBeGreaterThan(0)
    expect(inset?.width).toBeGreaterThanOrEqual(8)
    await act(async () => setup.mockInput.pressEnter())
    await setup.frame()
    expect(proposals).toEqual([false])
    expect(nav.width).toBe(4)
    await act(async () => setup.renderer.resize(80, 36))
    await setup.frame()
    expect(nav.width).toBe(24)
    expect(proposals).toEqual([false])
  } finally {
    setup.destroy()
  }
})
