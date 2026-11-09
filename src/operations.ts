import { readdir, readFile } from 'node:fs/promises'
import { basename, join, posix, resolve } from 'node:path'
import { createTwoFilesPatch } from 'diff'
import {
  defaultConfig,
  destination,
  loadConfig,
  loadManifest,
} from './config.js'
import { change, hash, json, parse, portable, read, same } from './files.js'
import { names, publicItems, renderFile, resolveItems } from './registry.js'
import type {
  Config,
  InstalledItem,
  Manifest,
  Options,
  Plan,
  Registry,
} from './types.js'

const makePlan = (root: string): Plan => ({
  root: resolve(root),
  changes: [],
  messages: [],
  install: false,
  guards: new Map(),
})
const normalizedSource = (text: string) => text.replace(/\r\n/g, '\n')
const sameSource = (bytes: Buffer | null, source: string) =>
  bytes !== null &&
  normalizedSource(bytes.toString('utf8')) === normalizedSource(source)
type Package = {
  name?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  [key: string]: unknown
}
function packageObject(bytes: Buffer | null) {
  const pkg = parse<Package>(bytes, 'package.json')
  if (!pkg || typeof pkg !== 'object' || Array.isArray(pkg))
    throw new Error('package.json must contain an object')
  for (const key of ['dependencies', 'devDependencies'] as const)
    if (
      pkg[key] &&
      (typeof pkg[key] !== 'object' ||
        Array.isArray(pkg[key]) ||
        Object.values(pkg[key]).some((v) => typeof v !== 'string'))
    )
      throw new Error(`Invalid package.json ${key}`)
  return pkg
}
async function project(root: string, registry: Registry) {
  const { config, bytes } = await loadConfig(root),
    [{ manifest, bytes: manifestBytes }, packageBytes] = await Promise.all([
      loadManifest(root, config, registry.release),
      read(root, 'package.json'),
    ])
  const plan = makePlan(root)
  plan.guards.set('tcn.json', bytes)
  plan.guards.set('.tcn/manifest.json', manifestBytes)
  plan.guards.set('package.json', packageBytes)
  return {
    config,
    manifest,
    plan,
    pkg: packageObject(packageBytes),
    packageBytes,
  }
}
function installed(
  registry: Registry,
  id: string,
  config: Config,
  explicit: boolean,
): InstalledItem {
  const item = registry.items[id]
  if (!item) throw new Error(`Unknown registry item: ${id}`)
  return {
    explicit,
    revision: item.revision,
    registryDependencies: item.registryDependencies,
    files: Object.fromEntries(
      item.files.map((file) => {
        const base = renderFile(file, config)
        return [
          destination(file.path, config),
          { source: file.path, base, hash: hash(base) },
        ]
      }),
    ),
  }
}
function depends(
  manifest: Manifest,
  root: string,
  target: string,
  seen = new Set<string>(),
): boolean {
  if (root === target) return true
  if (seen.has(root)) return false
  seen.add(root)
  return (
    manifest.items[root]?.registryDependencies.some((id) =>
      depends(manifest, id, target, seen),
    ) ?? false
  )
}
export async function planAdd(
  root: string,
  registry: Registry,
  requested: string[],
  options: Options = {},
) {
  const selected = publicItems(registry, requested),
    ids = resolveItems(registry, selected),
    { config, manifest, plan, pkg, packageBytes } = await project(
      root,
      registry,
    ),
    conflicts: string[] = [],
    npm: Record<string, string> = {},
    dev: Record<string, string> = {}
  for (const id of ids) {
    const item = registry.items[id]
    if (!item) continue
    const old = manifest.items[id],
      next = installed(
        registry,
        id,
        config,
        selected.includes(id) || !!old?.explicit,
      )
    let touched = false
    for (const [path, file] of Object.entries(next.files)) {
      const local = await read(root, path),
        incoming = Buffer.from(file.base),
        base = old?.files[path],
        modified = local !== null && (!base || !sameSource(local, base.base))
      if (
        same(local, incoming) ||
        (!options.force && sameSource(local, file.base))
      )
        continue
      if (modified && !options.force) {
        if (
          base &&
          normalizedSource(base.base) === normalizedSource(file.base)
        ) {
          plan.messages.push(`Preserve local edits: ${path}`)
          continue
        }
        conflicts.push(path)
        continue
      }
      await change(plan, path, incoming, local)
      touched = true
    }
    let retainedRetiredFile = false
    for (const [path, file] of Object.entries(old?.files ?? {})) {
      if (next.files[path] || !(await read(root, path))) continue
      next.files[path] = file
      retainedRetiredFile = true
      plan.messages.push(
        `Upstream no longer distributes ${path}; retained and tracked until you migrate or remove the component.`,
      )
    }
    if (retainedRetiredFile)
      next.registryDependencies = [
        ...new Set([
          ...next.registryDependencies,
          ...(old?.registryDependencies ?? []),
        ]),
      ].sort()
    if (touched && old) {
      const affected = Object.entries(manifest.items)
        .filter(
          ([other, v]) =>
            v.explicit && other !== id && depends(manifest, other, id),
        )
        .map(([other]) => other)
      if (affected.length)
        plan.messages.push(
          `Shared source ${id} also affects: ${affected.join(', ')}`,
        )
    }
    manifest.items[id] = next
    Object.assign(npm, item.dependencies)
    Object.assign(dev, item.devDependencies)
  }
  if (conflicts.length)
    throw new Error(
      `Local files differ from the registry. Review with tcn diff; --force overwrites these files:\n${conflicts.map((p) => `  ${p}`).join('\n')}`,
    )
  const beforePackage = json(pkg)
  for (const [name, version] of Object.entries(npm)) {
    if (pkg.dependencies?.[name]) continue
    pkg.dependencies ??= {}
    pkg.dependencies[name] = pkg.devDependencies?.[name] ?? version
    if (pkg.devDependencies?.[name]) delete pkg.devDependencies[name]
  }
  for (const [name, version] of Object.entries(dev))
    if (!pkg.dependencies?.[name] && !pkg.devDependencies?.[name]) {
      pkg.devDependencies ??= {}
      pkg.devDependencies[name] = version
    }
  const packageChanged = !beforePackage.equals(json(pkg))
  if (packageChanged) await change(plan, 'package.json', json(pkg))
  else plan.guards.set('package.json', packageBytes)
  manifest.release = registry.release
  await change(plan, '.tcn/manifest.json', json(manifest))
  plan.install = packageChanged && options.install !== false
  return plan
}
export async function planInit(
  root: string,
  registry: Registry,
  schema: string,
  options: Options = {},
) {
  const plan = makePlan(root),
    packageBytes = await read(root, 'package.json'),
    configBytes = await read(root, 'tcn.json')
  if (configBytes && !options.force)
    throw new Error(
      'Project already has tcn.json. Use --force to reinitialize CLI metadata; application files are preserved.',
    )
  const config = configBytes
      ? (await loadConfig(root)).config
      : structuredClone(defaultConfig),
    existing = !!packageBytes
  plan.guards.set('package.json', packageBytes)
  plan.guards.set('tcn.json', configBytes)
  if (existing) packageObject(packageBytes)
  else {
    const conflicts: string[] = []
    for (const file of registry.template.files) {
      let content = file.content
      if (file.path === 'package.json') {
        const pkg = JSON.parse(content) as Package
        pkg.name =
          basename(resolve(root))
            .toLowerCase()
            .replace(/[^a-z0-9._-]+/g, '-')
            .replace(/^[._-]+/, '') || 'tcn-app'
        content = json(pkg).toString('utf8')
      }
      const bytes = Buffer.from(content),
        current = await read(root, file.path)
      if (current && !same(current, bytes) && !options.force)
        conflicts.push(file.path)
      await change(plan, file.path, bytes, current)
    }
    if (conflicts.length)
      throw new Error(
        `Template conflicts. --force overwrites only these template paths:\n${conflicts.map((p) => `  ${p}`).join('\n')}`,
      )
  }
  const { manifest, bytes: manifestBytes } = await loadManifest(
    root,
    config,
    registry.release,
  )
  plan.guards.set('.tcn/manifest.json', manifestBytes)
  const planned = new Map(plan.changes.map((c) => [c.path, c.after])),
    adopted: string[] = []
  for (const id of resolveItems(registry, names(registry))) {
    const candidate = installed(
        registry,
        id,
        config,
        !!registry.items[id]?.public,
      ),
      present = await Promise.all(
        Object.keys(candidate.files).map((path) =>
          planned.has(path) ? planned.get(path) : read(root, path),
        ),
      )
    if (present.every(Boolean) && !manifest.items[id]) {
      manifest.items[id] = candidate
      if (candidate.explicit) adopted.push(id)
    }
  }
  // Only complete graphs are adopted; partial source remains untracked until explicitly added.
  let removed = true
  while (removed) {
    removed = false
    for (const [id, item] of Object.entries(manifest.items))
      if (item.registryDependencies.some((dep) => !manifest.items[dep])) {
        delete manifest.items[id]
        removed = true
      }
  }
  await change(plan, 'tcn.json', json(config))
  await change(plan, '.tcn/schema.json', Buffer.from(schema))
  await change(plan, '.tcn/manifest.json', json(manifest))
  plan.install = !existing && options.install !== false
  plan.messages.push(
    existing
      ? 'Configured existing project; application source preserved.'
      : 'Created starter with Home, Gallery and Tweak.',
  )
  if (adopted.length)
    plan.messages.push(
      `Adopted existing component source; baseline is bundled registry ${registry.release}. Local edits are preserved.`,
    )
  return plan
}
async function sourceFiles(root: string): Promise<string[]> {
  const result: string[] = []
  async function visit(dir: string) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (
        ['node_modules', 'dist', '.git', '.tcn', 'coverage'].includes(
          entry.name,
        )
      )
        continue
      const path = join(dir, entry.name)
      if (entry.isDirectory()) await visit(path)
      else if (entry.isFile() && /\.[cm]?[jt]sx?$/.test(path)) result.push(path)
    }
  }
  await visit(root)
  return result
}
function referencedPath(from: string, specifier: string, config: Config) {
  for (const key of ['ui', 'lib'] as const) {
    const alias = config.aliases[key]
    if (specifier.startsWith(`${alias}/`))
      return `${config.paths[key]}/${specifier.slice(alias.length + 1)}`
  }
  if (specifier.startsWith('.'))
    return posix.normalize(posix.join(posix.dirname(from), specifier))
  return null
}
export async function planRemove(
  root: string,
  registry: Registry,
  requested: string[],
  options: Options = {},
) {
  const { manifest, config, plan } = await project(root, registry),
    selected = [...new Set(requested)]
  if (!selected.length)
    throw new Error('Specify installed component names or --all.')
  for (const id of selected)
    if (
      id.startsWith('_') ||
      (!registry.items[id]?.public && !manifest.items[id])
    )
      throw new Error(`Unknown component: ${id}`)
  for (const id of selected)
    if (!manifest.items[id]) throw new Error(`Component is not tracked: ${id}`)
  const retained = new Set<string>(),
    visit = (id: string) => {
      if (retained.has(id)) return
      retained.add(id)
      for (const dep of manifest.items[id]?.registryDependencies ?? [])
        visit(dep)
    }
  for (const [id, item] of Object.entries(manifest.items))
    if (item.explicit && !selected.includes(id)) visit(id)
  for (const id of selected)
    if (retained.has(id)) {
      const users = Object.entries(manifest.items)
        .filter(
          ([other, item]) =>
            other !== id &&
            item.explicit &&
            !selected.includes(other) &&
            depends(manifest, other, id),
        )
        .map(([other]) => other)
      throw new Error(
        `${id} is required by ${users.join(', ')}. Remove dependents together. --force does not bypass dependencies.`,
      )
    }
  const candidates = Object.keys(manifest.items).filter(
      (id) => !retained.has(id),
    ),
    paths = new Map<string, { path: string; base: string }>()
  for (const id of candidates)
    for (const [path, file] of Object.entries(manifest.items[id]?.files ?? {}))
      paths.set(path.toLowerCase(), { path, base: file.base })
  const references: string[] = []
  for (const absolute of await sourceFiles(plan.root)) {
    const from = portable(absolute.slice(plan.root.length + 1))
    if (paths.has(from.toLowerCase())) continue
    const bytes = await readFile(absolute),
      content = bytes.toString('utf8')
    for (const match of content.matchAll(/['"`]([^'"`\r\n]+)['"`]/g)) {
      const raw = referencedPath(from, match[1] ?? '', config)
      if (!raw) continue
      const variants = [
        raw,
        `${raw}.ts`,
        `${raw}.tsx`,
        `${raw}/index.ts`,
        `${raw}/index.tsx`,
        raw.replace(/\.js$/, '.ts'),
        raw.replace(/\.js$/, '.tsx'),
      ]
      if (variants.some((path) => paths.has(path.toLowerCase()))) {
        references.push(from)
        break
      }
    }
    plan.guards.set(from, bytes)
  }
  if (references.length)
    throw new Error(
      `Application source still references files being removed:\n${references.map((p) => `  ${p}`).join('\n')}\nRemove these usages first; --force does not rewrite application or gallery code.`,
    )
  const modified: string[] = []
  for (const { path, base } of paths.values()) {
    const local = await read(root, path)
    if (local && !sameSource(local, base) && !options.force) modified.push(path)
    await change(plan, path, null, local)
  }
  if (modified.length)
    throw new Error(
      `Modified managed files would be deleted. Review before using --force:\n${modified.map((p) => `  ${p}`).join('\n')}`,
    )
  for (const id of candidates) delete manifest.items[id]
  await change(plan, '.tcn/manifest.json', json(manifest))
  plan.messages.push(
    `Remove ${candidates.filter((id) => !id.startsWith('_')).join(', ')} and unneeded managed helpers. Package dependencies are retained.`,
  )
  return plan
}
export async function diff(
  root: string,
  registry: Registry,
  requested: string[],
) {
  const { config, manifest } = await project(root, registry),
    selected = publicItems(
      registry,
      requested.length
        ? requested
        : Object.entries(manifest.items)
            .filter(([id, i]) => i.explicit && registry.items[id]?.public)
            .map(([id]) => id),
    ),
    output: string[] = []
  for (const id of resolveItems(registry, selected))
    for (const file of registry.items[id]?.files ?? []) {
      const path = destination(file.path, config),
        local = await read(root, path),
        next = renderFile(file, config)
      if (sameSource(local, next)) continue
      const base = manifest.items[id]?.files[path]
      output.push(
        `${path}: ${local === null ? 'missing' : base && sameSource(local, base.base) ? 'unmodified locally' : 'local edits or untracked source'}; ${base && normalizedSource(next) === normalizedSource(base.base) ? 'upstream unchanged' : 'upstream differs from installed baseline'}`,
        createTwoFilesPatch(
          `a/${path}`,
          `b/${path}`,
          local?.toString('utf8') ?? '',
          next,
          'local',
          'bundled registry',
          { context: 3, stripTrailingCr: true },
        ),
      )
    }
  return output.length
    ? output.join('\n')
    : 'No differences from the bundled registry.'
}
