# TCN contributor guide

## Project overview

TCN distributes source-owned React/OpenTUI components and a terminal application starter. The CLI runs on Node.js 22 or newer. Tooling and application development use Bun; use Bun 1.4.4 to match CI. The canonical UI source is `templates/starter`.

## Project structure

- `src/`: Node-compatible CLI, source ownership and file transactions.
- `scripts/`: registry compilation, icon generation, packaging and release tooling.
- `tests/`: CLI, registry and release tests.
- `templates/starter/`: standalone application, docs and tests; follow its [AGENTS.md](templates/starter/AGENTS.md).
- `registry/nerd-fonts/`: pinned upstream data and notices.
- `schemas/`: CLI configuration JSON Schema.
- `docs/`: CLI and contributor documentation.

See [repository structure](docs/project-structure.md). Create directories for actual code, not to fill out a conceptual architecture.

## Commands

Run from the repository root:

| Command | Purpose |
| --- | --- |
| `bun install --frozen-lockfile` | Install CLI tooling. |
| `bun run template:install` | Install starter dependencies. |
| `bun run dev` | Develop the starter application. |
| `bun run check` | Check CLI types, lint, build and tests. |
| `bun run template:check` | Check starter types, lint and tests. |
| `bun run format` | Format CLI/tooling source. |
| `bun run --cwd templates/starter format` | Format starter source. |
| `bun run --cwd templates/starter build` | Build the application. |
| `bun run icons:check` | Verify generated glyph sets. |
| `bun run icons:generate` | Regenerate glyph sets after an intentional snapshot update. |
| `bun run pack:release` | Build the local release archive. |
| `bun run smoke:release` | Verify the packed CLI and a generated application. |

## Coding conventions

- Use strict TypeScript, two-space indentation, single quotes and Biome formatting.
- Use Conventional Commits, for example `fix(cli): preserve local edits`, `feat: add icons` or `docs: clarify installation`.
- Preserve Node compatibility in CLI source. Bun APIs belong in tooling or the application.
- Implement UI changes in the starter. Keep shared visual defaults in `templates/starter/src/lib/ui/styles.ts`.
- Follow starter conventions for features, components and state.
- Follow the existing [version/changelog policy](docs/releasing.md). Do not impose TCN's release process on generated applications.

## Working rules

- Work on `dev`; merge into protected `main` through a pull request. Never push directly to `main`.
- Read relevant implementation, tests and docs first. Preserve unrelated local changes.
- Keep changes within the request. Update docs and examples when behavior or structure changes.
- Test observable behavior and regressions. Run checks for affected packages; verify a packed generated application when template distribution or CLI installation changes.
- Report checks performed, failures and limitations. Distinguish headless checks from manual terminal review.
- Commit, push, merge and publish only within the user's requested workflow. Implementation alone does not request a release.

<!-- CODEGRAPH_START -->
### CodeGraph

If `.codegraph/` exists at the repository root, use `codegraph_explore` or `codegraph explore "<question>"` before text search or file reads to locate or understand code. Otherwise use ordinary search; do not create an index automatically.
<!-- CODEGRAPH_END -->

## Boundaries

- Do not hand-edit `dist/`, `registry/index.json`, route manifests or generated glyph sets. Update inputs and run generators.
- The starter must remain independent of CLI code and work after extraction into a separate project.
- Keep root and starter commands, dependencies and docs distinct. Starter documentation links must resolve within the generated application.
- Preserve file transaction, local-edit and shared-ownership safeguards.
- Keep credentials and local verification output out of Git. Preserve upstream notices.
