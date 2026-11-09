# Release process

TCN is distributed as an npm-compatible `.tgz` asset on [GitHub Releases](https://github.com/chipguys2026/tcn/releases). Maintainers merge reviewed changes into `main`; CI builds, tests and publishes the versioned package. There is no npm publish step.

## Prepare a release

1. Create a branch from the current `main`.
2. Change CLI or starter source and update the corresponding documentation.
3. Increase the version in the root `package.json`.
4. Add a nonempty `## X.Y.Z` section to the root `CHANGELOG.md`.
5. Run the checks below, open a PR and pass `version-check` and `ci`.
6. Merge the PR. The main workflow publishes `vX.Y.Z` after all checks pass.

The nested starter's package version does not determine the CLI release version. Published packages are immutable; corrections require a new version.

## Version policy

The version check compares committed base/head revisions. Non-documentation changes, including tests, configuration and workflows, require a strictly greater SemVer. Markdown and `docs/` changes are exempt.

A bump must update `CHANGELOG.md`, and the current version must have a nonempty section. Downgrades and build-metadata-only bumps are rejected. The base must be an ancestor of the head, so update stale branches from `main` before merging.

Initial history accepts the first valid version and changelog. Branch rules must be active on GitHub to enforce these checks; see [GitHub administration](github-setup.md).

## Validate locally

```sh
bun install --frozen-lockfile
bun run check
bun install --frozen-lockfile --cwd templates/starter
bun run template:check
bun run pack:release
bun run smoke:release
```

The `smoke:release` command includes generated-application installation, checks and a production build. For a package/CLI-only check without installing app dependencies:

```sh
bun scripts/smoke.ts
```

Use `--offline` for smoke verification only when dependencies are cached. Use `--keep` to retain the generated application for inspection.

Check the version policy against local committed refs:

```sh
bun run version:check --base <BASE_COMMIT> --head <HEAD_COMMIT>
```

## CI stages

| Stage | Validation |
| --- | --- |
| `version-check` | Committed version, changelog and branch ancestry. |
| `build` | Frozen installs, CLI/starter checks, then one build and package. Uses Bun 1.4.4 and Node 24. |
| `packed-app` | The exact package on Ubuntu and Windows with Node 22; generates, installs, checks and builds an app. |
| `ci` | Requires every preceding stage to succeed. |
| `release` | Publishes the tested artifact on main pushes or manual dispatch in this repository. |

The release job receives `contents: write`; other jobs use read-only repository permissions. PRs and forks do not publish.

## Release assets

`bun run pack:release` writes these assets to `artifacts/release/`:

- `tcn-X.Y.Z.tgz`: CLI executable, bundled registry/template, schema, documentation and license notices.
- `SHA256SUMS`: package checksum.
- `release.json`: version, source commit and artifact metadata.

CI uploads the package once and downloads that artifact for testing and publishing. The publisher verifies the source commit and assets before making a draft public. Consumers install the release tarball using npm, Bun or pnpm.

## Retry a failed workflow

If setup or a download fails temporarily, rerun failed jobs in the original Actions run. If source needs a fix, submit a new version through the normal PR flow.

A failed release upload can resume its draft using the original run's artifacts. The publisher refuses different bytes for an existing asset and refuses a tag pointing at another commit. Already published versions are left unchanged, including after documentation-only commits.

The publishing script is restricted to the hosted release environment. Run `pack:release` and smoke checks locally rather than invoking the publisher.
