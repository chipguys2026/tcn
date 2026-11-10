# TCN application starter

A React/OpenTUI terminal application with local component source, filesystem routing, themes and development tools. Use it as the starting point for your own terminal app.

## Run the application

You need Bun 1.3.14 or newer and a terminal configured with a Nerd Font for icons.

```sh
bun install
bun run dev
```

If `tcn init` already installed dependencies, start directly with `bun run dev`. Use Tab and Shift+Tab to move focus, Enter or Space to activate buttons, and Ctrl+C to exit.

The development process restarts the application when source changes. Component state resets on restart.

## Make your first change

Edit `src/app/page.tsx`, which implements the entry screen directly.

For example, replace its contents with a name field and a greeting:

```tsx
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useTheme } from '@/lib/ui/theme/use-theme'

export default function HomePage() {
  const [name, setName] = useState('')
  const theme = useTheme()

  return (
    <box flexDirection="column" padding={2} gap={1}>
      <Input
        label="Name"
        placeholder="Your name"
        value={name}
        onValueChange={setName}
      />
      <text fg={theme.foreground}>Hello, {name || 'world'}!</text>
    </box>
  )
}
```

Use the [routing guide](docs/routing.md) to add screens in `src/app`. Follow the [feature walkthrough](docs/features.md) to build a searchable screen and organize its components. See [project structure](docs/project-structure.md) for where to place application code.

## Explore the components

The starter includes all 51 component families. Open Gallery from Home to see examples before using them in your screens.

| Route | Purpose |
| --- | --- |
| `/` | Home; replace this with your application's entry screen. |
| `/gallery` | Component catalog. |
| `/gallery/:name` | A component's examples, such as `/gallery/button`. |
| `/gallery/showcase` | Components composed into larger interfaces. |
| `/gallery/icons` | Search, preview and copy Nerd Fonts icons. |
| `/tweak` | Preview spacing, dimensions and color changes. |

Import components from local source:

```tsx
import { Button } from '@/components/ui/button'
```

Your application owns these files. See the [component reference](docs/ui/README.md) for usage, props and keyboard behavior.

The starter also includes the complete Nerd Fonts 3.5.1 catalog. Open **Nerd Fonts** in Gallery to search by name or codepoint, filter sets and copy usage examples. Existing aliases like `save` work alongside typed glyphs from individual sets. See [icons](docs/icons.md) for imports and installing sets in other applications.

## Customize the application

- Change light/dark theme selection in `src/app/layout.tsx`.
- Edit semantic colors in the `themes` section of `src/lib/ui/styles.ts`.
- Adjust shared component defaults in `src/lib/ui/styles.ts`.
- Use Tweak to preview a design and export a proposal, then apply the chosen values to source.

See [styling](docs/styling.md) and [Tweak](docs/tweak.md) for details. Tweak exports do not automatically change application defaults.

Keep Gallery and Tweak while developing your application, or follow [removing starter examples](docs/cleanup.md) to remove either tool and its associated files.

## Check and build

```sh
bun run check
bun run build
bun run start:prod
```

`check` runs TypeScript, lint and tests. `build` writes `dist/main.js`. The built application requires Bun and its installed runtime dependencies; when moving it to another machine, include `package.json` and `bun.lock`, install dependencies there and run the bundle.

For all available commands and test guidance, see [development](docs/development.md).

## Documentation

| Guide | Contents |
| --- | --- |
| [Project structure](docs/project-structure.md) | Files to edit and where application features belong. |
| [Feature development](docs/features.md) | Add a screen, extract a component and grow data/state ownership. |
| [Remove starter examples](docs/cleanup.md) | Keep or remove Gallery, Tweak and their shared fixtures. |
| [Contributor conventions](AGENTS.md) | Commands, coding conventions, working rules and boundaries. |
| [Routing](docs/routing.md) | Pages, layouts, navigation and error handling. |
| [Components](docs/ui/README.md) | Examples, props and interaction reference. |
| [Icons](docs/icons.md) | Built-in aliases, complete Nerd Fonts sets and the icon browser. |
| [Styling](docs/styling.md) | Themes, supported props and source defaults. |
| [Interaction](docs/interaction.md) | Keyboard, focus and overlay conventions. |
| [Popup sizing](docs/popup-sizing.md) | Content sizing, bounds and overflow. |
| [Tweak](docs/tweak.md) | Design previews, local drafts and exports. |
| [TCN source management](docs/tcn.md) | Updating and removing copied source. |
| [Architecture](docs/architecture.md) | Lifecycle, state and dependency boundaries. |
| [Contributing](CONTRIBUTING.md) | Guidelines for component and tooling changes. |

## License

[MIT](LICENSE).
