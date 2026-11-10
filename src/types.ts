export type Config = {
  $schema?: string
  version: 1
  registry: 'bundled'
  packageManager: 'bun'
  paths: { ui: string; lib: string }
  aliases: { ui: string; lib: string }
}
export type ImportLink = {
  start: number
  end: number
  target: string
  relative: boolean
}
export type RegistryFile = {
  path: string
  content: string
  hash: string
  imports: ImportLink[]
}
export type RegistryItem = {
  name: string
  public: boolean
  kind?: 'icons'
  revision: string
  registryDependencies: string[]
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  files: RegistryFile[]
}
export type Registry = {
  version: 1
  release: string
  revision: string
  items: Record<string, RegistryItem>
  template: { files: { path: string; content: string }[] }
}
export type InstalledFile = { source: string; base: string; hash: string }
export type InstalledItem = {
  explicit: boolean
  revision: string
  registryDependencies: string[]
  files: Record<string, InstalledFile>
}
export type Manifest = {
  version: 1
  layout: string
  release: string
  items: Record<string, InstalledItem>
}
export type Change = {
  path: string
  before: Buffer | null
  after: Buffer | null
}
export type Plan = {
  root: string
  changes: Change[]
  messages: string[]
  install: boolean
  guards: Map<string, Buffer | null>
}
export type Options = { force?: boolean; dryRun?: boolean; install?: boolean }
