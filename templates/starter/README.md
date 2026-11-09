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

Edit `src/features/home/home-page.tsx`. The root route at `src/app/page.tsx` already renders this feature.

For example, replace the Home feature with a name field and a greeting:

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

Use the [routing guide](docs/routing.md) to add screens. Keep screen implementations under `src/features/<feature>` and connect them through route files in `src/app`.

## Explore the components

The starter includes all 51 component families. Open Gallery from Home to see examples before using them in your screens.

| Route | Purpose |
| --- | --- |
| `/` | Home; replace this with your application's entry screen. |
| `/gallery` | Component catalog. |
| `/gallery/:name` | A component's examples, such as `/gallery/button`. |
| `/gallery/showcase` | Components composed into larger interfaces. |
| `/tweak` | Preview spacing, dimensions and color changes. |

Import components from local source:

```tsx
import { Button } from '@/components/ui/button'
```

Your application owns these files. See the [component reference](docs/ui/README.md) for usage, props and keyboard behavior.

## Customize the application

- Change light/dark theme selection in `src/app/layout.tsx`.
- Edit semantic colors in `src/lib/ui/theme/tokens.ts`.
- Adjust component defaults in their source and colocated `*.styles.ts` files.
- Use Tweak to preview a design and export a proposal, then apply the chosen values to source.

See [styling](docs/styling.md) and [Tweak](docs/tweak.md) for details. Tweak exports do not automatically change application defaults.

When the examples are no longer needed, remove their route modules under `src/app/gallery` and `src/app/tweak` and the corresponding features. Review tests that reference those screens. Reusable UI and shared helpers do not depend on them.

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
| [Routing](docs/routing.md) | Pages, layouts, navigation and error handling. |
| [Components](docs/ui/README.md) | Examples, props and interaction reference. |
| [Styling](docs/styling.md) | Themes, supported props and source defaults. |
| [Interaction](docs/interaction.md) | Keyboard, focus and overlay conventions. |
| [Popup sizing](docs/popup-sizing.md) | Content sizing, bounds and overflow. |
| [Tweak](docs/tweak.md) | Design previews, local drafts and exports. |
| [TCN source management](docs/tcn.md) | Updating and removing copied source. |
| [Architecture](docs/architecture.md) | Lifecycle, state and dependency boundaries. |
| [Contributing](CONTRIBUTING.md) | Guidelines for component and tooling changes. |

## License

[MIT](LICENSE).
