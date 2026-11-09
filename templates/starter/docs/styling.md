# Styling and component defaults

## Agreed contract

The intended styling order is:

1. Semantic theme tokens resolve colors.
2. Each component defines its source defaults in one place, eventually in a colocated `<name>.styles.ts`.
3. A normal typed `styles` prop lets the caller override individual parts.

Tweak will use that same override API for previews. Exported data proposes new source defaults. It must not become application runtime configuration.

## Implementation status

**The complete contract above is not implemented yet.** Component-wide `styles` props are not currently available across the kit. Do not copy a hypothetical `styles={{ ... }}` example and expect it to work.

The 37 draft parameters from 16 component families have been promoted into colocated `<name>.styles.ts` source defaults. Rendering and style observations consume those same constants. Other parts still declare defaults in their implementations. `button.styles.ts` also holds the semantic color resolver reused by Badge. Components call the opt-in adapter in `lib/ui/style-review.tsx`; outside its providers, this adapter returns no overrides.

Only the Tweak preview mounts those providers. Explicit shared-button edits, observed part IDs and one-line geometry calculations remain in that adapter. An empty proposal no longer invents Button padding or normalizes every trigger to a fabricated baseline; the actual source defaults remain visible. The adapter is still an implementation detail being replaced, not an application style API.

This release preparation reorganizes those features and documents their actual behavior. It does not silently declare the styling migration complete. The remaining work is listed in [roadmap](roadmap.md).

## Theme

`lib/ui/theme/tokens.ts` contains light/dark semantic tokens. `ThemeProvider` selects a theme and `useTheme()` reads it. The root layout currently chooses dark. Components use semantic roles such as primary, muted, destructive, popover and ring; do not introduce a second palette for a feature.

## Dimensions and visual states

Select and DropdownMenu default to auto width/height, minWidth="trigger", maxWidth=32, minHeight=3 and maxHeight=16. Limits include padding; minimums are clamped by maximums and available terminal space. Tooltip defaults to auto width/height, minWidth=3, maxWidth=32 and minHeight=3; it wraps and clips without scrollbars. See [popup sizing](popup-sizing.md).

Dimensions and spacing are terminal cells. Native glyphs are not CSS shapes. Kbd/Badge use semicircle glyphs within their padding; Switch uses a four-cell track and a two-cell rounded thumb. Input remains one content row; Textarea has an inset text viewport within a continuous surface.

Focus visuals are independent from focus ownership. A final paint pass renders rings; they do not reserve layout space. Avoid placing text immediately in the ring's one-cell expansion area. Validation state does not perform validation by itself.

## Reuse

Combobox reuses Input through Command; modal actions reuse Button; common activation uses Pressable/usePress. A reused component should inherit its own source defaults. A deliberate part override must be explicit and documented. The current Tweak inheritance graph is useful for reviewing drafts but must not define application geometry.
