// biome-ignore-all lint/correctness/noComponentHookFactories: Fixtures are declared once per test, outside render.
import { expect, test } from 'bun:test'
import {
  type BoxRenderable,
  type InputRenderable,
  type Renderable,
  TextareaRenderable,
  TextRenderable,
} from '@opentui/core'
import { testRender } from '@opentui/react/test-utils'
import { act, type ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import { StyleReviewProvider } from '@/lib/ui/style-review'
import { ThemeProvider } from '@/lib/ui/theme/provider'

function all(node: Renderable): Renderable[] {
  return [node, ...node.getChildren().flatMap(all)]
}
async function fixture(
  children: ReactNode,
  theme: 'light' | 'dark' = 'dark',
  width = 70,
) {
  const setup = await testRender(
    <ThemeProvider theme={theme}>
      <FocusScope>
        <box padding={2} flexDirection="column" gap={2}>
          {children}
        </box>
      </FocusScope>
    </ThemeProvider>,
    { width, height: 32, kittyKeyboard: true },
  )
  await act(async () => setup.renderOnce())
  return {
    ...setup,
    node: (id: string) =>
      setup.renderer.root.findDescendantById(id) as BoxRenderable,
    frame: async () => {
      await act(async () => setup.renderOnce())
      return setup.captureCharFrame()
    },
    destroy: () => act(() => setup.renderer.destroy()),
  }
}
for (const theme of ['light', 'dark'] as const) {
  test(`${theme} input group shares the editor ring, places addons and preserves controlled input`, async () => {
    const changes: string[] = []
    const setup = await fixture(
      <InputGroup id="group" width={32}>
        <InputGroupInput
          id="query"
          autoFocus
          value="fixed"
          onValueChange={(v) => changes.push(v)}
        />
        <InputGroupAddon>
          <InputGroupText>Q</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton id="send">Go</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>,
      theme,
    )
    try {
      const group = setup.node('group'),
        input = setup.node('query') as unknown as InputRenderable,
        button = setup.node('send')
      expect(group.width).toBe(32)
      expect(input.screenX).toBeGreaterThan(group.screenX)
      expect(input.screenX + input.width).toBeLessThanOrEqual(button.screenX)
      expect(button.screenX + button.width).toBeLessThanOrEqual(
        group.screenX + group.width,
      )
      expect(await setup.frame()).toContain(`┌${'─'.repeat(32)}┐`)
      await act(async () => setup.mockInput.typeText('x'))
      expect(changes).toHaveLength(1)
      expect(input.value).toBe('fixed')
      await act(async () => setup.mockInput.pressTab())
      expect(setup.renderer.currentFocusedRenderable?.id).toBe('send')
      expect(await setup.frame()).not.toContain(`┌${'─'.repeat(32)}┐`)
      await act(async () => setup.mockMouse.click(group.screenX, group.screenY))
      expect(setup.renderer.currentFocusedRenderable?.id).toBe('query')
    } finally {
      setup.destroy()
    }
  })
}
test('input group textarea places block addons and submits without replacing the native editor', async () => {
  const submitted: string[] = []
  const setup = await fixture(
    <InputGroup id="group" width={32}>
      <InputGroupTextarea
        id="message"
        autoFocus
        defaultValue="Hello"
        height={3}
        onSubmit={(v) => submitted.push(v)}
      />
      <InputGroupAddon align="block-start">
        <InputGroupText>Message</InputGroupText>
      </InputGroupAddon>
      <InputGroupAddon align="block-end">
        <InputGroupButton id="send">Send</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>,
  )
  try {
    const editor = setup.node('message') as unknown as TextareaRenderable,
      group = setup.node('group')
    expect(editor).toBeInstanceOf(TextareaRenderable)
    expect(editor.screenY).toBeGreaterThan(group.screenY)
    expect(setup.node('send').screenY).toBeGreaterThanOrEqual(
      editor.screenY + editor.height,
    )
    expect(await setup.frame()).toContain(`┌${'─'.repeat(32)}┐`)
    await act(async () => setup.mockInput.pressEnter({ ctrl: true }))
    expect(submitted).toEqual(['Hello'])
  } finally {
    setup.destroy()
  }
})
test('disabled input groups skip editors and buttons, and narrow groups keep controls inside bounds', async () => {
  const setup = await fixture(
    <>
      <Button id="before" autoFocus>
        Before
      </Button>
      <InputGroup disabled>
        <InputGroupInput id="disabled" defaultValue="Locked" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton id="disabled-action">Send</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup id="narrow" width={14}>
        <InputGroupInput id="small" />
        <InputGroupAddon>
          <InputGroupText>Prefix</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton id="small-action">Send</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </>,
  )
  try {
    expect(setup.node('disabled').focusable).toBe(false)
    expect(setup.node('disabled-action').focusable).toBe(false)
    await act(async () => setup.mockInput.pressTab())
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('small')
    const group = setup.node('narrow')
    for (const id of ['small', 'small-action']) {
      const node = setup.node(id)
      expect(node.width).toBeGreaterThan(0)
      expect(node.screenX).toBeGreaterThanOrEqual(group.screenX)
      expect(node.screenX + node.width).toBeLessThanOrEqual(
        group.screenX + group.width,
      )
    }
  } finally {
    setup.destroy()
  }
})
test('field labels delegate focus, disabled labels do not, and errors deduplicate', async () => {
  const setup = await fixture(
    <>
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input id="name" />
        <FieldError
          errors={[
            { message: 'Required' },
            { message: 'Required' },
            undefined,
            {},
          ]}
        />
      </Field>
      <Field disabled>
        <FieldLabel htmlFor="other">Disabled label</FieldLabel>
        <Input id="other" />
      </Field>
      <FieldError />
    </>,
  )
  try {
    const texts = all(setup.renderer.root).filter(
      (node): node is TextRenderable => node instanceof TextRenderable,
    )
    const label = texts.find((node) => node.plainText === 'Name'),
      disabled = texts.find((node) => node.plainText === 'Disabled label')
    if (!label || !disabled) throw new Error('Missing field labels')
    await act(async () => setup.mockMouse.click(label.screenX, label.screenY))
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('name')
    await act(async () =>
      setup.mockMouse.click(disabled.screenX, disabled.screenY),
    )
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('name')
    expect((await setup.frame()).match(/Required/g)).toHaveLength(1)
  } finally {
    setup.destroy()
  }
})
test('vertical button groups stretch their separator to the actual group width', async () => {
  const setup = await fixture(
    <ButtonGroup orientation="vertical">
      <Button id="vertical-one">One</Button>
      <ButtonGroupSeparator />
      <Button>Second</Button>
    </ButtonGroup>,
  )
  try {
    const group = setup.node('vertical-one').parent
    if (!group) throw new Error('Missing button group')
    const separator = group.getChildren()[1]
    expect(group.width).toBeGreaterThan(0)
    expect(separator?.width).toBe(group.width)
    expect(await setup.frame()).toContain('─'.repeat(group.width))
  } finally {
    setup.destroy()
  }
})

test('button groups and item actions keep ordinary activation and disabled focus behavior', async () => {
  const changes: string[] = []
  const setup = await fixture(
    <>
      <ButtonGroup>
        <Button id="one" autoFocus onPress={() => changes.push('one')}>
          One
        </Button>
        <ButtonGroupSeparator />
        <Button disabled>Disabled</Button>
      </ButtonGroup>
      <Item>
        <ItemContent>
          <ItemTitle>Project</ItemTitle>
          <ItemDescription>A useful project</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button id="open" onPress={() => changes.push('open')}>
            Open
          </Button>
        </ItemActions>
      </Item>
      <Skeleton height={3} />
    </>,
  )
  try {
    await act(async () => setup.mockInput.pressEnter())
    await act(async () => setup.mockInput.pressTab())
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('open')
    await act(async () => setup.mockInput.pressKey(' '))
    expect(changes).toEqual(['one', 'open'])
    expect(
      all(setup.renderer.root)
        .filter((node) => node.focusable)
        .map((node) => node.id),
    ).toEqual(['one', 'open'])
  } finally {
    setup.destroy()
  }
})
test('pagination keeps page state with the owner and skips disabled boundaries', async () => {
  const requests: number[] = []
  function Fixture() {
    const [page, setPage] = useState(1)
    return (
      <>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                disabled={page === 1}
                onPress={() => setPage(page - 1)}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                id="two"
                autoFocus
                isActive={page === 2}
                onPress={() => requests.push(2)}
              >
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                id="next"
                disabled={page === 2}
                onPress={() => setPage(2)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <text>Current: {page}</text>
      </>
    )
  }
  const setup = await fixture(<Fixture />)
  try {
    await act(async () => setup.mockInput.pressEnter())
    expect(requests).toEqual([2])
    expect(await setup.frame()).toContain('Current: 1')
    await act(async () => setup.mockInput.pressTab())
    expect(setup.renderer.currentFocusedRenderable?.id).toBe('next')
    await act(async () => setup.mockInput.pressEnter())
    expect(await setup.frame()).toContain('Current: 2')
    expect(setup.node('next').focusable).toBe(false)
  } finally {
    setup.destroy()
  }
})
test('tweak changes group padding on the actual composed controls and resets it', async () => {
  let replace: (padding: number) => void = () => {}
  function Fixture() {
    const [padding, setPadding] = useState(0)
    replace = setPadding
    return (
      <StyleReviewProvider
        value={{
          profile: {
            parts: { 'input-group/InputGroup': { paddingX: padding } },
            notes: '',
            reviewed: false,
          },
          observe: () => {},
          forget: () => {},
        }}
      >
        <InputGroup id="group" width={32}>
          <InputGroupInput id="query" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>Hint</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </StyleReviewProvider>
    )
  }
  const setup = await fixture(<Fixture />)
  try {
    const width = setup.node('query').width
    await act(async () => replace(2))
    await setup.frame()
    expect(setup.node('query').width).toBe(width - 4)
    await act(async () => replace(0))
    await setup.frame()
    expect(setup.node('query').width).toBe(width)
  } finally {
    setup.destroy()
  }
})
