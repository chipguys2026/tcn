# Architecture

The application runs on Bun with React and OpenTUI. Screens compose local UI components, while shared foundations provide theme, focus, navigation and renderer lifecycle.

## Application lifecycle

`src/main.tsx` creates the native renderer and React root. It mounts an outer application error boundary and RouterView. Shutdown unmounts React before destroying the renderer. Ctrl+C exits the application.

The root route layout supplies the dark theme, a FocusScope and a full-terminal application background. Feature screens inherit these foundations and can introduce local theme/focus scopes for examples.

## Features

| Feature | Responsibility |
| --- | --- |
| Home | Introduction and entry links. |
| Gallery | Component catalog, detailed examples and composed showcase. |
| Tweak | Preview parameter edits, history, notes, local drafts and proposal export. |

Route modules under `app/` implement screens and compose feature-owned components and logic. Screen-local state stays in the page; business behavior shared across screens belongs to its feature. See [feature development](features.md).

## Dependencies

- `app` imports features and application foundations.
- Features import `components/ui`, `lib/ui` and router APIs.
- Gallery and Tweak both use `components/shared/component-demos`; neither imports the other's internals.
- Reusable UI and `lib/ui` do not import features or read design files.
- Features do not import routes. Prefer composition in a route over cross-feature internal imports; document a public module when a feature dependency is necessary.
- Tests can exercise any of these boundaries.

`lib/ui` includes composition helpers as well as low-level hooks. Some composition helpers build on UI components, such as modal actions reusing Button. Do not assume every file in `lib` is a dependency-free utility.

## State

Use React state for local component/feature state. Use a Zustand store when state needs a shared owner; routing and the Tweak editing session use this pattern.

Keep state near its owner. Custom hooks reuse React logic; each invocation has its own local state unless it subscribes to a shared owner. When an application uses a query cache, that cache owns fetched data. Zustand stores should hold the additional application state that needs to be shared.

Feature data access belongs in its `api/` directory; application-wide transport setup belongs in `src/api/` when needed. Data access is independent of rendering and focus. Validate external responses, files and configuration at their boundaries. Keep business-specific types and transformations with their feature. See [project structure](project-structure.md) for shared code locations.

Stateful components accept controlled values with change callbacks or uncontrolled defaults. Controlled callbacks propose a change; the owner can reject it by leaving the value unchanged. Defaults only initialize state. Programmatic value replacement does not represent user input.

## Rendering and interaction

OpenTUI owns layout, terminal painting and native editor/scroll primitives. The reusable layer handles activation, focus registration, grouped navigation, overlays and semantic visual states. See [interaction](interaction.md).

Dimensions are terminal cells. A terminal row and column are not physically square. Glyph shapes depend on the terminal's Nerd Font; rendered headless tests verify cell layout and colors, not a particular font's rasterization.

## Component foundations

Reusable controls share activation, focus, layout and overlay systems. When maintaining a component, extend these foundations to preserve consistent interaction across the kit.

| System | Responsibilities |
| --- | --- |
| Activation and focus | `usePress`, `useFocusable` and FocusScope coordinate activation, registration and traversal. Grouped controls use roving navigation. |
| Focus rings | A shared final paint pass draws rings above component and popup surfaces without adding hit regions or tab stops. |
| Floating surfaces | Dialog, AlertDialog, Sheet, Popover and anchored popups share overlay placement and focus restoration. Portals preserve React context. |
| Menus | DropdownMenu, ContextMenu and Menubar share the menu engine while keeping family contexts separate. Menubar adds nested submenus. |
| Editors and composition | Input Group composes the native Input/Textarea controls; Field and other passive parts share layout/text helpers. |
| Appearance | `lib/ui/styles.ts` supplies palettes and defaults. Badge and Kbd share pill geometry; Badge uses Button's semantic variant colors. |
| Renderer lifecycle | Spinner uses the renderer clock. Shared integrations clean up with the renderer or React owner. |

Auto-sized popups participate in native layout before becoming visible. Resize hooks settle dimensions and placement before paint; focus enters once the popup is ready. Backdrop dimming starts when the popup opens and remains stable during measurement.

## Development data

Only Tweak reads or writes `design/`. Its draft/export documents are proposals for source defaults. Normal application startup does not load these documents or mount the Tweak styling provider.

Tweak mounts the optional preview adapter for part observation and overrides. Customize application screens through documented component props and source defaults; see [styling](styling.md).

The editor screen is `src/app/tweak/page.tsx`. Its feature separates part previews (`components`), document validation (`schemas`), editing state and persistence sessions (`stores`), and filesystem access/export (`api`). Gallery and Tweak use `components/shared/component-demos` for the shared catalog and examples. The `styleSource` and `stylePart` identifiers associate rendered parts with Tweak's observations and overrides.
