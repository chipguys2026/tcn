# Contributing to TCN

TCN contains a Node-compatible CLI and a React/OpenTUI application template. Component changes belong in the template; the build compiles them into the registry shipped with each CLI release.

## Set up the repository

Use Node.js 22 or newer and Bun 1.4.4 to match the pinned CI runtime.

```sh
git clone https://github.com/chipguys2026/tcn.git
cd tcn
bun install --frozen-lockfile
bun run template:install
bun run build
```

Run the canonical application to review component changes:

```sh
bun run dev
```

## Make a change

- Change CLI behavior in `src/` and integration coverage in `tests/`.
- Change component source in `templates/starter/src/components/ui` and shared foundations in `templates/starter/src/lib/ui`.
- Keep component documentation and Gallery examples aligned with the implementation. Follow the [starter contribution guide](templates/starter/CONTRIBUTING.md) for interaction and styling changes.
- Edit registry source through the template. `registry/index.json` and `dist/` are generated.

See [repository structure](docs/project-structure.md) for ownership and build details.

## Validate

```sh
bun run check
bun run template:check
bun run pack:release
bun run smoke:release
```

The first two commands check the CLI and starter. Packing builds the distributable; `smoke:release` verifies it and installs, checks and builds a generated application. For an archive/CLI check without installing app dependencies, run `bun scripts/smoke.ts`. Add `--offline` only when dependencies are already cached.

For UI changes, review the affected components in Gallery with light/dark themes, keyboard and pointer input, and narrow terminal dimensions.

## Submit a pull request

Create a branch from `main` and describe the user-visible change and validation performed. Use Conventional Commits, for example `fix: preserve local component edits` or `docs: clarify installation`.

Non-documentation changes require a higher root `package.json` version and matching `CHANGELOG.md` notes. Markdown and `docs/` changes are exempt from the version bump requirement. See the [release process](docs/releasing.md) for the complete version policy.

Contributions are licensed under [MIT](LICENSE).
