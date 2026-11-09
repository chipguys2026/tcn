import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { parseVersion } from './version.js'
export type ReleaseInfo = {
  version: string
  tag: string
  file: string
  sha256: string
  commit: string | null
  registryRevision: string
  components: number
}
export const sha256 = (bytes: Uint8Array | string) =>
  createHash('sha256').update(bytes).digest('hex')
export async function readArtifact(directory: string) {
  const bytes = await readFile(join(directory, 'release.json')),
    info = JSON.parse(bytes.toString('utf8')) as ReleaseInfo
  parseVersion(info.version)
  if (
    info.tag !== `v${info.version}` ||
    info.file !== `tcn-${info.version}.tgz` ||
    basename(info.file) !== info.file ||
    !/^[a-f0-9]{64}$/.test(info.sha256) ||
    !Number.isInteger(info.components) ||
    info.components < 1 ||
    typeof info.registryRevision !== 'string' ||
    (info.commit !== null && !/^[a-f0-9]{40}$/.test(info.commit))
  )
    throw new Error('Invalid release metadata')
  const tarball = await readFile(join(directory, info.file)),
    checksum = await readFile(join(directory, 'SHA256SUMS'))
  if (
    sha256(tarball) !== info.sha256 ||
    checksum.toString('utf8') !== `${info.sha256}  ${info.file}\n`
  )
    throw new Error('Release checksum mismatch')
  return {
    info,
    assets: [
      { name: info.file, bytes: tarball },
      { name: 'SHA256SUMS', bytes: checksum },
      { name: 'release.json', bytes },
    ],
  }
}
export function assertArchiveEntries(entries: string[]) {
  if (!entries.length) throw new Error('Empty package archive')
  for (const entry of entries) {
    if (entry === 'package/') continue
    const path = entry.replace(/\/$/, '')
    if (
      !path.startsWith('package/') ||
      path.includes('\\') ||
      path.split('/').some((p) => p === '..' || p === '') ||
      path.startsWith('/')
    )
      throw new Error(`Unsafe archive member: ${entry}`)
  }
  for (const file of [
    'package/package.json',
    'package/dist/cli.js',
    'package/dist/registry.json',
    'package/dist/tcn.schema.json',
  ])
    if (!entries.includes(file)) throw new Error(`Package is missing ${file}`)
  for (const entry of entries)
    if (
      /(?:^|\/)(?:node_modules|\.git)(?:\/|$)|\.draft\.json$|\.backup\.json$|(?:^|\/)\.env(?:\.|$)/.test(
        entry,
      )
    )
      throw new Error(
        `Private or generated dependency data in package: ${entry}`,
      )
}
