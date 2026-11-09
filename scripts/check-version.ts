import { execFileSync } from 'node:child_process'
import { appendFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import {
  changelogSection,
  compareVersions,
  parseVersion,
} from './lib/version.js'

const zero = /^0{40}$/
export function releaseRelevant(path: string) {
  return !(/(?:^|\/)docs\//.test(path) || /\.(md|mdx)$/i.test(path))
}
function git(root: string, args: string[]) {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  })
}
function versionAt(root: string, ref: string) {
  const value = JSON.parse(git(root, ['show', `${ref}:package.json`])) as {
    version?: unknown
  }
  if (typeof value.version !== 'string')
    throw new Error(`${ref}:package.json has no version`)
  parseVersion(value.version)
  return value.version
}
export function checkVersion(root: string, baseRef?: string, headRef = 'HEAD') {
  const head = git(root, [
      'rev-parse',
      '--verify',
      `${headRef}^{commit}`,
    ]).trim(),
    version = versionAt(root, head),
    notes = git(root, ['show', `${head}:CHANGELOG.md`])
  changelogSection(notes, version)
  if (!baseRef || zero.test(baseRef))
    return {
      version,
      changed: true,
      bootstrap: true,
      message: `Initial history: ${version}`,
    }
  const base = git(root, [
    'rev-parse',
    '--verify',
    `${baseRef}^{commit}`,
  ]).trim()
  try {
    git(root, ['merge-base', '--is-ancestor', base, head])
  } catch {
    throw new Error('Update this branch from the current main before merging')
  }
  if (!git(root, ['ls-tree', '--name-only', base, '--', 'package.json']).trim())
    return {
      version,
      changed: true,
      bootstrap: true,
      message: `Initial package: ${version}`,
    }
  const previous = versionAt(root, base),
    paths = git(root, ['diff', '--name-only', '--no-renames', '-z', base, head])
      .split('\0')
      .filter(Boolean),
    changed = paths.some(releaseRelevant),
    order = compareVersions(version, previous)
  if (order < 0)
    throw new Error(`Version cannot go backwards: ${previous} -> ${version}`)
  if (changed && order <= 0)
    throw new Error(
      `Release source changed: bump package.json version above ${previous} and update CHANGELOG.md`,
    )
  if (order > 0 && !paths.includes('CHANGELOG.md'))
    throw new Error('A version bump must update CHANGELOG.md')
  return {
    version,
    changed,
    bootstrap: false,
    message:
      order > 0
        ? `Version accepted: ${previous} -> ${version}`
        : 'No release source changes; version bump not required',
  }
}
async function main() {
  const args = process.argv.slice(2)
  let base = process.env.BASE_SHA,
    head = process.env.HEAD_SHA ?? 'HEAD',
    root = process.cwd()
  for (let i = 0; i < args.length; i++) {
    const value = args[i + 1]
    if (!value) throw new Error(`Missing value for ${args[i]}`)
    if (args[i] === '--base') base = value
    else if (args[i] === '--head') head = value
    else if (args[i] === '--cwd') root = resolve(value)
    else throw new Error(`Unknown option: ${args[i]}`)
    i++
  }
  if (process.env.CI && !base)
    throw new Error(
      'CI must supply BASE_SHA, including the all-zero SHA on initial push',
    )
  const result = checkVersion(root, base, head)
  console.log(result.message)
  if (process.env.GITHUB_OUTPUT)
    await appendFile(
      process.env.GITHUB_OUTPUT,
      `version=${result.version}\nsource_changed=${result.changed}\n`,
    )
}
if (import.meta.main)
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
