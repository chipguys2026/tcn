import { createHash } from 'node:crypto'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dir, '..')
const labels: Record<string, string> = {
  cod: 'Codicons',
  custom: 'Custom',
  dev: 'Devicons',
  extra: 'Extra',
  fa: 'Font Awesome',
  fae: 'Font Awesome Extension',
  iec: 'IEC Power',
  indent: 'Indent',
  indentation: 'Indentation',
  linux: 'Font Logos',
  md: 'Material Design',
  oct: 'Octicons',
  pl: 'Powerline',
  ple: 'Powerline Extra',
  pom: 'Pomicons',
  seti: 'Seti UI',
  weather: 'Weather',
}

export function compileIcons(data: Record<string, unknown>, version: string) {
  const sets = new Map<string, Map<string, string>>()
  for (const [name, raw] of Object.entries(data)) {
    if (name === 'METADATA') continue
    const match = /^([a-z]+)-([a-z0-9_]+)$/.exec(name)
    const glyph = raw as { char?: unknown; code?: unknown } | null
    if (
      !match?.[1] ||
      !match[2] ||
      !glyph ||
      typeof glyph.char !== 'string' ||
      typeof glyph.code !== 'string' ||
      !/^[a-f0-9]{4,6}$/i.test(glyph.code) ||
      Array.from(glyph.char).length !== 1 ||
      glyph.char.codePointAt(0) !== Number.parseInt(glyph.code, 16)
    )
      throw new Error(`Invalid Nerd Fonts glyph: ${name}`)
    const group = sets.get(match[1]) ?? new Map<string, string>()
    group.set(match[2], glyph.char)
    sets.set(match[1], group)
  }
  const output = new Map<string, string>()
  const header = `// Generated from Nerd Fonts v${version}; do not edit by hand.\n// Copyright (c) 2014 Ryan L McIntyre. MIT notice: src/lib/ui/icons.ts.\n`
  const compare = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0)
  const groups = [...sets].sort(([a], [b]) => compare(a, b))
  for (const [group, entries] of groups) {
    const properties = [...entries]
      .sort(([a], [b]) => compare(a, b))
      .map(
        ([name, char]) =>
          `  ${JSON.stringify(name)}: '\\u{${char.codePointAt(0)?.toString(16)}}',`,
      )
      .join('\n')
    output.set(
      `sets/${group}.ts`,
      `${header}\nimport { defineIconSet } from '../../icons'\n\nexport const ${group} = defineIconSet({\n${properties}\n} as const)\n`,
    )
  }
  const imports = groups
    .map(([group]) => `import { ${group} } from './sets/${group}'`)
    .join('\n')
  const exports = groups
    .map(([group]) => `export { ${group} } from './sets/${group}'`)
    .join('\n')
  const entries = groups
    .map(
      ([group, glyphs]) =>
        `  ${group}: { label: ${JSON.stringify(labels[group] ?? group)}, count: ${glyphs.size}, glyphs: ${group} },`,
    )
    .join('\n')
  output.set(
    'index.ts',
    `${header}\n${imports}\n\n${exports}\n\nexport const nerdFontsVersion = '${version}'\nexport const iconSets = {\n${entries}\n} as const\nexport type IconSetName = keyof typeof iconSets\n`,
  )
  return output
}

export async function generateIcons(check = false) {
  const snapshot = await readFile(
    join(root, 'registry/nerd-fonts/glyphnames.json'),
  )
  const source = JSON.parse(
    await readFile(join(root, 'registry/nerd-fonts/source.json'), 'utf8'),
  ) as {
    version: string
    sha256: string
    entries: number
    uniqueGlyphs: number
  }
  if (createHash('sha256').update(snapshot).digest('hex') !== source.sha256)
    throw new Error('Nerd Fonts snapshot checksum mismatch')
  const data = JSON.parse(snapshot.toString('utf8')) as Record<string, unknown>
  if ((data.METADATA as { version?: string })?.version !== source.version)
    throw new Error('Nerd Fonts snapshot version mismatch')
  const glyphs = Object.entries(data)
    .filter(([name]) => name !== 'METADATA')
    .map(([, value]) => (value as { char: string }).char)
  if (
    glyphs.length !== source.entries ||
    new Set(glyphs).size !== source.uniqueGlyphs
  )
    throw new Error('Nerd Fonts snapshot count mismatch')
  const output = compileIcons(data, source.version)
  const directory = join(root, 'templates/starter/src/lib/ui/nerd-fonts')
  if (!check) await mkdir(join(directory, 'sets'), { recursive: true })
  const existing = await readdir(join(directory, 'sets')).catch(
    (error: NodeJS.ErrnoException) => {
      if (error.code === 'ENOENT') return []
      throw error
    },
  )
  for (const file of existing)
    if (!output.has(`sets/${file}`))
      throw new Error(`Unexpected generated icon set: ${file}`)
  for (const [name, content] of output) {
    const file = join(directory, name)
    const format = Bun.spawnSync(
      [
        process.execPath,
        join(root, 'node_modules/@biomejs/biome/bin/biome'),
        'format',
        '--stdin-file-path',
        'icons.ts',
        '--config-path',
        root,
      ],
      { stdin: Buffer.from(content), stdout: 'pipe', stderr: 'pipe' },
    )
    if (format.exitCode !== 0) throw new Error(format.stderr.toString())
    const formatted = format.stdout.toString().replaceAll('\r\n', '\n')
    if (check) {
      const current = await readFile(file, 'utf8').catch(() => '')
      if (current.replaceAll('\r\n', '\n') !== formatted)
        throw new Error(
          `Generated icons are stale: ${name}. Run bun run icons:generate.`,
        )
    } else await writeFile(file, formatted)
  }
  return {
    version: source.version,
    groups: output.size - 1,
    entries: glyphs.length,
  }
}

if (import.meta.main) {
  const result = await generateIcons(process.argv.includes('--check'))
  console.log(
    `Nerd Fonts ${result.version}: ${result.entries} names in ${result.groups} sets`,
  )
}
