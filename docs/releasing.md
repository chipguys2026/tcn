# GitHub-only releases

The public distribution target is `chipguys2026/tcn` on GitHub. No npm publication, npm account, npm token or OIDC configuration is required. The CLI is distributed as an npm-compatible `.tgz` attachment on GitHub Releases.

## Workflows

`.github/workflows/ci-release.yml` runs on PRs to main, pushes to main and manual dispatch. It has no path filters, so required checks do not remain pending on documentation-only PRs.

1. **version-check** compares committed head/base versions. The base must be an ancestor of the head. All non-documentation changes, including tests, config and workflows, require a strictly greater SemVer. Markdown and docs-only changes are exempt. Downgrades are always rejected; build-metadata-only changes are not bumps. The current version needs nonempty notes under its exact CHANGELOG.md heading, and a bump must change that file.
2. **build** uses Bun 1.4.4 and Node 24, installs from lockfiles, checks CLI/starter, builds and packs once. The package, SHA256SUMS and release.json are uploaded as one artifact.
3. **packed-app** downloads that exact artifact on Linux and Windows, runs its CLI on Node 22, creates an app, installs locked dependencies and runs app checks/build. Checksums/archive members are validated first.
4. **ci** always runs and fails if any preceding check failed, was cancelled or skipped. Require stable checks `version-check` and `ci` in the main ruleset.
5. **release** runs only on main pushes/manual dispatch in chipguys2026/tcn after all checks pass. Only this job receives contents:write. It consumes the tested artifact and checks its commit matches the workflow SHA. PRs/forks cannot publish.

The publisher creates vVERSION at the tested commit. It uploads into a draft and publishes only after asset sizes/digests match. Published versions remain untouched, including on later docs-only commits. Failed draft uploads can resume from the original run's artifacts; different uploaded bytes or a tag at another commit are refused. Rerun the failed job in the original Actions run. GitHub chooses Latest automatically; prereleases are not marked Latest.

The initial push (all-zero base SHA) accepts the initial valid version/changelog. Later PRs must update from current main. Repository files cannot activate hosted branch protection: import the local ruleset after the first checks, as described in [GitHub setup](github-setup.md).

## Maintainer flow

1. Create a feature branch.
2. Edit CLI or templates/starter source; test/review Gallery and Tweak.
3. Increase root package.json version and add nonempty `## X.Y.Z` notes to CHANGELOG.md. The nested starter version does not control CLI releases.
4. Open a PR, update from main and pass version-check/ci.
5. Merge. The main workflow builds, tests and publishes the GitHub Release.

## Local verification

```sh
bun install --frozen-lockfile --offline
bun run check
bun install --frozen-lockfile --offline --cwd templates/starter
bun run template:check
bun run pack:release
bun run smoke:release --offline
```

Omit --offline when dependency downloads are allowed. Check committed local refs with:

```sh
bun run version:check --base <BASE_COMMIT> --head <HEAD_COMMIT>
```

Pack runs Bun's npm-compatible pack with lifecycle scripts disabled after an explicit build. Output is artifacts/release (git-ignored). `bun scripts/smoke.ts` checks package creation without app dependency installs; --full adds app checks/build, --offline restricts installs to cache, --keep preserves its temporary app. Smoke never contacts GitHub.

The publisher refuses ordinary local execution. Publisher tests use an in-memory API, with no remote release/settings changes. First execution of the actual hosted workflow still needs verification after you publish the repository.
