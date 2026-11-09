import { posix } from 'node:path'
import { hash, parse, read, safeRelative } from './files.js'
import type { Config, Manifest } from './types.js'
export const defaultConfig: Config = {
  $schema: './.tcn/schema.json',
  version: 1,
  registry: 'bundled',
  packageManager: 'bun',
  paths: { ui: 'src/components/ui', lib: 'src/lib/ui' },
  aliases: { ui: '@/components/ui', lib: '@/lib/ui' },
}
function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}
export function validateConfig(value: unknown): Config {
  if (
    !record(value) ||
    value.version !== 1 ||
    value.registry !== 'bundled' ||
    value.packageManager !== 'bun' ||
    !record(value.paths) ||
    !record(value.aliases)
  )
    throw new Error(
      'Unsupported tcn.json. Expected version 1, registry "bundled", packageManager "bun", paths and aliases.',
    )
  for (const key of Object.keys(value))
    if (
      ![
        '$schema',
        'version',
        'registry',
        'packageManager',
        'paths',
        'aliases',
      ].includes(key)
    )
      throw new Error(`Unknown tcn.json field: ${key}`)
  for (const section of ['paths', 'aliases'] as const) {
    const group = value[section] as Record<string, unknown>
    if (Object.keys(group).some((k) => !['ui', 'lib'].includes(k)))
      throw new Error(`Unknown ${section} key in tcn.json`)
    for (const key of ['ui', 'lib']) {
      const v = group[key]
      if (typeof v !== 'string')
        throw new Error(`Missing ${section}.${key} in tcn.json`)
      if (section === 'paths') {
        safeRelative(v)
        if (
          v
            .split('/')
            .some((p) =>
              ['.tcn', '.git', 'node_modules', 'dist'].includes(
                p.toLowerCase(),
              ),
            )
        )
          throw new Error(`Reserved component destination: ${v}`)
      } else if (
        !/^[@#~\w][@\w/#~-]*$/.test(v) ||
        v.endsWith('/') ||
        v.includes('//')
      )
        throw new Error(`Invalid import alias: ${v}`)
    }
  }
  const config = value as Config
  for (const section of ['paths', 'aliases'] as const) {
    const a = config[section].ui.toLowerCase(),
      b = config[section].lib.toLowerCase()
    if (a === b || a.startsWith(`${b}/`) || b.startsWith(`${a}/`))
      throw new Error(`UI and lib ${section} must not overlap`)
  }
  return config
}
export const layout = (config: Config) =>
  hash(JSON.stringify({ paths: config.paths, aliases: config.aliases }))
export function destination(source: string, config: Config) {
  for (const key of ['ui', 'lib'] as const) {
    const prefix = key === 'ui' ? 'src/components/ui/' : 'src/lib/ui/'
    if (source.startsWith(prefix))
      return `${config.paths[key]}/${source.slice(prefix.length)}`
  }
  throw new Error(`Unsupported registry source: ${source}`)
}
export function importAlias(source: string, config: Config) {
  for (const key of ['ui', 'lib'] as const) {
    const prefix = key === 'ui' ? 'src/components/ui/' : 'src/lib/ui/'
    if (source.startsWith(prefix))
      return `${config.aliases[key]}/${source
        .slice(prefix.length)
        .replace(/\.(tsx?|jsx?)$/, '')
        .replace(/\/index$/, '')}`
  }
  throw new Error(`Unsupported import target: ${source}`)
}
export function relativeImport(from: string, to: string) {
  const path = posix
    .relative(posix.dirname(from), to)
    .replace(/\.(tsx?|jsx?)$/, '')
  return path.startsWith('.') ? path : `./${path}`
}
export async function loadConfig(root: string) {
  const bytes = await read(root, 'tcn.json')
  return { config: validateConfig(parse(bytes, 'tcn.json')), bytes }
}
export async function loadManifest(
  root: string,
  config: Config,
  release: string,
) {
  const bytes = await read(root, '.tcn/manifest.json')
  if (!bytes)
    return {
      manifest: {
        version: 1,
        layout: layout(config),
        release,
        items: {},
      } as Manifest,
      bytes,
    }
  const value = parse<Manifest>(bytes, '.tcn/manifest.json')
  if (
    value.version !== 1 ||
    (value.layout !== layout(config) &&
      record(value.items) &&
      Object.keys(value.items).length > 0) ||
    !record(value.items)
  )
    throw new Error(
      'TCN layout differs from the installed manifest. Restore the previous paths/aliases before updating; moving installed files requires a migration.',
    )
  const owners = new Set<string>()
  value.layout = layout(config)
  for (const [id, item] of Object.entries(value.items)) {
    if (
      !record(item) ||
      typeof item.explicit !== 'boolean' ||
      typeof item.revision !== 'string' ||
      !Array.isArray(item.registryDependencies) ||
      !item.registryDependencies.every((d) => typeof d === 'string') ||
      !record(item.files)
    )
      throw new Error(`Invalid installed item: ${id}`)
    for (const [path, file] of Object.entries(item.files)) {
      safeRelative(path)
      if (
        !record(file) ||
        typeof file.source !== 'string' ||
        typeof file.base !== 'string' ||
        typeof file.hash !== 'string' ||
        hash(file.base) !== file.hash ||
        destination(file.source, config) !== path ||
        owners.has(path.toLowerCase())
      )
        throw new Error(`Invalid managed file in manifest: ${path}`)
      owners.add(path.toLowerCase())
    }
  }
  for (const item of Object.values(value.items))
    for (const dep of item.registryDependencies)
      if (!value.items[dep])
        throw new Error(
          `Manifest is missing dependency ${dep}; restore the manifest before continuing`,
        )
  return { manifest: value, bytes }
}
