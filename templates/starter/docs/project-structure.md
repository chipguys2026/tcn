# Project structure

This document describes the runnable `opentui-starter` directory. It can be copied or published as its own repository. The parent `tui-base` documentation is discussion/reference material and is not a runtime dependency.

```text
opentui-starter/
├─ README.md
├─ LICENSE
├─ CONTRIBUTING.md
├─ CHANGELOG.md
├─ package.json
├─ bun.lock
├─ tsconfig.json
├─ biome.json
├─ docs/
│  ├─ project-structure.md
│  ├─ architecture.md
│  ├─ routing.md
│  ├─ styling.md
│  ├─ interaction.md
│  ├─ development.md
│  ├─ tweak.md
│  ├─ roadmap.md
│  └─ ui/                    # One document per component family
├─ design/                   # Design proposals; never runtime configuration
├─ scripts/
│  ├─ dev.ts
│  ├─ build.ts
│  └─ generate-routes.ts
├─ tests/
│  ├─ components/
│  ├─ router/
│  ├─ runtime/
│  ├─ styling/
│  └─ tweak/
└─ src/
   ├─ main.tsx
   ├─ app/                   # Thin route modules and root layout/error handling
   │  ├─ layout.tsx
   │  ├─ error.tsx
   │  ├─ page.tsx
   │  ├─ gallery/
   │  │  ├─ page.tsx
   │  │  ├─ [name]/page.tsx
   │  │  └─ showcase/page.tsx
   │  └─ tweak/page.tsx
   ├─ features/
   │  ├─ home/home-page.tsx
   │  ├─ gallery/
   │  │  ├─ gallery-page.tsx
   │  │  ├─ component-page.tsx
   │  │  ├─ button-gallery-page.tsx
   │  │  ├─ input-gallery-page.tsx
   │  │  ├─ checkbox-gallery-page.tsx
   │  │  ├─ showcase-page.tsx
   │  │  ├─ catalog.tsx
   │  │  └─ examples/
   │  └─ tweak/
   │     ├─ tweak-page.tsx
   │     ├─ parts.tsx
   │     ├─ schema.ts
   │     ├─ store.ts
   │     ├─ session.ts
   │     ├─ storage.ts
   │     └─ export.ts
   ├─ components/
   │  ├─ ui/                 # Source-owned reusable components
   │  │  ├─ button.tsx
   │  │  ├─ button.styles.ts
   │  │  └─ …
   │  └─ shared/             # Shared application support, e.g. ErrorBoundary
   ├─ lib/ui/                # Interaction, composition, theme and focus helpers
   │  ├─ focus/
   │  ├─ theme/
   │  ├─ overlay.tsx
   │  ├─ pressable.tsx
   │  └─ …
   └─ router/
      └─ routes.generated.ts # Generated; do not edit
```

## Responsibilities

`app` binds route conventions to feature entry points. `features/home` owns the introduction; `features/gallery` owns the catalog and examples; `features/tweak` owns the editor and proposal persistence.

Gallery and Tweak use the same real components and examples. Tweak is allowed to depend on Gallery's catalog. Reusable components and `lib/ui` do not depend on either feature.

Keep small features flat. Do not create empty `hooks`, `services` or `model` directories. Extract a directory when actual code needs it.

## Defaults and style files

Thirty-seven component families have colocated `<name>.styles.ts` definitions, including the promoted draft values and the new composition/navigation/panel families. The component render and its style observations use the same constants. `button.styles.ts` also contains the color resolver reused by Badge. ContextMenu inherits DropdownMenu defaults with an explicit minimum-width exception. Remaining parts still define defaults in their implementations; the full migration is tracked in [styling](styling.md). Empty placeholder files are not part of this structure.

Passive composition parts reuse `lib/ui/parts.tsx`. Input Group shares visual ownership with existing Input/Textarea through `lib/ui/editor-group.ts`; editing, focus coordination and activation stay in their existing primitives.

DropdownMenu, ContextMenu and Menubar share `lib/ui/menu.tsx`, with separate family contexts. Menubar adds top-level switching and nested menus around that engine. Toast owns its provider-scoped notification state and uses the renderer clock; it does not introduce application-global state or another focus manager.

`lib/ui/use-box-size.ts` measures native cell dimensions for sliders and panel layouts. `lib/ui/panel-layout.ts` contains pure percentage constraints and adjacent-panel resizing. Sidebar composes existing controls and keeps its open state in a local provider.

`lib/ui/chart-model.ts` owns the pure Bar/Line cell renderer and hit testing. Code Block owns renderer-scoped syntax styles through `lib/ui/use-syntax-style.ts`. Questionnaire reuses form controls; Message Scroller owns a provider-local viewport and stable message-ID registry. Message, Marker and Trace compose existing layout, separator and disclosure primitives.

Overlay composition is split into `overlay-panel.tsx`, pure placement in `overlay-placement.ts`, and intrinsic measurement/limits in `overlay-sizing.ts`. `overlay.tsx` retains the public imports.

## Generated and local files

`node_modules/`, `dist/`, coverage and draft files are ignored. `bun.lock` and the route manifest are retained for reproducibility and review. `design/component-review.json` is an explicit export; `design/component-review.draft.json` is local autosave data.

For a product application, replace the Home feature and remove Gallery/Tweak routes and features if they are no longer useful. Keep `components/ui`, `lib/ui`, the router and application lifecycle code you use.
