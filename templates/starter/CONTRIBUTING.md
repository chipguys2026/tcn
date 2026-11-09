# Contributing

Run commands from the application root. These guidelines apply when changing local components, routing or development tools.

## Workflow

1. Install dependencies with `bun install`.
2. Describe the expected behavior before extending a component's API.
3. Implement reusable UI in `src/components/ui` and application features in `src/features`.
4. Add or update a shared gallery example. Tweak must preview the real component, not a second implementation.
5. Update the relevant `docs/ui/<component>.md` and any affected architecture or interaction documentation.
6. Run `bun run format`, `bun run check` and `bun run build`.

Use TypeScript strict mode, named component exports, two-space indentation, single quotes and no unnecessary semicolons. Let Biome format code.

## Boundaries

- Route modules in `src/app` connect routes to features. Do not place editors, catalogs or application state in route files.
- UI components and `lib/ui` must not import feature implementations or read files from `design/`.
- The Tweak feature may reuse Gallery's catalog and examples. Keep draft storage, schema, history and export inside Tweak.
- Do not add a component-specific focus manager. Reuse the focus, activation and overlay primitives.
- Preserve controlled/uncontrolled semantics and meaningful disabled/read-only behavior.
- Keep visual defaults in source. Draft/export JSON is a design proposal, not runtime configuration.
- Never edit `src/router/routes.generated.ts` by hand; run `bun run routes:generate`.

## Changes to appearance

Check light and dark themes, narrow terminals, disabled controls, focus rings, popup placement and embedded controls where relevant. Test observable behavior and regressions rather than reproducing implementation details.

Use documented component props and local source defaults for appearance changes. See [styling](docs/styling.md) for the supported customization model.

## Changes to routing and tooling

Run the generator and watcher tests. Build output depends on Bun and the installed runtime packages; verify a clean installation on each platform you intend to support.

Contributions are distributed under the [MIT license](LICENSE).
