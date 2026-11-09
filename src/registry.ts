import { readFile } from 'node:fs/promises'
import { destination, importAlias, relativeImport } from './config.js'
import { hash, safeRelative } from './files.js'
import type { Config, Registry, RegistryFile } from './types.js'
export async function loadRegistry(
  path = new URL('./registry.json', import.meta.url),
) {
  const registry = JSON.parse(await readFile(path, 'utf8')) as Registry
  if (
    registry.version !== 1 ||
    !registry.release ||
    !registry.items ||
    !registry.template?.files
  )
    throw new Error('Invalid bundled registry; rebuild or reinstall TCN')
  const files = new Set<string>()
  for (const item of Object.values(registry.items)) {
    for (const dependency of item.registryDependencies)
      if (!registry.items[dependency])
        throw new Error(`Missing registry dependency: ${dependency}`)
    for (const file of item.files) {
      safeRelative(file.path)
      if (hash(file.content) !== file.hash || files.has(file.path))
        throw new Error(`Invalid or duplicated registry file: ${file.path}`)
      files.add(file.path)
    }
  }
  return registry
}
export function names(registry: Registry) {
  return Object.values(registry.items)
    .filter((i) => i.public)
    .map((i) => i.name)
    .sort()
}
export function resolveItems(registry: Registry, requested: string[]) {
  const result = new Set<string>(),
    visit = (id: string) => {
      if (result.has(id)) return
      const item = registry.items[id]
      if (!item) throw new Error(`Unknown component: ${id}. Run tcn list.`)
      result.add(id)
      for (const dep of item.registryDependencies) visit(dep)
    }
  for (const id of requested) visit(id)
  return [...result].sort()
}
export function publicItems(registry: Registry, requested: string[]) {
  if (!requested.length)
    throw new Error('Specify component names or --all. Run tcn list.')
  for (const id of requested)
    if (!registry.items[id]?.public)
      throw new Error(`Unknown component: ${id}. Run tcn list.`)
  return [...new Set(requested)]
}
export function renderFile(file: RegistryFile, config: Config) {
  let content = file.content
  for (const link of [...file.imports].sort((a, b) => b.start - a.start)) {
    const specifier = link.relative
      ? relativeImport(
          destination(file.path, config),
          destination(link.target, config),
        )
      : importAlias(link.target, config)
    content = content.slice(0, link.start) + specifier + content.slice(link.end)
  }
  return content
}
