# CLI guide

Use `tcn` to create an application and manage the component source copied into it. Run commands from the application root, or pass `--cwd <directory>` to select another project.

## Create or configure a project

```sh
tcn init my-app
```

If the destination has no `package.json`, TCN creates the starter with its components, example screens, tests and development tools. It records the installed source and runs `bun install`. Existing files that would be replaced cause a conflict; choose a new directory or review the conflict before proceeding.

For an existing React/OpenTUI project:

```sh
tcn init --cwd ../existing-app
```

When `package.json` exists, TCN creates its configuration and adopts complete component dependency graphs already present. It preserves application source and `package.json`. It does not add the starter's router, screens or TypeScript configuration. Set up [paths and aliases](configuration.md) before installing components.

Reinitializing an existing TCN configuration requires `--force`. It preserves installed baselines and does not upgrade application architecture.

## List available components

```sh
tcn list
```

The list contains public component family names, such as `button`, `dialog` and `select`. Use those names with `add`, `diff` and `remove`. Shared helpers are managed automatically.

## Add or update components

```sh
tcn add button dialog
tcn add --all
```

TCN resolves the selected components' source dependencies, copies missing files and adds required package dependencies. Existing package versions are preserved. When installation is needed, TCN runs Bun unless you pass `--no-install`.

`add` also updates installed source using the snapshot bundled in your CLI. Unmodified files can update directly. Local edits are kept when the corresponding upstream file is unchanged; conflicting files require review. See [updates](updates.md).

Inspect a proposed operation:

```sh
tcn add button --dry-run
```

A dry run performs the same validation without writing files or installing dependencies. It can report a conflict rather than returning a writable plan.

## Install icon sets

In TCN 0.2.0 and newer, list and install Nerd Fonts sets separately from UI components:

```sh
tcn list --icons
tcn add icons/fa icons/md
tcn diff icons/fa
tcn remove icons/fa
```

Use `icons/all` to install the complete catalog. `tcn list` and `tcn add --all` continue to select the 51 UI families. Icon packs use the same conflict, shared-dependency and reference checks as components. New starters include all sets for Gallery; adding a component to an existing application does not pull in the full catalog.

See the [icon guide](https://github.com/chipguys2026/tcn/blob/main/templates/starter/docs/icons.md) for typed imports and the browser.

## Compare source

```sh
tcn diff button
tcn diff --all
```

`diff` prints a unified patch from your local source to the bundled registry and reports local/upstream status relative to the installed baseline. It includes required shared source. It does not modify files or merge changes.

## Remove components

```sh
tcn remove dialog --dry-run
tcn remove dialog
```

First remove imports and usages from your application, Gallery and tests. TCN refuses removal when retained components need the source, references remain or managed files contain local edits. It retains shared helpers that other installed components need and leaves package dependencies in `package.json`.

`tcn remove --all` selects all installed public components. It still performs reference and local-edit checks.

## Options

| Option | Effect |
| --- | --- |
| `--cwd`, `-c <directory>` | Select a project directory. |
| `--all`, `-a` | Select all public components for add/diff, or installed components for remove. |
| `--dry-run` | Validate a mutating command without writing or installing. |
| `--no-install` | Write source and package changes without running Bun. |
| `--force`, `-f` | Allow replacement or deletion of locally modified managed files. |
| `--help`, `-h` | Show command help. |
| `--version`, `-v` | Print the CLI's bundled release version. |

With `add`, `--force` applies to the requested components and their source dependencies, including shared helpers. Review the affected paths before using it. With `remove`, it permits deleting modified files but does not bypass dependency or reference checks.
