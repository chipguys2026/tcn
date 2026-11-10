# Project structure

Edit `src/app/page.tsx` to replace the entry screen. Implement additional screens in `src/app/<route>/page.tsx`. Group related business components and logic under `src/features/<name>`.

## What the starter contains

```text
my-app/
├── AGENTS.md                 # Contributor commands, conventions and boundaries
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
├── package.json
├── bun.lock
├── tsconfig.json
├── biome.json
├── tcn.json                  # Created by tcn init
├── .tcn/                     # Created by tcn init; tracked tooling metadata
│   ├── manifest.json
│   └── schema.json
├── docs/
├── design/                   # Optional Tweak proposals and ignored drafts
├── scripts/                  # Development, route generation and build
├── tests/                    # Components, routing, runtime, styling and Tweak
└── src/
    ├── main.tsx              # Renderer startup and shutdown
    ├── app/
    │   ├── layout.tsx
    │   ├── error.tsx
    │   ├── page.tsx
    │   ├── gallery/
    │   │   ├── page.tsx
    │   │   ├── [name]/page.tsx
    │   │   ├── showcase/page.tsx
    │   │   └── icons/page.tsx
    │   └── tweak/page.tsx
    ├── features/
    │   ├── gallery/
    │   │   ├── components/   # Detailed interactive examples
    │   │   └── utils/        # Icon catalog search
    │   └── tweak/
    │       ├── api/          # Filesystem persistence and explicit export
    │       ├── components/   # Part previews
    │       ├── schemas/      # Review document validation
    │       └── stores/       # Editing state and persistence session
    ├── components/
    │   ├── ui/               # Source-owned reusable controls
    │   └── shared/
    │       ├── error-boundary.tsx
    │       └── component-demos/
    │           ├── catalog.tsx
    │           └── examples/ # Shared by Gallery and Tweak
    ├── lib/ui/
    │   ├── styles.ts         # Shared palettes and component defaults
    │   ├── focus/
    │   ├── theme/
    │   ├── nerd-fonts/       # Generated glyph sets
    │   └── …
    └── router/
        ├── routes.generated.ts
        └── …
```

TCN configuration and `.tcn/` files are tooling metadata; application startup does not read them. See [source management](tcn.md).

## Growing an application

These locations are available as your app grows. Create them when they contain actual code; the starter does not ship empty directories.

```text
src/
├── app/users/page.tsx
├── features/users/
│   ├── api/
│   │   ├── user.api.ts
│   │   └── user.queries.ts  # Only when using a query library
│   ├── components/
│   │   ├── user-table.tsx
│   │   └── user-editor.tsx
│   ├── hooks/
│   ├── schemas/
│   ├── stores/
│   ├── types/
│   └── utils/
├── api/client.ts            # Shared transport setup, when needed
├── hooks/
├── schemas/
├── stores/
├── types/
├── utils/
└── lib/
```

| Location | Responsibility |
| --- | --- |
| `app/` | Route screens, navigation composition, layouts and fallbacks. |
| `features/<name>/` | A coherent user capability and its business-specific code. |
| `components/ui/` | Reusable TCN controls and composition parts. |
| `components/shared/` | Application components shared across screens/features. |
| `api/` | Shared transport setup; feature-specific requests stay in the feature. |
| `hooks/` | Reusable React logic, such as subscriptions and interaction state. |
| `schemas/` | Runtime validation of external data, configuration or files. |
| `stores/` | State with an explicit shared owner. |
| `types/` | Shared types without a more specific module owner. |
| `utils/` | Pure transformations without I/O or external mutable state. |
| `lib/` | Integrations and supporting systems, such as terminal clipboard or UI foundations. |

Each of `api`, `hooks`, `schemas`, `stores`, `types` and `utils` may exist globally or in a feature. Choose by ownership. A user-specific formatter stays in users even if several user screens call it. Avoid duplicating responsibilities between `api/client.ts` and `lib/http.ts`.

Validate API responses, imported JSON and persisted settings at their data boundaries. Keep the schemas and inferred types with the code that owns that data.

## Choosing an abstraction

A feature groups related behavior, such as listing, creating and editing users. Keep these flows together so their components, data access and state have a clear owner. Introduce a separate feature for a distinct user capability.

Compose simple layouts with `box`, `text` and existing controls. Extract a component when it owns a clear responsibility, manages its own interaction or is reused. For example, a user editor can own its fields and save behavior while the page coordinates navigation and data loading.

See [feature development](features.md) for a worked example and [architecture](architecture.md) for import and state boundaries.

## Styles, generated files and cleanup

Keep shared palettes/defaults in `src/lib/ui/styles.ts` and use documented props for instance-specific appearance. Theme/focus systems stay in their existing modules. See [styling](styling.md).

Commit source, tests, docs, `bun.lock`, the route manifest and TCN metadata. Do not hand-edit generated routes or glyph sets. Dependencies, build output, coverage and local Tweak drafts are ignored; an explicit design export can be committed for review.

See [removing starter examples](cleanup.md) before preparing your product application.
