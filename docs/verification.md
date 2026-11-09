# Local verification

Verified on Windows, 2026-11-09, with Node 24.18.0, npm 12.0.2 and Bun 1.4.4.

| Check | Result |
| --- | --- |
| CLI typecheck and lint | Passed. |
| CLI/source-management and local CI/release integration suites | 64 tests passed. |
| Canonical starter typecheck, lint and tests | 322 tests passed. |
| Latest snapshot registry/init checks | 2 selected integration tests passed after the template watcher fix. |
| npm-compatible package payload | Bun pack produced the tarball; extracted executable ran directly under Node. |
| App created by packed executable | Generated 51 families, Home/Gallery/Tweak, tcn.json, schema and installed baselines. |
| Generated app installation and checks | Bun install, typecheck, lint and all 322 tests passed. |
| Generated production build | dist/main.js built successfully. |
| Installed-source comparison | Packed CLI reported no differences for the generated Button. |

The package contains a Node executable, bundled registry/template data, schema, documentation, third-party notices and license. Template dependencies/build outputs, local Tweak drafts/backups and environment files were excluded. No npm publication or remote repository push was performed.

Local CI/release setup was checked without accessing or changing a Git remote or GitHub settings. Release tests use local temporary Git histories and an in-memory API. They cover missing bumps, stale branches, docs exemptions, SemVer, initial-history bootstrapping, exact commit tags, immutable published versions, partial draft recovery, checksums and blocked local/PR/fork publishing. Workflow YAML parsing, dependency gates, pinned actions and ruleset check names are tested locally. The actual hosted workflow and ruleset have not been run/applied; those require the owner's later GitHub setup.

The cache-only packed-app smoke used `bun run smoke:release --offline`: all 322 app tests, typecheck/lint and production build passed. The catalog route test still mounts every family; its per-test timeout is 15 seconds to accommodate native/highlighter startup on cold Windows runners, with all assertions retained.

Two earlier generated-app checks exposed an existing Windows route-watch race: a child directory disappeared between listing and traversal. The canonical scanner now retries a fresh whole discovery snapshot for child ENOENT/ENOTDIR errors, with a bounded retry count. It preserves genuine errors. A deterministic rename-during-read test and a permission-error test were added; the final packed app passed the watcher test and the complete suite.

Integration coverage includes graph resolution, adoption, idempotence, local/upstream conflicts, force, shared impact, custom paths/aliases, CRLF/LF comparisons, retired files/components, source references before removal, path/junction checks, concurrent modifications and transaction rollback. Tests do not establish automatic merging or compatibility with arbitrary application customizations. Review diffs and run application checks when taking updates.
