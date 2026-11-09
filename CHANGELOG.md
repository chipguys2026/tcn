# Changelog

## 0.1.0 — Unreleased

- Add a Node-compatible npm CLI: init, add, remove, diff, list, force, dry-run and no-install.
- Compile 51 component families and shared primitives from the canonical starter into a bundled registry.
- Generate tcn.json and local schema; track installed revisions, source baselines and dependency ownership separately.
- Preserve local edits, show shared dependency impact, check references before removal and guard file transactions.
- Keep Home, Gallery, Tweak, source defaults and application tests in the standalone generated starter.
- Prepare local packaging and release documentation; no npm publication yet.
- Fix route discovery during Windows directory renames by retrying a complete snapshot; preserve permission/configuration failures.
- Prepare GitHub-only CI/releases, version/changelog checks, packed-app smoke tooling and an importable main ruleset. No remote setup or publication was performed.
