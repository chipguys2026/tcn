// biome-ignore-all lint/correctness/noComponentHookFactories: Fixtures are declared once per test, outside render.
import { expect, test } from 'bun:test'
import {
  type BoxRenderable,
  type Renderable,
  TextRenderable,
} from '@opentui/core'
import { ManualClock } from '@opentui/core/testing'
import { testRender } from '@opentui/react/test-utils'
import { act, type ReactNode } from 'react'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
  Toast,
  ToastAction,
  ToastClose,
  Toaster,
  ToastProvider,
  ToastTitle,
  useToast,
} from '@/components/ui/toast'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import { icons } from '@/lib/ui/icons'
import { ThemeProvider } from '@/lib/ui/theme/provider'

function all(node: Renderable): Renderable[] {
  return [node, ...node.getChildren().flatMap(all)]
}
async function fixture(
  children: ReactNode,
  width = 70,
  height = 24,
  theme: 'light' | 'dark' = 'dark',
) {
  const clock = new ManualClock()
  const setup = await testRender(
    <ThemeProvider theme={theme}>
      <FocusScope>
        <box padding={2} gap={2} flexDirection="column">
          {children}
        </box>
      </FocusScope>
    </ThemeProvider>,
    { width, height, clock, kittyKeyboard: true },
  )
  const frame = async () => {
    for (let i = 0; i < 5; i++) await act(async () => setup.renderOnce())
    return setup.captureCharFrame()
  }
  await frame()
  return {
    ...setup,
    clock,
    frame,
    node: (id: string) =>
      setup.renderer.root.findDescendantById(id) as BoxRenderable,
    destroy: () => act(() => setup.renderer.destroy()),
  }
}
test('breadcrumb links activate without making the page, separators or ellipsis focusable', async () => {
  const changes: string[] = []
  const setup = await fixture(
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            id="home"
            autoFocus
            onPress={() => changes.push('home')}
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbEllipsis />
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Current</BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink disabled>Disabled</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>,
    30,
  )
  try {
    await act(async () => setup.mockInput.pressEnter())
    expect(changes).toEqual(['home'])
    expect(
      all(setup.renderer.root)
        .filter((node) => node.focusable)
        .map((node) => node.id),
    ).toEqual(['home'])
    const home = setup.node('home')
    expect(home.width).toBe(4)
  } finally {
    setup.destroy()
  }
})
test('context menu opens at the pointer, navigates enabled items and restores trigger focus', async () => {
  let selected = 0
  const setup = await fixture(
    <ContextMenu>
      <ContextMenuTrigger id="trigger" autoFocus>
        Project actions
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem id="first" onSelect={() => selected++}>
          Open
        </ContextMenuItem>
        <ContextMenuItem disabled>Unavailable</ContextMenuItem>
        <ContextMenuItem id="last">Inspect</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>,
  )
  try {
    const trigger = setup.node('trigger')
    await act(async () =>
      setup.mockMouse.click(trigger.screenX + 5, trigger.screenY, 0),
    )
    expect(setup.renderer.root.findDescendantById('first')).toBeUndefined()
    await act(async () =>
      setup.mockMouse.click(trigger.screenX + 5, trigger.screenY, 2),
    )
    await setup.frame()
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('first')
    const first = setup.node('first')
    expect(first.screenX).toBeGreaterThan(trigger.screenX + 5)
    await act(async () => setup.mockInput.pressArrow('down'))
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('last')
    await act(async () => setup.mockInput.pressKey('HOME'))
    await act(async () => setup.mockInput.pressEnter())
    expect(selected).toBe(1)
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('trigger')
  } finally {
    setup.destroy()
  }
})
test('keyboard context menus support controlled check/radio proposals and Escape', async () => {
  const checks: boolean[] = [],
    radios: string[] = []
  const setup = await fixture(
    <ContextMenu>
      <ContextMenuTrigger id="trigger" autoFocus>
        Actions
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuCheckboxItem
          id="check"
          checked={false}
          onCheckedChange={(v) => checks.push(v)}
          closeOnSelect={false}
        >
          Enabled
        </ContextMenuCheckboxItem>
        <ContextMenuRadioGroup
          value="list"
          onValueChange={(v) => radios.push(v)}
        >
          <ContextMenuRadioItem id="list" value="list" closeOnSelect={false}>
            List
          </ContextMenuRadioItem>
          <ContextMenuRadioItem
            id="detail"
            value="detail"
            closeOnSelect={false}
          >
            Details
          </ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>,
  )
  try {
    await act(async () => setup.mockInput.pressKey('F10', { shift: true }))
    await setup.frame()
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('check')
    await act(async () => setup.mockInput.pressEnter())
    await act(async () => setup.mockInput.pressEnter())
    expect(checks).toEqual([true, true])
    await act(async () => setup.mockInput.pressKey('END'))
    await act(async () => setup.mockInput.pressEnter())
    expect(radios).toEqual(['detail'])
    await act(async () => setup.mockInput.pressEscape())
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('trigger')
  } finally {
    setup.destroy()
  }
})
test('disabled and controlled-rejected context menus do not open', async () => {
  const requests: boolean[] = []
  const setup = await fixture(
    <>
      <ContextMenu open={false} onOpenChange={(v) => requests.push(v)}>
        <ContextMenuTrigger id="trigger" autoFocus>
          Actions
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem id="item">Open</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <ContextMenu>
        <ContextMenuTrigger id="disabled" disabled>
          Disabled
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem id="disabled-item">Unavailable</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>,
  )
  try {
    await act(async () => setup.mockInput.pressKey('F10', { shift: true }))
    expect(requests).toEqual([true])
    expect(setup.renderer.root.findDescendantById('item')).toBeUndefined()
    const disabled = setup.node('disabled')
    await act(async () =>
      setup.mockMouse.click(disabled.screenX, disabled.screenY, 2),
    )
    expect(
      setup.renderer.root.findDescendantById('disabled-item'),
    ).toBeUndefined()
  } finally {
    setup.destroy()
  }
})
test('toast timers use the renderer clock, pause on focus and resume their remaining duration', async () => {
  const closed: boolean[] = []
  const setup = await fixture(
    <>
      <Button id="editor" autoFocus>
        Continue working
      </Button>
      <Toast duration={1000} onOpenChange={(v) => closed.push(v)}>
        <ToastTitle>Saved</ToastTitle>
        <ToastAction id="undo">Undo</ToastAction>
        <ToastClose />
      </Toast>
    </>,
  )
  try {
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('editor')
    await act(async () => setup.clock.advance(400))
    await act(async () => setup.mockInput.pressTab())
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('undo')
    await act(async () => setup.clock.advance(2000))
    expect(closed).toEqual([])
    await act(async () => setup.node('editor').focus())
    await act(async () => setup.clock.advance(599))
    expect(closed).toEqual([])
    await act(async () => setup.clock.advance(1))
    expect(closed).toEqual([false])
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('editor')
  } finally {
    setup.destroy()
  }
  expect(setup.clock.pendingTimerCount).toBe(0)
})
test('toast actions execute once, close the toast and restore focus without auto focusing on mount', async () => {
  let actions = 0
  const setup = await fixture(
    <>
      <Button id="editor" autoFocus>
        Work
      </Button>
      <Toast duration={0}>
        <ToastTitle>Saved</ToastTitle>
        <ToastAction id="undo" onPress={() => actions++}>
          Undo
        </ToastAction>
      </Toast>
    </>,
  )
  try {
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('editor')
    const action = setup.node('undo')
    await act(async () => setup.mockMouse.click(action.screenX, action.screenY))
    expect(actions).toBe(1)
    expect(setup.renderer.root.findDescendantById('undo')).toBeUndefined()
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('editor')
  } finally {
    setup.destroy()
  }
})
test('toast queues bound their count, update and dismiss notifications', async () => {
  let manager: ReturnType<typeof useToast> | undefined
  function Controls() {
    manager = useToast()
    return (
      <Button id="work" autoFocus>
        Work
      </Button>
    )
  }
  const setup = await fixture(
    <ToastProvider limit={2}>
      <Controls />
      <Toaster />
    </ToastProvider>,
    30,
    32,
  )
  try {
    if (!manager) throw new Error('Missing toast manager')
    const api = manager
    let second = 0
    await act(async () => {
      api.toast({ title: 'First', duration: 0 })
      second = api.toast({ title: 'Second', duration: 0 })
      api.toast({ title: 'Third', duration: 0 })
    })
    const frame = await setup.frame()
    expect(frame).not.toContain('First')
    expect(frame).toContain('Second')
    expect(frame).toContain('Third')
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('work')
    await act(async () => api.update(second, { title: 'Updated' }))
    expect(await setup.frame()).toContain('Updated')
    await act(async () => api.dismiss())
    expect(await setup.frame()).not.toContain('Updated')
  } finally {
    setup.destroy()
  }
})
test('hovering a toast pauses its remaining time without changing focus', async () => {
  const closed: boolean[] = []
  const setup = await fixture(
    <>
      <Button id="work" autoFocus>
        Work
      </Button>
      <Toast duration={1000} onOpenChange={(value) => closed.push(value)}>
        <ToastTitle>Notification</ToastTitle>
      </Toast>
    </>,
  )
  try {
    const title = all(setup.renderer.root).find(
      (node): node is TextRenderable =>
        node instanceof TextRenderable && node.plainText === 'Notification',
    )
    if (!title) throw new Error('Missing toast title')
    await act(async () => setup.clock.advance(400))
    await act(async () => setup.mockMouse.moveTo(title.screenX, title.screenY))
    await act(async () => setup.clock.advance(2000))
    expect(closed).toEqual([])
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('work')
    await act(async () => setup.mockMouse.moveTo(0, 0))
    await act(async () => setup.clock.advance(600))
    expect(closed).toEqual([false])
  } finally {
    setup.destroy()
  }
})

test('separate toast providers keep independent queues and dismiss operations', async () => {
  let first: ReturnType<typeof useToast> | undefined,
    second: ReturnType<typeof useToast> | undefined
  function First() {
    first = useToast()
    return null
  }
  function Second() {
    second = useToast()
    return null
  }
  const setup = await fixture(
    <>
      <ToastProvider>
        <First />
      </ToastProvider>
      <ToastProvider>
        <Second />
      </ToastProvider>
    </>,
  )
  try {
    if (!first || !second) throw new Error('Missing toast providers')
    const a = first,
      b = second
    await act(async () => {
      a.toast({ title: 'A' })
      b.toast({ title: 'B' })
    })
    expect(first.toasts.map((entry) => entry.title)).toEqual(['A'])
    expect(second.toasts.map((entry) => entry.title)).toEqual(['B'])
    await act(async () => a.dismiss())
    expect(first.toasts).toEqual([])
    expect(second.toasts.map((entry) => entry.title)).toEqual(['B'])
  } finally {
    setup.destroy()
  }
})

for (const theme of ['light', 'dark'] as const) {
  for (const width of [70, 18]) {
    test(`${theme} toast at ${width} columns keeps status/content together and actions aligned`, async () => {
      function Controls() {
        const { toast } = useToast()
        return (
          <Button
            id="notify"
            autoFocus
            onPress={() =>
              toast({
                title: 'Saved',
                description: 'Changes are ready for review.',
                duration: 0,
                action: { label: 'Undo', onPress: () => {} },
              })
            }
          >
            Notify
          </Button>
        )
      }
      const setup = await fixture(
        <ToastProvider>
          <Controls />
          <Toaster />
        </ToastProvider>,
        width,
        32,
        theme,
      )
      try {
        await act(async () => setup.mockInput.pressEnter())
        await setup.frame()
        const texts = all(setup.renderer.root).filter(
          (node): node is TextRenderable => node instanceof TextRenderable,
        )
        const title = texts.find((node) => node.plainText === 'Saved'),
          description = texts.find(
            (node) => node.plainText === 'Changes are ready for review.',
          ),
          icon = texts.find((node) => node.plainText === icons.info),
          action = texts.find((node) => node.plainText === 'Undo'),
          close = texts.find((node) => node.plainText === icons.close)
        if (!title || !description || !icon || !action || !close)
          throw new Error('Missing toast parts')
        expect(icon.screenY).toBe(title.screenY)
        expect(title.screenX).toBe(icon.screenX + 2)
        expect(description.screenX).toBe(title.screenX)
        expect(description.screenY).toBe(title.screenY + 1)
        expect(description.height).toBeLessThanOrEqual(2)
        expect(close.screenY).toBe(title.screenY - 1)
        const closeButton = close.parent
        if (!closeButton) throw new Error('Missing toast close button')
        expect(closeButton.screenX + closeButton.width).toBe(width - 1)
        if (width === 70) expect(action.screenY).toBe(title.screenY)
        else
          expect(action.screenY).toBeGreaterThanOrEqual(
            description.screenY + description.height,
          )
        for (const node of [title, description, icon, action, close]) {
          expect(node.width).toBeGreaterThan(0)
          expect(node.screenX).toBeGreaterThanOrEqual(1)
          expect(node.screenX + node.width).toBeLessThanOrEqual(width - 1)
          expect(node.screenY + node.height).toBeLessThanOrEqual(31)
        }
        expect(setup.renderer.currentFocusedRenderable?.id).toBe('notify')
      } finally {
        setup.destroy()
      }
    })
  }
}

test('newest toast stays nearest the bottom edge without changing queue API order', async () => {
  let manager: ReturnType<typeof useToast> | undefined
  function Controls() {
    manager = useToast()
    return null
  }
  const setup = await fixture(
    <ToastProvider>
      <Controls />
      <Toaster />
    </ToastProvider>,
    70,
    32,
  )
  try {
    if (!manager) throw new Error('Missing toast manager')
    const api = manager
    await act(async () => {
      api.toast({ title: 'Older', duration: 0 })
      api.toast({ title: 'Newest', variant: 'destructive', duration: 0 })
    })
    await setup.frame()
    const texts = all(setup.renderer.root).filter(
      (node): node is TextRenderable => node instanceof TextRenderable,
    )
    const older = texts.find((node) => node.plainText === 'Older'),
      newest = texts.find((node) => node.plainText === 'Newest'),
      error = texts.find((node) => node.plainText === icons.error)
    if (!older || !newest || !error)
      throw new Error('Missing stacked toast parts')
    expect(newest.screenY).toBeGreaterThan(older.screenY)
    expect(error.screenY).toBe(newest.screenY)
    expect(manager.toasts.map((entry) => entry.title)).toEqual([
      'Newest',
      'Older',
    ])
  } finally {
    setup.destroy()
  }
})

test('short-terminal toasts keep dismiss controls visible and within the viewport', async () => {
  function Controls() {
    const { toast } = useToast()
    return (
      <Button
        id="notify"
        autoFocus
        onPress={() =>
          toast({
            title: 'Saved',
            description: 'A longer description',
            action: { label: 'Undo', onPress: () => {} },
            duration: 0,
          })
        }
      >
        Notify
      </Button>
    )
  }
  const setup = await fixture(
    <ToastProvider>
      <Controls />
      <Toaster />
    </ToastProvider>,
    20,
    6,
  )
  try {
    await act(async () => setup.mockInput.pressEnter())
    await setup.frame()
    const close = all(setup.renderer.root).find(
      (node) => node.focusable && node.id !== 'notify',
    )
    if (!close) throw new Error('Missing toast dismiss control')
    expect(close.screenY).toBeGreaterThanOrEqual(0)
    expect(close.screenY + close.height).toBeLessThanOrEqual(6)
    expect(close.screenX + close.width).toBeLessThanOrEqual(20)
    expect(
      all(setup.renderer.root).filter(
        (node) => node instanceof TextRenderable && node.plainText === 'Undo',
      ),
    ).toHaveLength(0)
  } finally {
    setup.destroy()
  }
})
