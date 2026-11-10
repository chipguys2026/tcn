import { expect, test } from 'bun:test'
import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { dirname, resolve, sep } from 'node:path'
import { demos } from '@/components/shared/component-demos/catalog'
import { routeManifest } from '@/router/routes.generated'

const project = resolve(import.meta.dir, '../..')
async function files(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? files(resolve(directory, entry.name))
          : [resolve(directory, entry.name)],
      ),
    )
  ).flat()
}

test('standalone starter exposes canonical routes and all component families', async () => {
  const pkg = JSON.parse(
    await readFile(resolve(project, 'package.json'), 'utf8'),
  )
  expect(pkg.name).toMatch(/^[a-z0-9][a-z0-9._-]*$/)
  expect(pkg.license).toBe('MIT')
  expect(routeManifest.routes.map((route) => route.path).sort()).toEqual([
    '/',
    '/gallery',
    '/gallery/:name',
    '/gallery/icons',
    '/gallery/showcase',
    '/tweak',
  ])
  expect(demos).toHaveLength(51)
  expect(new Set(demos.map((demo) => demo.name)).size).toBe(51)
  for (const demo of demos)
    expect(existsSync(resolve(project, `docs/ui/${demo.name}.md`))).toBe(true)
})

test('shared source stays independent of features and routes', async () => {
  const reusable = [
    ...(await files(resolve(project, 'src/components'))),
    ...(await files(resolve(project, 'src/lib/ui'))),
  ]
  for (const file of reusable) {
    const source = await readFile(file, 'utf8')
    expect(source).not.toMatch(/from\s+['"][^'"]*features\//)
    expect(source).not.toMatch(/from\s+['"]@\/app\//)
    if (!file.includes(`${sep}shared${sep}`))
      expect(source).not.toMatch(/from\s+['"]node:fs/)
  }
  for (const file of await files(resolve(project, 'src/features'))) {
    const source = await readFile(file, 'utf8')
    expect(source).not.toMatch(/from\s+['"]@\/app\//)
  }
})

test('public documentation links resolve entirely within the starter', async () => {
  const documents = [
    ...(await files(resolve(project, 'docs'))),
    ...[
      'AGENTS.md',
      'README.md',
      'CONTRIBUTING.md',
      'CHANGELOG.md',
      'design/README.md',
    ].map((file) => resolve(project, file)),
  ]
  for (const file of documents.filter((file) => file.endsWith('.md'))) {
    const content = await readFile(file, 'utf8')
    for (const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const link = match[1]?.split('#')[0]
      if (!link || /^[a-z]+:/i.test(link)) continue
      const target = resolve(dirname(file), link)
      expect(target.startsWith(`${project}${sep}`)).toBe(true)
      expect(existsSync(target)).toBe(true)
    }
  }
})
