import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { assertArchiveEntries, readArtifact } from './lib/artifact.js'

async function main() {
  const args = process.argv.slice(2),
    offline = args.includes('--offline'),
    full = args.includes('--full'),
    keep = args.includes('--keep'),
    directoryArg = args.indexOf('--directory'),
    root = resolve(import.meta.dir, '..'),
    directory =
      directoryArg >= 0
        ? resolve(args[directoryArg + 1] ?? '')
        : join(root, 'artifacts/release')
  const { info } = await readArtifact(directory),
    parent = join(root, '.verification')
  await mkdir(parent, { recursive: true })
  const working = await mkdtemp(join(parent, 'packed-smoke-'))
  if (
    dirname(working) !== parent ||
    !basename(working).startsWith('packed-smoke-')
  )
    throw new Error('Unsafe smoke cleanup target')
  function run(command: string[], cwd = working) {
    const result = Bun.spawnSync(command, {
      cwd,
      stdout: 'inherit',
      stderr: 'inherit',
      stdin: 'ignore',
    })
    if (result.exitCode !== 0)
      throw new Error(
        `Smoke command failed: ${command.join(' ')} (${result.exitCode})`,
      )
  }
  try {
    const archive = relative(working, join(directory, info.file)).replaceAll(
        '\\',
        '/',
      ),
      listing = Bun.spawnSync(['tar', '-tzf', info.file], {
        cwd: directory,
        stdout: 'pipe',
        stderr: 'pipe',
      })
    if (listing.exitCode !== 0) throw new Error(listing.stderr.toString())
    assertArchiveEntries(listing.stdout.toString().trim().split(/\r?\n/))
    run(['tar', '-xzf', archive])
    const cli = join(working, 'package/dist/cli.js'),
      version = Bun.spawnSync(['node', cli, '--version'], {
        stdout: 'pipe',
        stderr: 'pipe',
      })
    if (
      version.exitCode !== 0 ||
      version.stdout.toString().trim() !== info.version
    )
      throw new Error('Packed CLI version mismatch')
    run(['node', cli, 'init', 'app', '--no-install'])
    const app = join(working, 'app'),
      pkg = JSON.parse(await readFile(join(app, 'package.json'), 'utf8')) as {
        dependencies?: Record<string, string>
      }
    if (pkg.dependencies?.tcn)
      throw new Error('Generated app must not depend on tcn')
    run(['node', cli, 'add', 'button', '--cwd', app, '--no-install'])
    run(['node', cli, 'diff', 'button', '--cwd', app])
    const m = JSON.parse(
      await readFile(join(app, '.tcn/manifest.json'), 'utf8'),
    ) as { items: Record<string, { explicit: boolean }> }
    if (
      Object.values(m.items).filter((i) => i.explicit).length !==
      info.components
    )
      throw new Error('Generated component tracking is incomplete')
    if (full) {
      run(
        [
          process.execPath,
          'install',
          '--frozen-lockfile',
          ...(offline ? ['--offline'] : []),
        ],
        app,
      )
      run([process.execPath, 'run', 'check'], app)
      run([process.execPath, 'run', 'build'], app)
    }
    console.log(
      `Packed smoke passed: ${info.file}${full ? ' (app checks and build included)' : ''}`,
    )
  } finally {
    if (!keep) {
      await rm(working, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 100,
      })
    } else console.log(`Kept smoke app at ${working}`)
  }
}
if (import.meta.main)
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
