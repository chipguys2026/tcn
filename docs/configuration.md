# Project configuration

TCN reads `tcn.json` in your application root to decide where component files go and how their imports are written. `tcn init` creates it with these defaults:

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

## Choose paths and aliases

`paths` are physical destinations relative to the project root. `aliases` are the import prefixes used by the copied source.

| Field | Purpose |
| --- | --- |
| `paths.ui` | Component source destination. |
| `paths.lib` | Shared theme, interaction and composition helpers. |
| `aliases.ui` | Import prefix for component files. |
| `aliases.lib` | Import prefix for shared helpers. |
| `$schema` | Local schema for editor completion and validation. |
| `version` | Configuration format; use `1`. |
| `registry` | Source snapshot; use `"bundled"`. |
| `packageManager` | Dependency installer; use `"bun"`. |

For example, to use `src/ui` and `src/shared/ui`, set:

```json
{
  "paths": {
    "ui": "src/ui",
    "lib": "src/shared/ui"
  },
  "aliases": {
    "ui": "@/ui",
    "lib": "@/shared/ui"
  }
}
```

These fields replace the corresponding sections in the full configuration. TCN rewrites imports between managed source files for the selected layout.

Your TypeScript and runtime alias resolution must match. New starters include `@/* -> src/*`. In an existing project, configure this mapping yourself; `init` does not rewrite its `tsconfig.json`.

Choose your layout **before adding components**. Moving installed files requires migrating their imports and tracking metadata together; changing `tcn.json` alone does not move them. Destinations must stay inside the project, must not overlap, and cannot traverse symlinks or junctions.

## Keep project metadata in Git

| File | Purpose | Commit? |
| --- | --- | --- |
| `tcn.json` | Paths, aliases and CLI settings. | Yes |
| `.tcn/manifest.json` | Installed source baseline and dependency ownership. | Yes |
| `.tcn/schema.json` | JSON Schema for the project configuration. | Yes |
| `.tcn/transaction.lock` | Temporary lock during a source operation. | No |

The manifest lets TCN distinguish local edits from changes in a newer CLI's bundled source. It also tracks shared helpers so removing one component does not remove another component's dependencies. Let the CLI maintain this file.

These files are used by CLI commands. Your application reads its component source directly at runtime.

## Source availability

Each CLI release includes its own registry and starter snapshot. `init` and `add` can write source offline with `--no-install`; installing package dependencies still requires network access or a populated Bun cache. Remote registries are not supported in this release.
