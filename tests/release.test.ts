import { afterAll, expect, test } from 'bun:test'
import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { checkVersion, releaseRelevant } from '../scripts/check-version.js'
import {
  assertArchiveEntries,
  type ReleaseInfo,
  readArtifact,
  sha256,
} from '../scripts/lib/artifact.js'
import {
  type Asset,
  HttpError,
  type PayloadAsset,
  publishRelease,
  type Release,
  type ReleaseApi,
  type ReleaseContext,
} from '../scripts/lib/github-release.js'
import {
  changelogSection,
  compareVersions,
  parseVersion,
} from '../scripts/lib/version.js'

const roots: string[] = []
async function temp() {
  const root = await mkdtemp(join(tmpdir(), 'tcn-release-test-'))
  if (
    dirname(resolve(root)) !== resolve(tmpdir()) ||
    !root.includes('tcn-release-test-')
  )
    throw new Error('Unsafe release fixture path')
  roots.push(root)
  return root
}
afterAll(async () => {
  for (const root of roots) {
    if (
      dirname(resolve(root)) !== resolve(tmpdir()) ||
      !root.includes('tcn-release-test-')
    )
      throw new Error('Unsafe release test cleanup')
    await rm(root, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 100,
    })
  }
})
function git(root: string, ...args: string[]) {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim()
}
async function write(root: string, path: string, content: string) {
  await mkdir(dirname(join(root, path)), { recursive: true })
  await writeFile(join(root, path), content)
}
async function commit(root: string) {
  git(root, 'add', '--all')
  git(root, '-c', 'commit.gpgsign=false', 'commit', '-qm', 'fixture')
  return git(root, 'rev-parse', 'HEAD')
}
async function fixture() {
  const root = await temp()
  git(root, 'init', '-b', 'main')
  git(root, 'config', 'user.email', 'fixture@example.invalid')
  git(root, 'config', 'user.name', 'TCN fixture')
  git(root, 'config', 'core.hooksPath', join(root, '.no-hooks'))
  await write(
    root,
    'package.json',
    JSON.stringify({ name: 'tcn', version: '1.0.0' }),
  )
  await write(root, 'CHANGELOG.md', '# Changelog\n\n## 1.0.0\n\n- Initial.\n')
  await write(root, 'src/main.ts', 'export const value = 1\n')
  return { root, base: await commit(root) }
}
async function bump(root: string, version = '1.0.1') {
  await write(root, 'package.json', JSON.stringify({ name: 'tcn', version }))
  await write(
    root,
    'CHANGELOG.md',
    `# Changelog\n\n## ${version}\n\n- Updated.\n\n## 1.0.0\n\n- Initial.\n`,
  )
}

test('SemVer ordering covers prereleases, numeric identifiers and build metadata', () => {
  const chain = [
    '1.0.0-alpha',
    '1.0.0-alpha.1',
    '1.0.0-alpha.beta',
    '1.0.0-beta',
    '1.0.0-beta.2',
    '1.0.0-beta.11',
    '1.0.0-rc.1',
    '1.0.0',
    '1.0.1',
    '1.1.0',
    '2.0.0',
  ]
  for (let i = 1; i < chain.length; i++) {
    const a = chain[i - 1],
      b = chain[i]
    if (!a || !b) throw new Error('Missing SemVer fixture')
    expect(compareVersions(a, b)).toBe(-1)
    expect(compareVersions(b, a)).toBe(1)
  }
  expect(compareVersions('1.0.0+abc', '1.0.0+def')).toBe(0)
})
for (const value of [
  '1.0',
  'v1.0.0',
  '01.0.0',
  '1.0.0-01',
  '1.0.0-',
  '1.0.0+',
  '1.0.0\nx=1',
])
  test(`reject invalid version ${JSON.stringify(value)}`, () => {
    expect(() => parseVersion(value)).toThrow()
  })
test('changelog extraction isolates the exact version and rejects empty notes', () => {
  expect(
    changelogSection(
      '## [1.2.3] — date\n\n- Added.\n\n## 1.2.2\n\n- Old.',
      '1.2.3',
    ),
  ).toBe('- Added.')
  expect(() => changelogSection('## 1.2.3\n\n## 1.2.2\nOld', '1.2.3')).toThrow(
    'empty',
  )
})
test('version gate rejects code changes without a version bump', async () => {
  const { root, base } = await fixture()
  await write(root, 'src/main.ts', 'export const value = 2\n')
  await commit(root)
  expect(() => checkVersion(root, base)).toThrow('bump package.json')
})
test('version gate accepts a greater version with changelog and source changes', async () => {
  const { root, base } = await fixture()
  await write(
    root,
    'templates/starter/src/components/ui/new.tsx',
    'export const New = () => null',
  )
  await bump(root)
  await commit(root)
  expect(checkVersion(root, base).version).toBe('1.0.1')
})
test('docs-only edits pass without a version change', async () => {
  const { root, base } = await fixture()
  await write(root, 'docs/guide.md', 'Guide')
  await commit(root)
  expect(checkVersion(root, base).changed).toBe(false)
})
test('tests, dependencies, helpers and workflow changes require a bump', () => {
  for (const path of [
    'tests/cli.test.ts',
    'bun.lock',
    'scripts/build.ts',
    'schemas/tcn.schema.json',
    'templates/starter/src/lib/ui/focus.ts',
    '.github/workflows/ci-release.yml',
  ])
    expect(releaseRelevant(path)).toBe(true)
  expect(releaseRelevant('templates/starter/docs/ui/button.md')).toBe(false)
})
test('version downgrade and build-metadata-only bumps are rejected', async () => {
  const { root, base } = await fixture()
  await bump(root, '0.9.9')
  await commit(root)
  expect(() => checkVersion(root, base)).toThrow('backwards')
  await bump(root, '1.0.0+build.2')
  await commit(root)
  expect(() => checkVersion(root, base)).toThrow('bump package.json')
})
test('bumping the version without updating changelog fails', async () => {
  const { root, base } = await fixture()
  await write(root, 'package.json', JSON.stringify({ version: '1.0.1' }))
  await commit(root)
  expect(() => checkVersion(root, base)).toThrow('CHANGELOG.md')
})
test('first push accepts valid initial version and notes without a base commit', async () => {
  const { root } = await fixture()
  expect(checkVersion(root, '0'.repeat(40)).bootstrap).toBe(true)
})
test('the first package can be introduced after a README-only repository commit', async () => {
  const { root, base: withPackage } = await fixture()
  git(root, 'checkout', '--orphan', 'readme-only')
  git(root, 'rm', '-rf', '.')
  await write(root, 'README.md', 'Readme')
  const base = await commit(root)
  git(
    root,
    'checkout',
    withPackage,
    '--',
    'package.json',
    'CHANGELOG.md',
    'src/main.ts',
  )
  await commit(root)
  expect(checkVersion(root, base).bootstrap).toBe(true)
})
test('a stale/diverged PR must update from main', async () => {
  const { root, base } = await fixture()
  git(root, 'checkout', '-b', 'feature')
  await bump(root)
  const head = await commit(root)
  git(root, 'checkout', 'main')
  await write(root, 'docs/main.md', 'another merge')
  const latest = await commit(root)
  expect(base).not.toBe(latest)
  expect(() => checkVersion(root, latest, head)).toThrow('Update this branch')
})

const context: ReleaseContext = {
  actions: true,
  repository: 'chipguys2026/tcn',
  sha: 'a'.repeat(40),
  ref: 'refs/heads/main',
  event: 'push',
}
function payload(version = '1.0.1') {
  const bytes = Buffer.from('package payload'),
    info: ReleaseInfo = {
      version,
      tag: `v${version}`,
      file: `tcn-${version}.tgz`,
      sha256: sha256(bytes),
      commit: context.sha,
      registryRevision: 'registry-hash',
      components: 51,
    }
  return {
    info,
    assets: [
      { name: info.file, bytes },
      {
        name: 'SHA256SUMS',
        bytes: Buffer.from(`${info.sha256}  ${info.file}\n`),
      },
      { name: 'release.json', bytes: Buffer.from(JSON.stringify(info)) },
    ],
  }
}
class FakeApi implements ReleaseApi {
  calls: { method: string; path: string; body?: unknown }[] = []
  release: Release | null = null
  tag: { object: { type: string; sha: string } } | null = null
  failUpload: string | null = null
  hideDraft = false
  uploads: string[] = []
  async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    this.calls.push({ method, path, body })
    let value: unknown
    if (method === 'GET' && path.includes('/releases/tags/')) {
      if (!this.release || (this.hideDraft && this.release.draft))
        throw new HttpError(404, 'missing')
      value = this.release
    } else if (method === 'GET' && path.includes('/releases?'))
      value = this.release ? [this.release] : []
    else if (method === 'GET' && path.includes('/git/ref/')) {
      if (!this.tag) throw new HttpError(404, 'missing tag')
      value = this.tag
    } else if (method === 'POST' && path.endsWith('/git/refs')) {
      this.tag = {
        object: { type: 'commit', sha: (body as { sha: string }).sha },
      }
      value = this.tag
    } else if (method === 'POST' && path.endsWith('/releases')) {
      this.release = {
        id: 1,
        tag_name: (body as { tag_name: string }).tag_name,
        draft: true,
        assets: [],
      }
      value = this.release
    } else if (method === 'DELETE' && path.includes('/releases/assets/')) {
      const id = Number(path.split('/').at(-1))
      if (this.release)
        this.release.assets = this.release.assets.filter((a) => a.id !== id)
    } else if (method === 'PATCH' && path.endsWith('/releases/1')) {
      if (!this.release) throw new Error('Missing fake release')
      this.release.draft = false
      value = this.release
    } else throw new Error(`Unexpected fake API call: ${method} ${path}`)
    return structuredClone(value) as T
  }
  async upload(_id: number, asset: PayloadAsset) {
    if (this.failUpload === asset.name)
      throw new HttpError(500, 'upload interrupted')
    const value: Asset = {
      id: this.uploads.length + 1,
      name: asset.name,
      state: 'uploaded',
      size: asset.bytes.byteLength,
      digest: `sha256:${sha256(asset.bytes)}`,
    }
    this.uploads.push(asset.name)
    this.release?.assets.push(value)
    return structuredClone(value)
  }
}
test('publisher creates an exact-commit tag, uploads all assets and only then publishes', async () => {
  const api = new FakeApi(),
    p = payload()
  expect(
    (await publishRelease(api, context, p.info, p.assets, 'notes')).published,
  ).toBe(true)
  expect(api.tag?.object.sha).toBe(context.sha)
  expect(api.uploads).toHaveLength(3)
  expect(api.calls.at(-1)).toMatchObject({
    method: 'PATCH',
    body: { draft: false, make_latest: 'legacy' },
  })
})
test('an already published version is left unchanged on later docs-only main commits', async () => {
  const api = new FakeApi(),
    p = payload()
  api.release = { id: 1, tag_name: p.info.tag, draft: false, assets: [] }
  api.tag = { object: { type: 'commit', sha: 'b'.repeat(40) } }
  expect(
    (await publishRelease(api, context, p.info, p.assets, 'notes')).published,
  ).toBe(false)
  expect(api.calls.every((c) => c.method === 'GET')).toBe(true)
  expect(api.uploads).toHaveLength(0)
})
test('an existing tag cannot be moved to another commit', async () => {
  const api = new FakeApi(),
    p = payload()
  api.tag = { object: { type: 'commit', sha: 'b'.repeat(40) } }
  await expect(
    publishRelease(api, context, p.info, p.assets, 'notes'),
  ).rejects.toThrow('another commit')
  expect(api.uploads).toHaveLength(0)
})
test('upload failure keeps a draft; retry resumes matching assets without replacing them', async () => {
  const api = new FakeApi(),
    p = payload()
  api.failUpload = 'SHA256SUMS'
  await expect(
    publishRelease(api, context, p.info, p.assets, 'notes'),
  ).rejects.toThrow('interrupted')
  expect(api.release?.draft).toBe(true)
  api.failUpload = null
  api.hideDraft = true
  await publishRelease(api, context, p.info, p.assets, 'notes')
  expect(api.uploads.filter((n) => n === p.info.file)).toHaveLength(1)
  expect(api.release?.draft).toBe(false)
})
test('mismatched uploaded draft assets are not overwritten', async () => {
  const api = new FakeApi(),
    p = payload()
  api.tag = { object: { type: 'commit', sha: context.sha } }
  api.release = {
    id: 1,
    tag_name: p.info.tag,
    draft: true,
    assets: [
      {
        id: 1,
        name: p.info.file,
        state: 'uploaded',
        size: p.assets[0]?.bytes.byteLength ?? 0,
        digest: 'sha256:bad',
      },
    ],
  }
  await expect(
    publishRelease(api, context, p.info, p.assets, 'notes'),
  ).rejects.toThrow('refusing to overwrite')
  expect(api.uploads).toHaveLength(0)
  expect(api.calls.some((c) => c.method === 'PATCH')).toBe(false)
})
test('prereleases never request the Latest label', async () => {
  const api = new FakeApi(),
    p = payload('1.1.0-beta.1')
  await publishRelease(api, context, p.info, p.assets, 'notes')
  expect(api.calls.at(-1)?.body).toMatchObject({
    prerelease: true,
    make_latest: 'false',
  })
})
test('local/PR/fork contexts and wrong-commit payloads fail before any API access', async () => {
  for (const override of [
    { actions: false },
    { event: 'pull_request' },
    { repository: 'fork/tcn' },
    { ref: 'refs/heads/feature' },
    { sha: 'b'.repeat(40) },
  ]) {
    const api = new FakeApi(),
      p = payload()
    await expect(
      publishRelease(
        api,
        { ...context, ...override },
        p.info,
        p.assets,
        'notes',
      ),
    ).rejects.toThrow()
    expect(api.calls).toHaveLength(0)
  }
})
test('checksum mismatch prevents all release writes', async () => {
  const root = await temp(),
    p = payload()
  await write(root, 'release.json', JSON.stringify(p.info))
  await write(root, 'SHA256SUMS', `${p.info.sha256}  ${p.info.file}\n`)
  await write(root, p.info.file, 'tampered')
  await expect(readArtifact(root)).rejects.toThrow('checksum mismatch')
})
test('archive inspection rejects traversal, missing runtime assets and leaked private files', () => {
  const good = [
    'package/package.json',
    'package/dist/cli.js',
    'package/dist/registry.json',
    'package/dist/tcn.schema.json',
  ]
  expect(() => assertArchiveEntries(good)).not.toThrow()
  for (const extra of [
    'package/../../outside',
    '/absolute',
    'package/.env',
    'package/node_modules/private/index.js',
    'package/design/review.draft.json',
  ])
    expect(() => assertArchiveEntries([...good, extra])).toThrow()
  expect(() => assertArchiveEntries(good.slice(1))).toThrow('missing')
})

test('workflow and local ruleset wire mandatory checks and restrict write permissions', async () => {
  const root = resolve(import.meta.dir, '..'),
    workflow = Bun.YAML.parse(
      await readFile(join(root, '.github/workflows/ci-release.yml'), 'utf8'),
    ) as {
      on: Record<string, unknown>
      permissions: Record<string, string>
      jobs: Record<
        string,
        {
          name?: string
          needs?: string[] | string
          permissions?: Record<string, string>
          if?: string
          steps?: {
            uses?: string
            with?: Record<string, unknown>
            run?: string
          }[]
        }
      >
    }
  expect(Object.keys(workflow.on).sort()).toEqual([
    'pull_request',
    'push',
    'workflow_dispatch',
  ])
  expect(workflow.permissions).toEqual({ contents: 'read' })
  expect(workflow.jobs.ci?.needs).toEqual(['version-check', 'build', 'test'])
  expect(workflow.jobs.release?.needs).toEqual(['ci', 'build'])
  expect(workflow.jobs.release?.permissions).toEqual({ contents: 'write' })
  expect(workflow.jobs.release?.if).toContain("github.ref == 'refs/heads/main'")
  for (const [name, job] of Object.entries(workflow.jobs)) {
    if (name !== 'release') expect(job.permissions?.contents).not.toBe('write')
    for (const step of job.steps ?? [])
      if (step.uses) {
        expect(step.uses).toMatch(/^[\w-]+\/[\w-]+@[a-f0-9]{40}$/)
        if (step.uses.startsWith('actions/checkout@'))
          expect(step.with?.['persist-credentials']).toBe(false)
      }
  }
  const rules = JSON.parse(
    await readFile(join(root, '.github/main-ruleset.json'), 'utf8'),
  ) as {
    enforcement: string
    bypass_actors: unknown[]
    rules: {
      type: string
      parameters?: {
        strict_required_status_checks_policy: boolean
        required_status_checks: { context: string }[]
      }
    }[]
  }
  expect(rules.enforcement).toBe('active')
  expect(rules.bypass_actors).toHaveLength(0)
  expect(rules.rules.some((r) => r.type === 'non_fast_forward')).toBe(true)
  expect(
    rules.rules
      .find((r) => r.type === 'required_status_checks')
      ?.parameters?.required_status_checks.map((c) => c.context),
  ).toEqual(['version-check', 'ci'])
  expect(
    rules.rules.find((r) => r.type === 'required_status_checks')?.parameters
      ?.strict_required_status_checks_policy,
  ).toBe(true)
})
