// biome-ignore-all lint/correctness/noComponentHookFactories: Fixtures are declared once per test.
import { expect, test } from 'bun:test'
import type { BoxRenderable, ScrollBoxRenderable } from '@opentui/core'
import { testRender } from '@opentui/react/test-utils'
import { act, type ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  BarChart,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  LineChart,
} from '@/components/ui/chart'
import { CodeBlock, CodeBlockContent } from '@/components/ui/code-block'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar'
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
} from '@/components/ui/message'
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from '@/components/ui/message-scroller'
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from '@/components/ui/questionnaire'
import {
  chartDomain,
  chartHitIndex,
  chartModel,
  chartRuns,
} from '@/lib/ui/chart-model'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import { ThemeProvider } from '@/lib/ui/theme/provider'

async function fixture(children: ReactNode, width = 70) {
  const s = await testRender(
    <ThemeProvider theme="dark">
      <FocusScope autoFocus>
        <box padding={2} gap={1} flexDirection="column">
          {children}
        </box>
      </FocusScope>
    </ThemeProvider>,
    { width, height: 36, kittyKeyboard: true },
  )
  const frame = async () => {
    for (let i = 0; i < 5; i++) await act(async () => s.renderOnce())
    return s.captureCharFrame()
  }
  await frame()
  return {
    ...s,
    frame,
    node: (id: string) =>
      s.renderer.root.findDescendantById(id) as BoxRenderable,
    destroy: () => act(() => s.renderer.destroy()),
  }
}
test('menubar switches open menus, skips disabled triggers and restores focus', async () => {
  const selected: string[] = []
  const s = await fixture(
    <Menubar>
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem id="new" onSelect={() => selected.push('new')}>
            New
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="disabled">
        <MenubarTrigger disabled>Disabled</MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu value="edit">
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem id="undo" onSelect={() => selected.push('undo')}>
            Undo
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>,
  )
  try {
    await act(async () => s.mockInput.pressArrow('down'))
    await s.frame()
    expect(s.renderer.currentFocusedRenderable?.id).toBe('new')
    await act(async () => s.mockInput.pressArrow('right'))
    await s.frame()
    expect(s.renderer.currentFocusedRenderable?.id).toBe('undo')
    await act(async () => s.mockInput.pressKey('RETURN'))
    await s.frame()
    expect(selected).toEqual(['undo'])
    expect(s.renderer.currentFocusedRenderable?.id).not.toBe('undo')
    expect(s.captureCharFrame()).not.toContain('Undo')
  } finally {
    s.destroy()
  }
})
test('nested menubar opens with Right, closes one level with Left and selects through the bar', async () => {
  const selected: string[] = []
  const s = await fixture(
    <Menubar>
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>Export</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem id="json" onSelect={() => selected.push('json')}>
                JSON
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>,
  )
  try {
    await act(async () => s.mockInput.pressArrow('down'))
    await s.frame()
    await act(async () => s.mockInput.pressArrow('right'))
    await s.frame()
    expect(s.renderer.currentFocusedRenderable?.id).toBe('json')
    await act(async () => s.mockInput.pressArrow('left'))
    await s.frame()
    expect(s.captureCharFrame()).not.toContain('JSON')
    await act(async () => s.mockInput.pressArrow('right'))
    await s.frame()
    await act(async () => s.mockInput.pressKey('RETURN'))
    await s.frame()
    expect(selected).toEqual(['json'])
    expect(s.captureCharFrame()).not.toContain('Export')
  } finally {
    s.destroy()
  }
})
test('Tab exits an open menubar to the next application control', async () => {
  const s = await fixture(
    <>
      <Menubar>
        <MenubarMenu value="file">
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <Button id="after-bar">After</Button>
    </>,
  )
  try {
    await act(async () => s.mockInput.pressArrow('down'))
    await s.frame()
    await act(async () => s.mockInput.pressKey('TAB'))
    await s.frame()
    expect(s.renderer.currentFocusedRenderable?.id).toBe('after-bar')
    expect(s.captureCharFrame()).not.toContain('New')
  } finally {
    s.destroy()
  }
})
test('pointer hover switches an open menubar and one click switches back through the backdrop', async () => {
  const s = await fixture(
    <Menubar>
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem id="file-action">New project</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="edit">
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem id="edit-action">Undo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>,
  )
  try {
    const file = s.renderer.currentFocusedRenderable,
      edit = file?.parent?.getChildren()[1]
    expect(file).toBeDefined()
    expect(edit).toBeDefined()
    if (!file || !edit) return
    await act(async () => s.mockInput.pressArrow('down'))
    await s.frame()
    await act(async () => s.mockMouse.moveTo(edit.screenX + 1, edit.screenY))
    await s.frame()
    expect(s.renderer.currentFocusedRenderable?.id).toBe('edit-action')
    await act(async () => s.mockMouse.click(file.screenX + 1, file.screenY))
    await s.frame()
    expect(s.renderer.currentFocusedRenderable?.id).toBe('file-action')
  } finally {
    s.destroy()
  }
})
test('a second-level submenu closes just its level and selection restores the top trigger', async () => {
  const s = await fixture(
    <Menubar>
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>Export</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarSub>
                <MenubarSubTrigger>Formats</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem id="nested-json">JSON</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>,
  )
  try {
    const top = s.renderer.currentFocusedRenderable
    await act(async () => s.mockInput.pressArrow('down'))
    await s.frame()
    await act(async () => s.mockInput.pressArrow('right'))
    await s.frame()
    await act(async () => s.mockInput.pressArrow('right'))
    await s.frame()
    expect(s.renderer.currentFocusedRenderable?.id).toBe('nested-json')
    await act(async () => s.mockInput.pressKey('ESCAPE'))
    await s.frame()
    expect(s.captureCharFrame()).toContain('Formats')
    expect(s.captureCharFrame()).not.toContain('JSON')
    await act(async () => s.mockInput.pressArrow('right'))
    await s.frame()
    await act(async () => s.mockInput.pressKey('RETURN'))
    await s.frame()
    expect(s.renderer.currentFocusedRenderable).toBe(top)
    expect(s.captureCharFrame()).not.toContain('Export')
  } finally {
    s.destroy()
  }
})
test('questionnaire validates, preserves answers across steps and submits all answers', async () => {
  const submitted: unknown[] = []
  const s = await fixture(
    <Questionnaire
      items={[{ name: 'tool', required: true }, { name: 'notes' }]}
      onSubmit={(v) => submitted.push(v)}
    >
      <QuestionnaireItem name="tool">
        <QuestionnaireTitle>Choose a tool</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="bun">Bun</QuestionnaireChoice>
          <QuestionnaireChoice value="node">Node</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="notes">
        <QuestionnaireTitle>Notes</QuestionnaireTitle>
        <QuestionnaireInput />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>,
  )
  try {
    // Move past the single radio tab stop to Next, leaving the required response empty.
    await act(async () => s.mockInput.pressKey('TAB'))
    await act(async () => s.mockInput.pressKey('RETURN'))
    expect(await s.frame()).toContain('A response is required.')
    await act(async () => s.mockInput.pressKey('TAB', { shift: true }))
    await act(async () => s.mockInput.pressKey('RETURN'))
    await act(async () => s.mockInput.pressKey('TAB'))
    await act(async () => s.mockInput.pressKey('RETURN'))
    expect(await s.frame()).toContain('Notes')
    await act(async () => s.mockInput.typeText('Ready'))
    await act(async () => s.mockInput.pressKey('TAB'))
    await act(async () => s.mockInput.pressKey('RETURN'))
    expect(await s.frame()).toContain('Choose a tool')
    await act(async () => s.mockInput.pressKey('TAB'))
    await act(async () => s.mockInput.pressKey('RETURN'))
    await s.frame()
    await act(async () => s.mockInput.pressKey('TAB'))
    await act(async () => s.mockInput.pressKey('TAB'))
    await act(async () => s.mockInput.pressKey('RETURN'))
    await s.frame()
    expect(submitted).toEqual([
      {
        tool: { choices: ['bun'], text: '' },
        notes: { choices: [], text: 'Ready' },
      },
    ])
  } finally {
    s.destroy()
  }
})
test('controlled questionnaire does not advance when the owner rejects step changes', async () => {
  const proposals: number[] = []
  const s = await fixture(
    <Questionnaire
      items={[{ name: 'one' }, { name: 'two' }]}
      step={0}
      onStepChange={(v) => proposals.push(v)}
    >
      <QuestionnaireItem name="one">
        <QuestionnaireTitle>First question</QuestionnaireTitle>
      </QuestionnaireItem>
      <QuestionnaireItem name="two">
        <QuestionnaireTitle>Second question</QuestionnaireTitle>
      </QuestionnaireItem>
      <QuestionnaireNext />
    </Questionnaire>,
  )
  try {
    await act(async () => s.mockInput.pressKey('RETURN'))
    expect(await s.frame()).toContain('First question')
    expect(proposals).toEqual([1])
  } finally {
    s.destroy()
  }
})
test('multiple-choice questionnaire displays labels and toggles independent values with Space', async () => {
  const submitted: unknown[] = []
  const s = await fixture(
    <Questionnaire
      items={[{ name: 'tools', multiple: true, required: true }]}
      onSubmit={(v) => submitted.push(v)}
    >
      <QuestionnaireItem name="tools">
        <QuestionnaireChoices>
          <QuestionnaireChoice value="bun">Bun runtime</QuestionnaireChoice>
          <QuestionnaireChoice value="ts">
            TypeScript language
          </QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireSubmit />
    </Questionnaire>,
  )
  try {
    expect(s.captureCharFrame()).toContain('Bun runtime')
    expect(s.captureCharFrame()).toContain('TypeScript language')
    await act(async () => s.mockInput.pressKey(' '))
    await act(async () => s.mockInput.pressKey('TAB'))
    await act(async () => s.mockInput.pressKey(' '))
    await act(async () => s.mockInput.pressKey('TAB'))
    await act(async () => s.mockInput.pressKey('RETURN'))
    expect(submitted).toEqual([{ tools: { choices: ['bun', 'ts'], text: '' } }])
  } finally {
    s.destroy()
  }
})
test('message avatar aligns above a wrapped footer', async () => {
  const s = await fixture(
    <Message>
      <MessageAvatar>
        <text id="message-avatar">AI</text>
      </MessageAvatar>
      <MessageContent>
        <text id="message-body">Response</text>
        <MessageFooter>
          <text>Long footer action</text>
          <text>Another footer action</text>
        </MessageFooter>
      </MessageContent>
    </Message>,
    32,
  )
  try {
    const avatar = s.node('message-avatar'),
      body = s.node('message-body')
    expect(avatar.screenY + avatar.height).toBe(body.screenY + body.height)
  } finally {
    s.destroy()
  }
})
test('code block renders highlighted numbered lines and updates streamed content without crashing', async () => {
  let update: (v: string) => void = () => {}
  function Demo() {
    const [code, setCode] = useState('const count = 1\nconsole.log(count)')
    update = setCode
    return (
      <CodeBlock>
        <CodeBlockContent
          language="typescript"
          lineNumbers
          startLine={8}
          highlightedLines={[9]}
          wrap
        >
          {code}
        </CodeBlockContent>
      </CodeBlock>
    )
  }
  const s = await fixture(<Demo />, 32)
  try {
    expect(s.captureCharFrame()).toContain('const count')
    expect(s.captureCharFrame()).toContain('8')
    await act(async () =>
      update('const count = 2\nconsole.log(count)\n// complete'),
    )
    expect(await s.frame()).toContain('complete')
  } finally {
    s.destroy()
  }
})
test('message scroller follows append, pauses while reading, anchors prepend and resumes explicitly', async () => {
  let append: () => void = () => {},
    prepend: () => void = () => {},
    jump: () => void = () => {},
    goto: (id: string) => boolean = () => false
  function Controls() {
    const s = useMessageScroller()
    jump = s.scrollToBottom
    goto = s.scrollToMessage
    return <MessageScrollerButton />
  }
  function Demo() {
    const [ids, setIds] = useState(Array.from({ length: 20 }, (_, i) => i))
    append = () => setIds((v) => [...v, (v.at(-1) ?? 0) + 1])
    prepend = () => setIds((v) => [-2, -1, ...v])
    return (
      <MessageScrollerProvider>
        <MessageScroller height={9}>
          <MessageScrollerViewport id="history">
            <MessageScrollerContent>
              {ids.map((id) => (
                <MessageScrollerItem key={id} id={`msg-${id}`}>
                  <text>{`Message ${id}`}</text>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <Controls />
        </MessageScroller>
      </MessageScrollerProvider>
    )
  }
  const s = await fixture(<Demo />),
    v = s.node('history') as ScrollBoxRenderable
  try {
    expect(v.scrollTop).toBeGreaterThan(0)
    expect(
      v.scrollHeight - v.viewport.height - v.scrollTop,
    ).toBeLessThanOrEqual(1)
    await act(async () => append())
    await s.frame()
    expect(
      v.scrollHeight - v.viewport.height - v.scrollTop,
    ).toBeLessThanOrEqual(1)
    await act(async () => v.scrollTo(8))
    await s.frame()
    const before = v.scrollTop
    await act(async () => append())
    await s.frame()
    expect(v.scrollTop).toBe(before)
    const visible = s
      .captureCharFrame()
      .split('\n')
      .find((l) => l.includes('Message '))
    await act(async () => prepend())
    await s.frame()
    expect(v.scrollTop).toBe(before + 4)
    expect(
      s
        .captureCharFrame()
        .split('\n')
        .find((l) => l.includes('Message ')),
    ).toBe(visible)
    await act(async () => jump())
    await s.frame()
    expect(
      v.scrollHeight - v.viewport.height - v.scrollTop,
    ).toBeLessThanOrEqual(1)
    await act(async () => {
      expect(goto('unknown')).toBe(false)
      expect(goto('msg-3')).toBe(true)
    })
    await s.frame()
    expect(s.captureCharFrame()).toContain('Message 3')
  } finally {
    s.destroy()
  }
})
test('code block exposes keyboard scrolling on both axes', async () => {
  const s = await fixture(
    <CodeBlock>
      <CodeBlockContent id="long-code" height={5}>
        {Array.from(
          { length: 20 },
          (_, i) => `${i} ${'long content '.repeat(10)}`,
        ).join('\n')}
      </CodeBlockContent>
    </CodeBlock>,
    32,
  )
  try {
    const v = s.node('long-code') as ScrollBoxRenderable
    expect(v.scrollWidth).toBeGreaterThan(v.viewport.width)
    await act(async () => s.mockInput.pressArrow('right'))
    await act(async () => s.mockInput.pressArrow('down'))
    await s.frame()
    expect(v.scrollLeft).toBeGreaterThan(0)
    expect(v.scrollTop).toBeGreaterThan(0)
  } finally {
    s.destroy()
  }
})
test('chart domains keep negative stacks separate and ignore invalid values', () => {
  expect(
    chartDomain(
      [
        { a: 5, b: 7 },
        { a: -2, b: -4 },
        { a: Number.NaN, b: null },
      ],
      ['a', 'b'],
      true,
    ),
  ).toEqual([-6, 12])
  expect(chartDomain([], ['a'])).toEqual([0, 1])
})
test('chart hit testing uses plot coordinates and coalesced runs preserve every cell', () => {
  const o = {
    data: [
      { x: 'A', a: 2 },
      { x: 'B', a: 3 },
      { x: 'C', a: 1 },
    ],
    indexKey: 'x',
    keys: ['a'],
    width: 30,
    height: 8,
    kind: 'bar' as const,
  }
  expect(chartHitIndex(o, 12, 2)).toBe(1)
  expect(chartHitIndex(o, 29, 2)).toBe(2)
  for (const row of chartModel(o)) {
    const runs = chartRuns(row)
    expect(runs.map((r) => r.char).join('')).toBe(
      row.map((c) => c.char).join(''),
    )
    expect(runs.length).toBeLessThanOrEqual(row.length)
  }
})
for (const kind of ['bar', 'line'] as const)
  for (const width of [1, 8, 30])
    test(`${kind} cell renderer stays bounded at width ${width}`, () => {
      const model = chartModel({
        data: [
          { x: 'A', a: -4, b: 3 },
          { x: 'B', a: 6, b: 8 },
          { x: 'C', a: null, b: 5 },
        ],
        indexKey: 'x',
        keys: ['a', 'b'],
        width,
        height: 7,
        kind,
        stacked: true,
        dots: true,
        grid: true,
      })
      expect(model).toHaveLength(7)
      expect(model.every((row) => row.length === width)).toBe(true)
    })
test('chart keyboard inspection updates tooltip and handles empty data', async () => {
  const s = await fixture(
    <>
      <ChartContainer config={{ value: { label: 'Requests' } }} height={6}>
        <LineChart
          data={[
            { day: 'Mon', value: 2 },
            { day: 'Tue', value: 8 },
          ]}
          indexKey="day"
        />
        <ChartLegend />
        <ChartTooltip />
      </ChartContainer>
      <ChartContainer config={{ value: {} }} height={4}>
        <BarChart data={[]} indexKey="day" />
        <ChartTooltip />
      </ChartContainer>
    </>,
  )
  try {
    expect(s.captureCharFrame()).toContain('Requests: 2')
    await act(async () => s.mockInput.pressArrow('right'))
    expect(await s.frame()).toContain('Requests: 8')
    expect(s.captureCharFrame()).toContain('No data')
  } finally {
    s.destroy()
  }
})
