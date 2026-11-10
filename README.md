# TCN

Build terminal applications with React and OpenTUI. TCN gives you a working application starter and 51 component families whose source lives in your project, ready to customize.

Use buttons, forms, dialogs, menus, tables, charts and conversation layouts without building their terminal interactions from scratch. The starter includes filesystem routing, light and dark themes, a component gallery and Tweak for previewing visual changes.

## Quick start

You need **Node.js 22 or newer** for the CLI and **Bun 1.3.14 or newer** to install dependencies and run your application. Configure your terminal with a Nerd Font for icons.

Install TCN from the [v0.2.0 GitHub Release](https://github.com/chipguys2026/tcn/releases/tag/v0.2.0):

```sh
npm install -g https://github.com/chipguys2026/tcn/releases/download/v0.2.0/tcn-0.2.0.tgz
tcn init my-app
cd my-app
bun run dev
```

The application opens at Home. Choose **Gallery** to explore the components or **Showcase** to see them used together. Use Tab and Shift+Tab to move focus, Enter or Space to activate buttons, and Ctrl+C to exit.

TCN is distributed through GitHub Releases. Use the release URL above; `npx tcn@latest` resolves to a different npm package. See [installation](docs/installation.md) for Bun/pnpm alternatives and troubleshooting.

## Build your first screen

Replace `src/app/page.tsx` in your generated application:

```tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const [count, setCount] = useState(0)

  return (
    <box flexDirection="column" padding={2} gap={1}>
      <text>Count: {count}</text>
      <Button onPress={() => setCount((value) => value + 1)}>Increment</Button>
    </box>
  )
}
```

The dev process restarts the application when you save. Component imports point to local files under `src/components/ui`; shared theme and interaction helpers live in `src/lib/ui`.

For additional screens, follow the [routing guide](https://github.com/chipguys2026/tcn/blob/main/templates/starter/docs/routing.md). See the [starter guide](https://github.com/chipguys2026/tcn/blob/main/templates/starter/README.md) for the project layout, development commands and production build.

## Manage components

Run these commands from a project configured with TCN:

```sh
tcn list
tcn add button dialog
tcn diff button
tcn remove dialog
```

A new starter already includes every component family. `add` installs missing components or takes source changes from your installed CLI release. It also includes required shared helpers and package dependencies. Before removing a component, remove its usages from your application, Gallery and tests.

To use TCN in an existing React/OpenTUI application, run `tcn init` in that project, check its paths and aliases, then add the components you need. See the [CLI guide](docs/cli.md) and [configuration reference](docs/configuration.md).

## Use more icons

TCN 0.2.0 adds the complete Nerd Fonts catalog as optional source sets:

```sh
tcn list --icons
tcn add icons/fa
```

Use typed glyphs such as `fa.address_book` in component icon props. Existing aliases such as `save` remain available. New starters include a browser at `/gallery/icons`. See the [icon guide](https://github.com/chipguys2026/tcn/blob/main/templates/starter/docs/icons.md) for set imports, search and clipboard actions.

## Customize and update

Edit the component source to fit your application. Use [theme tokens and component defaults](https://github.com/chipguys2026/tcn/blob/main/templates/starter/docs/styling.md) for appearance changes, or open Tweak to preview and export a design proposal.

Installing a newer CLI does not change your application's files. Review changes with `tcn diff`, inspect an update with `tcn add button --dry-run`, then apply the components you want. TCN preserves local edits when the corresponding upstream file is unchanged and stops on conflicting replacements. See [updating and removing components](docs/updates.md).

Commit `tcn.json`, `.tcn/manifest.json` and `.tcn/schema.json` alongside your source so future updates can use the installed baseline.

## Documentation

| Guide | What you can do |
| --- | --- |
| [Installation](docs/installation.md) | Install the CLI, check requirements and resolve setup problems. |
| [CLI](docs/cli.md) | Create projects and add, compare or remove components. |
| [Components](https://github.com/chipguys2026/tcn/blob/main/templates/starter/docs/ui/README.md) | Find usage examples, props and keyboard behavior. |
| [Application development](https://github.com/chipguys2026/tcn/blob/main/templates/starter/README.md) | Add screens, customize the UI and build your app. |
| [Configuration](docs/configuration.md) | Choose source destinations and import aliases. |
| [Updates](docs/updates.md) | Review upstream changes while preserving your edits. |
| [Troubleshooting](docs/troubleshooting.md) | Resolve installation, update and removal errors. |
| [Contributing](https://github.com/chipguys2026/tcn/blob/main/CONTRIBUTING.md) | Develop and test changes to TCN itself. |

## License

[MIT](LICENSE).
