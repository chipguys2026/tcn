# Troubleshooting

## The terminal cannot find `tcn`

Reopen your terminal after installing the CLI. Make sure the global executable directory of the package manager you used is on `PATH`. Verify that the installation completed, then run `tcn --version`.

If the command belongs to another package, remove that installation using its package manager and reinstall TCN from the GitHub Release URL in the [installation guide](installation.md).

## Bun is required

The CLI runs on Node.js 22 or newer, but generated applications and automatic dependency installation require Bun. Check that `bun --version` works in the same terminal where you run TCN.

To create or modify source before Bun is available, pass `--no-install`. Install Bun, then run `bun install` from the application root before starting the app.

## Dependency installation failed

If source was saved before `bun install` failed, resolve the network or package error and retry inside the application:

```sh
bun install
bun run check
```

You do not need to recreate the project to retry dependency installation.

## Icons appear as missing glyphs

Select a Nerd Font in your terminal settings. A Mono variant provides more consistent cell alignment. Font installation alone is insufficient if the terminal still uses another font.

## Imports using `@/` do not resolve

New starters map `@/*` to `src/*`. For an existing project, make sure TypeScript and the application runtime resolve the aliases configured in `tcn.json`. TCN does not rewrite an existing project's `tsconfig.json`. See [configuration](configuration.md).

## An update reports conflicting local files

Commit your current work, then inspect the incoming source:

```sh
tcn diff button
```

Merge the relevant changes into your files manually, or use `tcn add button --force` if you intend to replace the selected component and its required source dependencies. The CLI does not perform a three-way merge. See [updates](updates.md) for baseline behavior.

## A component cannot be removed

Read the reported paths and dependent components. Remove imports and usages from your application, Gallery and tests first. A retained component may still need the selected component or a shared helper.

`--force` only permits deleting locally modified managed files; it does not bypass references or dependencies. Package dependencies remain installed after source removal and can be reviewed separately.

## Another TCN operation holds the transaction lock

Allow the running command to finish. If it crashed, confirm that its process has exited before deleting the application's `.tcn/transaction.lock`, then retry. The lock protects concurrent source updates.

Keep `.tcn/manifest.json` and `.tcn/schema.json`; they are tracked project metadata, not temporary locks.

## Tweak changes do not appear in the application

Tweak previews changes and exports a design proposal. Apply the chosen values to component source defaults to change the application. See the [Tweak guide](https://github.com/chipguys2026/tcn/blob/main/templates/starter/docs/tweak.md).

## Report a problem

Open an [issue](https://github.com/chipguys2026/tcn/issues) with your TCN, Node and Bun versions, operating system, terminal, the command you ran and the error output. For rendering problems, include the terminal size and font. Include a small reproduction when possible and omit credentials or private application data.
