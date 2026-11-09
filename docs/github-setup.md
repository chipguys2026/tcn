# GitHub administration

This guide is for repository maintainers configuring Actions and branch rules. To install TCN, use the [installation guide](installation.md).

## Actions permissions

The release workflow runs in `chipguys2026/tcn`. Keep GitHub Actions enabled and allow the release job to request `contents: write`. It publishes with the built-in `GITHUB_TOKEN`; npm credentials and a personal access token are not required.

The workflow builds, tests and releases in one pipeline. Publishing does not depend on a newly created tag triggering another workflow. External actions are pinned to commit SHAs.

## Protect main

Import [main-ruleset.json](../.github/main-ruleset.json) under **Settings → Rules → Rulesets**. Check the resulting settings:

- Enforcement is active and the target is `refs/heads/main`.
- Changes require a pull request.
- Required GitHub Actions checks are `version-check` and `ci`.
- Branches must be up to date before merging.
- Force pushes and branch deletion are restricted.
- The bypass list is empty.

The supplied ruleset requires no external approvals, allowing a single maintainer to merge after automated checks pass. Adjust the review policy to match your team.

Committing the JSON file does not activate hosted rules. Check the live ruleset in GitHub settings; repository administrators can change it independently.

## Release access and recovery

Only the main-branch release job receives write permission. PR and fork workflows cannot publish. Use the original Actions run when retrying a failed release so it consumes the same tested package.

See the [release process](releasing.md) for versioning, artifact validation and draft recovery.
