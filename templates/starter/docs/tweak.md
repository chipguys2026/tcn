# Tweak

`/tweak` is a development tool for designing component defaults. It is not an application settings page or a runtime theme/configuration loader.

## Workflow

1. Choose a component and a named part.
2. Adjust spacing, dimensions and colors in the real preview.
3. Compare light/dark themes and representative states.
4. Add notes and export the proposal.
5. Review the proposal, then update component source defaults.
6. Verify the result in `/gallery` and update component documentation.

Changing a value in Tweak does not change ordinary Gallery screens or application startup defaults. Export does not rewrite source files. Source promotion is deliberately a separate reviewed implementation step.

## Feature files

`tweak-page.tsx` owns the page UI and preview session. `parts.tsx` maps named parts to shared examples. `schema.ts` validates the document; `store.ts` owns history/state; `session.ts` serializes draft saves; `storage.ts` handles filesystem I/O; `export.ts` writes a proposal without live baseline observations.

Gallery and Tweak share the catalog and examples under `features/gallery`. Some targeted preview fixtures live in `parts.tsx` where a particular state must be exposed. They use the real UI components.

## Saved data

Paths are relative to the starter working directory:

| Path | Purpose |
| --- | --- |
| `design/component-review.draft.json` | Local autosave; ignored by git. |
| `design/component-review.json` | Explicit proposal export; may be committed for discussion. |

Legacy filenames are retained to preserve existing drafts. The document uses version 1, partsVersion 2, terminal-cell units and the legacy shared-with-overrides mode. Schema validation rejects unknown fields or invalid values. Baselines are recaptured from live components instead of trusted as imported styling.

Undo/Redo, notes and reviewed flags belong to the editing session. Exporting/importing proposals is separate from applying source defaults. Do not import storage or proposal files from `components/ui`, `lib/ui` or the root layout.

The existing 37 parameters have now been applied to source defaults. Their exact previous document is saved as `design/component-review.defaults-<timestamp>.backup.json` (ignored by git). Only matching, consumed overrides were cleared; notes and review flags were preserved. Baselines will be recaptured from source defaults when reopening Tweak.

Popup width/height accept `auto`; the editor also supports minWidth/maxWidth/minHeight/maxHeight. minWidth accepts `trigger` for anchored popups. The control pickers inside Tweak can explicitly use larger caps; component previews use the normal component caps. See [popup sizing](popup-sizing.md).

## Current behavior and migration

The existing preview adapter still observes parts, shares selected parameters between reused components and supports explicit local overrides. Some popup preview state is still driven by that adapter. This is isolated from ordinary screens, but it is not the final normal-prop styling architecture.

The agreed replacement is documented in [styling](styling.md). Per-component `styles` props and centralized source defaults remain migration work; this tool's current observation API is not a stable public application API.
