// biome-ignore-all lint/correctness/noComponentHookFactories: Fixtures are created once per test outside render.
import { expect, test } from 'bun:test'
import { BoxRenderable, type Renderable, RGBA } from '@opentui/core'
import { testRender } from '@opentui/react/test-utils'
import { act, useState } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectTrigger } from '@/components/ui/select'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import { Toggle } from '@/components/ui/toggle'
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip'
import { emptyProfile } from '@/features/tweak/storage'
import { createStyleReviewStore } from '@/features/tweak/store'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import {
  type ComponentStyleProfiles,
  ComponentStylesProvider,
  resolvePartStyle,
  StyleReviewProvider,
  sharedStyleTarget,
} from '@/lib/ui/style-review'
import { themes } from '@/lib/ui/styles'
import { ThemeProvider } from '@/lib/ui/theme/provider'

test('accordion preview height follows inherited vertical padding instead of its padded default height', async () => {
  let updatePadding = (_value: number) => {}
  function Fixture() {
    const [paddingY, setPaddingY] = useState(0)
    updatePadding = setPaddingY
    return (
      <ThemeProvider theme="dark">
        <ComponentStylesProvider
          profiles={{
            button: {
              ...emptyProfile(),
              parts: { 'button/Button.default': { paddingY } },
            },
          }}
        >
          <FocusScope>
            <box width={30}>
              <Accordion type="single">
                <AccordionItem value="one">
                  <AccordionTrigger label="Heading" />
                </AccordionItem>
              </Accordion>
            </box>
          </FocusScope>
        </ComponentStylesProvider>
      </ThemeProvider>
    )
  }
  const setup = await testRender(<Fixture />, { width: 40, height: 16 })
  function find(node: Renderable): BoxRenderable | undefined {
    if (node instanceof BoxRenderable && node.focusable) return node
    for (const child of node.getChildren()) {
      const match = find(child)
      if (match) return match
    }
  }
  try {
    for (const padding of [0, 2, 0]) {
      await act(async () => updatePadding(padding))
      await act(async () => setup.renderOnce())
      expect(find(setup.renderer.root)?.height).toBe(1 + 2 * padding)
    }
  } finally {
    act(() => setup.renderer.destroy())
  }
})

test('button geometry has one shared target while variants and list items retain their own colors/layout', () => {
  expect(
    sharedStyleTarget('button/Button.secondary.text', 'marginLeft'),
  ).toEqual({ owner: 'button', part: 'button/Button.default.text' })
  expect(sharedStyleTarget('select/SelectValue', 'marginLeft')).toEqual({
    owner: 'button',
    part: 'button/Button.default.text',
  })
  for (const part of [
    'button/Button.default',
    'button/Button.secondary',
    'button/Button.ghost',
    'select/SelectTrigger',
    'dialog/Close',
    'popover/Trigger',
  ])
    expect(sharedStyleTarget(part, 'paddingX')).toEqual({
      owner: 'button',
      part: 'button/Button.default',
    })
  expect(
    sharedStyleTarget('button/Button.secondary', 'backgroundColor'),
  ).toEqual({ owner: 'button', part: 'button/Button.secondary' })
  expect(sharedStyleTarget('select/SelectItem', 'paddingX')).toEqual({
    owner: 'select',
    part: 'select/SelectItem',
  })
  const profiles = {
    button: {
      ...emptyProfile(),
      parts: {
        'button/Button.default': { paddingX: 1 },
        'button/Button.secondary': { paddingX: 7, backgroundColor: '#123456' },
      },
    },
  }
  expect(resolvePartStyle(profiles, 'button/Button.secondary')).toEqual({
    paddingX: 1,
    backgroundColor: '#123456',
  })
  expect(resolvePartStyle(profiles, 'dialog/Close')).toEqual({
    paddingX: 1,
  })
})
test('an explicit local button override still takes priority over shared geometry', () => {
  const profiles = {
    button: {
      ...emptyProfile(),
      parts: { 'button/Button.default': { paddingX: 1 } },
    },
  }
  const local = {
    ...emptyProfile(),
    parts: { 'button/Button.secondary': { paddingX: 9 } },
  }
  expect(
    resolvePartStyle(profiles, 'button/Button.secondary', local).paddingX,
  ).toBe(9)
})
test('resetting shared button layout and variant color is one undoable edit', () => {
  const store = createStyleReviewStore()
  store.getState().setField('button', 'button/Button.default', 'paddingX', 1)
  store
    .getState()
    .setField('button', 'button/Button.secondary', 'backgroundColor', '#123456')
  store.getState().resetFields([
    { owner: 'button', part: 'button/Button.default', field: 'paddingX' },
    {
      owner: 'button',
      part: 'button/Button.secondary',
      field: 'backgroundColor',
    },
  ])
  expect(store.getState().document.components.button?.parts).toEqual({})
  store.getState().undo()
  expect(
    store.getState().document.components.button?.parts['button/Button.default']
      ?.paddingX,
  ).toBe(1)
  expect(
    store.getState().document.components.button?.parts[
      'button/Button.secondary'
    ]?.backgroundColor,
  ).toBe('#123456')
})
test.each(['light', 'dark'] as const)(
  '%s preview buttons and triggers use the same layout, preserve colors, and leave ordinary controls unchanged',
  async (theme) => {
    let update: (profiles: ComponentStyleProfiles) => void = () => {}
    function Fixture() {
      const [profiles, setProfiles] = useState<ComponentStyleProfiles>({
        button: {
          ...emptyProfile(),
          parts: {
            'button/Button.default': {
              paddingX: 1,
              paddingLeft: 1,
              paddingRight: 1,
              paddingY: 0,
            },
          },
        },
      })
      update = setProfiles
      return (
        <box padding={2} gap={2} flexDirection="column">
          <Button id="outside">Action</Button>
          <ComponentStylesProvider profiles={profiles}>
            <StyleReviewProvider
              value={{
                profile: emptyProfile(),
                observe: () => {},
                forget: () => {},
              }}
            >
              {(
                [
                  'default',
                  'secondary',
                  'ghost',
                  'destructive',
                  'link',
                ] as const
              ).map((variant) => (
                <Button key={variant} id={variant} variant={variant}>
                  Action
                </Button>
              ))}
              <Button id="disabled" disabled>
                Action
              </Button>
              <Dialog>
                <DialogTrigger>Action</DialogTrigger>
              </Dialog>
              <AlertDialog>
                <AlertDialogTrigger>Action</AlertDialogTrigger>
              </AlertDialog>
              <Sheet>
                <SheetTrigger>Action</SheetTrigger>
              </Sheet>
              <Popover>
                <PopoverTrigger>Action</PopoverTrigger>
              </Popover>
              <DropdownMenu>
                <DropdownMenuTrigger>Action</DropdownMenuTrigger>
              </DropdownMenu>
              <Select>
                <SelectTrigger>Action</SelectTrigger>
              </Select>
              <Tooltip>
                <TooltipTrigger label="Action">Action</TooltipTrigger>
              </Tooltip>
              <Toggle label="Action" />
            </StyleReviewProvider>
          </ComponentStylesProvider>
        </box>
      )
    }
    const setup = await testRender(
      <ThemeProvider theme={theme}>
        <FocusScope>
          <Fixture />
        </FocusScope>
      </ThemeProvider>,
      { width: 80, height: 120, kittyKeyboard: true },
    )
    function boxes() {
      const found: BoxRenderable[] = []
      function visit(node: Renderable) {
        if (
          node instanceof BoxRenderable &&
          node.focusable &&
          node.id !== 'outside'
        )
          found.push(node)
        for (const child of node.getChildren()) visit(child)
      }
      visit(setup.renderer.root)
      return found
    }
    const node = (id: string) =>
      setup.renderer.root.findDescendantById(id) as BoxRenderable
    try {
      await setup.renderOnce()
      const buttons = boxes()
      expect(buttons.length).toBeGreaterThan(10)
      for (const button of buttons) {
        expect(button.width).toBe(8)
        expect(button.height).toBe(1)
      }
      expect(node('disabled').width).toBe(8)
      expect(node('outside').width).toBe(8)
      await act(async () =>
        update({
          button: {
            ...emptyProfile(),
            parts: {
              'button/Button.default': {
                paddingX: 3,
                paddingY: 1,
                backgroundColor: '#123456',
              },
            },
          },
        }),
      )
      await setup.renderOnce()
      for (const button of buttons) {
        expect(button.width).toBe(12)
        expect(button.height).toBe(3)
      }
      expect(node('disabled').height).toBe(3)
      expect(node('outside').height).toBe(1)
      expect(node('outside').width).toBe(8)
      expect(
        node('default').backgroundColor.equals(RGBA.fromHex('#123456')),
      ).toBe(true)
      expect(
        node('secondary').backgroundColor.equals(
          RGBA.fromHex(themes[theme].secondary),
        ),
      ).toBe(true)
      await act(async () => update({}))
      await setup.renderOnce()
      for (const button of buttons) {
        expect(button.width).toBe(8)
        expect(button.height).toBe(1)
      }
    } finally {
      act(() => setup.renderer.destroy())
    }
  },
)
