import { afterEach, expect, test } from 'bun:test'
import {
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { discoverRoutes, generateRoutes } from '../../scripts/generate-routes'

const temporary: string[] = []
afterEach(async () => {
  await Promise.all(
    temporary
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  )
})

async function fixture(files: string[]) {
  const directory = await mkdtemp(join(tmpdir(), 'tui-routes-'))
  temporary.push(directory)
  const appDir = join(directory, 'app')
  const outFile = join(directory, 'router/routes.generated.ts')
  for (const file of files) {
    const target = join(appDir, file)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, 'export default function Fixture() { return null }')
  }
  return { appDir, outFile }
}

test('route discovery retries a coherent snapshot when a listed child is renamed', async () => {
  const { appDir } = await fixture(['page.tsx', 'added/page.tsx'])
  let renamed = false
  const result = await discoverRoutes(appDir, async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true })
    if (directory === appDir && !renamed) {
      await rename(join(appDir, 'added'), join(appDir, 'renamed'))
      renamed = true
    }
    return entries
  })
  expect(result.routes.map((r) => r.path)).toEqual(['/', '/renamed'])
  expect(result.layers.some((l) => l.id === 'added')).toBe(false)
})
test('route discovery propagates permission errors instead of retrying them', async () => {
  const { appDir } = await fixture(['page.tsx'])
  let reads = 0
  await expect(
    discoverRoutes(appDir, async () => {
      reads++
      throw Object.assign(new Error('denied'), { code: 'EACCES', path: appDir })
    }),
  ).rejects.toThrow('denied')
  expect(reads).toBe(1)
})

test('generates importable static modules with inherited layers and route groups', async () => {
  const options = await fixture([
    'layout.tsx',
    'error.tsx',
    'loading.tsx',
    'page.tsx',
    '(account)/layout.tsx',
    '(account)/settings/page.tsx',
    'items/layout.tsx',
    'items/loading.tsx',
    'items/[id]/page.tsx',
    'items/[id]/error.tsx',
  ])
  expect((await generateRoutes(options)).count).toBe(3)
  const { routeManifest } = await import(pathToFileURL(options.outFile).href)
  const item = routeManifest.routes.find(
    (route: { path: string }) => route.path === '/items/:id',
  )
  expect(item.layers.map((layer: { id: string }) => layer.id)).toEqual([
    'items',
    'items/[id]',
  ])
  expect(item.layers[0].loading).toBeFunction()
  expect(item.layers[1].error).toBeFunction()
  expect(routeManifest.root.layout).toBeFunction()
  expect(routeManifest.root.error).toBeFunction()
  expect(routeManifest.root.loading).toBeFunction()
  expect(
    routeManifest.routes.find(
      (route: { path: string }) => route.path === '/settings',
    ).layers[0].id,
  ).toBe('(account)')
  expect(await readFile(options.outFile, 'utf8')).not.toContain('import(')
})

test('generation is deterministic and does not touch an unchanged manifest', async () => {
  const options = await fixture(['page.tsx'])
  expect((await generateRoutes(options)).changed).toBe(true)
  const before = await stat(options.outFile)
  expect((await generateRoutes(options)).changed).toBe(false)
  expect((await stat(options.outFile)).mtimeMs).toBe(before.mtimeMs)
})

test('orders static segments before dynamic segments at the first differing position', async () => {
  const { appDir } = await fixture([
    'items/[id]/page.tsx',
    'items/new/page.tsx',
    '[section]/new/page.tsx',
  ])
  expect(
    (await discoverRoutes(appDir)).routes.map((route) => route.path),
  ).toEqual(['/items/new', '/items/:id', '/:section/new'])
})

test.each([
  ['page.tsx', '(group)/page.tsx'],
  ['items/[id]/page.tsx', 'items/[slug]/page.tsx'],
])('rejects conflicting routes: %j', async (first, second) => {
  const { appDir } = await fixture([first, second])
  await expect(discoverRoutes(appDir)).rejects.toThrow('Conflicting routes')
})

test('rejects repeated params and unsupported catch-all folders', async () => {
  const duplicate = await fixture(['[id]/children/[id]/page.tsx'])
  await expect(discoverRoutes(duplicate.appDir)).rejects.toThrow(
    'Repeated route parameter',
  )
  const catchAll = await fixture(['[...slug]/page.tsx'])
  await expect(discoverRoutes(catchAll.appDir)).rejects.toThrow(
    'Unsupported app directory',
  )
})

test('reflects additions, directory renames, and deleted pages', async () => {
  const options = await fixture(['page.tsx', 'first/page.tsx'])
  await generateRoutes(options)
  await rename(join(options.appDir, 'first'), join(options.appDir, 'second'))
  await generateRoutes(options)
  expect(await readFile(options.outFile, 'utf8')).toContain('/second')
  expect(await readFile(options.outFile, 'utf8')).not.toContain('/first')
  await rm(join(options.appDir, 'second/page.tsx'))
  expect((await generateRoutes(options)).count).toBe(1)
})

test('invalid discovery leaves the last valid manifest untouched', async () => {
  const options = await fixture(['page.tsx'])
  await generateRoutes(options)
  const before = await readFile(options.outFile, 'utf8')
  await mkdir(join(options.appDir, '(group)'))
  await writeFile(
    join(options.appDir, '(group)/page.tsx'),
    'export default () => null',
  )
  await expect(generateRoutes(options)).rejects.toThrow('Conflicting routes')
  expect(await readFile(options.outFile, 'utf8')).toBe(before)
})
