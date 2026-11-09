// biome-ignore-all lint/correctness/noComponentHookFactories: Test fixtures are created once outside render.
import { expect, test } from 'bun:test'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { InputRenderable, type Renderable } from '@opentui/core'
import { testRender } from '@opentui/react/test-utils'
import { act, useState } from 'react'
import RootLayout from '@/app/layout'
import { Combobox } from '@/components/ui/combobox'
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { emptyProfile, emptyReview } from '@/features/tweak/storage'
import { useStyleReviewStore } from '@/features/tweak/store'
import { TweakPage } from '@/features/tweak/tweak-page'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import {
  type ComponentReview,
  type ComponentStyleProfiles,
  ComponentStylesProvider,
  resolvePartStyle,
  StyleReviewProvider,
  sharedStyleTarget,
} from '@/lib/ui/style-review'
import { ThemeProvider } from '@/lib/ui/theme/provider'
import { RouteContext } from '@/router/context'
import { createNavigationStore } from '@/router/navigation-store'

test('shared fields cascade and a local override only masks its own fields', () => {
  const profiles = {
    input: {
      ...emptyProfile(),
      parts: { 'input/Input': { paddingX: 3, paddingY: 1 } },
    },
  }
  const local = { ...emptyProfile(), parts: { 'input/Input': { paddingX: 5 } } }
  expect(resolvePartStyle(profiles, 'input/Input', local)).toEqual({
    paddingX: 5,
    paddingY: 1,
  })
  expect(resolvePartStyle(profiles, 'input/Input', emptyProfile())).toEqual({
    paddingX: 3,
    paddingY: 1,
  })
  expect(resolvePartStyle(null, 'input/Input')).toEqual({})
})

test('new composition wrappers inherit their existing control proposals', () => {
  const profiles = {
    button: {
      ...emptyProfile(),
      parts: { 'button/Button.default': { paddingX: 3 } },
    },
    label: { ...emptyProfile(), parts: { 'label/Label': { fg: '#abcdef' } } },
    separator: {
      ...emptyProfile(),
      parts: { 'separator/Separator': { marginTop: 2 } },
    },
  }
  for (const part of [
    'input-group/InputGroupButton',
    'pagination/PaginationLink',
    'pagination/PaginationNext',
    'pagination/PaginationPrevious',
    'menubar/MenubarTrigger',
    'code-block/CodeBlockCopyButton',
    'questionnaire/QuestionnairePrevious',
    'questionnaire/QuestionnaireNext',
    'questionnaire/QuestionnaireSkip',
    'questionnaire/QuestionnaireSubmit',
  ]) {
    expect(resolvePartStyle(profiles, part).paddingX).toBe(3)
    expect(sharedStyleTarget(part, 'paddingX')).toEqual({
      owner: 'button',
      part: 'button/Button.default',
    })
  }
  expect(resolvePartStyle(profiles, 'field/FieldLabel').fg).toBe('#abcdef')
  for (const part of [
    'item/ItemSeparator',
    'button-group/ButtonGroupSeparator',
  ]) {
    expect(resolvePartStyle(profiles, part).marginTop).toBe(2)
    expect(sharedStyleTarget(part, 'marginTop')).toEqual({
      owner: 'separator',
      part: 'separator/Separator',
    })
  }
})

test('ordinary application layout does not apply editor style proposals', async () => {
  const document = emptyReview()
  document.components.input = {
    ...emptyProfile(),
    parts: { 'input/Input': { paddingX: 8, width: 25 } },
  }
  useStyleReviewStore.getState().load(document)
  const setup = await testRender(
    <RootLayout>
      <Input id="ordinary-gallery-input" />
    </RootLayout>,
    { width: 80, height: 24 },
  )
  try {
    await setup.renderOnce()
    const input = setup.renderer.root.findDescendantById(
      'ordinary-gallery-input',
    ) as InputRenderable
    expect(input.width).toBe(78)
    expect(input.parent?.width).toBe(80)
  } finally {
    act(() => setup.renderer.destroy())
    useStyleReviewStore.getState().load(emptyReview())
  }
})
test('Input, CommandInput and ComboboxSearch share live preview spacing; outside controls keep their styles', async () => {
  let setProfiles: (profiles: ComponentStyleProfiles) => void = () => {},
    setCombo: (profile: ComponentReview) => void = () => {}
  const observe = () => {},
    forget = () => {}
  function Fixture() {
    const [profiles, replace] = useState<ComponentStyleProfiles>({}),
      [combo, replaceCombo] = useState(emptyProfile())
    setProfiles = replace
    setCombo = replaceCombo
    return (
      <box width="100%" flexDirection="column" gap={1} padding={2}>
        <Input id="ordinary-input" defaultValue="Outside the editor previews" />
        <ComponentStylesProvider profiles={profiles}>
          <StyleReviewProvider
            value={{ profile: emptyProfile(), observe, forget }}
          >
            <Input id="shared-input" />
          </StyleReviewProvider>
          <StyleReviewProvider
            value={{ profile: emptyProfile(), observe, forget }}
          >
            <Command>
              <CommandInput autoFocus={false} placeholder="Command test" />
              <CommandList>
                <CommandItem>Command action</CommandItem>
              </CommandList>
            </Command>
          </StyleReviewProvider>
          <StyleReviewProvider
            value={{ profile: combo, observe, forget, openPopups: true }}
          >
            <Combobox
              options={[{ value: 'bun', label: 'Bun' }]}
              searchPlaceholder="Combo test"
            />
          </StyleReviewProvider>
        </ComponentStylesProvider>
      </box>
    )
  }
  const setup = await testRender(
    <ThemeProvider theme="dark">
      <FocusScope>
        <Fixture />
      </FocusScope>
    </ThemeProvider>,
    { width: 100, height: 40, kittyKeyboard: true },
  )
  function inputs() {
    const found: InputRenderable[] = []
    function visit(node: Renderable) {
      if (node instanceof InputRenderable) found.push(node)
      for (const child of node.getChildren()) visit(child)
    }
    visit(setup.renderer.root)
    return found
  }
  try {
    await setup.renderOnce()
    const rendered = inputs()
    expect(rendered).toHaveLength(4)
    const find = (match: (node: InputRenderable) => boolean) => {
      const node = rendered.find(match)
      if (!node) throw new Error('Missing native input')
      return node
    }
    const nodes = [
      find((node) => node.id === 'ordinary-input'),
      find((node) => node.id === 'shared-input'),
      find((node) => node.placeholder === 'Command test'),
      find((node) => node.placeholder === 'Combo test'),
    ]
    const initial = nodes.map((node) => node.width)
    await act(async () =>
      setProfiles({
        input: { ...emptyProfile(), parts: { 'input/Input': { paddingX: 2 } } },
      }),
    )
    await setup.renderOnce()
    expect(nodes[0]?.width).toBe(initial[0])
    for (let i = 1; i < 4; i++)
      expect(nodes[i]?.width).toBe((initial[i] ?? 0) - 2)
    await act(async () =>
      setCombo({
        ...emptyProfile(),
        parts: { 'input/Input': { paddingX: 4 } },
      }),
    )
    await setup.renderOnce()
    expect(nodes[3]?.width).toBe((initial[3] ?? 0) - 6)
    await act(async () =>
      setProfiles({
        input: { ...emptyProfile(), parts: { 'input/Input': { paddingX: 3 } } },
      }),
    )
    await setup.renderOnce()
    expect(nodes[1]?.width).toBe((initial[1] ?? 0) - 4)
    expect(nodes[2]?.width).toBe((initial[2] ?? 0) - 4)
    expect(nodes[3]?.width).toBe((initial[3] ?? 0) - 6)
    await act(async () => setCombo(emptyProfile()))
    await setup.renderOnce()
    expect(nodes[3]?.width).toBe((initial[3] ?? 0) - 4)
    await act(async () => setProfiles({}))
    await setup.renderOnce()
    expect(nodes.map((node) => node.width)).toEqual(initial)
  } finally {
    act(() => setup.renderer.destroy())
  }
})
test('editing a reused input from Command updates the shared profile and Combobox inherits it in the editor', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'tui-style-inherit-'))
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
    { width: 120, height: 50, kittyKeyboard: true },
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
  async function plusPadding() {
    await act(async () => setup.renderOnce())
    const lines = setup.captureCharFrame().split('\n'),
      y = lines.findIndex((line) => line.includes('paddingX')) + 1,
      x = lines[y]?.indexOf('+') ?? -1
    if (x < 0) throw new Error('Missing padding control')
    await act(async () => setup.mockMouse.click(x, y))
  }
  try {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 40))
    })
    await choose('button', 'command')
    await choose('Command', 'CommandInput')
    expect(setup.captureCharFrame()).toContain('Editing shared input')
    await plusPadding()
    expect(
      useStyleReviewStore.getState().document.components.input?.parts[
        'input/Input'
      ]?.paddingX,
    ).toBe(2)
    expect(
      useStyleReviewStore.getState().document.components.command?.parts[
        'input/Input'
      ],
    ).toBeUndefined()
    await choose('command', 'combobox')
    await choose('ComboboxTrigger', 'ComboboxSearch')
    expect(setup.captureCharFrame()).toContain('Editing shared input')
    await plusPadding()
    expect(
      useStyleReviewStore.getState().document.components.input?.parts[
        'input/Input'
      ]?.paddingX,
    ).toBe(3)
    await click('Override only in combobox')
    await plusPadding()
    expect(
      useStyleReviewStore.getState().document.components.combobox?.parts[
        'input/Input'
      ]?.paddingX,
    ).toBe(4)
    expect(
      useStyleReviewStore.getState().document.components.input?.parts[
        'input/Input'
      ]?.paddingX,
    ).toBe(3)
    await click('Remove local override / inherit shared')
    expect(
      useStyleReviewStore.getState().document.components.combobox?.parts[
        'input/Input'
      ],
    ).toBeUndefined()
  } finally {
    act(() => setup.renderer.destroy())
  }
})
