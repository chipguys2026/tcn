# Verification

TCN's CI validates both the development source and the package users install. See the [workflow runs](https://github.com/chipguys2026/tcn/actions/workflows/ci-release.yml) for current results.

## Automated checks

| Area | What is checked |
| --- | --- |
| CLI | TypeScript, Biome and source-management integration tests. |
| Starter | TypeScript, Biome, component behavior, routing, interaction, styling and Tweak tests. |
| Package | Required archive members, checksums, metadata and the Node-compatible executable. |
| Generated application | Creation from the packed CLI, dependency installation, application checks and production build on Ubuntu and Windows. |
| Release | Version/changelog policy, commit identity, draft recovery and published-asset consistency. |

The built CLI is exercised on Node 22. The main build uses Node 24 and Bun 1.4.4. Frozen lockfile installs make dependency changes explicit.

## Source-management coverage

Integration tests cover dependency resolution, existing-source adoption, repeated operations, local/upstream conflicts, forced replacement, shared helpers, custom paths/aliases, line endings, retired source, references before removal, path checks, concurrent edits and rollback.

Release tests use temporary Git histories and an in-memory GitHub API to check version gates and publishing behavior without creating live releases. The hosted workflow then tests and publishes the actual artifact.

## Run checks locally

Follow the [contribution guide](https://github.com/chipguys2026/tcn/blob/main/CONTRIBUTING.md) for setup and the [release guide](releasing.md#validate-locally) for package verification commands.

For UI changes, also inspect the relevant Gallery examples in a real terminal. Headless tests validate cell geometry, colors and input behavior; glyph rasterization, terminal shortcuts and font support depend on the user's environment. Automated checks do not establish compatibility with arbitrary application customizations or perform source merges.
