# TCN source management

This application owns its component source. TCN copies files into src/components/ui and src/lib/ui; normal application startup has no TCN runtime dependency.

A project generated/configured by the CLI contains tcn.json and .tcn/manifest.json. The former configures placement/import aliases; the latter tracks original installed source, revisions and dependency ownership for diff/update/remove. Commit them with .tcn/schema.json. The canonical template itself does not need CLI metadata to run.

Use the installed TCN CLI to list/add/diff/remove component source. Review an update with diff and add --dry-run before replacing local edits with add --force. The manifest distinguishes local edits from upstream changes. A default promoted from Tweak is a normal local source edit and is preserved when that upstream file is unchanged.

Removal requires clearing usages in application source, Gallery and tests. The CLI does not rewrite these features for you. Components needed by retained components and shared helpers remain protected even with force. Npm dependencies are retained. Template/router changes require an application migration, not a component add operation.

Tweak remains a development tool for proposing and promoting source defaults. It never uses tcn.json or installed metadata as runtime style configuration.
