import { expect, test } from 'bun:test'
import {
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { startDev } from '../../scripts/dev'

async function waitFor(predicate: () => Promise<boolean>) {
  const deadline = Date.now() + 5000
  while (Date.now() < deadline) {
    if (await predicate()) return
    await Bun.sleep(25)
  }
  throw new Error('Timed out waiting for the development watcher')
}

test('dev detects route additions/renames/deletions and restarts the app after generation', async () => {
  const root = await mkdtemp(join(tmpdir(), 'tui-dev-'))
  const app = join(root, 'src/app')
  const output = join(root, 'src/router/routes.generated.ts')
  const marker = join(root, 'starts.txt')
  await mkdir(app, { recursive: true })
  await writeFile(join(app, 'page.tsx'), 'export default () => null')
  await writeFile(
    join(root, 'src/main.tsx'),
    `import { appendFileSync } from 'node:fs'; appendFileSync(${JSON.stringify(marker)}, 'started;'); setInterval(() => {}, 1000)`,
  )
  const errors: unknown[] = []
  const dev = await startDev(root, {
    log: () => {},
    error: (...args) => {
      errors.push(args)
    },
  })
  try {
    await waitFor(async () => Bun.file(marker).exists())
    const before = (await readFile(marker, 'utf8')).length
    await mkdir(join(app, 'added'))
    await writeFile(join(app, 'added/page.tsx'), 'export default () => null')
    await waitFor(
      async () =>
        (await readFile(output, 'utf8')).includes('"/added"') &&
        (await readFile(marker, 'utf8')).length > before,
    )
    await rename(join(app, 'added'), join(app, 'renamed'))
    await waitFor(async () =>
      (await readFile(output, 'utf8')).includes('"/renamed"'),
    )
    await rm(join(app, 'renamed/page.tsx'))
    await waitFor(
      async () => !(await readFile(output, 'utf8')).includes('"/renamed"'),
    )
    // A bad route stops the application; the next valid edit recovers it.
    await mkdir(join(app, '(duplicate)'))
    await writeFile(
      join(app, '(duplicate)/page.tsx'),
      'export default () => null',
    )
    await waitFor(async () => errors.length > 0)
    expect(String(errors[0])).toContain('Conflicting routes')
    const restartCount = (await readFile(marker, 'utf8')).length
    await rm(join(app, '(duplicate)/page.tsx'))
    await waitFor(
      async () => (await readFile(marker, 'utf8')).length > restartCount,
    )
    expect(await readFile(output, 'utf8')).toContain('path: "/"')
  } finally {
    await dev.stop()
    await rm(root, { recursive: true, force: true })
  }
}, 15000)
