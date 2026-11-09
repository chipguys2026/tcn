# Manage component source with TCN

This application owns its component source. TCN copies files into `src/components/ui` and `src/lib/ui`; application startup does not require the CLI.

Run the commands below from a project created or configured with TCN. If you copied the starter manually, run `tcn init` first.

## Add components

```sh
tcn list
tcn add button dialog
```

A generated starter already includes all 51 component families. Use `add` to restore missing source or update it from your installed CLI's bundled snapshot. Required shared helpers and package dependencies are included automatically.

## Review updates

Install the desired CLI release, commit your application's current work, then inspect the selected components:

```sh
tcn diff button
tcn add button --dry-run
tcn add button
bun run check
```

The manifest distinguishes your edits from changes since the installed baseline. Local edits are preserved when the corresponding upstream file is unchanged; competing changes stop with a conflict. Merge manually or use `--force` when replacing local source is intentional.

Forced replacement includes required shared source, so inspect `tcn add button --force --dry-run` first. Defaults you apply after using Tweak are ordinary local source edits.

## Remove unused source

```sh
tcn remove dialog --dry-run
tcn remove dialog
```

Remove usages from application screens, Gallery and tests first. TCN protects source needed by retained components and reports remaining module references. Force does not bypass those checks. Package dependencies remain installed for you to review separately.

## Commit tracking files

| File | Purpose |
| --- | --- |
| `tcn.json` | Component paths and import aliases. |
| `.tcn/manifest.json` | Installed baselines, revisions and dependency ownership. |
| `.tcn/schema.json` | Editor schema for the configuration. |

Commit all three with your source. Ignore only the temporary `.tcn/transaction.lock`.

Component updates do not replace routes, application features or tooling. Migrate starter architecture changes separately. For the full CLI and update guides, see the [TCN documentation](https://github.com/chipguys2026/tcn/tree/main/docs).
