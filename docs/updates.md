# Update and remove components

Your application owns its copied component source. TCN uses the installed baseline to help you review changes from a newer CLI release without silently replacing conflicting edits.

## Update the CLI first

Install the desired release's `.tgz` asset using your package manager, as described in [installation](installation.md). Each CLI contains one component snapshot. Updating the executable alone leaves your application unchanged.

## Review and apply an update

Commit your application's current state, then run these commands inside it:

```sh
tcn diff button
tcn add button --dry-run
tcn add button
bun run check
```

`diff` shows local-to-registry changes, including shared dependencies. `--dry-run` validates the operation without writing; conflicting replacements stop the command. Review the affected paths and test the screens that use them after applying an update.

Use `--all` to select every public component. This can install components that were not previously in your application.

## How local edits are handled

TCN compares each file with the baseline recorded when it was installed.

| Local file | Incoming source | Result of `add` |
| --- | --- | --- |
| Unchanged from baseline | Changed | Update the file. |
| Locally edited | Unchanged from baseline | Preserve your edits. |
| Locally edited | Also changed | Stop and report a conflict. |
| Already matches incoming source | Any baseline | Keep the file and refresh tracking. |
| Missing | Available | Restore the file. |
| Untracked and different | Available | Stop and report a conflict. |

Comparison ignores CRLF/LF-only differences. Conflicts are detected per file; the CLI does not merge individual edits within a conflicting file.

For a conflict, review `tcn diff` and merge the relevant changes manually. If you want to replace local source with the bundled version, inspect the forced plan first:

```sh
tcn add button --force --dry-run
tcn add button --force
```

`--force` also covers required source dependencies, including shared helpers used elsewhere in your app. A default you edited after using Tweak is a local source edit and follows the same rules.

## Files removed upstream

When a newer snapshot stops shipping a previously installed file, `add` retains it and reports it. Its dependencies remain protected while the retired file exists. Migrate your usages before removing the component. Components retired from the registry can still be removed using their installed metadata.

## Remove unused components

Remove imports and usages from application screens, Gallery examples and tests, then inspect the removal:

```sh
tcn remove dialog --dry-run
tcn remove dialog
bun run check
```

TCN checks installed dependencies and quoted module references before deleting managed source. It retains shared helpers needed by other components. Locally modified files require `--force` to delete, but force never bypasses references or dependency requirements.

Package dependencies remain in `package.json`; review them separately because other application code may still use them. Reference checking cannot identify every computed import, so run your application's checks after removal.

## Update the starter architecture

Component updates do not upgrade routes, screens, configuration or development scripts. Compare starter changes and migrate those files explicitly when you need them. Running `init --force` in an existing project reinitializes CLI configuration/adoption; it does not replace the application with a new starter.

If dependency installation fails after source was saved, run `bun install` in the application and retry its checks. See [troubleshooting](troubleshooting.md).
