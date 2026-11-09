import { expect, test } from 'bun:test'
import {
  type BoxRenderable,
  type Renderable,
  TextRenderable,
} from '@opentui/core'
import { testRender } from '@opentui/react/test-utils'
import { act } from 'react'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import { icons } from '@/lib/ui/icons'
import { ThemeProvider } from '@/lib/ui/theme/provider'

function all(node: Renderable): Renderable[] {
  return [node, ...node.getChildren().flatMap(all)]
}
for (const theme of ['light', 'dark'] as const) {
  for (const width of [70, 24, 12]) {
    test(`${theme} Item at ${width} columns keeps media with its title and wraps actions below content`, async () => {
      let opened = 0
      const setup = await testRender(
        <ThemeProvider theme={theme}>
          <FocusScope>
            <box padding={2}>
              <Item>
                <ItemMedia variant="icon">
                  <text>{icons.folder}</text>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Project</ItemTitle>
                  <ItemDescription>
                    A terminal application with reusable components.
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button id="open" onPress={() => opened++}>
                    Open
                  </Button>
                </ItemActions>
              </Item>
            </box>
          </FocusScope>
        </ThemeProvider>,
        { width, height: 40, kittyKeyboard: true },
      )
      try {
        await act(async () => setup.renderOnce())
        const texts = all(setup.renderer.root).filter(
          (node): node is TextRenderable => node instanceof TextRenderable,
        )
        const title = texts.find((node) => node.plainText === 'Project'),
          description = texts.find((node) =>
            node.plainText.startsWith('A terminal'),
          ),
          icon = texts.find((node) => node.plainText === icons.folder)
        const action = setup.renderer.root.findDescendantById(
          'open',
        ) as BoxRenderable
        if (!title || !description || !icon)
          throw new Error('Missing Item parts')
        expect(icon.screenY).toBe(title.screenY)
        expect(title.screenX).toBe(icon.screenX + 3)
        expect(description.screenX).toBe(title.screenX)
        expect(description.screenY).toBe(title.screenY + title.height)
        if (width === 70) {
          expect(action.screenY).toBe(title.screenY)
          expect(action.screenX).toBeGreaterThan(title.screenX + title.width)
        } else {
          expect(action.screenY).toBeGreaterThanOrEqual(
            description.screenY + description.height,
          )
        }
        expect(action.screenX + action.width).toBe(width - 3)
        for (const node of [title, description, icon, action]) {
          expect(node.width).toBeGreaterThan(0)
          expect(node.screenX).toBeGreaterThanOrEqual(3)
          expect(node.screenX + node.width).toBeLessThanOrEqual(width - 3)
        }
        await act(async () =>
          setup.mockMouse.click(action.screenX, action.screenY),
        )
        expect(opened).toBe(1)
      } finally {
        act(() => setup.renderer.destroy())
      }
    })
  }
}
test('Item header and footer stay outside the media/content/action row', async () => {
  const setup = await testRender(
    <ThemeProvider theme="dark">
      <box padding={2}>
        <Item>
          <ItemHeader>
            <text>Header</text>
          </ItemHeader>
          <ItemMedia variant="icon">
            <text>{icons.folder}</text>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Project</ItemTitle>
            <ItemDescription>Description</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button id="open">Open</Button>
          </ItemActions>
          <ItemFooter>
            <text>Footer</text>
          </ItemFooter>
        </Item>
      </box>
    </ThemeProvider>,
    { width: 70, height: 24 },
  )
  try {
    await act(async () => setup.renderOnce())
    const texts = all(setup.renderer.root).filter(
      (node): node is TextRenderable => node instanceof TextRenderable,
    )
    const header = texts.find((node) => node.plainText === 'Header'),
      footer = texts.find((node) => node.plainText === 'Footer'),
      title = texts.find((node) => node.plainText === 'Project'),
      description = texts.find((node) => node.plainText === 'Description')
    if (!header || !footer || !title || !description)
      throw new Error('Missing Item parts')
    expect(header.screenY + header.height).toBeLessThan(title.screenY)
    expect(footer.screenY).toBeGreaterThan(
      description.screenY + description.height,
    )
    expect(setup.renderer.root.findDescendantById('open')?.screenY).toBe(
      title.screenY,
    )
  } finally {
    act(() => setup.renderer.destroy())
  }
})
