// biome-ignore-all lint/correctness/noComponentHookFactories: Test fixtures are declared once per test, outside render.
import { expect, test } from 'bun:test'
import { mkdtemp, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { BoxRenderable } from '@opentui/core'
import { testRender } from '@opentui/react/test-utils'
import { act, useRef, useState } from 'react'
import { TweakPage } from '@/app/tweak/page'
import { styleDemos } from '@/components/shared/component-demos/catalog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  emptyProfile,
  emptyReview,
  parseReview,
  readReview,
  reviewPaths,
  writeReview,
} from '@/features/tweak/api/review.storage'
import {
  matchesPiece,
  PiecePreview,
  piecesFor,
} from '@/features/tweak/components/part-preview'
import { validValue } from '@/features/tweak/schemas/review.schema'
import {
  createStyleReviewStore,
  useStyleReviewStore,
} from '@/features/tweak/stores/review.store'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import {
  type ComponentReview,
  type PartObservation,
  StyleReviewProvider,
} from '@/lib/ui/style-review'
import { ThemeProvider } from '@/lib/ui/theme/provider'
import { RouteContext } from '@/router/context'
import { createNavigationStore } from '@/router/navigation-store'

test('popup sizing proposals preserve auto dimensions and trigger minimums', () => {
  const document = emptyReview()
  const limits = {
    width: 'auto' as const,
    height: 'auto' as const,
    minWidth: 'trigger' as const,
    maxWidth: 32,
    minHeight: 3,
    maxHeight: 16,
  }
  document.components.select = {
    ...emptyProfile(),
    parts: { 'select/SelectContent': limits },
  }
  expect(
    parseReview(JSON.stringify(document)).components.select?.parts,
  ).toEqual({
    'select/SelectContent': limits,
  })
  expect(validValue('minWidth', 'trigger')).toBe(true)
  expect(validValue('maxWidth', 'trigger')).toBe(false)
  expect(validValue('maxHeight', 0)).toBe(false)
})

test('component edits stay independent, preserve notes and support bounded undo/redo', () => {
  const store = createStyleReviewStore()
  store.getState().load(emptyReview())
  store.getState().setField('card', 'card/Card', 'paddingX', 4)
  store.getState().setField('dialog', 'dialog/Content', 'paddingX', 1)
  expect(
    store.getState().document.components.card?.parts['card/Card']?.paddingX,
  ).toBe(4)
  expect(
    store.getState().document.components.dialog?.parts['dialog/Content']
      ?.paddingX,
  ).toBe(1)
  store.getState().undo()
  expect(store.getState().document.components.dialog).toBeUndefined()
  store.getState().redo()
  expect(
    store.getState().document.components.dialog?.parts['dialog/Content']
      ?.paddingX,
  ).toBe(1)
  store.getState().setField('card', 'card/Card', 'paddingX', undefined)
  expect(
    store.getState().document.components.card?.parts['card/Card'],
  ).toBeUndefined()
  expect(() =>
    store.getState().setField('card', 'card/Card', 'gap', -1),
  ).toThrow()
  for (let i = 0; i < 70; i++)
    store.getState().edit('card', (p) => ({ ...p, notes: `Note ${i}` }))
  expect(store.getState().undoStack).toHaveLength(50)
})

for (const demo of styleDemos)
  test(`${demo.name} named subcomponents expose editable targets, including open popup pieces`, async () => {
    for (const piece of piecesFor(demo.name)) {
      const observed = new Set<string>()
      const setup = await testRender(
        <ThemeProvider theme="dark">
          <FocusScope>
            <StyleReviewProvider
              value={{
                profile: emptyProfile(),
                openPopups: piece.popup,
                observe: (_id, parts) => {
                  for (const part of parts) observed.add(part.part)
                },
                forget: () => {},
              }}
            >
              <box width="100%" padding={2} flexDirection="column">
                <PiecePreview
                  name={demo.name}
                  piece={piece}
                  report={() => {}}
                />
              </box>
            </StyleReviewProvider>
          </FocusScope>
        </ThemeProvider>,
        { width: 80, height: 24, kittyKeyboard: true },
      )
      try {
        await setup.renderOnce()
        expect(
          [...observed].some((part) => matchesPiece(part, piece)),
          `${demo.name} / ${piece.name}`,
        ).toBe(true)
      } finally {
        act(() => setup.renderer.destroy())
      }
    }
  })
test('old shared part proposals are preserved once, then checkbox/radio and head/cell edits are independent', () => {
  const old = {
    version: 1,
    units: 'terminal-cells',
    components: {
      'dropdown-menu': {
        ...emptyProfile(),
        parts: { 'dropdown-menu/DropdownMenuItem': { paddingX: 3 } },
      },
      table: { ...emptyProfile(), parts: { 'table/Cell': { paddingX: 2 } } },
      tooltip: {
        ...emptyProfile(),
        parts: { 'tooltip/TooltipContent': { fg: '#abcdef' } },
      },
    },
    baselines: {},
  }
  const upgraded = parseReview(JSON.stringify(old))
  expect(upgraded.components.table?.parts['table/TableHead']?.paddingX).toBe(2)
  expect(upgraded.components.table?.parts['table/TableCell']?.paddingX).toBe(2)
  expect(
    upgraded.components.tooltip?.parts['tooltip/TooltipContent.text']?.fg,
  ).toBe('#abcdef')
  const store = createStyleReviewStore()
  store.getState().load(upgraded)
  store
    .getState()
    .setField(
      'dropdown-menu',
      'dropdown-menu/DropdownMenuCheckboxItem',
      'paddingX',
      5,
    )
  expect(
    store.getState().document.components['dropdown-menu']?.parts[
      'dropdown-menu/DropdownMenuItem'
    ]?.paddingX,
  ).toBe(3)
  expect(
    store.getState().document.components['dropdown-menu']?.parts[
      'dropdown-menu/DropdownMenuRadioItem'
    ]?.paddingX,
  ).toBe(3)
  store
    .getState()
    .setField(
      'dropdown-menu',
      'dropdown-menu/DropdownMenuCheckboxItem',
      'paddingX',
      undefined,
    )
  expect(
    parseReview(JSON.stringify(store.getState().document)).components[
      'dropdown-menu'
    ]?.parts['dropdown-menu/DropdownMenuCheckboxItem'],
  ).toBeUndefined()
})
test('review exports round-trip through disk and reject malformed styles without replacing state', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'tui-style-data-')),
    paths = reviewPaths(directory),
    document = emptyReview()
  document.components.button = {
    parts: {
      'button/Button.default': {
        paddingX: 3,
        backgroundColor: '@secondary',
        width: '100%',
      },
    },
    notes: 'Prefer compact buttons',
    reviewed: true,
  }
  await writeReview(paths.exported, document)
  expect(await readReview(paths.exported)).toEqual(document)
  expect(await readReview(paths.draft)).toBeNull()
  expect(() => parseReview('not json')).toThrow()
  expect(() =>
    parseReview(JSON.stringify({ ...document, version: 2 })),
  ).toThrow()
  for (const style of [
    { gap: -1 },
    { height: 0 },
    { paddingX: 1.5 },
    { fg: 'red' },
    { onPress: 'run' },
    { width: '999%' },
  ])
    expect(() =>
      parseReview(
        JSON.stringify({
          ...document,
          components: {
            button: {
              ...emptyProfile(),
              parts: { 'button/Button.default': style },
            },
          },
        }),
      ),
    ).toThrow()
})
test('preview spacing changes actual controls, restores after reset, and leaves editor controls untouched', async () => {
  let replace: (profile: ComponentReview) => void = () => {}
  const observed = new Map<string, PartObservation>()
  const observe = (_id: string, parts: PartObservation[]) => {
    for (const part of parts) observed.set(part.part, part)
  }
  function Fixture() {
    const [profile, setProfile] = useState(emptyProfile())
    replace = setProfile
    return (
      <box padding={2} gap={2} flexDirection="column">
        <Button id="outside">Editor button</Button>
        <StyleReviewProvider value={{ profile, observe, forget: () => {} }}>
          <Button id="inside">Preview button</Button>
          <Card>
            <text>Card body</text>
          </Card>
        </StyleReviewProvider>
      </box>
    )
  }
  const setup = await testRender(
    <ThemeProvider theme="dark">
      <FocusScope>
        <Fixture />
      </FocusScope>
    </ThemeProvider>,
    { width: 80, height: 24, kittyKeyboard: true },
  )
  const node = (id: string) =>
    setup.renderer.root.findDescendantById(id) as BoxRenderable
  try {
    await setup.renderOnce()
    const width = node('inside').width,
      outside = node('outside').width
    expect(observed.has('button/Button.default')).toBe(true)
    await act(async () =>
      replace({
        parts: { 'button/Button.default': { paddingX: 4, paddingY: 1 } },
        notes: '',
        reviewed: false,
      }),
    )
    await setup.renderOnce()
    expect(node('inside').width).toBe(width + 6)
    expect(node('inside').height).toBe(3)
    expect(node('outside').width).toBe(outside)
    expect(node('outside').height).toBe(1)
    await act(async () => replace(emptyProfile()))
    await setup.renderOnce()
    expect(node('inside').width).toBe(width)
    expect(node('inside').height).toBe(1)
  } finally {
    act(() => setup.renderer.destroy())
  }
})
test.each(['light', 'dark'] as const)(
  '%s every component demo exposes editable parts without changing defaults',
  async (theme) => {
    for (const demo of styleDemos) {
      const observations: PartObservation[] = []
      const setup = await testRender(
        <ThemeProvider theme={theme}>
          <FocusScope>
            <StyleReviewProvider
              value={{
                profile: emptyProfile(),
                observe: (_id, parts) => observations.push(...parts),
                forget: () => {},
              }}
            >
              <box width="100%" padding={2} gap={1} flexDirection="column">
                <demo.render report={() => {}} />
              </box>
            </StyleReviewProvider>
          </FocusScope>
        </ThemeProvider>,
        { width: 80, height: 24, kittyKeyboard: true },
      )
      try {
        await setup.renderOnce()
        expect(observations.length).toBeGreaterThan(0)
        expect(setup.captureCharFrame().trim().length).toBeGreaterThan(0)
      } finally {
        act(() => setup.renderer.destroy())
      }
    }
  },
)
test('popup review discovers content across portals and keeps keyboard dismissal working', async () => {
  const parts = new Set<string>()
  const setup = await testRender(
    <ThemeProvider theme="dark">
      <FocusScope>
        <StyleReviewProvider
          value={{
            profile: {
              ...emptyProfile(),
              parts: { 'dialog/Content': { paddingX: 4 } },
            },
            observe: (_id, observed) => {
              for (const part of observed) parts.add(part.part)
            },
            forget: () => {},
          }}
        >
          <Button autoFocus>Before</Button>
          <Dialog>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent>
              <text>Popup review</text>
              <DialogClose>Close</DialogClose>
            </DialogContent>
          </Dialog>
        </StyleReviewProvider>
      </FocusScope>
    </ThemeProvider>,
    { width: 80, height: 24, kittyKeyboard: true },
  )
  try {
    await setup.renderOnce()
    await act(async () => setup.mockInput.pressTab())
    const trigger = setup.renderer.currentFocusedRenderable
    await act(async () => setup.mockInput.pressEnter())
    await setup.renderOnce()
    expect(parts.has('dialog/Content')).toBe(true)
    expect(setup.captureCharFrame()).toContain('Popup review')
    await act(async () => setup.mockInput.pressEscape())
    expect(setup.renderer.currentFocusedRenderable).toBe(trigger)
  } finally {
    act(() => setup.renderer.destroy())
  }
})
test('style editor can adjust real preview with mouse, undo and export a usable file', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'tui-style-editor-'))
  useStyleReviewStore.setState({
    document: emptyReview(),
    hydrated: false,
    revision: 0,
    undoStack: [],
    redoStack: [],
  })
  const setup = await testRender(
    <RouteContext
      value={{
        pathname: '/tweak',
        params: {},
        store: createNavigationStore('/tweak'),
      }}
    >
      <ThemeProvider theme="dark">
        <FocusScope>
          <TweakPage storageDirectory={directory} />
        </FocusScope>
      </ThemeProvider>
    </RouteContext>,
    { width: 120, height: 40, kittyKeyboard: true },
  )
  async function clickText(label: string, exact = false) {
    await act(async () => setup.renderOnce())
    const lines = setup.captureCharFrame().split('\n'),
      y = lines.findIndex((line) =>
        exact ? line.trim() === label : line.includes(label),
      )
    if (y < 0) throw new Error(`Missing ${label}\n${setup.captureCharFrame()}`)
    const x = lines[y]?.indexOf(label) ?? 0
    await act(async () => setup.mockMouse.click(x, y))
  }
  try {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50))
    })
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('Tweak /')
    expect(setup.captureCharFrame()).toContain('paddingX')
    // The first + in the inspector edits paddingX of the selected default button.
    const frame = setup.captureCharFrame().split('\n'),
      y = frame.findIndex((line) => line.includes('paddingX')) + 1,
      x = frame[y]?.indexOf('+') ?? -1
    expect(x).toBeGreaterThanOrEqual(0)
    await act(async () => setup.mockMouse.click(x, y))
    expect(
      useStyleReviewStore.getState().document.components.button?.parts[
        'button/Button.default'
      ]?.paddingX,
    ).toBe(2)
    await clickText('Undo')
    expect(
      useStyleReviewStore.getState().document.components.button?.parts[
        'button/Button.default'
      ],
    ).toBeUndefined()
    await clickText('Redo')
    await act(async () => {
      await clickText('Export JSON')
      await new Promise((resolve) => setTimeout(resolve, 30))
    })
    const exported = parseReview(
      await readFile(reviewPaths(directory).exported, 'utf8'),
    )
    expect(
      exported.components.button?.parts['button/Button.default']?.paddingX,
    ).toBe(2)
    const editorFocus = setup.renderer.currentFocusedRenderable
    await act(async () => setup.mockInput.pressKey('F6'))
    expect(setup.renderer.currentFocusedRenderable).not.toBe(editorFocus)
    await act(async () => setup.mockInput.pressKey('F6'))
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 550))
    })
    expect(
      (await readReview(reviewPaths(directory).draft))?.components.button
        ?.parts['button/Button.default']?.paddingX,
    ).toBe(2)
    await act(async () => {
      setup.resize(60, 18)
      await setup.renderOnce()
    })
    expect(setup.captureCharFrame()).toContain('Tweak /')
    await clickText('View: split')
    await act(async () => setup.renderOnce())
    expect(setup.captureCharFrame()).toContain('View: editor')
    await act(async () => setup.mockInput.pressKey('F6'))
    await act(async () => setup.renderOnce())
    expect(setup.captureCharFrame()).toContain('View: preview')
    expect(
      useStyleReviewStore.getState().document.components.button?.parts[
        'button/Button.default'
      ]?.paddingX,
    ).toBe(2)
  } finally {
    act(() => setup.renderer.destroy())
  }
})

test('review dialogs stay inside preview, dim only that region, and allow editor focus while open', async () => {
  let replace: (profile: ComponentReview) => void = () => {}
  function Fixture() {
    const viewport = useRef<BoxRenderable>(null),
      [profile, setProfile] = useState(emptyProfile())
    replace = setProfile
    return (
      <box width="100%" height="100%" backgroundColor="#507090">
        <box
          position="absolute"
          left={0}
          top={0}
          width={40}
          height={24}
          padding={1}
          flexDirection="column"
          gap={1}
        >
          <text fg="#f0e0d0">Editor heading</text>
          <Button id="edit-controls" autoFocus>
            Editor control
          </Button>
        </box>
        <box
          ref={viewport}
          position="absolute"
          left={40}
          top={0}
          width={40}
          height={24}
          flexDirection="column"
          gap={1}
        >
          <text fg="#f0e0d0">Preview background</text>
          <StyleReviewProvider
            value={{ profile, viewport, observe: () => {}, forget: () => {} }}
          >
            <Dialog>
              <DialogTrigger>Open review dialog</DialogTrigger>
              <DialogContent width={48} height={12}>
                <text>Review dialog body</text>
                <DialogClose>Close dialog</DialogClose>
              </DialogContent>
            </Dialog>
          </StyleReviewProvider>
        </box>
      </box>
    )
  }
  const setup = await testRender(
    <ThemeProvider theme="dark">
      <FocusScope>
        <Fixture />
      </FocusScope>
    </ThemeProvider>,
    { width: 80, height: 24, kittyKeyboard: true },
  )
  function color(label: string) {
    const span = setup
      .captureSpans()
      .lines.flatMap((line) => line.spans)
      .find((span) => span.text.includes(label))
    if (!span) throw new Error(`Missing ${label}`)
    return span.fg
  }
  try {
    await setup.renderOnce()
    const original = color('Editor heading')
    await act(async () => setup.mockInput.pressTab())
    await act(async () => setup.mockInput.pressEnter())
    await setup.renderOnce()
    expect(color('Editor heading').equals(original)).toBe(true)
    expect(color('Preview background').r).toBeCloseTo(original.r * 0.45, 2)
    const inside = setup.renderer.currentFocusedRenderable
    expect(inside?.screenX).toBeGreaterThanOrEqual(40)
    expect((inside?.screenX ?? 0) + (inside?.width ?? 0)).toBeLessThanOrEqual(
      80,
    )
    const editor = setup.renderer.root.findDescendantById('edit-controls')
    if (!editor) throw new Error('Missing editor control')
    await act(async () => setup.mockMouse.click(editor.screenX, editor.screenY))
    expect(setup.renderer.currentFocusedRenderable).toBe(editor)
    await act(async () =>
      replace({
        ...emptyProfile(),
        parts: { 'dialog/Content': { paddingX: 4, width: 240 } },
      }),
    )
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('Review dialog body')
    expect(color('Editor heading').equals(original)).toBe(true)
    await act(async () => setup.mockInput.pressEscape())
    await setup.renderOnce()
    expect(setup.captureCharFrame()).not.toContain('Review dialog body')
  } finally {
    act(() => setup.renderer.destroy())
  }
})

test('editor keeps Select Popup and Item independent while Trigger edits shared Button layout', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'tui-style-select-'))
  useStyleReviewStore.setState({
    document: emptyReview(),
    hydrated: false,
    revision: 0,
    undoStack: [],
    redoStack: [],
  })
  const setup = await testRender(
    <RouteContext
      value={{
        pathname: '/tweak',
        params: {},
        store: createNavigationStore('/tweak'),
      }}
    >
      <ThemeProvider theme="dark">
        <FocusScope>
          <TweakPage storageDirectory={directory} />
        </FocusScope>
      </ThemeProvider>
    </RouteContext>,
    { width: 120, height: 40, kittyKeyboard: true },
  )
  async function click(label: string) {
    await act(async () => setup.renderOnce())
    const lines = setup.captureCharFrame().split('\n'),
      y = lines.findIndex((line) => line.includes(label))
    if (y < 0) throw new Error(`Missing ${label}\n${setup.captureCharFrame()}`)
    await act(async () =>
      setup.mockMouse.click(lines[y]?.indexOf(label) ?? 0, y),
    )
  }
  async function choose(current: string, next: string) {
    await click(current)
    await act(async () => setup.mockInput.typeText(next))
    await act(async () => setup.mockInput.pressEnter())
    await act(async () => setup.renderOnce())
  }
  async function incrementPadding() {
    await act(async () => setup.renderOnce())
    const lines = setup.captureCharFrame().split('\n'),
      y = lines.findIndex((line) => line.includes('paddingX')) + 1,
      x = lines[y]?.indexOf('+') ?? -1
    if (x < 0)
      throw new Error(`Missing padding control\n${setup.captureCharFrame()}`)
    await act(async () => setup.mockMouse.click(x, y))
  }
  try {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 40))
    })
    await choose('button', 'select')
    await click('SelectTrigger')
    await act(async () => setup.renderOnce())
    expect(setup.captureCharFrame()).toContain('SelectPopup (SelectContent)')
    expect(setup.captureCharFrame()).toContain('SelectItem')
    await act(async () => setup.mockInput.typeText('SelectItem'))
    await act(async () => setup.mockInput.pressEnter())
    await act(async () => setup.renderOnce())
    expect(setup.captureCharFrame()).toContain('Popup stays open')
    expect(setup.captureCharFrame()).toContain('Node.js')
    await incrementPadding()
    expect(
      useStyleReviewStore.getState().document.components.select?.parts[
        'select/SelectItem'
      ]?.paddingX,
    ).toBe(2)
    expect(
      useStyleReviewStore.getState().document.components.select?.parts[
        'select/SelectTrigger'
      ],
    ).toBeUndefined()
    await choose('SelectItem', 'SelectPopup')
    await incrementPadding()
    expect(
      useStyleReviewStore.getState().document.components.select?.parts[
        'select/SelectContent'
      ]?.paddingX,
    ).toBe(2)
    await choose('SelectPopup (SelectContent)', 'SelectTrigger')
    await incrementPadding()
    const parts =
      useStyleReviewStore.getState().document.components.select?.parts
    expect(parts?.['select/SelectTrigger']?.paddingX).toBeUndefined()
    expect(
      useStyleReviewStore.getState().document.components.button?.parts[
        'button/Button.default'
      ]?.paddingX,
    ).toBe(2)
    expect(parts?.['select/SelectContent']?.paddingX).toBe(2)
    expect(parts?.['select/SelectItem']?.paddingX).toBe(2)
  } finally {
    act(() => setup.renderer.destroy())
  }
})
