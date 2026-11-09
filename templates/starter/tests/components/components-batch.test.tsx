// biome-ignore-all lint/correctness/noComponentHookFactories: Fixtures are created once per test outside React render.
import { expect, test } from 'bun:test'
import type {
  BoxRenderable,
  InputRenderable,
  TextareaRenderable,
} from '@opentui/core'
import { ManualClock } from '@opentui/core/testing'
import { testRender } from '@opentui/react/test-utils'
import { act, type ReactNode, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Combobox } from '@/components/ui/combobox'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { demos } from '@/features/gallery/catalog'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import { overlayRect } from '@/lib/ui/overlay'
import { StyleReviewProvider } from '@/lib/ui/style-review'
import { ThemeProvider } from '@/lib/ui/theme/provider'
import type { ThemeName } from '@/lib/ui/theme/tokens'
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
        <box
          width="100%"
          height="100%"
          flexDirection="column"
          padding={2}
          gap={1}
        >
          {children}
        </box>
      </FocusScope>
    </ThemeProvider>,
    { width, height, kittyKeyboard: true },
  )
  await setup.renderOnce()
  return { ...setup, destroy: () => act(() => setup.renderer.destroy()) }
}
for (const theme of ['light', 'dark'] as const)
  for (const [width, height] of [
    [80, 24],
    [120, 40],
    [60, 18],
  ] as const) {
    test(`${theme} demos mount and clean up at ${width}x${height}`, async () => {
      for (const demo of demos) {
        const setup = await render(
          <demo.render report={() => {}} />,
          theme,
          width,
          height,
        )
        try {
          expect(setup.captureCharFrame().trim().length).toBeGreaterThan(0)
        } finally {
          setup.destroy()
        }
      }
    })
  }
test('radio arrows select enabled items and Tab leaves the group', async () => {
  const changes: string[] = []
  const setup = await render(
    <>
      <Button autoFocus>Before</Button>
      <RadioGroup defaultValue="one" onValueChange={(v) => changes.push(v)}>
        <RadioGroupItem value="one" />
        <RadioGroupItem value="disabled" disabled />
        <RadioGroupItem value="two" />
      </RadioGroup>
      <Button id="after-radio">After</Button>
    </>,
  )
  try {
    await act(async () => setup.mockInput.pressTab())
    await act(async () => setup.mockInput.pressArrow('down'))
    expect(changes).toEqual(['two'])
    await act(async () => setup.mockInput.pressTab())
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('after-radio')
    await setup.renderOnce()
  } finally {
    setup.destroy()
  }
})
test('manual tabs only change panels after activation', async () => {
  const setup = await render(
    <>
      <Button autoFocus>Before</Button>
      <Tabs defaultValue="one" activationMode="manual">
        <TabsList>
          <TabsTrigger value="one" />
          <TabsTrigger value="two" />
        </TabsList>
        <TabsContent value="one">
          <text>First panel</text>
        </TabsContent>
        <TabsContent value="two">
          <text>Second panel</text>
        </TabsContent>
      </Tabs>
    </>,
  )
  try {
    await act(async () => setup.mockInput.pressTab())
    await act(async () => setup.mockInput.pressArrow('right'))
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('First panel')
    await act(async () => setup.mockInput.pressEnter())
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('Second panel')
  } finally {
    setup.destroy()
  }
})
test('dialog traps Tab, Escape closes and restores trigger focus', async () => {
  const setup = await render(
    <>
      <Button autoFocus>Before</Button>
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <text>Dialog body</text>
          <DialogClose>Close dialog</DialogClose>
        </DialogContent>
      </Dialog>
      <Button>After</Button>
    </>,
  )
  try {
    await act(async () => setup.mockInput.pressTab())
    const trigger = setup.renderer.currentFocusedRenderable
    await act(async () => setup.mockInput.pressEnter())
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('Dialog body')
    const inside = setup.renderer.currentFocusedRenderable
    expect(inside).not.toBe(trigger)
    await act(async () => setup.mockInput.pressTab())
    expect(setup.renderer.currentFocusedRenderable === inside).toBe(false)
    expect(setup.renderer.currentFocusedRenderable === trigger).toBe(false)
    await act(async () => setup.mockInput.pressTab())
    expect(setup.renderer.currentFocusedRenderable === inside).toBe(true)
    await act(async () => setup.mockInput.pressKey('ESCAPE'))
    await setup.renderOnce()
    expect(setup.captureCharFrame()).not.toContain('Dialog body')
    expect(setup.renderer.currentFocusedRenderable).toBe(trigger)
  } finally {
    setup.destroy()
  }
})
test('controlled dialog can reject dismissal', async () => {
  const requested: boolean[] = []
  function Fixture() {
    const [open] = useState(true)
    return (
      <Dialog open={open} onOpenChange={(v) => requested.push(v)}>
        <DialogContent>
          <DialogClose>Keep open</DialogClose>
        </DialogContent>
      </Dialog>
    )
  }
  const setup = await render(<Fixture />)
  try {
    await act(async () => setup.mockInput.pressEnter())
    await setup.renderOnce()
    expect(requested).toEqual([false])
    expect(setup.captureCharFrame()).toContain('Keep open')
  } finally {
    setup.destroy()
  }
})
test('overlay placement flips and clamps within small terminals', () => {
  expect(
    overlayRect({ width: 60, height: 18 }, 32, 8, {
      x: 55,
      y: 16,
      width: 4,
      height: 1,
    }),
  ).toEqual({ x: 28, y: 7, width: 32, height: 8 })
  expect(overlayRect({ width: 20, height: 6 }, 48, 12)).toEqual({
    x: 0,
    y: 0,
    width: 20,
    height: 6,
  })
})

// Visits every family; cold Windows runners also initialize native/highlighter resources.
test('catalog routes expose every demo and the composed review', async () => {
  const store = createNavigationStore('/gallery')
  const setup = await testRender(<RouterView store={store} />, {
    width: 80,
    height: 24,
  })
  try {
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('51 available')
    for (const demo of demos) {
      await act(async () => store.getState().navigate(`/gallery/${demo.name}`))
      await setup.renderOnce()
      expect(setup.captureCharFrame()).toContain(`Gallery / ${demo.name}`)
    }
    await act(async () => store.getState().navigate('/gallery/showcase'))
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('Create project')
    await act(async () => store.getState().navigate('/gallery/dialog'))
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('Gallery / dialog')
  } finally {
    act(() => setup.renderer.destroy())
  }
}, 15000)
for (const theme of ['light', 'dark'] as const)
  test(`${theme} open modal survives resize and keeps close action reachable`, async () => {
    const setup = await render(
      <>
        <Button autoFocus>Before</Button>
        <Dialog>
          <DialogTrigger>Open dialog</DialogTrigger>
          <DialogContent width={48} height={18}>
            <text>Resize dialog</text>
            {Array.from({ length: 20 }, (_, i) => `Detail ${i}`).map((line) => (
              <text key={line}>{line}</text>
            ))}
            <DialogClose>Close long dialog</DialogClose>
          </DialogContent>
        </Dialog>
      </>,
      theme,
      120,
      40,
    )
    try {
      await act(async () => setup.mockInput.pressTab())
      const trigger = setup.renderer.currentFocusedRenderable
      await act(async () => setup.mockInput.pressEnter())
      for (const [width, height] of [
        [80, 24],
        [60, 18],
        [120, 40],
      ] as const) {
        await act(async () => setup.resize(width, height))
        await setup.renderOnce()
        const focused = setup.renderer.currentFocusedRenderable
        expect(focused?.screenX).toBeGreaterThanOrEqual(0)
        expect(focused?.screenY).toBeLessThan(height)
        expect(setup.captureCharFrame()).toContain('Close long dialog')
      }
      await act(async () => setup.mockInput.pressEnter())
      expect(setup.renderer.currentFocusedRenderable).toBe(trigger)
    } finally {
      setup.destroy()
    }
  })
test.each(['left', 'right', 'top', 'bottom'] as const)(
  '%s sheet opens with a reachable close action',
  async (side) => {
    const setup = await render(
      <>
        <Button autoFocus>Before</Button>
        <Sheet>
          <SheetTrigger>Open sheet</SheetTrigger>
          <SheetContent side={side} width={30} height={12}>
            <text>Sheet body</text>
            <SheetClose>Close sheet</SheetClose>
          </SheetContent>
        </Sheet>
      </>,
    )
    try {
      await act(async () => setup.mockInput.pressTab())
      const trigger = setup.renderer.currentFocusedRenderable
      await act(async () => setup.mockInput.pressEnter())
      await setup.renderOnce()
      expect(setup.captureCharFrame()).toContain('Sheet body')
      await act(async () => setup.mockInput.pressEnter())
      expect(setup.renderer.currentFocusedRenderable).toBe(trigger)
    } finally {
      setup.destroy()
    }
  },
)
test('label click delegates to input focus and disabled labels do not', async () => {
  const setup = await render(
    <>
      <Button autoFocus>Before</Button>
      <Label htmlFor="label-target">Name label</Label>
      <Input id="label-target" />
      <Label htmlFor="label-target" disabled>
        Disabled label
      </Label>
    </>,
  )
  try {
    const frame = setup.captureCharFrame().split('\n')
    const y = frame.findIndex((line) => line.includes('Name label'))
    await act(async () => setup.mockMouse.click(3, y))
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('label-target')
  } finally {
    setup.destroy()
  }
})
test('spinner advances on the renderer clock and releases its subscription', async () => {
  const clock = new ManualClock()
  const setup = await testRender(
    <ThemeProvider theme="dark">
      <Spinner label="Loading" />
    </ThemeProvider>,
    { width: 30, height: 5, clock },
  )
  try {
    await setup.renderOnce()
    const first = setup.captureCharFrame()
    await act(async () => clock.advance(150))
    await setup.renderOnce()
    expect(setup.captureCharFrame()).not.toBe(first)
  } finally {
    act(() => setup.renderer.destroy())
  }
  expect(clock.pendingTimerCount).toBe(0)
})

test('textarea edits multiple lines, submits on Ctrl+Enter and restores rejected controlled edits', async () => {
  const changes: string[] = [],
    submissions: string[] = []
  const setup = await render(
    <Textarea
      id="notes"
      autoFocus
      onValueChange={(v) => changes.push(v)}
      onSubmit={(v) => submissions.push(v)}
    />,
  )
  try {
    await act(async () => setup.mockInput.typeText('one'))
    await act(async () => setup.mockInput.pressEnter())
    await act(async () => setup.mockInput.typeText('two'))
    const native = setup.renderer.root.findDescendantById(
      'notes',
    ) as TextareaRenderable
    expect(native.plainText).toBe('one\ntwo')
    expect(changes.at(-1)).toBe('one\ntwo')
    await act(async () => setup.mockInput.pressEnter({ ctrl: true }))
    expect(submissions).toEqual(['one\ntwo'])
  } finally {
    setup.destroy()
  }
  const rejected = await render(
    <Textarea
      id="notes"
      autoFocus
      value="Locked"
      onValueChange={(v) => changes.push(v)}
    />,
  )
  try {
    await act(async () => rejected.mockInput.typeText('x'))
    expect(
      (rejected.renderer.root.findDescendantById('notes') as TextareaRenderable)
        .plainText,
    ).toBe('Locked')
  } finally {
    rejected.destroy()
  }
})
test('switch spacing follows the actual layout gap without a fixed spacer', async () => {
  for (const gap of [undefined, 0, 2]) {
    const setup = await render(
      <StyleReviewProvider
        value={{
          profile: {
            parts: gap === undefined ? {} : { 'switch/Switch': { gap } },
            notes: '',
            reviewed: false,
          },
          observe: () => {},
          forget: () => {},
        }}
      >
        <Switch id="gap-switch" label="Label" />
      </StyleReviewProvider>,
    )
    try {
      await act(async () => setup.renderOnce())
      const control = setup.renderer.root.findDescendantById(
        'gap-switch',
      ) as BoxRenderable
      const [track, label] = control.getChildren()
      expect(control.getChildren()).toHaveLength(2)
      expect(track?.width).toBe(4)
      if (!track || !label) throw new Error('Missing switch track or label')
      expect(label.screenX - (track.screenX + track.width)).toBe(gap ?? 1)
    } finally {
      setup.destroy()
    }
  }
})

test('switch and toggle propose controlled state; disabled controls are skipped', async () => {
  const changes: boolean[] = []
  const setup = await render(
    <>
      <Switch
        label="Switch"
        autoFocus
        checked={false}
        onCheckedChange={(v) => changes.push(v)}
      />
      <Toggle label="Unavailable" disabled />
      <Toggle label="Toggle" onPressedChange={(v) => changes.push(v)} />
    </>,
  )
  try {
    await act(async () => setup.mockInput.pressEnter())
    await act(async () => setup.mockInput.pressEnter())
    expect(changes).toEqual([true, true])
    await act(async () => setup.mockInput.pressTab())
    await act(async () => setup.mockInput.pressKey(' '))
    expect(changes).toEqual([true, true, true])
  } finally {
    setup.destroy()
  }
})
test('switch toggles from its caps, thumb and label while disabled switches ignore clicks', async () => {
  const changes: boolean[] = []
  const setup = await render(
    <>
      <Switch
        id="rounded-switch"
        label="Notifications"
        onCheckedChange={(value) => changes.push(value)}
      />
      <Switch
        id="disabled-rounded-switch"
        label="Disabled"
        disabled
        onCheckedChange={(value) => changes.push(value)}
      />
    </>,
  )
  try {
    const control = setup.renderer.root.findDescendantById(
      'rounded-switch',
    ) as BoxRenderable
    const track = control.getChildren()[0] as BoxRenderable
    expect(track.width).toBe(4)
    expect(track.height).toBe(1)
    for (const offset of [0, 2, 6]) {
      await act(async () =>
        setup.mockMouse.click(control.screenX + offset, control.screenY),
      )
      await act(async () => setup.renderOnce())
    }
    expect(changes).toEqual([true, false, true])
    const disabled = setup.renderer.root.findDescendantById(
      'disabled-rounded-switch',
    ) as BoxRenderable
    await act(async () =>
      setup.mockMouse.click(disabled.screenX, disabled.screenY),
    )
    expect(changes).toEqual([true, false, true])
  } finally {
    setup.destroy()
  }
})

test('multiple toggle group retains independent selections', async () => {
  const changes: string[][] = []
  const setup = await render(
    <>
      <Button autoFocus>Before</Button>
      <ToggleGroup type="multiple" onValueChange={(v) => changes.push(v)}>
        <ToggleGroupItem value="bold" />
        <ToggleGroupItem value="italic" />
      </ToggleGroup>
    </>,
  )
  try {
    await act(async () => setup.mockInput.pressTab())
    await act(async () => setup.mockInput.pressEnter())
    await act(async () => setup.mockInput.pressArrow('right'))
    await act(async () => setup.mockInput.pressEnter())
    expect(changes).toEqual([['bold'], ['bold', 'italic']])
  } finally {
    setup.destroy()
  }
})
test('collapsible content enters and leaves the focus order; accordion headers navigate', async () => {
  const setup = await render(
    <>
      <Button autoFocus>Before</Button>
      <Collapsible>
        <CollapsibleTrigger label="Details" />
        <CollapsibleContent>
          <Button id="inside-disclosure">Inside</Button>
        </CollapsibleContent>
      </Collapsible>
      <Accordion type="single" collapsible>
        <AccordionItem value="one">
          <AccordionTrigger label="One" />
          <AccordionContent>
            <text>First answer</text>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="two">
          <AccordionTrigger label="Two" />
          <AccordionContent>
            <text>Second answer</text>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>,
  )
  try {
    await act(async () => setup.mockInput.pressTab())
    await act(async () => setup.mockInput.pressEnter())
    await act(async () => setup.mockInput.pressTab())
    expect(setup.renderer.currentFocusedRenderable?.id).toBe(
      'inside-disclosure',
    )
    await act(async () => setup.mockInput.pressTab())
    await act(async () => setup.mockInput.pressArrow('down'))
    await act(async () => setup.mockInput.pressEnter())
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('Second answer')
    expect(setup.captureCharFrame()).not.toContain('First answer')
  } finally {
    setup.destroy()
  }
})
test('disclosures place toggles at the right edge and preserve their intended hit areas', async () => {
  const setup = await render(
    <box width={30} gap={2} flexDirection="column">
      <Accordion type="single" collapsible defaultValue="one">
        <AccordionItem value="one">
          <AccordionTrigger label="Section heading" />
          <AccordionContent>
            <text>Accordion answer</text>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Collapsible>
        <CollapsibleTrigger label="Details heading" />
        <CollapsibleContent>
          <text>Collapsible answer</text>
        </CollapsibleContent>
      </Collapsible>
    </box>,
  )
  try {
    let lines = setup.captureCharFrame().split('\n')
    let y = lines.findIndex((line) => line.includes('Section heading'))
    const left = lines[y]?.indexOf('Section heading') ?? -1
    expect(left).toBeGreaterThanOrEqual(0)
    expect(lines[y]?.[left + 29]).toBe('\uf077')
    expect(setup.captureCharFrame()).toContain('Accordion answer')
    await act(async () => setup.mockMouse.click(left + 20, y - 1))
    await act(async () => setup.renderOnce())
    expect(setup.captureCharFrame()).not.toContain('Accordion answer')
    lines = setup.captureCharFrame().split('\n')
    y = lines.findIndex((line) => line.includes('Details heading'))
    expect(lines[y]?.[left + 28]).toBe('\uf078')
    await act(async () => setup.mockMouse.click(left, y))
    await act(async () => setup.renderOnce())
    expect(setup.captureCharFrame()).not.toContain('Collapsible answer')
    await act(async () => setup.mockMouse.click(left + 28, y))
    await act(async () => setup.renderOnce())
    expect(setup.captureCharFrame()).toContain('Collapsible answer')
    expect(setup.renderer.currentFocusedRenderable?.width).toBe(3)
  } finally {
    setup.destroy()
  }
})

test('select opens empty, typeahead focuses labels, skips disabled and commits once', async () => {
  const changes: string[] = []
  const setup = await render(
    <>
      <Button autoFocus>Before</Button>
      <Select onValueChange={(v) => changes.push(v)}>
        <SelectTrigger label="Runtime" />
        <SelectContent>
          <SelectItem value="bun">Bun</SelectItem>
          <SelectItem value="blocked" disabled>
            Blocked
          </SelectItem>
          <SelectItem value="node">Node.js</SelectItem>
        </SelectContent>
      </Select>
      <Button id="after-select">After</Button>
    </>,
  )
  try {
    await act(async () => setup.mockInput.pressTab())
    const trigger = setup.renderer.currentFocusedRenderable
    await act(async () => setup.mockInput.pressEnter())
    expect(setup.renderer.currentFocusedRenderable).not.toBe(trigger)
    await act(async () => setup.mockInput.typeText('n'))
    await act(async () => setup.mockInput.pressEnter())
    expect(changes).toEqual(['node'])
    expect(setup.renderer.currentFocusedRenderable).toBe(trigger)
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('Node.js')
  } finally {
    setup.destroy()
  }
})
test('command filters, navigates enabled results and runs the selected action without losing input focus', async () => {
  const selected: string[] = []
  const setup = await render(
    <Command>
      <CommandInput />
      <CommandList>
        <CommandEmpty />
        <CommandItem
          value="create"
          keywords={['new']}
          onSelect={(v) => selected.push(v)}
        >
          Create project
        </CommandItem>
        <CommandItem value="closed" disabled>
          Closed project
        </CommandItem>
        <CommandItem value="settings" onSelect={(v) => selected.push(v)}>
          Settings
        </CommandItem>
      </CommandList>
    </Command>,
  )
  try {
    const input = setup.renderer.currentFocusedRenderable as InputRenderable
    await act(async () => setup.mockInput.typeText('new'))
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('Create project')
    expect(setup.captureCharFrame()).not.toContain('Settings')
    await act(async () => setup.mockInput.pressEnter())
    expect(selected).toEqual(['create'])
    expect(setup.renderer.currentFocusedRenderable).toBe(input)
    await act(async () => setup.mockInput.typeText('xyz'))
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('No results found.')
    await act(async () => setup.mockInput.pressEnter())
    expect(selected).toHaveLength(1)
  } finally {
    setup.destroy()
  }
})
test('combobox opens search, filters and commits a selection back to its trigger', async () => {
  const selected: string[] = []
  const setup = await render(
    <>
      <Button autoFocus>Before</Button>
      <Combobox
        options={[
          { value: 'bun', label: 'Bun' },
          { value: 'node', label: 'Node.js' },
        ]}
        onValueChange={(v) => selected.push(v)}
      />
    </>,
  )
  try {
    await act(async () => setup.mockInput.pressTab())
    const trigger = setup.renderer.currentFocusedRenderable
    await act(async () => setup.mockInput.pressEnter())
    await act(async () => setup.mockInput.typeText('node'))
    await act(async () => setup.mockInput.pressEnter())
    expect(selected).toEqual(['node'])
    expect(setup.renderer.currentFocusedRenderable).toBe(trigger)
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('Node.js')
  } finally {
    setup.destroy()
  }
})
test('dropdown checkbox/radio items can stay open and normal action closes it', async () => {
  const selected: (boolean | string)[] = []
  const setup = await render(
    <>
      <Button autoFocus>Before</Button>
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent height={18}>
          <DropdownMenuCheckboxItem
            closeOnSelect={false}
            onCheckedChange={(v) => selected.push(v)}
          >
            Status
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup
            defaultValue="one"
            onValueChange={(v) => selected.push(v)}
          >
            <DropdownMenuRadioItem value="one" closeOnSelect={false}>
              One
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="two" closeOnSelect={false}>
              Two
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuItem onSelect={() => selected.push('action')}>
            Action
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>,
  )
  try {
    await act(async () => setup.mockInput.pressTab())
    const trigger = setup.renderer.currentFocusedRenderable
    await act(async () => setup.mockInput.pressEnter())
    await act(async () => setup.mockInput.pressEnter())
    await act(async () => setup.mockInput.pressArrow('down'))
    await act(async () => setup.mockInput.pressArrow('down'))
    await act(async () => setup.mockInput.pressEnter())
    expect(selected).toEqual([true, 'two'])
    await act(async () => setup.mockInput.pressArrow('down'))
    await act(async () => setup.mockInput.pressEnter())
    expect(selected).toEqual([true, 'two', 'action'])
    expect(setup.renderer.currentFocusedRenderable).toBe(trigger)
  } finally {
    setup.destroy()
  }
})
test('nonmodal popover Tab exit continues after the trigger', async () => {
  const setup = await render(
    <>
      <Button autoFocus>Before</Button>
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </Popover>
      <Button id="after-popup">After</Button>
    </>,
  )
  try {
    await act(async () => setup.mockInput.pressTab())
    await act(async () => setup.mockInput.pressEnter())
    await act(async () => setup.mockInput.pressTab())
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('after-popup')
  } finally {
    setup.destroy()
  }
})
test('nested overlay Escape dismisses only the top layer and restores focus at each level', async () => {
  const setup = await render(
    <>
      <Button autoFocus>Before</Button>
      <Dialog>
        <DialogTrigger>Outer</DialogTrigger>
        <DialogContent>
          <text>Outer body</text>
          <Popover>
            <PopoverTrigger>Inner</PopoverTrigger>
            <PopoverContent>
              <text>Inner body</text>
              <PopoverClose>Inner close</PopoverClose>
            </PopoverContent>
          </Popover>
          <DialogClose>Outer close</DialogClose>
        </DialogContent>
      </Dialog>
    </>,
  )
  try {
    await act(async () => setup.mockInput.pressTab())
    const outer = setup.renderer.currentFocusedRenderable
    await act(async () => setup.mockInput.pressEnter())
    const inner = setup.renderer.currentFocusedRenderable
    await act(async () => setup.mockInput.pressEnter())
    await act(async () => setup.mockInput.pressEscape())
    expect(setup.renderer.currentFocusedRenderable).toBe(inner)
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('Outer body')
    expect(setup.captureCharFrame()).not.toContain('Inner body')
    await act(async () => setup.mockInput.pressEscape())
    expect(setup.renderer.currentFocusedRenderable).toBe(outer)
  } finally {
    setup.destroy()
  }
})
test('alert dialog ignores outside clicks, and mouse actions restore focus', async () => {
  let confirmed = 0
  const setup = await render(
    <>
      <Button autoFocus>Before</Button>
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
        <AlertDialogContent>
          <text>Confirm deletion</text>
          <AlertDialogCancel autoFocus>Cancel</AlertDialogCancel>
          <AlertDialogAction onPress={() => confirmed++}>
            Confirm
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>,
  )
  try {
    await act(async () => setup.mockInput.pressTab())
    const trigger = setup.renderer.currentFocusedRenderable
    await act(async () => setup.mockInput.pressEnter())
    await setup.renderOnce()
    await act(async () => setup.mockMouse.click(0, 0))
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('Confirm deletion')
    await act(async () => setup.mockInput.pressTab())
    const action = setup.renderer.currentFocusedRenderable
    if (!action) throw new Error('Missing alert action')
    await setup.renderOnce()
    await act(async () => setup.mockMouse.click(action.screenX, action.screenY))
    expect(confirmed).toBe(1)
    expect(setup.renderer.currentFocusedRenderable).toBe(trigger)
  } finally {
    setup.destroy()
  }
})
test('tooltip timer opens without stealing focus and is cancelled on unmount', async () => {
  const changes: boolean[] = []
  const setup = await render(
    <>
      <Button autoFocus>Before</Button>
      <Tooltip delayDuration={5} onOpenChange={(v) => changes.push(v)}>
        <TooltipTrigger label="Hint">Hover me</TooltipTrigger>
        <TooltipContent>Helpful description</TooltipContent>
      </Tooltip>
      <Button id="after-tooltip">After</Button>
    </>,
  )
  try {
    await act(async () => setup.mockInput.pressTab())
    const trigger = setup.renderer.currentFocusedRenderable
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 15))
    })
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('Helpful description')
    expect(setup.renderer.currentFocusedRenderable).toBe(trigger)
    await act(async () => setup.mockInput.pressTab())
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('after-tooltip')
    await setup.renderOnce()
    expect(setup.captureCharFrame()).not.toContain('Helpful description')
  } finally {
    setup.destroy()
  }
  const count = changes.length
  await new Promise((resolve) => setTimeout(resolve, 15))
  expect(changes).toHaveLength(count)
})
