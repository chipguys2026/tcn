# Compiled registry

Run `bun run build` to generate index.json here and dist/registry.json for distribution. Edit canonical component source under templates/starter, not generated JSON.

The index records schema version, CLI release, a content revision, public component items, internal helper units, and a complete template snapshot. Each unit records files (source path, content, hash, resolved import ranges), registryDependencies, npm dependencies, devDependencies and its own revision. Public component IDs match their filenames; internal helper IDs start with an underscore and are not direct CLI add/remove targets.

Source dependencies may contain type-level cycles. Resolution visits each unit once and supports these cycles. A file has exactly one owner. The shared `src/lib/ui/styles.ts` module is an internal dependency containing theme palettes and component defaults. Import ranges are computed from the TypeScript AST and rewritten from the end of the file so substitutions do not invalidate later ranges. UI imports outside the source registry fail the build.
