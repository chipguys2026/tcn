import { useState } from 'react'
import type { DemoProps } from '@/components/shared/component-demos/catalog'
import { Button } from '@/components/ui/button'
import {
  BarChart,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  LineChart,
} from '@/components/ui/chart'
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from '@/components/ui/code-block'
import { Marker, MarkerContent, MarkerIcon } from '@/components/ui/marker'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
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
  MessageGroup,
  MessageHeader,
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
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from '@/components/ui/questionnaire'
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from '@/components/ui/trace'

export function MenubarDemo({ report }: DemoProps) {
  return (
    <Menubar>
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>Project</MenubarLabel>
            <MenubarItem onSelect={() => report('New project')}>
              <box flexDirection="row" gap={2}>
                <text>New project</text>
                <MenubarShortcut>Ctrl+N</MenubarShortcut>
              </box>
            </MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger>Export</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem onSelect={() => report('Export JSON')}>
                  JSON
                </MenubarItem>
                <MenubarItem onSelect={() => report('Export text')}>
                  Text
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarItem disabled>Unavailable</MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarCheckboxItem defaultChecked closeOnSelect={false}>
            Show status
          </MenubarCheckboxItem>
          <MenubarRadioGroup defaultValue="dark">
            <MenubarRadioItem value="dark" closeOnSelect={false}>
              Dark
            </MenubarRadioItem>
            <MenubarRadioItem value="light" closeOnSelect={false}>
              Light
            </MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="edit">
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onSelect={() => report('Undo')}>Undo</MenubarItem>
          <MenubarItem onSelect={() => report('Redo')}>Redo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="disabled">
        <MenubarTrigger disabled>Disabled</MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  )
}
export function QuestionnaireDemo({ report }: DemoProps) {
  return (
    <Questionnaire
      items={[
        { name: 'tools', required: true, multiple: true },
        { name: 'notes' },
      ]}
      onSubmit={(v) => report(JSON.stringify(v))}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem name="tools">
        <QuestionnaireTitle>Which tools do you use?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Select several options, or enter your own.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="bun">Bun</QuestionnaireChoice>
          <QuestionnaireChoice value="typescript">
            TypeScript
          </QuestionnaireChoice>
          <QuestionnaireChoice value="unavailable" disabled>
            Unavailable
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireInput placeholder="Other tools" />
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="notes">
        <QuestionnaireTitle>Anything else?</QuestionnaireTitle>
        <QuestionnaireInput />
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
}
const source = 'const greeting = "Hello, terminal"\nconsole.log(greeting)'
export function CodeBlockDemo({ report }: DemoProps) {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>hello.ts</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton
            value={source}
            onCopy={() => report('Copied through terminal clipboard')}
            onCopyError={(e) => report(e.message)}
          />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent
        language="typescript"
        lineNumbers
        highlightedLines={[2]}
      >
        {source}
      </CodeBlockContent>
      <CodeBlockContent>
        <CodeBlockLine variant="removed">const count = 1</CodeBlockLine>
        <CodeBlockLine variant="added" highlighted>
          const count = 2
        </CodeBlockLine>
      </CodeBlockContent>
      <CodeBlockFooter>
        <text>TypeScript · OSC 52 clipboard</text>
      </CodeBlockFooter>
    </CodeBlock>
  )
}
export function MessageDemo({ report }: DemoProps) {
  return (
    <MessageGroup>
      <Message>
        <MessageAvatar>
          <text>AI</text>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>
            <text>Assistant</text>
          </MessageHeader>
          <text>Your terminal components are ready.</text>
          <MessageFooter>
            <Button variant="ghost" onPress={() => report('Helpful')}>
              Helpful
            </Button>
            <text>Just now</text>
          </MessageFooter>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageAvatar>
          <text>Me</text>
        </MessageAvatar>
        <MessageContent>
          <text>Show me the next step.</text>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}
function ScrollerControls() {
  const s = useMessageScroller()
  return (
    <Button variant="ghost" onPress={() => s.scrollToMessage('message-3')}>
      Jump to message 3
    </Button>
  )
}
export function MessageScrollerDemo() {
  const [ids, setIds] = useState(() =>
    Array.from({ length: 12 }, (_, i) => i + 1),
  )
  return (
    <MessageScrollerProvider>
      <box flexDirection="row" gap={1}>
        <Button
          variant="secondary"
          onPress={() =>
            setIds((v) => [(v[0] ?? 1) - 2, (v[0] ?? 1) - 1, ...v])
          }
        >
          Load older
        </Button>
        <Button onPress={() => setIds((v) => [...v, (v.at(-1) ?? 0) + 1])}>
          Append
        </Button>
        <ScrollerControls />
      </box>
      <MessageScroller height={10}>
        <MessageScrollerViewport>
          <MessageScrollerContent>
            {ids.map((id) => (
              <MessageScrollerItem key={id} id={`message-${id}`}>
                <Message>
                  <MessageContent>
                    <text>{`Message ${id}: conversation content`}</text>
                  </MessageContent>
                </Message>
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}
export function MarkerDemo() {
  return (
    <>
      <Marker>
        <MarkerIcon>
          <text>✓</text>
        </MarkerIcon>
        <MarkerContent>Connected to workspace</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerContent>Session started</MarkerContent>
      </Marker>
    </>
  )
}
export function TraceDemo() {
  return (
    <Trace>
      <TraceLine status="complete">
        <TraceIcon>
          <text>✓</text>
        </TraceIcon>
        <TraceTitle>Read project files</TraceTitle>
      </TraceLine>
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>Inspect result</TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <TraceDescription>
            Reuses Collapsible and Code Block.
          </TraceDescription>
          <CodeBlock>
            <CodeBlockContent language="json">
              {'{ "files": 8, "status": "ready" }'}
            </CodeBlockContent>
          </CodeBlock>
          <Trace>
            <TraceLine status="running">
              <TraceIcon>
                <text>◌</text>
              </TraceIcon>
              <TraceTitle>Building components</TraceTitle>
            </TraceLine>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <TraceLine status="pending">
        <TraceTitle>Waiting for review</TraceTitle>
      </TraceLine>
      <TraceLine status="error">
        <TraceTitle>Example error state</TraceTitle>
      </TraceLine>
    </Trace>
  )
}
const data = [
    { month: 'Jan', desktop: 120, mobile: 80 },
    { month: 'Feb', desktop: 180, mobile: 100 },
    { month: 'Mar', desktop: 150, mobile: 130 },
    { month: 'Apr', desktop: 240, mobile: 170 },
  ],
  config = { desktop: { label: 'Desktop' }, mobile: { label: 'Mobile' } }
export function ChartDemo() {
  return (
    <>
      <ChartContainer config={config} height={8}>
        <BarChart data={data} indexKey="month" label="Monthly usage bars" />
        <ChartLegend />
        <ChartTooltip />
      </ChartContainer>
      <ChartContainer config={config} height={8}>
        <LineChart data={data} indexKey="month" label="Monthly usage lines" />
        <ChartLegend />
        <ChartTooltip />
      </ChartContainer>
      <ChartContainer config={config} height={8}>
        <BarChart
          data={data}
          indexKey="month"
          layout="horizontal"
          stacked
          label="Stacked usage"
        />
      </ChartContainer>
    </>
  )
}
export const contentToolDemos = [
  {
    name: 'menubar',
    hint: 'Left/Right switch menus. Down opens; nested menus use Right/Left. Shortcuts are hints, app owns bindings.',
    render: MenubarDemo,
  },
  {
    name: 'questionnaire',
    hint: 'Controlled answers, required validation and step navigation. Primitives reuse Checkbox, RadioGroup, Input and Button.',
    render: QuestionnaireDemo,
  },
  {
    name: 'code-block',
    hint: 'Native syntax highlighting, line numbers, diff lines, scroll and terminal clipboard.',
    render: CodeBlockDemo,
  },
  {
    name: 'message',
    hint: 'Composable messages with app-owned avatars and content, start/end alignment and action slots.',
    render: MessageDemo,
  },
  {
    name: 'message-scroller',
    hint: 'Scroll up to pause following. Load older preserves your place; append follows only at the bottom.',
    render: MessageScrollerDemo,
  },
  {
    name: 'marker',
    hint: 'Inline system note, labeled separator and border row.',
    render: MarkerDemo,
  },
  {
    name: 'trace',
    hint: 'Nested execution steps and collapsible details reuse existing primitives.',
    render: TraceDemo,
  },
  {
    name: 'chart',
    hint: 'Bar and Line only. Tab to focus, then arrows/Home/End inspect values; pointer updates tooltip.',
    render: ChartDemo,
  },
]
