import { createHash, randomUUID } from 'node:crypto'
import { lstat, mkdir, open, readFile, rename, unlink } from 'node:fs/promises'
import { dirname, isAbsolute, relative, resolve } from 'node:path'
import type { Change, Plan } from './types.js'
export const hash = (data: string | Buffer) =>
  createHash('sha256').update(data).digest('hex')
export const json = (data: unknown) =>
  Buffer.from(`${JSON.stringify(data, null, 2)}\n`)
export function portable(path: string) {
  return path.replaceAll('\\', '/')
}
export function safeRelative(path: string) {
  if (
    !path ||
    path.includes('\\') ||
    path.includes(':') ||
    path.includes('\0') ||
    isAbsolute(path) ||
    path
      .split('/')
      .some(
        (p) =>
          !p ||
          p === '.' ||
          p === '..' ||
          /[. ]$/.test(p) ||
          /[<>"|?*]/.test(p) ||
          [...p].some((c) => c.charCodeAt(0) < 32) ||
          /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(p),
      )
  )
    throw new Error(`Unsafe project path: ${path}`)
  return path
}
export async function target(root: string, path: string) {
  safeRelative(path)
  const absolute = resolve(root, path),
    inside = relative(resolve(root), absolute)
  if (!inside || inside.startsWith('..') || isAbsolute(inside))
    throw new Error(`Path leaves project: ${path}`)
  let current = absolute
  while (true) {
    try {
      const stat = await lstat(current)
      if (stat.isSymbolicLink())
        throw new Error(`Refusing symlink or junction: ${current}`)
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e
    }
    const parent = dirname(current)
    if (parent === current) break
    current = parent
  }
  return absolute
}
export async function read(root: string, path: string) {
  const file = await target(root, path)
  try {
    return await readFile(file)
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw e
  }
}
export function parse<T>(buffer: Buffer | null, path: string): T {
  if (!buffer) throw new Error(`Missing ${path}`)
  try {
    return JSON.parse(buffer.toString('utf8').replace(/^\uFEFF/, '')) as T
  } catch {
    throw new Error(`Invalid JSON in ${path}`)
  }
}
export const same = (a: Buffer | null, b: Buffer | null) =>
  a === null ? b === null : b !== null && a.equals(b)
export async function change(
  plan: Plan,
  path: string,
  after: Buffer | null,
  capturedBefore?: Buffer | null,
) {
  const before =
    capturedBefore === undefined ? await read(plan.root, path) : capturedBefore
  if (!same(before, after)) plan.changes.push({ path, before, after })
}
async function atomic(root: string, path: string, value: Buffer | null) {
  const file = await target(root, path)
  if (value === null) {
    try {
      await unlink(file)
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e
    }
    return
  }
  await mkdir(dirname(file), { recursive: true })
  const temporary = `${file}.tcn-${randomUUID()}.tmp`
  try {
    await (await import('node:fs/promises')).writeFile(temporary, value, {
      flag: 'wx',
    })
    await rename(temporary, file)
  } finally {
    await unlink(temporary).catch(() => {})
  }
}
/** Check every precondition before touching managed files; rollback file bytes on an I/O failure. */
export async function commit(plan: Plan) {
  if (!plan.changes.length) return
  const lock = await target(plan.root, '.tcn/transaction.lock')
  await mkdir(dirname(lock), { recursive: true })
  let handle: Awaited<ReturnType<typeof open>>
  try {
    handle = await open(lock, 'wx')
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'EEXIST')
      throw new Error(
        'Another TCN operation holds .tcn/transaction.lock. If its process has exited, remove that stale lock.',
      )
    throw e
  }
  const applied: Change[] = []
  try {
    for (const [path, expected] of plan.guards)
      if (!same(await read(plan.root, path), expected))
        throw new Error(
          `Project changed during planning: ${path}. Retry the command.`,
        )
    for (const c of plan.changes)
      if (!same(await read(plan.root, c.path), c.before))
        throw new Error(
          `File changed during planning: ${c.path}. Retry the command.`,
        )
    for (const c of plan.changes) {
      await atomic(plan.root, c.path, c.after)
      applied.push(c)
    }
  } catch (error) {
    const failures: unknown[] = []
    for (const c of applied.reverse())
      try {
        await atomic(plan.root, c.path, c.before)
      } catch (e) {
        failures.push(e)
      }
    if (failures.length)
      throw new AggregateError(
        [error, ...failures],
        'TCN could not completely roll back the transaction',
      )
    throw error
  } finally {
    await handle.close()
    await unlink(lock)
  }
}
