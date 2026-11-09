# switch

A boolean switch with a compact rounded track.

[Source](../../src/components/ui/switch.tsx) · Gallery: `/gallery/switch` · [Styling status](../styling.md)

## Usage

```tsx
import { Switch } from '@/components/ui/switch'

<Switch label="Notifications" checked={enabled} onCheckedChange={setEnabled} />
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Switch`.

| Component | Props contract |
| --- | --- |
| Switch | `SwitchProps` |

### Declared prop types

```ts
type SwitchProps = {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  autoFocus?: boolean
  label: string
  id?: string
}
```

## State and interaction

Enter/Space and clicks on caps, thumb or label toggle. Disabled controls are skipped. Controlled owners can reject edits.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Track is four cells wide and one row high. The rounded thumb uses two cells: left for Off, right for On. Track changes muted/primary; label is alongside.

Track-to-label spacing is a real layout gap, defaulting to one cell in [switch.styles.ts](../../src/components/ui/switch.styles.ts). The Tweak `Switch.gap` field controls the entire spacing; no fixed spacer is inserted.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| Switch.defaultChecked | `false` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses Pressable, useControllable and the shared Nerd Font semicircle tokens.

## TUI boundaries

No animation or product-level setting persistence. Label remains required for focus metadata.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
