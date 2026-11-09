# Implementation status

This page separates the runnable starter from design decisions that still require implementation. Do not mark an item complete merely because a directory or document exists.

## Implemented

- Bun/React/OpenTUI application lifecycle, theme and shared focus/interaction primitives.
- Generated filesystem router with layout, error and optional loading conventions.
- Source-owned kit of 51 component families.
- Home, shared Gallery catalog, composed showcase and Tweak feature routes.
- Feature-based source layout, grouped tests and standalone documentation.
- Local Tweak drafts, history, notes and proposal export; no startup draft loading.
- MIT license.
- Promote 37 draft parameters from 16 families to colocated source defaults; the consumed draft overrides are cleared after making a backup.
- Auto-sized Select/Menu/Tooltip with source min/max defaults, native content measurement, terminal/free-region constraints and appropriate scroll/wrap behavior.

## Agreed, not yet implemented

- A consistent typed `styles` prop for every component/compound part.
- Complete the colocated default-definition migration for the remaining families/parts.
- Tweak preview through that normal override API, removing legacy observation/cross-component geometry inference from the reusable layer.
- Stable versioned exported-default data suitable for promoting into those source definitions.

## Separate future work

- A product-level hierarchical FocusManager, beyond the current component scopes.
- Additional component ports after their behavior and design are agreed.
- Distribution as a standalone executable or npm package.
- Verification on each additional advertised OS/terminal/font combination.

The repository can be shared as a development starter with these boundaries stated. Treat completion of the styling migration and target-platform verification as explicit release decisions; do not claim them as done in release notes.
