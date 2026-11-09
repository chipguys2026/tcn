# Project configuration

TCN uses `tcn.json`, serving the CLI configuration role of shadcn's components.json without unrelated browser, CSS, Tailwind or server-component settings.

```json
{
  "$schema": "./.tcn/schema.json",
  "version": 1,
  "registry": "bundled",
  "packageManager": "bun",
  "paths": {
    "ui": "src/components/ui",
    "lib": "src/lib/ui"
  },
  "aliases": {
    "ui": "@/components/ui",
    "lib": "@/lib/ui"
  }
}
```

| Field | Meaning |
| --- | --- |
| version | Configuration format, currently 1. |
| registry | Currently bundled: immutable source shipped with this CLI package. |
| packageManager | Currently bun, matching the application runtime. |
| paths.ui / paths.lib | Physical destinations relative to the application root. |
| aliases.ui / aliases.lib | Import prefixes used in generated source. |
| $schema | Local JSON Schema installed by init for editor completion. |

Destinations cannot overlap or point outside the project. Symlinks/junctions in managed target paths are rejected. Internal imports and re-exports, including type imports, are rewritten from the compiled source graph. Relative imports remain relative and are recalculated for the chosen destinations.

The application's TypeScript/runtime alias resolution must already match the chosen aliases. Init provides the default `@/* -> src/*` mapping in new projects; configuring an existing project does not rewrite its tsconfig. Change paths/aliases before adding components. Once files are installed, restore the original layout or explicitly migrate files, imports and metadata together.

`.tcn/manifest.json` records installed units, explicit/transitive ownership, source revision, dependency graph and original installed content/hash. CLI commands use it to preserve edited source, detect upstream changes and avoid deleting shared dependencies. It is project history and should be committed; do not hand-edit it. Adopting existing source uses the current bundled registry as a comparison baseline and preserves every local byte.

The generated schema is `.tcn/schema.json`. `.tcn/transaction.lock` is temporary and must not be committed. A live lock prevents concurrent writes. If a process crashes, verify it has exited before removing its stale lock. Neither tcn.json nor installed metadata is imported by normal TUI startup or by Tweak.
