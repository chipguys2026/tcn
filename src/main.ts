import { spawnSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { loadConfig, loadManifest } from './config.js'
import { commit } from './files.js'
import { diff, planAdd, planInit, planRemove } from './operations.js'
import { loadRegistry, names } from './registry.js'
import type { Options } from './types.js'

const help = `TCN — source-owned React + OpenTUI components

Usage:
  tcn init [directory]       Create a starter, or configure an existing project
  tcn add <components...>    Add components and required source dependencies
  tcn remove <components...> Remove unused managed source
  tcn diff [components...]   Compare local source with the bundled registry
  tcn list                  List available component families

Options:
  --cwd, -c <directory>      Project directory (default: current directory)
  --all, -a                 Select all public components (add/remove/diff)
  --force, -f               Overwrite modified source; never bypass dependencies
  --dry-run                 Show the complete file plan without writing/installing
  --no-install              Update files/package.json without running bun install
  --help, -h                Show help
  --version, -v             Show bundled release

The CLI runs on Node >=22 or Bun. Generated OpenTUI applications require Bun.
`
async function main(args: string[]) {
  if (args.includes('--help') || args.includes('-h') || !args.length) {
    console.log(help)
    return
  }
  const options: Options = {},
    positionals: string[] = []
  let cwd = process.cwd(),
    all = false,
    version = false
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--cwd' || arg === '-c') {
      const value = args[++i]
      if (!value || value.startsWith('-'))
        throw new Error('--cwd requires a directory')
      cwd = resolve(value)
    } else if (arg === '--force' || arg === '-f') options.force = true
    else if (arg === '--dry-run') options.dryRun = true
    else if (arg === '--no-install') options.install = false
    else if (arg === '--all' || arg === '-a') all = true
    else if (arg === '--version' || arg === '-v') version = true
    else if (arg?.startsWith('-')) throw new Error(`Unknown option: ${arg}`)
    else if (arg) positionals.push(arg)
  }
  const registry = await loadRegistry()
  if (version) {
    console.log(registry.release)
    return
  }
  const [command, ...requested] = positionals
  if (command === 'list') {
    if (requested.length || all)
      throw new Error('tcn list does not accept component arguments')
    console.log(names(registry).join('\n'))
    return
  }
  if (!['init', 'add', 'remove', 'diff'].includes(command ?? ''))
    throw new Error(`Unknown command: ${command}. Run tcn --help.`)
  if (command === 'init' && (all || requested.length > 1))
    throw new Error('tcn init accepts one optional directory')
  const root = command === 'init' ? resolve(cwd, requested[0] ?? '.') : cwd
  let selected = all ? names(registry) : requested
  if (command === 'remove' && all) {
    const { config } = await loadConfig(root),
      { manifest } = await loadManifest(root, config, registry.release)
    selected = Object.keys(manifest.items).filter((id) => !id.startsWith('_'))
  }
  if (command === 'diff') {
    console.log(await diff(root, registry, selected))
    return
  }
  const plan =
    command === 'init'
      ? await planInit(
          root,
          registry,
          await readFile(new URL('./tcn.schema.json', import.meta.url), 'utf8'),
          options,
        )
      : command === 'add'
        ? await planAdd(root, registry, selected, options)
        : await planRemove(root, registry, selected, options)
  for (const message of plan.messages) console.log(message)
  for (const change of plan.changes)
    console.log(
      `${change.after === null ? 'DELETE' : change.before === null ? 'CREATE' : 'UPDATE'} ${change.path}`,
    )
  if (options.dryRun) {
    console.log(
      `Dry run: ${plan.changes.length} file changes; no files written or packages installed.`,
    )
    return
  }
  if (plan.install) {
    const probe = spawnSync('bun', ['--version'], {
      stdio: 'ignore',
      shell: false,
    })
    if (probe.error || probe.status !== 0)
      throw new Error(
        'Bun is required to install application dependencies. Install Bun or pass --no-install. No files were changed.',
      )
  }
  await commit(plan)
  if (plan.install) {
    const result = spawnSync('bun', ['install'], {
      cwd: root,
      stdio: 'inherit',
      shell: false,
    })
    if (result.error || result.status !== 0)
      throw new Error(
        'Source files were saved, but bun install failed. Run bun install in the project to retry.',
      )
  }
  console.log(
    plan.changes.length
      ? `Done: ${plan.changes.length} file changes in ${root}`
      : 'Already up to date.',
  )
  if (command === 'init')
    console.log(
      `Next: ${options.install === false ? 'bun install, then ' : ''}bun run dev in ${root}`,
    )
}
main(process.argv.slice(2)).catch((error) => {
  console.error(
    `tcn: ${error instanceof Error ? error.message : String(error)}`,
  )
  process.exitCode = 1
})
