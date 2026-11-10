# Application contributor guide

## Project overview

This terminal application uses Bun, React and OpenTUI. `src/main.tsx` starts the renderer; `src/app/layout.tsx` supplies theme and focus. TCN components are local source owned by this project. Gallery and Tweak are removable development tools.

## Project structure

- `src/app/`: screens, layouts, loading and error handling. Implement screens directly in `page.tsx`.
- `src/features/<name>/`: business components, data access, hooks, schemas, stores, types and utilities owned by a feature.
- `src/components/ui/`: reusable TCN controls.
- `src/components/shared/`: shared application components and optional component demos.
- `src/api/`, `hooks/`, `schemas/`, `stores/`, `types/`, `utils/`: global code, created only when needed.
- `src/lib/`: integrations and supporting systems. `src/lib/ui/styles.ts` owns shared palettes/defaults.
- `src/router/`: routing implementation and generated manifest.
- `tests/`, `docs/`, `scripts/`: verification, documentation and tooling.

See [project structure](docs/project-structure.md), [feature development](docs/features.md) and [architecture](docs/architecture.md).

## Commands

Run from this application's root:

| Command | Purpose |
| --- | --- |
| `bun install` | Install dependencies. |
| `bun run dev` | Watch source, generate routes and restart. |
| `bun run start` | Generate routes and run once. |
| `bun run routes:generate` | Regenerate the route manifest. |
| `bun run typecheck` | Generate routes and check TypeScript. |
| `bun run lint` | Check formatting and lint. |
| `bun run format` | Apply Biome formatting and safe fixes. |
| `bun run test` | Generate routes and run tests. |
| `bun test tests/components/button.test.tsx` | Run a focused suite. |
| `bun run check` | Run types, lint and tests. |
| `bun run build` | Generate routes, typecheck and build. |
| `bun run start:prod` | Run `dist/main.js` with Bun. |

## Coding conventions

- Use strict TypeScript, two-space indentation, single quotes and Biome formatting. Prefer type-only imports where appropriate.
- Use kebab-case files, PascalCase components and `use`-prefixed hooks. Use plural `stores/`; examples include `user.api.ts`, `user.schema.ts`, `user.store.ts`.
- Route pages have default component exports; reusable components normally have named exports. Do not create a second `*-page.tsx` merely to forward a route.
- Split features around coherent user capabilities, not file counts. Keep related list/create/edit flows together. A small screen can stay in its route.
- Extract a component for meaningful responsibility, independent interaction/state or demonstrated reuse. Use primitives and existing controls directly for simple composition. Avoid wrappers that only rename components or props.
- Keep state near its owner. Use a store for state shared by independent consumers. Do not mirror a query cache in Zustand.
- Keep business-specific code in its feature; promote code only when ownership and API are shared.
- Keep shared UI defaults in `src/lib/ui/styles.ts`. Use supported props for instance overrides; do not add per-component style files.
- Schemas validate external data, configuration and files at runtime, not just forms. Infer types from schemas when possible instead of duplicating declarations.
- Use Conventional Commits, such as `feat(users): add filtering` or `fix: restore menu focus`.

## Working rules

- Inspect relevant code, docs and tests before editing. Preserve unrelated local changes.
- Use the smallest useful abstraction. Do not add empty directories, placeholder layers or dependencies for hypothetical needs.
- Check scripts in `package.json`. Run focused checks during development and `bun run check` plus `bun run build` for application code changes.
- Add meaningful regression coverage. Verify relevant keyboard, focus, theme and narrow-terminal behavior for UI changes.
- Update docs and examples when behavior changes. Shared demos and Tweak previews must use real controls.
- Report validation and unresolved failures; distinguish headless testing from manual terminal review.
- Follow this project's branch/PR workflow. Do not assume upstream TCN branch names or release policy apply here.

<!-- CODEGRAPH_START -->
### CodeGraph

If `.codegraph/` exists at the repository root, use `codegraph_explore` or `codegraph explore "<question>"` before text search or file reads to locate or understand code. Otherwise use ordinary search; do not create an index automatically.
<!-- CODEGRAPH_END -->

## Boundaries

- Routes may import features and shared code. Features must not import routes. Shared components/foundations must not import features or routes.
- Avoid cross-feature internal imports. Compose features in routes; expose and document a deliberate public module when a dependency is necessary.
- `api/` owns data access, not UI/focus. `utils/` contains pure transformations. Integrations and stateful supporting systems belong in `lib/`.
- Reuse TCN focus, activation and overlays. Preserve controlled/uncontrolled and disabled/read-only behavior.
- OpenTUI renders terminal cells, not browser DOM. Do not assume browser globals, CSS or DOM-based libraries.
- Do not hand-edit generated route manifests or glyph sets. Design proposals are not runtime defaults.
- Keep secrets, output and local drafts out of Git. Retain source-management metadata and license notices where applicable.
- Choose additional dependencies according to application requirements; keep the starter's runtime and rendering constraints in mind.
