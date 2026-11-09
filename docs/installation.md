# Install TCN

TCN installs a `tcn` command that creates React/OpenTUI terminal applications and manages component source in existing projects.

## Requirements

| Tool | Requirement |
| --- | --- |
| [Node.js](https://nodejs.org/en/download) | Version 22 or newer for the CLI. |
| [Bun](https://bun.sh/docs/installation) | Version 1.3.14 or newer for application dependencies and runtime. |
| Terminal font | A Nerd Font for component icons; a Mono variant is recommended. |

Check your runtimes before installing:

```sh
node --version
bun --version
```

TCN's CI validates generated applications on Ubuntu and Windows. Terminal colors, keyboard input and glyph rendering also depend on your terminal configuration.

## Install the CLI

Choose one package manager. All three commands install the same release asset.

### npm

```sh
npm install -g https://github.com/chipguys2026/tcn/releases/download/v0.1.1/tcn-0.1.1.tgz
```

### Bun

```sh
bun add -g https://github.com/chipguys2026/tcn/releases/download/v0.1.1/tcn-0.1.1.tgz
```

### pnpm

```sh
pnpm add -g https://github.com/chipguys2026/tcn/releases/download/v0.1.1/tcn-0.1.1.tgz
```

Verify the installation:

```sh
tcn --version
tcn --help
```

The version command should print `0.1.1`. If `tcn` is unavailable, reopen your terminal and check that your package manager's global executable directory is on `PATH`. See [troubleshooting](troubleshooting.md).

TCN is available from [GitHub Releases](https://github.com/chipguys2026/tcn/releases). It is not published to the npm registry under this project's name; `npx tcn@latest` fetches a different package.

## Create an application

```sh
tcn init my-app
cd my-app
bun run dev
```

`init` copies the starter, sets up TCN tracking and runs `bun install`. The starter includes all 51 component families, Gallery examples and the Tweak design tool. The [application guide](https://github.com/chipguys2026/tcn/blob/main/templates/starter/README.md) explains where to start editing.

To install dependencies separately:

```sh
tcn init my-app --no-install
cd my-app
bun install
bun run dev
```

## Use an existing application

Run these commands inside a React/OpenTUI project:

```sh
tcn init
tcn add button dialog
```

In a directory containing `package.json`, `init` configures source management without scaffolding application screens or replacing `package.json`. Check [source paths and aliases](configuration.md) before adding components. Your project must provide the React/OpenTUI renderer, runtime setup and alias resolution that the components use.

## Install a newer CLI

Choose a release on GitHub and install its `.tgz` asset with the same package manager. Replacing the CLI changes the bundled component snapshot available to `add` and `diff`; it does not modify existing application source.

Follow the [update guide](updates.md) to review and apply component changes.
