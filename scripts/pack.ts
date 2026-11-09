import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import {
  assertArchiveEntries,
  type ReleaseInfo,
  sha256,
} from './lib/artifact.js'
import { changelogSection, parseVersion } from './lib/version.js'

const root = resolve(import.meta.dir, '..'),
  pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8')) as {
    version: string
  },
  version = parseVersion(pkg.version).raw,
  registry = JSON.parse(
    await readFile(join(root, 'dist/registry.json'), 'utf8'),
  ) as {
    release: string
    revision: string
    items: Record<string, { public: boolean }>
  }
if (registry.release !== version)
  throw new Error('Registry is stale; run bun run build before packaging')
changelogSection(await readFile(join(root, 'CHANGELOG.md'), 'utf8'), version)
const directory = join(root, 'artifacts/release'),
  file = `tcn-${version}.tgz`
await mkdir(directory, { recursive: true })
const pack = Bun.spawnSync(
  [
    process.execPath,
    'pm',
    'pack',
    '--ignore-scripts',
    '--filename',
    join(directory, file),
  ],
  { cwd: root, stdout: 'pipe', stderr: 'pipe' },
)
if (pack.exitCode !== 0)
  throw new Error(`Package build failed: ${pack.stderr.toString()}`)
const listing = Bun.spawnSync(['tar', '-tzf', file], {
  cwd: directory,
  stdout: 'pipe',
  stderr: 'pipe',
})
if (listing.exitCode !== 0) throw new Error(listing.stderr.toString())
assertArchiveEntries(listing.stdout.toString().trim().split(/\r?\n/))
const sha = sha256(await readFile(join(directory, file))),
  commit = process.env.GITHUB_SHA ?? null
if (commit !== null && !/^[a-f0-9]{40}$/.test(commit))
  throw new Error('Invalid GITHUB_SHA')
const info: ReleaseInfo = {
  version,
  tag: `v${version}`,
  file,
  sha256: sha,
  commit,
  registryRevision: registry.revision,
  components: Object.values(registry.items).filter((i) => i.public).length,
}
await writeFile(join(directory, 'SHA256SUMS'), `${sha}  ${file}\n`)
await writeFile(
  join(directory, 'release.json'),
  `${JSON.stringify(info, null, 2)}\n`,
)
if (process.env.GITHUB_OUTPUT)
  await appendFile(
    process.env.GITHUB_OUTPUT,
    `version=${version}\ntag=${info.tag}\nfile=${file}\n`,
  )
console.log(`Packed ${file}\nSHA-256 ${sha}`)
