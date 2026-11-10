# Preview designs with Tweak

Tweak lets you try component spacing, dimensions and colors before changing source. Open it from Home or navigate to `/tweak`.

## Preview a change

1. Choose a component and one of its named parts.
2. Adjust the available spacing, dimension and color controls.
3. Compare light/dark themes and the states shown in the preview.
4. Add review notes and export the proposal.
5. Apply the chosen values to component source defaults.
6. Check the result in Gallery and run `bun run check`.

The previews use the same components as Gallery. Tweak changes stay inside the preview until you implement them in source. Exporting saves a proposal; it does not rewrite component files.

## Save and share a proposal

Paths are relative to your application's working directory:

| File | Purpose |
| --- | --- |
| `design/component-review.draft.json` | Local autosave, ignored by Git. |
| `design/component-review.json` | Explicit export that you can commit for review. |

Undo/redo, notes and reviewed flags help track a design session. Baseline values are captured from live components when reviewing them, so source edits can be checked against the current implementation.

Export validation rejects unsupported fields or invalid values. Keep exports as design documents rather than importing them into your application's layout or theme.

## Apply the design

Use the component reference's defaults link to open `src/lib/ui/styles.ts`. Find the matching component section and apply the chosen values there. Consider compositions that reuse the changed component.

Then open Gallery, compare the result and commit the source change. Source edits are tracked by TCN like any other local customization. See [styling](styling.md) and [source management](tcn.md).

## Resize popups

Popup controls support `auto` width/height and minimum/maximum bounds. Anchored popups can use `minWidth="trigger"`. To make a popup larger than its default maximum, change the maximum as well as the requested size. See [popup sizing](popup-sizing.md).

For contributor guidance on the editor's modules and preview adapter, see [architecture](architecture.md#development-data).
