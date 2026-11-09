import type { Dirent } from 'node:fs'
import { mkdir, readdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { RouteSegment } from '../src/router/types'

const moduleNames = ['layout', 'error', 'loading', 'page'] as const
type ModuleName = (typeof moduleNames)[number]
type DiscoveredLayer = {
  id: string
  modules: Partial<Record<ModuleName, string>>
}
type DiscoveredRoute = {
  path: string
  segments: RouteSegment[]
  layers: DiscoveredLayer[]
  page: string
}

export const projectDir = fileURLToPath(new URL('../', import.meta.url))

function compareRoutes(left: DiscoveredRoute, right: DiscoveredRoute) {
  const count = Math.min(left.segments.length, right.segments.length)
  for (let index = 0; index < count; index++) {
    const a = left.segments[index]
    const b = right.segments[index]
    if (!a || !b) continue
    if (a.kind !== b.kind) return a.kind === 'static' ? -1 : 1
    if (a.kind === 'static' && a.value !== b.value)
      return a.value < b.value ? -1 : 1
  }
  return (
    left.segments.length - right.segments.length ||
    left.path.localeCompare(right.path)
  )
}

function parseSegment(name: string): RouteSegment | null {
  if (/^\([a-z0-9]+(?:-[a-z0-9]+)*\)$/.test(name)) return null
  const dynamic = /^\[([a-zA-Z_][a-zA-Z0-9_]*)\]$/.exec(name)
  if (dynamic?.[1]) return { kind: 'dynamic', value: dynamic[1] }
  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name))
    return { kind: 'static', value: name }
  throw new Error(
    `Unsupported app directory: ${name}. Use kebab-case, [param], or (group).`,
  )
}

type DirectoryReader = (directory: string) => Promise<Dirent[]>

export async function discoverRoutes(
  appDir: string,
  readDirectory: DirectoryReader = (directory) =>
    readdir(directory, { withFileTypes: true }),
) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await discoverSnapshot(appDir, readDirectory)
    } catch (error) {
      const failure = error as NodeJS.ErrnoException
      // A child can disappear between listing its parent and entering it.
      // Retry the whole snapshot so partial layers/signatures are discarded.
      if (
        attempt >= 2 ||
        !['ENOENT', 'ENOTDIR'].includes(failure.code ?? '') ||
        resolve(failure.path ?? appDir) === resolve(appDir)
      )
        throw error
    }
  }
}

async function discoverSnapshot(
  appDir: string,
  readDirectory: DirectoryReader,
) {
  const routes: DiscoveredRoute[] = []
  const layers: DiscoveredLayer[] = []
  const signatures = new Map<string, string>()

  async function visit(
    directory: string,
    segments: RouteSegment[],
    ancestors: DiscoveredLayer[],
  ) {
    const entries = (await readDirectory(directory)).sort((a, b) =>
      a.name.localeCompare(b.name),
    )
    const id = relative(appDir, directory).split(sep).join('/') || '.'
    const layer: DiscoveredLayer = { id, modules: {} }

    for (const entry of entries) {
      if (entry.isSymbolicLink())
        throw new Error(
          `Symlinks are not supported in app/: ${id}/${entry.name}`,
        )
      for (const name of moduleNames) {
        if (entry.isFile() && entry.name === `${name}.tsx`) {
          layer.modules[name] = resolve(directory, entry.name)
        }
      }
    }
    layers.push(layer)
    const chain = [...ancestors, layer]

    if (layer.modules.page) {
      const names = segments
        .filter((segment) => segment.kind === 'dynamic')
        .map((segment) => segment.value)
      if (new Set(names).size !== names.length)
        throw new Error(`Repeated route parameter in ${id}`)
      const signature = segments
        .map((segment) => (segment.kind === 'static' ? segment.value : ':'))
        .join('/')
      const previous = signatures.get(signature)
      if (previous !== undefined)
        throw new Error(
          `Conflicting routes: ${previous}/page.tsx and ${id}/page.tsx`,
        )
      signatures.set(signature, id)
      routes.push({
        path: `/${segments.map((segment) => (segment.kind === 'dynamic' ? `:${segment.value}` : segment.value)).join('/')}`,
        segments,
        layers: chain.slice(1),
        page: layer.modules.page,
      })
    }

    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue
      const segment = parseSegment(entry.name)
      await visit(
        resolve(directory, entry.name),
        segment ? [...segments, segment] : segments,
        chain,
      )
    }
  }

  await visit(resolve(appDir), [], [])
  const root = layers[0]
  if (!root) throw new Error('Missing app directory')
  if (routes.length === 0)
    throw new Error('app/ must contain at least one page.tsx')
  return { root, layers, routes: routes.sort(compareRoutes) }
}

export async function generateRoutes(
  options: { appDir?: string; outFile?: string } = {},
) {
  const appDir = options.appDir ?? resolve(projectDir, 'src/app')
  const outFile =
    options.outFile ?? resolve(projectDir, 'src/router/routes.generated.ts')
  const { root, layers, routes } = await discoverRoutes(appDir)
  const modules = [
    ...new Set(layers.flatMap((layer) => Object.values(layer.modules))),
  ].sort()
  const moduleIds = new Map(
    modules.map((file, index) => [file, `Module${index}`]),
  )
  const layerIds = new Map(
    layers.map((layer, index) => [layer.id, `layer${index}`]),
  )
  const lines = [
    '// Generated by scripts/generate-routes.ts. Do not edit.',
    "import type { RouteManifest } from './types'",
    ...modules.map((file) => {
      let specifier = relative(dirname(outFile), file)
        .split(sep)
        .join('/')
        .replace(/\.tsx$/, '')
      if (!specifier.startsWith('.')) specifier = `./${specifier}`
      return `import ${moduleIds.get(file)} from ${JSON.stringify(specifier)}`
    }),
    '',
    ...layers.map((layer) => {
      const fields = [`id: ${JSON.stringify(layer.id)}`]
      for (const name of ['layout', 'error', 'loading'] as const) {
        const file = layer.modules[name]
        if (file) fields.push(`${name}: ${moduleIds.get(file)}`)
      }
      return `const ${layerIds.get(layer.id)} = { ${fields.join(', ')} }`
    }),
    '',
    'export const routeManifest = {',
    `  root: ${layerIds.get(root.id)},`,
    '  routes: [',
    ...routes.map(
      (route) =>
        `    { path: ${JSON.stringify(route.path)}, segments: ${JSON.stringify(route.segments)}, page: ${moduleIds.get(route.page)}, layers: [${route.layers.map((layer) => layerIds.get(layer.id)).join(', ')}] },`,
    ),
    '  ],',
    '} satisfies RouteManifest',
    '',
  ]
  const source = lines.join('\n')
  let previous: string | undefined
  try {
    previous = await readFile(outFile, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }
  if (source === previous) return { changed: false, count: routes.length }
  await mkdir(dirname(outFile), { recursive: true })
  const temporary = `${outFile}.tmp`
  await writeFile(temporary, source)
  await rename(temporary, outFile)
  return { changed: true, count: routes.length }
}

if (import.meta.main) {
  const result = await generateRoutes()
  console.log(
    `Routes: ${result.count} (${result.changed ? 'generated' : 'unchanged'})`,
  )
}
