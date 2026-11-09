# GitHub setup to apply later

Local setup supplies the workflow and `.github/main-ruleset.json`. It does not create a remote, push commits, create a GitHub repository, activate rules or publish a release.

After you have published this standalone directory as `chipguys2026/tcn`:

1. Use main as the default branch and enable GitHub Actions. The initial push can release 0.1.0 if all checks pass.
2. Allow the release job to request contents:write. It uses built-in GITHUB_TOKEN only; no personal token or npm secret is needed.
3. After the first workflow registers its check names, open Settings / Rules / Rulesets and import `.github/main-ruleset.json`.
4. Confirm Active enforcement, target refs/heads/main, required PRs, required checks `version-check` and `ci` from GitHub Actions, and up-to-date branches before merge.
5. Retain the empty bypass list and force-push/deletion restrictions. Zero external approvals allows a single maintainer to use PRs; automated checks remain mandatory.

Version checks cannot block merges/direct pushes until these hosted rules are active. Owners can still edit/delete the ruleset; repository files cannot prevent that administrative action.

Release is a job in the same pipeline. It does not rely on a token-created tag triggering another workflow. External actions are pinned to commits; update pins deliberately and rerun checks.

## Install after a release exists

Users choose one package manager:

```sh
bun add -g https://github.com/chipguys2026/tcn/releases/download/v0.1.0/tcn-0.1.0.tgz
```

```sh
pnpm add -g https://github.com/chipguys2026/tcn/releases/download/v0.1.0/tcn-0.1.0.tgz
```

Then `tcn init my-app`, `cd my-app` and `bun run dev`. Install a newer release URL to update the CLI, then review/take source changes with diff/add. CLI requires Node 22+ and applications require Bun. URLs become usable only after the repository and release assets exist.

GitHub-only distribution does not provide npx tcn@latest or npx @chipguys/tcn@latest; those resolve through npm by default. The package name in a GitHub asset does not reserve/publish an npm registry name.
