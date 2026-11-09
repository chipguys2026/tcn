import { resolve } from 'node:path'
import { generateRoutes, projectDir } from './generate-routes'

await generateRoutes()
const typecheck = Bun.spawn(
  [process.execPath, 'x', '--no-install', 'tsc', '--noEmit'],
  {
    cwd: projectDir,
    stdout: 'inherit',
    stderr: 'inherit',
  },
)
if ((await typecheck.exited) !== 0) process.exit(1)

const result = await Bun.build({
  entrypoints: [resolve(projectDir, 'src/main.tsx')],
  outdir: resolve(projectDir, 'dist'),
  target: 'bun',
  format: 'esm',
  sourcemap: 'external',
  external: ['@opentui/*', 'react', 'react/*', 'zustand', 'zustand/*'],
})
if (!result.success) {
  console.error(result.logs)
  process.exit(1)
}
console.log('Built dist/main.js (runtime package dependencies remain external)')
