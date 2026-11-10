import { expect, test } from 'bun:test'
import { readFile } from 'node:fs/promises'
import { compileIcons, generateIcons } from '../scripts/generate-icons.js'

test('generated icon sets reproduce the pinned snapshot without network access', async () => {
  const result = await generateIcons(true)
  expect(result).toEqual({ version: '3.5.1', groups: 17, entries: 10995 })
  const data = JSON.parse(
    await readFile(
      new URL('../registry/nerd-fonts/glyphnames.json', import.meta.url),
      'utf8',
    ),
  )
  const catalogPath = new URL(
    '../templates/starter/src/lib/ui/nerd-fonts/index.ts',
    import.meta.url,
  ).href
  const { iconSets } = (await import(catalogPath)) as {
    iconSets: Record<string, { glyphs: Record<string, string> }>
  }
  const actual = new Map<string, string>(
    Object.entries(iconSets).flatMap(([group, set]) =>
      Object.entries(set.glyphs).map(
        ([name, glyph]) => [`${group}-${name}`, glyph] as const,
      ),
    ),
  )
  expect(actual.size).toBe(10995)
  for (const [name, entry] of Object.entries(data)) {
    if (name === 'METADATA') continue
    expect(actual.get(name)).toBe((entry as { char: string }).char)
  }
  expect(new Set(actual.values()).size).toBe(10617)
})

test('icon generation retains aliases, supplementary-plane codepoints and bracket-only names', () => {
  const result = compileIcons(
    {
      'fa-alias': { char: '\uf000', code: 'f000' },
      'fa-500px': { char: '\uf000', code: 'f000' },
      'md-test': { char: '\u{f0001}', code: 'f0001' },
    },
    'test',
  )
  expect(result.get('sets/fa.ts')).toContain('"500px"')
  expect(result.get('sets/md.ts')).toContain('\\u{f0001}')
  expect(result.get('index.ts')).toContain('count: 2')
})

test('icon generation rejects malformed names and invalid Unicode mappings', () => {
  for (const data of [
    { '../escape': { char: 'a', code: '0061' } },
    { 'fa-name': { char: 'ab', code: '0061' } },
    { 'fa-name': { char: 'a', code: '0062' } },
  ])
    expect(() => compileIcons(data, 'test')).toThrow('Invalid Nerd Fonts glyph')
})
