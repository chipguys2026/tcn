# TCN

Source-owned React and OpenTUI components, distributed as a prebuilt CLI through GitHub Releases at `chipguys2026/tcn`. Component source is copied into your app and is yours to edit. There is no TCN runtime dependency.

This directory is the standalone repository intended for distribution. Its canonical component source lives in `templates/starter/src/components/ui` and `templates/starter/src/lib/ui`. The registry is compiled from that source. The earlier sibling `opentui-starter` is a transition reference, not a build dependency.

## Run locally

Use Node 22+ for the CLI. Bun is required to develop this repository and run generated TUI applications.

```sh
bun install
bun run build
node dist/cli.js list
node dist/cli.js init ../my-app --no-install
```

Then, inside the generated project:

```sh
bun install
bun run dev
```

The starter contains Home (`/`), all 51 component families in `/gallery`, and `/tweak` for designing source defaults. Tweak data is a development proposal, not runtime configuration. Run `bun run template:install`, then `bun run dev` here to develop the canonical starter.

After a GitHub Release exists, users can install its npm-compatible tarball with Bun, pnpm or npm. For example:

```sh
bun add -g https://github.com/chipguys2026/tcn/releases/download/v0.1.0/tcn-0.1.0.tgz
tcn init my-app
```

This is a release location, not a claim the release already exists. See [GitHub setup and installation](docs/github-setup.md).

## CLI

```sh
node dist/cli.js init my-app
node dist/cli.js init --cwd ../existing-app --no-install
node dist/cli.js add button dialog --cwd ../existing-app
node dist/cli.js diff button --cwd ../existing-app
node dist/cli.js add button --force --dry-run --cwd ../existing-app
node dist/cli.js remove dialog --cwd ../existing-app
```

`init [directory]` scaffolds a new starter when there is no package.json. In an existing project, it creates CLI configuration and adopts complete source graphs already present; it preserves application source and package.json. Reinitializing configuration requires `--force` and preserves installed baselines.

`add` resolves component/helper dependencies and required runtime/type packages. Identical files are untouched. Installed, unmodified files can update without force. Local edits remain when their upstream file is unchanged; conflicting changes require `--force`. That flag replaces files throughout the requested dependency closure, including shared helpers. The plan lists every changed path and reports affected installed roots.

`remove` prunes the selected components and unneeded managed helpers. It refuses dependencies required by retained components, literal references in application/gallery/test code, and modified files. `--force` permits deletion of modified managed files; it does not bypass references/dependencies. Remove usages first. Package dependencies remain because other application code may use them. `remove --all` selects installed components only.

`diff` prints a unified local-to-registry patch with local/upstream status based on the installed baseline. It includes required source dependencies. It does not perform an automatic three-way merge.

`list` lists public families. `--all` selects every family for add/diff. All mutating commands accept `--dry-run`; it performs the same checks and writes nothing. `--no-install` skips Bun installation. Existing dependency versions are preserved; the application owns version upgrades. Installation failure leaves saved source and reports how to retry.

## Configuration and updates

Projects use [tcn.json](docs/configuration.md), separate from machine-managed `.tcn/manifest.json`. Configuration is read only by the CLI. Layout/alias changes are supported before the first component installation; moving installed files needs a migration. Commit both files and the generated `.tcn/schema.json`. See [updates and removal](docs/updates.md).

Registry and template snapshots ship inside the package. CLI version and source snapshot therefore move together; init/add work offline with `--no-install`. Remote registries and arbitrary registry scripts are not supported in this version.

## Develop and package

```sh
bun run check
bun run template:install
bun run template:check
bun run build
bun run pack:release
bun run smoke:release --offline
```

Build compiles the source graph and snapshots the template. It excludes node_modules, dist, local Tweak drafts/backups and environment files. The npm tarball contains the built Node executable, bundled registry/template snapshot, schema, third-party notices, README and MIT license. See [project structure](docs/project-structure.md), [research decisions](docs/research.md) and [release procedure](docs/releasing.md).

Distribution is GitHub-only for now. No npm publish step, npm credentials or npm-name ownership is needed for release-URL installs. The preexisting npm registry package tcn is separate; do not use npx tcn@latest to fetch this GitHub-only CLI.

The workflow checks version/changelog on PRs, tests packed apps on Linux/Windows, and releases new main versions after checks. The local [main ruleset](.github/main-ruleset.json) must be activated on GitHub later to enforce merging policy. See [release procedure](docs/releasing.md).

See [local verification](docs/verification.md) for tested commands, coverage and the packed-app check.
