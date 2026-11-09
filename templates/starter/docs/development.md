# Development

## Requirements

- Bun on PATH. The package requires Bun >= 1.3.14 and records the development package manager version in `package.json`.
- A terminal configured with a Nerd Font, preferably a Mono variant.
- Native OpenTUI dependencies installed for the platform where the application will run.

The development workflow has been exercised on Windows/PowerShell. Check installation, tests, renderer startup and terminal cleanup on other platforms before claiming support for them.

## Commands

Run all commands from the opentui-starter directory:

```sh
bun install
bun run dev
```

| Command | Purpose |
| --- | --- |
| `bun run dev` | Watch source, regenerate routes and restart the app. |
| `bun run start` | Generate routes and run source once. |
| `bun run routes:generate` | Update the static route manifest. |
| `bun run format` | Apply Biome formatting and safe fixes. |
| `bun run check` | TypeScript, lint and tests. |
| `bun run test` | Generate routes and run Bun tests. |
| `bun run build` | Generate routes, typecheck and bundle. |
| `bun run start:prod` | Run `dist/main.js`. |

The dev process restarts on source changes; it does not provide React Fast Refresh or preserve arbitrary component state across restarts. Stop it before moving/renaming the project on Windows.

## Tests

Tests are grouped under `tests/components`, `router`, `runtime`, `styling` and `tweak`. Type-only component API fixtures are checked by TypeScript. Headless render tests use the OpenTUI test renderer and mock keyboard/mouse input.

Verify the behavior affected by a change. For interaction or layout regressions, use real native geometry and observable input/render behavior. Wrap updates and render passes that trigger React state in `act`.

The watcher tests create temporary directories and exercise file additions, renames, conflicts and recovery. Do not weaken them to make an unrelated UI edit pass.

## Build and distribution

The bundle is a Bun entry point with external OpenTUI, React and Zustand dependencies. It requires an installed runtime dependency tree; it is not a standalone executable. The package remains `private: true` to prevent accidental npm publication of an application starter. Publishing the repository is separate from publishing an npm package.

Do not commit `node_modules`, `dist`, coverage or local drafts. Keep the lockfile. Follow [CONTRIBUTING](../CONTRIBUTING.md) when changing the public component contract.
