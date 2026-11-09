import { type ReleaseInfo, sha256 } from './artifact.js'
import { parseVersion } from './version.js'

export type Asset = {
  id: number
  name: string
  state: string
  size: number
  digest?: string | null
}
export type Release = {
  id: number
  tag_name: string
  draft: boolean
  assets: Asset[]
}
export type PayloadAsset = { name: string; bytes: Uint8Array }
export type ReleaseContext = {
  actions: boolean
  repository: string
  sha: string
  ref: string
  event: string
}
export interface ReleaseApi {
  request<T>(method: string, path: string, body?: unknown): Promise<T>
  upload(id: number, asset: PayloadAsset): Promise<Asset>
}
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}
export function validateReleaseContext(
  context: ReleaseContext,
  info: ReleaseInfo,
) {
  if (
    !context.actions ||
    context.repository !== 'chipguys2026/tcn' ||
    context.ref !== 'refs/heads/main' ||
    !['push', 'workflow_dispatch'].includes(context.event)
  )
    throw new Error(
      'Release publishing is only enabled in GitHub Actions on chipguys2026/tcn main',
    )
  if (!/^[a-f0-9]{40}$/.test(context.sha) || info.commit !== context.sha)
    throw new Error('Artifact must belong to the exact tested workflow commit')
  if (info.tag !== `v${parseVersion(info.version).raw}`)
    throw new Error('Invalid release version/tag')
}
async function optional<T>(call: () => Promise<T>) {
  try {
    return await call()
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) return null
    throw error
  }
}
export async function publishRelease(
  api: ReleaseApi,
  context: ReleaseContext,
  info: ReleaseInfo,
  assets: PayloadAsset[],
  notes: string,
) {
  validateReleaseContext(context, info)
  const expected = [info.file, 'SHA256SUMS', 'release.json']
  if (
    assets.length !== 3 ||
    new Set(assets.map((a) => a.name)).size !== 3 ||
    expected.some((name) => !assets.some((a) => a.name === name))
  )
    throw new Error('Expected exactly the tarball, SHA256SUMS and release.json')
  const tar = assets.find((a) => a.name === info.file),
    sum = assets.find((a) => a.name === 'SHA256SUMS')
  if (
    !tar ||
    !sum ||
    sha256(tar.bytes) !== info.sha256 ||
    Buffer.from(sum.bytes).toString() !== `${info.sha256}  ${info.file}\n`
  )
    throw new Error('Release payload checksum mismatch')
  const root = `/repos/${context.repository}`,
    tag = encodeURIComponent(info.tag)
  let release = await optional(() =>
    api.request<Release>('GET', `${root}/releases/tags/${tag}`),
  )
  if (!release) {
    for (let page = 1; ; page++) {
      const releases = await api.request<Release[]>(
        'GET',
        `${root}/releases?per_page=100&page=${page}`,
      )
      release = releases.find((r) => r.tag_name === info.tag) ?? null
      if (release || releases.length < 100) break
    }
  }
  // A docs-only main commit can reuse an already published version. Never mutate it.
  if (release && !release.draft)
    return {
      published: false,
      tag: info.tag,
      message: `${info.tag} is already published; left unchanged`,
    }
  type Ref = { object: { type: string; sha: string } }
  let ref = await optional(() =>
    api.request<Ref>('GET', `${root}/git/ref/tags/${tag}`),
  )
  if (!ref) {
    try {
      ref = await api.request<Ref>('POST', `${root}/git/refs`, {
        ref: `refs/tags/${info.tag}`,
        sha: context.sha,
      })
    } catch (error) {
      if (!(error instanceof HttpError) || error.status !== 422) throw error
      ref = await api.request<Ref>('GET', `${root}/git/ref/tags/${tag}`)
    }
  }
  for (let depth = 0; ref.object.type === 'tag' && depth < 8; depth++)
    ref = await api.request<Ref>('GET', `${root}/git/tags/${ref.object.sha}`)
  if (ref.object.type !== 'commit' || ref.object.sha !== context.sha)
    throw new Error(
      `Tag ${info.tag} points to another commit; refusing to move it`,
    )
  const prerelease = parseVersion(info.version).pre.length > 0
  if (!release)
    release = await api.request<Release>('POST', `${root}/releases`, {
      tag_name: info.tag,
      target_commitish: context.sha,
      name: `TCN ${info.version}`,
      body: notes,
      draft: true,
      prerelease,
    })
  if (!Number.isSafeInteger(release.id) || release.id <= 0)
    throw new Error('Invalid release ID')
  for (const asset of assets) {
    let existing = release.assets.find((a) => a.name === asset.name)
    if (existing && existing.state !== 'uploaded') {
      await api.request('DELETE', `${root}/releases/assets/${existing.id}`)
      existing = undefined
    }
    const accepted = existing ?? (await api.upload(release.id, asset))
    if (
      accepted.state !== 'uploaded' ||
      accepted.name !== asset.name ||
      accepted.size !== asset.bytes.byteLength ||
      accepted.digest !== `sha256:${sha256(asset.bytes)}`
    )
      throw new Error(
        `Draft asset ${asset.name} differs from the checked artifact; refusing to overwrite it`,
      )
  }
  // Let GitHub choose Latest by date/SemVer, including when different versions finish out of order.
  await api.request('PATCH', `${root}/releases/${release.id}`, {
    draft: false,
    prerelease,
    make_latest: prerelease ? 'false' : 'legacy',
  })
  return {
    published: true,
    tag: info.tag,
    message: `Published ${info.tag} at ${context.sha}`,
  }
}
export class GitHubApi implements ReleaseApi {
  constructor(private token: string) {}
  private async result<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const text = await response.text()
      throw new HttpError(
        response.status,
        `GitHub API ${response.status}: ${text.slice(0, 500)}`,
      )
    }
    if (response.status === 204) return undefined as T
    return (await response.json()) as T
  }
  request<T>(method: string, path: string, body?: unknown): Promise<T> {
    if (!path.startsWith('/repos/chipguys2026/tcn/'))
      throw new Error('Unexpected repository API path')
    return fetch(`https://api.github.com${path}`, {
      method,
      redirect: 'error',
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'tcn-release',
        Authorization: `Bearer ${this.token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    }).then((response) => this.result<T>(response))
  }
  upload(id: number, asset: PayloadAsset): Promise<Asset> {
    return fetch(
      `https://uploads.github.com/repos/chipguys2026/tcn/releases/${id}/assets?name=${encodeURIComponent(asset.name)}`,
      {
        method: 'POST',
        redirect: 'error',
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'tcn-release',
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/octet-stream',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: Buffer.from(asset.bytes),
      },
    ).then((response) => this.result<Asset>(response))
  }
}
