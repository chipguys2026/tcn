import { watch } from 'node:fs'
import { resolve } from 'node:path'
import { generateRoutes, projectDir } from './generate-routes'

export async function startDev(
  root = projectDir,
  logger: Pick<Console, 'log' | 'error'> = console,
) {
  const srcDir = resolve(root, 'src')
  const appDir = resolve(srcDir, 'app')
  const outFile = resolve(srcDir, 'router/routes.generated.ts')
  let child: ReturnType<typeof Bun.spawn> | undefined
  let timer: ReturnType<typeof setTimeout> | undefined
  let pending = false
  let running = false
  let stopped = false

  async function stopChild() {
    const current = child
    child = undefined
    if (current && current.exitCode === null) {
      current.kill()
      await current.exited
    }
  }

  async function refresh() {
    if (stopped) return
    pending = true
    if (running) return
    running = true
    try {
      while (pending && !stopped) {
        pending = false
        await stopChild()
        if (stopped) break
        try {
          const result = await generateRoutes({ appDir, outFile })
          if (stopped) break
          logger.log(`[dev] ${result.count} route(s); starting application`)
          child = Bun.spawn([process.execPath, resolve(srcDir, 'main.tsx')], {
            cwd: root,
            stdin: 'inherit',
            stdout: 'inherit',
            stderr: 'inherit',
          })
        } catch (error) {
          logger.error(
            '[dev] Cannot start application:',
            error instanceof Error ? error.message : error,
          )
        }
      }
    } finally {
      running = false
    }
  }

  const watcher = watch(srcDir, { recursive: true }, (_event, filename) => {
    const changed = filename ? resolve(srcDir, filename.toString()) : undefined
    if (changed === outFile || changed === `${outFile}.tmp`) return
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => void refresh(), 80)
  })

  async function stop() {
    if (stopped) return
    stopped = true
    if (timer) clearTimeout(timer)
    watcher.close()
    await stopChild()
  }

  watcher.on('error', (error) => {
    logger.error('[dev] Source watcher failed:', error)
    void stop()
    process.exitCode = 1
  })
  await refresh()
  return { stop }
}

if (import.meta.main) {
  const dev = await startDev()
  process.once('SIGINT', () => void dev.stop())
  process.once('SIGTERM', () => void dev.stop())
}
