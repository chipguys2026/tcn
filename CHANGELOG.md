# Changelog

## 0.2.0 — 2026-11-10

- Implement starter screens directly in route pages, organize feature code by responsibility and share Gallery/Tweak demos without cross-feature imports.
- Document application structure, feature development and example cleanup; include contributor conventions in repository and generated application AGENTS.md files.
- Include the complete Nerd Fonts 3.5.1 catalog: 10,995 names across 17 independently installable sets, while preserving all 18 existing icon aliases.
- Accept typed catalog glyphs in component icon props and add an icon browser with search, set filtering, previews, pagination and clipboard actions.
- Generate catalog source offline from a checksum-pinned upstream snapshot and distribute notices with installed icon source.

## 0.1.2 — 2026-11-10

- Resolve auto-sized popup layout before painting to avoid flashing provisional dimensions when opening menus and tooltips.
- Keep backdrop dimming active throughout measurement and defer popup autofocus until its size and placement are ready.

## 0.1.1 — 2026-11-09

- Consolidate theme palettes and component defaults into `src/lib/ui/styles.ts` for application-wide customization.
- Distribute styles as a shared source dependency, preserving local edits and retaining the file while installed components need it.

## 0.1.0 — 2026-11-09

- Create React/OpenTUI terminal applications with filesystem routing, themes, Gallery examples and Tweak design previews.
- Include 51 component families as editable application source, with shared interaction, focus and overlay helpers.
- Add the Node-compatible `tcn` CLI with `init`, `list`, `add`, `diff` and `remove`.
- Track installed baselines and shared dependencies to preserve local edits and detect conflicting source updates.
- Support custom source paths and import aliases, dry runs, offline source operations and explicit forced replacement.
- Distribute a prebuilt CLI and bundled starter through GitHub Releases, with packed-application checks on Ubuntu and Windows.
