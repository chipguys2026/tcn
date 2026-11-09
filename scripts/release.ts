import { readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { readArtifact } from './lib/artifact.js'
import {
  GitHubApi,
  publishRelease,
  validateReleaseContext,
} from './lib/github-release.js'
import { changelogSection } from './lib/version.js'

async function main() {
  const root = resolve(import.meta.dir, '..'),
    context = {
      actions: process.env.GITHUB_ACTIONS === 'true',
      repository: process.env.GITHUB_REPOSITORY ?? '',
      sha: process.env.GITHUB_SHA ?? '',
      ref: process.env.GITHUB_REF ?? '',
      event: process.env.GITHUB_EVENT_NAME ?? '',
    }
  // Check the CI boundary before constructing a network client. Local execution cannot publish.
  if (
    !context.actions ||
    context.repository !== 'chipguys2026/tcn' ||
    context.ref !== 'refs/heads/main'
  )
    throw new Error(
      'Release publishing is disabled outside chipguys2026/tcn main GitHub Actions',
    )
  const { info, assets } = await readArtifact(join(root, 'artifacts/release'))
  validateReleaseContext(context, info)
  const pkg = JSON.parse(
    await readFile(join(root, 'package.json'), 'utf8'),
  ) as { version: string }
  if (pkg.version !== info.version)
    throw new Error('Checkout and release artifact versions differ')
  const notes = changelogSection(
      await readFile(join(root, 'CHANGELOG.md'), 'utf8'),
      info.version,
    ),
    token = process.env.GH_TOKEN
  if (!token) throw new Error('GH_TOKEN is required in the release job')
  console.log(
    (await publishRelease(new GitHubApi(token), context, info, assets, notes))
      .message,
  )
}
if (import.meta.main)
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
