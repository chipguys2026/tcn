import { afterAll, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import {
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { defaultConfig, destination, validateConfig } from '../src/config.js'
import { commit, hash, json, read, safeRelative } from '../src/files.js'
import { diff, planAdd, planInit, planRemove } from '../src/operations.js'
import {
  loadRegistry,
  names,
  renderFile,
  resolveItems,
} from '../src/registry.js'
import type { Config, Manifest, Registry } from '../src/types.js'

const registry = await loadRegistry(
    new URL('../dist/registry.json', import.meta.url),
  ),
  schema = await readFile(
    new URL('../schemas/tcn.schema.json', import.meta.url),
    'utf8',
  ),
  roots: string[] = [],
  cli = resolve(import.meta.dir, '../dist/cli.js')
async function temp() {
  const root = await mkdtemp(join(tmpdir(), 'tcn-test-'))
  roots.push(root)
  return root
}
afterAll(async () => {
  for (const root of roots) {
    if (
      dirname(resolve(root)) !== resolve(tmpdir()) ||
      !root.includes('tcn-test-')
    )
      throw new Error(`Unsafe test cleanup: ${root}`)
    await rm(root, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 100,
    })
  }
})
async function fixture(config: Config = structuredClone(defaultConfig)) {
  const root = await temp()
  await writeFile(
    join(root, 'package.json'),
    json({ name: 'fixture', private: true, type: 'module' }),
  )
  await commit(await planInit(root, registry, schema, { install: false }))
  if (JSON.stringify(config) !== JSON.stringify(defaultConfig)) {
    await writeFile(join(root, 'tcn.json'), json(config))
  }
  return root
}
const manifest = async (root: string) =>
  JSON.parse(
    await readFile(join(root, '.tcn/manifest.json'), 'utf8'),
  ) as Manifest
const run = (args: string[]) =>
  spawnSync(
    process.execPath.includes('bun') ? 'node' : process.execPath,
    [cli, ...args],
    { encoding: 'utf8', shell: false },
  )

test('registry contains all 51 families and every source import resolves to a registry file', () => {
  expect(names(registry)).toHaveLength(51)
  const files = new Set(
    Object.values(registry.items).flatMap((i) => i.files.map((f) => f.path)),
  )
  for (const item of Object.values(registry.items)) {
    for (const dep of item.registryDependencies)
      expect(registry.items[dep]).toBeDefined()
    for (const file of item.files) {
      expect(hash(file.content)).toBe(file.hash)
      for (const link of file.imports) expect(files.has(link.target)).toBe(true)
    }
  }
  expect(
    registry.template.files.some((f) =>
      /node_modules|\.draft\.json$|\.backup\.json$|^dist\//.test(f.path),
    ),
  ).toBe(false)
})
test('init plan has no side effects and creates a self-contained starter with config and baselines', async () => {
  const parent = await temp(),
    root = join(parent, 'my-app'),
    plan = await planInit(root, registry, schema, { install: false })
  expect(await read(root, 'package.json')).toBeNull()
  expect(plan.install).toBe(false)
  await commit(plan)
  expect(
    JSON.parse((await read(root, 'package.json'))?.toString() ?? '{}').name,
  ).toBe('my-app')
  expect(await read(root, 'src/app/page.tsx')).not.toBeNull()
  expect(await read(root, 'src/app/gallery/page.tsx')).not.toBeNull()
  expect(await read(root, 'src/app/tweak/page.tsx')).not.toBeNull()
  expect(
    Object.values((await manifest(root)).items).filter((i) => i.explicit),
  ).toHaveLength(51)
  expect(await diff(root, registry, ['button'])).toContain('No differences')
  expect(await read(root, '.tcn/schema.json')).not.toBeNull()
})
test('init existing app leaves user source and package untouched', async () => {
  const root = await temp(),
    pkg = json({ name: 'existing', custom: true })
  await writeFile(join(root, 'package.json'), pkg)
  await writeFile(join(root, 'app.ts'), 'export const untouched = true')
  const plan = await planInit(root, registry, schema, { install: false })
  await commit(plan)
  expect(await readFile(join(root, 'package.json'))).toEqual(pkg)
  expect(await readFile(join(root, 'app.ts'), 'utf8')).toContain('untouched')
  expect(await read(root, 'src/app/page.tsx')).toBeNull()
  expect(Object.keys((await manifest(root)).items)).toHaveLength(0)
})
test('init refuses collisions before writing and --force replaces only template paths', async () => {
  const root = await temp()
  await writeFile(join(root, 'README.md'), 'mine')
  await writeFile(join(root, 'personal.txt'), 'keep')
  await expect(
    planInit(root, registry, schema, { install: false }),
  ).rejects.toThrow('Template conflicts')
  expect(await read(root, 'tcn.json')).toBeNull()
  await commit(
    await planInit(root, registry, schema, { force: true, install: false }),
  )
  expect(await readFile(join(root, 'personal.txt'), 'utf8')).toBe('keep')
  expect(await readFile(join(root, 'README.md'), 'utf8')).not.toBe('mine')
})
test('add resolves dependencies once and re-adding produces an empty plan', async () => {
  const root = await fixture()
  await commit(
    await planAdd(root, registry, ['dialog', 'button'], { install: false }),
  )
  const m = await manifest(root)
  expect(m.items.dialog?.explicit).toBe(true)
  expect(m.items.button?.explicit).toBe(true)
  expect(Object.keys(m.items)).toEqual(
    resolveItems(registry, ['dialog', 'button']),
  )
  expect(await read(root, 'src/lib/ui/overlay-panel.tsx')).not.toBeNull()
  expect(
    (await planAdd(root, registry, ['dialog', 'button'], { install: false }))
      .changes,
  ).toHaveLength(0)
  const pkg = JSON.parse((await read(root, 'package.json'))?.toString() ?? '{}')
  expect(pkg.dependencies['@opentui/core']).toBeDefined()
  expect(pkg.devDependencies['@types/react']).toBeDefined()
})
test('untracked files conflict atomically even if other requested files are missing', async () => {
  const root = await fixture()
  await mkdir(join(root, 'src/components/ui'), { recursive: true })
  await writeFile(join(root, 'src/components/ui/button.tsx'), '// mine')
  await expect(
    planAdd(root, registry, ['dialog'], { install: false }),
  ).rejects.toThrow('Local files differ')
  expect(await read(root, 'src/components/ui/dialog.tsx')).toBeNull()
  expect(
    await readFile(join(root, 'src/components/ui/button.tsx'), 'utf8'),
  ).toBe('// mine')
})
test('add preserves local edits with no upstream changes; --force restores source', async () => {
  const root = await fixture()
  await commit(await planAdd(root, registry, ['button'], { install: false }))
  const path = 'src/components/ui/button.tsx',
    base = (await read(root, path))?.toString() ?? ''
  await writeFile(join(root, path), `${base}\n// project variant\n`)
  const plan = await planAdd(root, registry, ['button'], { install: false })
  expect(plan.messages.join()).toContain('Preserve local edits')
  await commit(plan)
  expect((await read(root, path))?.toString()).toContain('project variant')
  const patch = await diff(root, registry, ['button'])
  expect(patch).toContain('upstream unchanged')
  expect(patch).toContain('-// project variant')
  await commit(
    await planAdd(root, registry, ['button'], { install: false, force: true }),
  )
  expect((await read(root, path))?.toString()).toBe(base)
})
function upgrade(id: string): Registry {
  const next = structuredClone(registry),
    item = next.items[id]
  if (!item?.files[0]) throw new Error('Missing upgrade fixture')
  item.files[0].content += '\n// upstream revision\n'
  item.files[0].hash = hash(item.files[0].content)
  item.revision = hash(item.files[0].content)
  return next
}
test('unmodified installed source upgrades without force and keeps a new baseline', async () => {
  const root = await fixture()
  await commit(await planAdd(root, registry, ['button'], { install: false }))
  const next = upgrade('button')
  await commit(await planAdd(root, next, ['button'], { install: false }))
  expect(
    (await read(root, 'src/components/ui/button.styles.ts'))?.toString(),
  ).toContain('upstream revision')
  expect((await manifest(root)).items.button?.revision).toBe(
    next.items.button?.revision,
  )
})
test('local/upstream conflict requires force and does not apply partial updates', async () => {
  const root = await fixture()
  await commit(await planAdd(root, registry, ['button'], { install: false }))
  const item = registry.items.button,
    file = item?.files[0]
  if (!file) throw new Error('Missing fixture')
  await writeFile(join(root, file.path), `${file.content}\n// local revision`)
  const old = await read(root, '.tcn/manifest.json')
  await expect(
    planAdd(root, upgrade('button'), ['button'], { install: false }),
  ).rejects.toThrow('--force')
  expect(await read(root, '.tcn/manifest.json')).toEqual(old)
})
test('shared helper updates identify affected installed component roots', async () => {
  const root = await fixture()
  await commit(
    await planAdd(root, registry, ['button', 'input'], { install: false }),
  )
  const id = '_lib/ui/focus/use-focusable',
    next = upgrade(id),
    plan = await planAdd(root, next, ['button'], { install: false })
  expect(plan.messages.join()).toContain('also affects:')
  expect(plan.messages.join()).toContain('input')
})
test('custom destinations rewrite aliases and relative imports, including type imports', async () => {
  const config = structuredClone(defaultConfig)
  config.paths = { ui: 'src/widgets', lib: 'src/foundation' }
  config.aliases = { ui: '~/widgets', lib: '~/foundation' }
  const root = await fixture(config)
  await commit(await planAdd(root, registry, ['dialog'], { install: false }))
  const content = (await read(root, 'src/widgets/dialog.tsx'))?.toString() ?? ''
  expect(content).toContain('~/foundation/')
  expect(content).not.toContain('@/lib/ui')
  const floating =
    (await read(root, 'src/foundation/floating.tsx'))?.toString() ?? ''
  expect(floating).toContain('~/widgets/button')
  for (const id of resolveItems(registry, ['dialog']))
    for (const file of registry.items[id]?.files ?? []) {
      const rendered = renderFile(file, config)
      expect(rendered).not.toContain('@/components/ui/')
      expect(rendered).not.toContain('@/lib/ui/')
      expect(await read(root, destination(file.path, config))).not.toBeNull()
    }
})
test('paths/alias changes after installation require migration', async () => {
  const root = await fixture()
  await commit(await planAdd(root, registry, ['button'], { install: false }))
  const config = structuredClone(defaultConfig)
  config.paths.ui = 'src/widgets'
  await writeFile(join(root, 'tcn.json'), json(config))
  await expect(
    planAdd(root, registry, ['button'], { install: false }),
  ).rejects.toThrow('layout differs')
})
test('unknown components and malformed config do not mutate files', async () => {
  const root = await fixture()
  await expect(
    planAdd(root, registry, ['does-not-exist'], { install: false }),
  ).rejects.toThrow('Unknown')
  await writeFile(join(root, 'tcn.json'), '{ nope')
  await expect(
    planAdd(root, registry, ['button'], { install: false }),
  ).rejects.toThrow('Invalid JSON')
})
for (const path of [
  '../outside',
  '/absolute',
  'C:/outside',
  'src/../../outside',
  'src\\outside',
  'src/file:stream',
  'src/CON.ts',
  'src/a.',
  'src//ui',
])
  test(`reject unsafe destination ${path}`, () => {
    expect(() => safeRelative(path)).toThrow()
  })
test('reject overlapping and reserved config paths and unknown config fields', () => {
  for (const override of [
    { paths: { ui: 'src/ui', lib: 'src/ui/lib' } },
    { paths: { ui: '.tcn/ui', lib: 'src/lib' } },
    { registry: 'https://example.com' },
    { unknown: true },
  ])
    expect(() => validateConfig({ ...defaultConfig, ...override })).toThrow()
})
test('symlinked destinations cannot write outside project', async () => {
  const root = await fixture(),
    outside = await temp()
  await mkdir(join(root, 'src'), { recursive: true })
  await symlink(
    outside,
    join(root, 'src/components'),
    process.platform === 'win32' ? 'junction' : 'dir',
  )
  await expect(
    planAdd(root, registry, ['button'], { install: false }),
  ).rejects.toThrow('symlink')
  expect(await readdir(outside)).toHaveLength(0)
})
test('concurrent edits invalidate a plan before any managed files change', async () => {
  const root = await fixture(),
    plan = await planAdd(root, registry, ['button'], { install: false })
  await writeFile(join(root, 'package.json'), json({ name: 'changed' }))
  await expect(commit(plan)).rejects.toThrow('Project changed')
  expect(await read(root, 'src/components/ui/button.tsx')).toBeNull()
  expect(await read(root, '.tcn/transaction.lock')).toBeNull()
})
test('remove refuses dependency violations even with force', async () => {
  const root = await fixture()
  await commit(await planAdd(root, registry, ['dialog'], { install: false }))
  await expect(
    planRemove(root, registry, ['button'], { force: true }),
  ).rejects.toThrow('required by dialog')
  expect(await read(root, 'src/components/ui/button.tsx')).not.toBeNull()
})
test('remove prunes orphan helpers but retains explicitly installed shared components', async () => {
  const root = await fixture()
  await commit(
    await planAdd(root, registry, ['dialog', 'button'], { install: false }),
  )
  await commit(await planRemove(root, registry, ['dialog']))
  expect(await read(root, 'src/components/ui/dialog.tsx')).toBeNull()
  expect(await read(root, 'src/components/ui/button.tsx')).not.toBeNull()
  expect(await read(root, 'src/lib/ui/overlay-panel.tsx')).toBeNull()
  expect((await manifest(root)).items.button?.explicit).toBe(true)
})
test('remove never deletes modified source unless forced and leaves package dependencies intact', async () => {
  const root = await fixture()
  await commit(await planAdd(root, registry, ['button'], { install: false }))
  const path = 'src/components/ui/button.tsx',
    pkg = await read(root, 'package.json')
  await writeFile(join(root, path), '// own button')
  await expect(planRemove(root, registry, ['button'])).rejects.toThrow(
    'Modified',
  )
  await commit(await planRemove(root, registry, ['button'], { force: true }))
  expect(await read(root, path)).toBeNull()
  expect(await read(root, 'package.json')).toEqual(pkg)
  expect(Object.keys((await manifest(root)).items)).toHaveLength(0)
})
test('remove checks application imports even with force', async () => {
  const root = await fixture()
  await commit(await planAdd(root, registry, ['button'], { install: false }))
  await writeFile(
    join(root, 'app.tsx'),
    "import { Button } from '@/components/ui/button'\n",
  )
  await expect(
    planRemove(root, registry, ['button'], { force: true }),
  ).rejects.toThrow('Application source')
  expect(await read(root, 'src/components/ui/button.tsx')).not.toBeNull()
})
test('components removed from a future registry remain removable from installed metadata', async () => {
  const root = await fixture()
  await commit(await planAdd(root, registry, ['button'], { install: false }))
  const next = structuredClone(registry)
  delete next.items.button
  await commit(await planRemove(root, next, ['button']))
  expect(await read(root, 'src/components/ui/button.tsx')).toBeNull()
})
test('existing dependency versions remain app owned', async () => {
  const root = await fixture()
  await writeFile(
    join(root, 'package.json'),
    json({ name: 'fixture', dependencies: { react: '99.0.0' } }),
  )
  await commit(
    await planAdd(root, registry, ['button'], { force: true, install: false }),
  )
  expect(
    JSON.parse((await read(root, 'package.json'))?.toString() ?? '{}')
      .dependencies.react,
  ).toBe('99.0.0')
})
test('files retired upstream retain ownership and remain removable with their component', async () => {
  const root = await fixture()
  await commit(await planAdd(root, registry, ['button'], { install: false }))
  const next = structuredClone(registry),
    item = next.items.button
  if (!item) throw new Error('Missing button')
  item.files = item.files.filter((file) => file.path.endsWith('.tsx'))
  for (const file of item.files) {
    file.content = 'export const Button = () => null\n'
    file.hash = hash(file.content)
    file.imports = []
  }
  item.revision = 'retired-style'
  const plan = await planAdd(root, next, ['button'], { install: false })
  expect(plan.messages.join()).toContain('no longer distributes')
  await commit(plan)
  expect(
    (await manifest(root)).items.button?.files[
      'src/components/ui/button.styles.ts'
    ],
  ).toBeDefined()
  await commit(await planRemove(root, next, ['button']))
  expect(await read(root, 'src/components/ui/button.styles.ts')).toBeNull()
})
test('Windows line endings are not local edits, while transaction guards still compare exact bytes', async () => {
  const root = await fixture()
  await commit(await planAdd(root, registry, ['button'], { install: false }))
  const path = 'src/components/ui/button.tsx',
    base = (await read(root, path))?.toString() ?? '',
    crlf = base.replace(/\r?\n/g, '\r\n')
  await writeFile(join(root, path), crlf)
  expect(await diff(root, registry, ['button'])).toContain('No differences')
  expect(
    (await planAdd(root, registry, ['button'], { install: false })).changes,
  ).toHaveLength(0)
  expect((await read(root, path))?.toString()).toBe(crlf)
  await commit(await planRemove(root, registry, ['button']))
  expect(await read(root, path)).toBeNull()
})
test('an I/O failure rolls back files already applied by the transaction', async () => {
  const root = await temp()
  await expect(
    commit({
      root,
      install: false,
      messages: [],
      guards: new Map(),
      changes: [
        { path: 'barrier', before: null, after: Buffer.from('file') },
        {
          path: 'barrier/child.ts',
          before: null,
          after: Buffer.from('blocked'),
        },
      ],
    }),
  ).rejects.toThrow()
  expect(await read(root, 'barrier')).toBeNull()
  expect(await read(root, '.tcn/transaction.lock')).toBeNull()
})
test('built Node executable supports help/version/list and errors without requiring Bun at runtime', () => {
  const help = run(['--help'])
  expect(help.status).toBe(0)
  expect(help.stdout).toContain('tcn init')
  expect(run(['--version']).stdout.trim()).toBe(registry.release)
  expect(run(['list']).stdout.trim().split('\n')).toHaveLength(51)
  expect(run(['--unknown']).status).toBe(1)
  expect(run(['add', 'button', '--cwd']).stderr).toContain(
    'requires a directory',
  )
})
test('CLI dry-run creates no project; --all remove selects installed components only', async () => {
  const parent = await temp(),
    newRoot = join(parent, 'dry-app'),
    result = run(['init', 'dry-app', '--cwd', parent, '--dry-run'])
  expect(result.status).toBe(0)
  expect(result.stdout).toContain('Dry run')
  expect(await read(newRoot, 'package.json')).toBeNull()
  const root = await fixture()
  expect(run(['add', 'button', '--cwd', root, '--no-install']).status).toBe(0)
  expect(run(['remove', '--all', '--cwd', root, '--no-install']).status).toBe(0)
  expect(await read(root, 'src/components/ui/button.tsx')).toBeNull()
})
