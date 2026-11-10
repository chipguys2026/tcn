import {
  chmod,
  copyFile,
  mkdir,
  readdir,
  readFile,
  writeFile,
} from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import ts from 'typescript'
import { hash, json, portable } from '../src/files.js'
import type { ImportLink, Registry, RegistryItem } from '../src/types.js'
import { generateIcons } from './generate-icons.js'

const root = resolve(import.meta.dir, '..'),
  template = join(root, 'templates/starter'),
  pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8')),
  app = JSON.parse(await readFile(join(template, 'package.json'), 'utf8'))
await generateIcons(true)
async function files(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  return (
    await Promise.all(
      entries
        .filter(
          (e) =>
            !['node_modules', 'dist', '.git', '.tcn', 'coverage'].includes(
              e.name,
            ),
        )
        .map((e) =>
          e.isDirectory()
            ? files(join(directory, e.name))
            : e.isFile()
              ? [join(directory, e.name)]
              : [],
        ),
    )
  ).flat()
}
const ignored = (path: string) =>
  /\.draft\.json$|\.backup\.json$|\.tmp$|(?:^|\/)\.env(?:\.|$)|\.tgz$/.test(
    path,
  )
const all = (await files(template))
  .map((p) => portable(relative(template, p)))
  .filter((p) => !ignored(p))
  .sort()
const sources = all.filter((p) =>
    /^src\/(components\/ui|lib\/ui)\/.+\.(ts|tsx)$/.test(p),
  ),
  sourceSet = new Set(sources),
  owner = new Map<string, string>(),
  items: Record<string, RegistryItem> = {}
for (const path of sources) {
  const iconSet = /^src\/lib\/ui\/nerd-fonts\/sets\/([a-z]+)\.ts$/.exec(
    path,
  )?.[1]
  const iconItem = iconSet
    ? `icons/${iconSet}`
    : path === 'src/lib/ui/nerd-fonts/index.ts'
      ? 'icons/all'
      : undefined
  const name =
    iconItem ??
    (path.startsWith('src/components/ui/')
      ? path.slice('src/components/ui/'.length).replace(/\.tsx?$/, '')
      : `_${path.slice('src/'.length).replace(/\.tsx?$/, '')}`)
  owner.set(path, name)
  items[name] ??= {
    name,
    public: !name.startsWith('_'),
    ...(iconItem ? { kind: 'icons' as const } : {}),
    revision: '',
    registryDependencies: [],
    dependencies: {},
    devDependencies: {},
    files: [],
  }
}
const options: ts.CompilerOptions = {
    baseUrl: template,
    paths: { '@/*': ['src/*'] },
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
  },
  host = ts.sys
for (const path of sources) {
  const absolute = join(template, path),
    content = await readFile(absolute, 'utf8'),
    sf = ts.createSourceFile(absolute, content, ts.ScriptTarget.Latest, true),
    id = owner.get(path),
    item = id ? items[id] : undefined
  if (!item) throw new Error(`Missing file owner: ${path}`)
  const imports: ImportLink[] = [],
    links = new Set<string>(),
    npm = new Set<string>()
  const visit = (node: ts.Node) => {
    let literal: ts.StringLiteralLike | undefined
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteralLike(node.moduleSpecifier)
    )
      literal = node.moduleSpecifier
    else if (
      ts.isImportTypeNode(node) &&
      ts.isLiteralTypeNode(node.argument) &&
      ts.isStringLiteralLike(node.argument.literal)
    )
      literal = node.argument.literal
    else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments[0] &&
      ts.isStringLiteralLike(node.arguments[0])
    )
      literal = node.arguments[0]
    if (literal) {
      const name = literal.text
      if (name.startsWith('.') || name.startsWith('@/')) {
        const resolved = ts.resolveModuleName(name, absolute, options, host)
          .resolvedModule?.resolvedFileName
        if (!resolved) throw new Error(`Unresolved ${name} in ${path}`)
        const target = portable(relative(template, resolved))
        if (!sourceSet.has(target))
          throw new Error(
            `Reusable UI imports non-registry source: ${path} -> ${target}`,
          )
        imports.push({
          start: literal.getStart(sf) + 1,
          end: literal.getEnd() - 1,
          target,
          relative: name.startsWith('.'),
        })
        const dependency = owner.get(target)
        if (dependency && dependency !== id) links.add(dependency)
      } else if (name !== 'bun' && !name.startsWith('node:'))
        npm.add(
          name.startsWith('@')
            ? name.split('/').slice(0, 2).join('/')
            : (name.split('/')[0] ?? name),
        )
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  if (path.endsWith('.tsx')) {
    npm.add('react')
    npm.add('@opentui/react')
  }
  if (path.endsWith('.tsx') || npm.has('react'))
    item.devDependencies['@types/react'] = app.devDependencies['@types/react']
  if (content.includes("from 'bun'"))
    item.devDependencies['@types/bun'] = app.devDependencies['@types/bun']
  item.files.push({ path, content, hash: hash(content), imports })
  item.registryDependencies = [
    ...new Set([...item.registryDependencies, ...links]),
  ].sort()
  for (const dep of npm) {
    const version = app.dependencies?.[dep]
    if (!version) throw new Error(`No version for ${dep} imported by ${path}`)
    item.dependencies[dep] = version
  }
}
for (const item of Object.values(items)) {
  item.files.sort((a, b) => a.path.localeCompare(b.path))
  item.revision = hash(
    JSON.stringify({
      files: item.files.map((f) => [f.path, f.hash]),
      registryDependencies: item.registryDependencies,
      dependencies: item.dependencies,
      devDependencies: item.devDependencies,
    }),
  )
}
const templateFiles = await Promise.all(
  all.map(async (path) => ({
    path,
    content: await readFile(join(template, path), 'utf8'),
  })),
)
const registry: Registry = {
  version: 1,
  release: pkg.version,
  revision: hash(
    JSON.stringify({
      items,
      template: templateFiles.map((f) => [f.path, hash(f.content)]),
    }),
  ),
  items,
  template: { files: templateFiles },
}
await mkdir(join(root, 'dist'), { recursive: true })
await mkdir(join(root, 'registry'), { recursive: true })
await writeFile(join(root, 'dist/registry.json'), json(registry))
await writeFile(join(root, 'registry/index.json'), json(registry))
await copyFile(
  join(root, 'schemas/tcn.schema.json'),
  join(root, 'dist/tcn.schema.json'),
)
const build = await Bun.build({
  entrypoints: [join(root, 'src/main.ts')],
  outdir: join(root, 'dist'),
  naming: 'cli.js',
  target: 'node',
  format: 'esm',
  minify: false,
  banner: '#!/usr/bin/env node',
})
if (!build.success) throw new AggregateError(build.logs, 'CLI build failed')
await chmod(join(root, 'dist/cli.js'), 0o755)
await writeFile(
  join(root, 'dist/THIRD_PARTY_NOTICES.md'),
  `# Third-party notices\n\nThe CLI bundles jsdiff (diff), BSD-3-Clause:\n\n${await readFile(join(root, 'node_modules/diff/LICENSE'), 'utf8')}\n\nNerd Fonts glyph mapping data v3.5.1 (no font binaries):\n\n${await readFile(join(root, 'registry/nerd-fonts/LICENSE'), 'utf8')}`,
)
console.log(
  `Built tcn ${pkg.version}: ${Object.values(items).filter((i) => i.public && i.kind !== 'icons').length} components, ${Object.values(items).filter((i) => i.kind === 'icons').length} icon packs, ${sources.length} source files, ${templateFiles.length} template files`,
)
