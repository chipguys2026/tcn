# Customize appearance

Use semantic theme tokens for application colors, component props for supported per-instance changes, and local source defaults for changes across your application. Dimensions and spacing are measured in terminal cells.

## Select a theme

The root layout in `src/app/layout.tsx` wraps the application in `ThemeProvider`. Change its `theme` to `"light"` or `"dark"`.

Read colors in a screen or component with `useTheme`:

```tsx
import { useTheme } from '@/lib/ui/theme/use-theme'

export function Status() {
  const theme = useTheme()

  return <text fg={theme.mutedForeground}>Ready</text>
}
```

A nested `ThemeProvider` can select another theme for a section. Edit `src/lib/ui/theme/tokens.ts` to change the palettes. Components use semantic roles such as `primary`, `muted`, `destructive`, `popover` and `ring`.

## Use component props

Each component reference lists its supported props. For example:

```tsx
import { Button } from '@/components/ui/button'

<Button variant="secondary" paddingX={2} width={20} onPress={save}>
  Save
</Button>
```

Here `save` is an application handler. Props differ by component; there is no kit-wide `styles` prop in this version. Consult the [component reference](ui/README.md) before passing overrides.

## Change source defaults

Component source is under `src/components/ui`. Many families have a colocated `<name>.styles.ts` file containing their defaults; other defaults are declared directly in the component implementation.

Edit these local files when a change should apply to every use of the component. Shared components inherit their own defaults: changing Button can also affect modal actions and other compositions that use Button.

After editing defaults:

1. Check the component and its compositions in Gallery.
2. Compare light/dark themes and enabled, disabled and focused states.
3. Run `bun run check`.
4. Commit the source changes with any relevant tests.

TCN treats these edits as local changes during future component updates. See [source management](tcn.md).

## Preview with Tweak

Open `/tweak` to try dimensions, spacing and colors against real components. Export a proposal, review it and apply the chosen values to source. Preview overrides do not change ordinary application screens. See [Tweak](tweak.md).

The preview adapter in `src/lib/ui/style-review.tsx`, including `styleSource` and `stylePart` identifiers, supports the design tool. Use documented component props and source defaults for application customization.

## Account for terminal layout

A terminal row and column are not physically square, and glyph shapes depend on the font. Keep spacing around controls whose focus ring extends one cell beyond their surface; rings do not reserve layout space.

Select and Dropdown Menu use content-driven sizing with default maximums of 32 columns and 16 rows. Tooltip wraps within its available region. Explicit dimensions can require explicit maximum overrides; see [popup sizing](popup-sizing.md).
