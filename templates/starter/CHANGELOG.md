# Changelog

## 0.1.0 — Unreleased

- Add Menubar, Questionnaire, Code Block, Message, Message Scroller, Marker, Trace and native Bar/Line Chart families, with Gallery/Tweak examples and per-family documentation.

- Apply the existing 37 draft parameters to source defaults for 16 families, preserve a draft backup and clear only consumed overrides.
- Add content-driven popup sizing with min/max limits: Select/Menu cap at 32 columns and 16 rows; Tooltip wraps without a scrollbox.
- Keep keyboard-focused popup items visible when the popup viewport resizes.

- Rename the standalone starter to `opentui-starter` and add the MIT license.
- Organize Home, Gallery and Tweak as features with thin filesystem route modules.
- Use `/`, `/gallery`, `/gallery/:name`, `/gallery/showcase` and `/tweak` as the public example routes.
- Share one catalog of 51 component families between Gallery and Tweak.
- Add multi-thumb Slider, keyboard/pointer Resizable panels and a collapsible Sidebar with source defaults, shared gallery/Tweak examples and docs.
- Add Breadcrumb, Context Menu and renderer-clock Toast notifications with source defaults, gallery/Tweak previews and documentation.
- Restyle Toast with a compact Sonner-inspired icon/content/action layout, corner close button, neutral surfaces and newest-at-bottom stacking while retaining the provider/hook API.
- Share the menu engine between Dropdown Menu and Context Menu; support pointer anchors without changing existing dropdown behavior.
- Add Field, Input Group, Button Group, Item, Pagination and Skeleton with source defaults, shared gallery/Tweak demos and component documentation.
- Let grouped Input/Textarea reuse their native interaction and paint the editor focus ring around the group; group buttons keep their own rings.
- Separate Tweak schema, store, session, filesystem storage and export.
- Group tests by components, router, runtime, styling and Tweak.
- Add self-contained architecture, development and per-component documentation.

The component-wide `styles` override API and centralized default definitions are agreed design goals, not a completed migration. See [styling](docs/styling.md) and [roadmap](docs/roadmap.md).
