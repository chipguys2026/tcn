# Changelog

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
