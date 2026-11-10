# Remove starter examples

Gallery and Tweak help explore controls and preview styling. Keep them during development or remove them when preparing your product application.

## Remove both tools

1. Replace `src/app/page.tsx` with your entry screen and remove links to Gallery/Tweak.
2. Delete `src/app/gallery` and `src/app/tweak`.
3. Delete `src/features/gallery` and `src/features/tweak`.
4. Delete `src/components/shared/component-demos`, shared by both tools.
5. Remove tool-specific tests and update route expectations in `tests/runtime/project-structure.test.ts`. Some component/styling tests use demo or Tweak fixtures; replace those fixtures to retain their regression coverage.
6. Remove optional design proposals/drafts and tool docs you no longer need. Preserve notices for glyph data you retain.
7. Run `bun run routes:generate`, `bun run check` and `bun run build`. Resolve remaining imports and documentation links.

Keep renderer lifecycle, root layout/error handling, router, controls and foundations your application uses. Reusable UI does not depend on either tool.

## Keep one tool

Both tools depend on `src/components/shared/component-demos`; keep it while either tool uses it. You can remove either tool independently. Update Home links, route assertions, relevant tests and docs for the tool removed.

## Trim unused source

Gallery's icon browser imports the complete Nerd Fonts catalog. After removing it, inspect application imports before removing unused sets. `tcn remove` manages registered component/icon ownership and local edits; removing sample screens is a separate application change. See [icons](icons.md) and [source management](tcn.md).

Keep `tcn.json` and `.tcn/` if you intend to keep using TCN updates; they record the installed source baseline.
