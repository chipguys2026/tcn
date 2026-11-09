# opentui-starter

A React and OpenTUI starter for terminal applications, with a source-owned UI kit, component gallery and development tool for designing component defaults.

This directory is the standalone project. It can be copied or published independently of the parent discussion repository.

This is the canonical starter template distributed by TCN. Generated projects own their source and use CLI-only tcn.json/installed metadata for source updates. See [TCN source management](docs/tcn.md).

## Start

Requirements: Bun >= 1.3.14 and a terminal using a Nerd Font, preferably Mono. Run from this directory:

```sh
bun install
bun run dev
```

The application opens at Home. Tab/Shift+Tab moves focus; Enter/Space activates buttons; Ctrl+C exits. Text editors retain their documented typing keys.

| Route | Purpose |
| --- | --- |
| `/` | Introduction and entry points. |
| `/gallery` | Catalog of 51 component families. |
| `/gallery/:name` | A component's examples, such as `/gallery/button`. |
| `/gallery/showcase` | Form, table, selection and command-palette composition. |
| `/tweak` | Development previews, parameter edits and proposal export. |

The root layout uses dark theme. Gallery examples support local light/dark review. Configure the terminal font to render Nerd Font icons and rounded glyph shapes correctly.

## Included

- Bun, TypeScript strict mode, React, OpenTUI and Biome.
- Generated filesystem routing with page/layout/error/loading conventions.
- Local React state and Zustand-backed navigation/editing state.
- Source-owned [UI components](docs/ui/README.md), semantic light/dark theme tokens and shared input/focus/overlay primitives.
- Feature-based Home, Gallery and Tweak pages.
- Source defaults promoted from the existing draft, with auto-sized and bounded selection/menu/tooltip popups.
- Headless native rendering, keyboard/mouse, router, lifecycle and tooling tests.

The kit follows shadcn-inspired naming/composition, adapted to terminal rendering and interaction. It is not a DOM compatibility layer and does not depend on shadcn, Radix or Tailwind.

## Tweak designs defaults

The workflow is **preview parameters → export a proposal → review → update source defaults → verify in Gallery**.

Tweak does not rewrite component source or configure ordinary application startup. Local drafts under `design/` are ignored; explicit exports can be committed for discussion. See [Tweak](docs/tweak.md).

The universal per-part `styles` prop and colocated default-definition migration are agreed but **not completed yet**. The existing preview adapter is not the final public styling API. Read [styling status](docs/styling.md) and [roadmap](docs/roadmap.md) before relying on it.

## Develop and build

```sh
bun run format
bun run check
bun run build
bun run start:prod
```

The build outputs `dist/main.js` with external runtime dependencies. Bun and installed dependencies are still required; this is not a standalone executable. `private: true` prevents accidental npm publication of the application starter.

## Documentation

| Document | Contents |
| --- | --- |
| [Project structure](docs/project-structure.md) | Folders, feature ownership and dependency boundaries. |
| [Architecture](docs/architecture.md) | Lifecycle, state and reusable foundations. |
| [Routing](docs/routing.md) | Route conventions and navigation API. |
| [UI components](docs/ui/README.md) | Per-family API, examples, appearance and interaction. |
| [Styling](docs/styling.md) | Current implementation and agreed default/override contract. |
| [Interaction](docs/interaction.md) | Keyboard, mouse, focus rings and popup behavior. |
| [Popup sizing](docs/popup-sizing.md) | Auto dimensions, min/max bounds and scroll/wrap behavior. |
| [Development](docs/development.md) | Commands, verification and distribution boundaries. |
| [Tweak](docs/tweak.md) | Editing, drafts and exporting proposals. |
| [Roadmap](docs/roadmap.md) | Implemented, agreed-but-pending and future work. |
| [Contributing](CONTRIBUTING.md) | How to change components and documentation together. |

To start a product application, replace Home, add feature routes and remove the sample Gallery/Tweak features if unused. Reusable UI and `lib/ui` do not import those features.

## License

[MIT](LICENSE).
