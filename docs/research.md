# Design decisions

This page explains the distribution and update model for contributors working on TCN.

## Components are application source

TCN copies components and their shared helpers into an application. Users import local files and can edit them. The CLI is a development tool; it is not an application runtime dependency.

The configuration and source-copy workflow follows the approach documented by [shadcn's project configuration](https://ui.shadcn.com/docs/components-json) and [CLI](https://ui.shadcn.com/docs/cli). TCN defines its own update/removal semantics and terminal interaction behavior.

## Dependencies are compiled from source

The registry compiler follows TypeScript imports to build component ownership, helper dependencies and package requirements. This avoids maintaining a separate hand-written dependency graph. Related registry concepts are described in the [shadcn registry-item reference](https://ui.shadcn.com/docs/registry/registry-item-json).

Each release bundles its registry and starter snapshot with the executable. This keeps the CLI and available source at the same revision and allows source operations offline with `--no-install`. Remote registries would require a separate versioning and validation contract.

## Updates use an installed baseline

The manifest records original installed content and dependency ownership. TCN compares that baseline with local files and incoming source to preserve local edits when upstream is unchanged and stop on conflicting replacements.

Diff output uses [jsdiff](https://github.com/kpdecker/jsdiff). Its license is included in the package's third-party notices. TCN does not perform an automatic three-way merge.

## The CLI and application have separate runtimes

The packaged executable runs on Node.js 22 or newer. Generated React/OpenTUI applications use Bun. The package's executable and payload are declared through [package.json bin/files fields](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/).

GitHub Releases host the npm-compatible archive. Installing a tarball URL does not require publishing to or reserving a name on the npm registry.

## Starter upgrades are explicit

Updating a component does not replace an application's routes, feature code or tooling. Architecture changes are migrated separately so a component update cannot silently reset application structure.
