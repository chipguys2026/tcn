# Develop and build your application

Run commands from your application root, where `package.json` lives. Use Bun 1.3.14 or newer and configure your terminal with a Nerd Font for icons.

## Development commands

```sh
bun install
bun run dev
```

| Command | Purpose |
| --- | --- |
| `bun run dev` | Watch source, regenerate routes and restart the app. |
| `bun run start` | Generate routes and run source once. |
| `bun run routes:generate` | Update the static route manifest. |
| `bun run typecheck` | Generate routes and check TypeScript. |
| `bun run lint` | Check source with Biome. |
| `bun run format` | Apply Biome formatting and safe fixes. |
| `bun run test` | Generate routes and run Bun tests. |
| `bun run check` | Run TypeScript, lint and tests. |
| `bun run build` | Generate routes, typecheck and bundle the application. |
| `bun run start:prod` | Run `dist/main.js`. |

The dev process restarts on source changes. It does not preserve component state across restarts. Stop it before moving or renaming the project directory on Windows.

## Edit screens and components

Start with `src/features/home/home-page.tsx` for your Home screen. Add features under `src/features` and routes under `src/app`; see [routing](routing.md).

Components in `src/components/ui` and helpers in `src/lib/ui` are local source. Edit them to fit your application. If you use TCN updates, keep its manifest in Git so it can identify your changes.

## Run tests

Tests are grouped under `tests/components`, `router`, `runtime`, `styling` and `tweak`. Type-only API fixtures are checked by TypeScript. Headless component tests use OpenTUI's test renderer and simulated keyboard/mouse input.

Run a specific suite while working:

```sh
bun test tests/components/button.test.tsx
```

For layout or interaction changes, test observable rendering and input behavior and inspect the result in a real terminal. Wrap updates that trigger React state in `act`. The routing/watcher tests exercise additions, renames and recovery using temporary directories.

When removing the sample Gallery or Tweak features, update the tests that depend on them, including starter structure assertions.

## Build for deployment

```sh
bun run check
bun run build
bun run start:prod
```

The bundle at `dist/main.js` keeps OpenTUI, React and Zustand external. Deploy it with `package.json` and `bun.lock`, install runtime dependencies for the target platform, and run it with Bun. It is not a standalone binary.

The starter package is private by default. If you choose to distribute your application, define its installation and packaging separately.

## Files to commit

Keep source, tests, documentation, `bun.lock` and the generated route manifest in Git. For projects configured with TCN, also keep `tcn.json`, `.tcn/manifest.json` and `.tcn/schema.json`.

Dependencies, build output, coverage and local Tweak drafts are ignored. An explicit `design/component-review.json` export can be committed when it helps review a design.
