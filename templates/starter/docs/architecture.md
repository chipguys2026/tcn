# Architecture

opentui-starter is a Bun application rendered by React and OpenTUI. It includes reusable component source and developer-facing example features. It does not require a browser, React DOM, Tailwind, Next.js or shadcn runtime packages.

## Application lifecycle

`src/main.tsx` creates the native renderer and React root. It mounts an outer application error boundary and RouterView. Shutdown unmounts React before destroying the renderer. Ctrl+C exits the application.

The root route layout supplies the dark theme, a FocusScope and a full-terminal application background. Feature screens inherit these foundations and can introduce local theme/focus scopes for examples.

## Features

| Feature | Responsibility |
| --- | --- |
| Home | Introduction and entry links. |
| Gallery | Component catalog, detailed examples and composed showcase. |
| Tweak | Preview parameter edits, history, notes, local drafts and proposal export. |

Route modules under `app/` are composition points, not feature implementations. A product feature should own its components, state and helper files under `features/<name>` and use the reusable UI kit.

## Dependencies

- `app` imports features and application foundations.
- Features import `components/ui`, `lib/ui` and router APIs.
- Tweak reuses Gallery's public catalog/examples.
- Reusable UI and `lib/ui` do not import features or read design files.
- Tests can exercise any of these boundaries.

`lib/ui` includes composition helpers as well as low-level hooks. Some composition helpers build on UI components, such as modal actions reusing Button. Do not assume every file in `lib` is a dependency-free utility.

## State

Use React state for local component/feature state. Use a Zustand store when state needs a shared owner; routing and the Tweak editing session already use this pattern. A workspace registry, view framework or global application store is not required.

Stateful components accept controlled values with change callbacks or uncontrolled defaults. Controlled callbacks propose a change; the owner can reject it by leaving the value unchanged. Defaults only initialize state. Programmatic value replacement does not represent user input.

## Rendering and interaction

OpenTUI owns layout, terminal painting and native editor/scroll primitives. The reusable layer handles activation, focus registration, grouped navigation, overlays and semantic visual states. See [interaction](interaction.md).

Dimensions are terminal cells. A terminal row and column are not physically square. Glyph shapes depend on the terminal's Nerd Font; rendered headless tests verify cell layout and colors, not a particular font's rasterization.

## Development data

Only Tweak reads or writes `design/`. Its draft/export documents are proposals for source defaults. Normal application startup does not load these documents or mount the Tweak styling provider.

The current optional styling adapter still contains editor-era observation and inheritance behavior. Its replacement by a normal typed `styles` API is unfinished; see [styling](styling.md). The structural reorganization does not claim that migration is complete.
