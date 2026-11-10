import { expect, spyOn, test } from 'bun:test'
import {
  type Renderable,
  ScrollBoxRenderable,
  TextRenderable,
} from '@opentui/core'
import { testRender } from '@opentui/react/test-utils'
import { act } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { EmptyMedia } from '@/components/ui/empty'
import {
  catalogIcons,
  iconsPerPage,
  searchIcons,
} from '@/features/gallery/utils/icon-catalog'
import { icons, resolveIcon } from '@/lib/ui/icons'
import { iconSets, nerdFontsVersion } from '@/lib/ui/nerd-fonts'
import { fa } from '@/lib/ui/nerd-fonts/sets/fa'
import { md } from '@/lib/ui/nerd-fonts/sets/md'
import { ThemeProvider } from '@/lib/ui/theme/provider'
import { createNavigationStore } from '@/router/navigation-store'
import { RouterView } from '@/router/router-view'

function all(node: Renderable): Renderable[] {
  return [node, ...node.getChildren().flatMap(all)]
}

test('the complete catalog retains namespaces, aliases, codepoints and the legacy aliases', () => {
  expect(nerdFontsVersion).toBe('3.5.1')
  expect(Object.keys(iconSets)).toHaveLength(17)
  expect(catalogIcons).toHaveLength(10995)
  expect(new Set(catalogIcons.map((icon) => icon.glyph)).size).toBe(10617)
  expect(Object.keys(icons)).toHaveLength(18)
  expect(resolveIcon('save')).toBe('\uf0c7')
  expect(resolveIcon(fa.address_book)).toBe(fa.address_book)
  expect(
    searchIcons('nf-fa-address_book').some(
      (icon) => icon.name === 'address_book',
    ),
  ).toBe(true)
  expect(searchIcons('account', 'md').every((icon) => icon.set === 'md')).toBe(
    true,
  )
  const account = searchIcons('account', 'md').find(
    (icon) => icon.name === 'account',
  )
  expect(account).toBeDefined()
  expect(
    searchIcons(account?.codepoint ?? '').some(
      (icon) => icon.name === 'account',
    ),
  ).toBe(true)
  expect(searchIcons('this_icon_does_not_exist')).toHaveLength(0)
  expect(searchIcons('nf-fa-500px')[0]?.reference).toBe('fa["500px"]')
})

for (const [width, height] of [
  [40, 20],
  [80, 24],
] as const) {
  test(`icon browser keeps search, results and copy controls available at ${width}x${height}`, async () => {
    const setup = await testRender(
      <RouterView store={createNavigationStore('/gallery/icons')} />,
      { width, height, kittyKeyboard: true },
    )
    try {
      await act(async () => setup.renderOnce())
      const scroll = all(setup.renderer.root).find(
        (node) => node instanceof ScrollBoxRenderable,
      ) as ScrollBoxRenderable | undefined
      expect(scroll?.viewport.height ?? 0).toBeGreaterThan(0)
      const copy = setup.renderer.root.findDescendantById('icons-copy-usage')
      if (!copy) throw new Error('Missing copy control')
      expect(copy.screenY + copy.height).toBeLessThanOrEqual(height)
      expect(copy.screenX + copy.width).toBeLessThanOrEqual(width)
      await act(async () => setup.mockInput.typeText('not_an_existing_icon'))
      await act(async () => setup.renderOnce())
      expect(setup.captureCharFrame()).toContain('No matching icons')
    } finally {
      act(() => setup.renderer.destroy())
    }
  })
}

test('existing components render typed catalog glyphs and legacy aliases', async () => {
  const setup = await testRender(
    <ThemeProvider theme="dark">
      <box flexDirection="column" gap={1}>
        <Button icon="save">Save</Button>
        <Button icon={fa.address_book}>Contacts</Button>
        <Alert icon={md.account}>
          <AlertDescription>Account details</AlertDescription>
        </Alert>
        <EmptyMedia icon={fa.address_book} />
      </box>
    </ThemeProvider>,
    { width: 60, height: 24 },
  )
  try {
    await act(async () => setup.renderOnce())
    const frame = setup.captureCharFrame()
    expect(frame).toContain(icons.save)
    expect(frame).toContain(fa.address_book)
    expect(frame).toContain(md.account)
  } finally {
    act(() => setup.renderer.destroy())
  }
})

test('the icon browser paginates, filters sets, previews and copies names, glyphs and usage', async () => {
  const store = createNavigationStore('/gallery/icons')
  const setup = await testRender(<RouterView store={store} />, {
    width: 100,
    height: 36,
    kittyKeyboard: true,
  })
  const clipboard = spyOn(
    setup.renderer,
    'copyToClipboardOSC52',
  ).mockReturnValue(true)
  const frame = () => act(async () => setup.renderOnce())
  const activate = async (id: string) => {
    const node = setup.renderer.root.findDescendantById(id)
    if (!node) throw new Error(`Missing browser control ${id}`)
    await act(async () => node.focus())
    await act(async () => setup.mockInput.pressEnter())
    await frame()
  }
  try {
    await frame()
    expect(
      all(setup.renderer.root).filter((node) =>
        node.id.startsWith('icon-result-'),
      ),
    ).toHaveLength(iconsPerPage)
    await activate('icons-next')
    expect(setup.captureCharFrame()).toContain('Page 2 of')
    await act(async () =>
      setup.renderer.root.findDescendantById('icons-search')?.focus(),
    )
    await act(async () => setup.mockInput.typeText('nf-fa-address_book'))
    await frame()
    expect(setup.captureCharFrame()).toContain('Page 1 of 1')
    await activate('icon-result-fa-address_book')
    expect(setup.captureCharFrame()).toContain('nf-fa-address_book')
    await activate('icons-copy-name')
    expect(clipboard).toHaveBeenLastCalledWith('nf-fa-address_book')
    await activate('icons-copy-glyph')
    expect(clipboard).toHaveBeenLastCalledWith(fa.address_book)
    await activate('icons-copy-usage')
    expect(clipboard.mock.calls.at(-1)?.[0]).toContain('icon={fa.address_book}')
    clipboard.mockReturnValue(false)
    await activate('icons-copy-name')
    expect(setup.captureCharFrame()).toContain('Clipboard unavailable')

    const triggerText = all(setup.renderer.root).find(
      (node) =>
        node instanceof TextRenderable &&
        node.plainText.includes('All icon sets'),
    )
    if (!triggerText?.parent) throw new Error('Missing set selector')
    await act(async () => triggerText.parent?.focus())
    await act(async () => setup.mockInput.pressEnter())
    await frame()
    await act(async () => setup.mockInput.typeText('Material'))
    await act(async () => setup.mockInput.pressEnter())
    await frame()
    expect(setup.captureCharFrame()).toContain('No matching icons')
    expect(
      all(setup.renderer.root).filter((node) =>
        node.id.startsWith('icon-result-'),
      ),
    ).toHaveLength(0)
    await activate('icons-back')
    expect(store.getState().pathname).toBe('/gallery')
  } finally {
    clipboard.mockRestore()
    act(() => setup.renderer.destroy())
  }
})
