# Switch

A boolean switch with a compact rounded track.

[Source](../../src/components/ui/switch.tsx) · Gallery: `/gallery/switch` · [Customization](../styling.md)

## Usage

```tsx
import { Switch } from '@/components/ui/switch'

<Switch label="Notifications" checked={enabled} onCheckedChange={setEnabled} />
```

## API

Exports: `Switch`.

| Component | Props contract |
| --- | --- |
| Switch | `SwitchProps` |

### Prop types

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

## Appearance

Track is four cells wide and one row high. The rounded thumb uses two cells: left for Off, right for On. Track changes muted/primary; label is alongside.

Track-to-label spacing is a real layout gap, defaulting to one cell in [styles.ts](../../src/lib/ui/styles.ts). The Tweak `Switch.gap` field controls the entire spacing; no fixed spacer is inserted.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| Switch.defaultChecked | `false` |

## Reuse

Uses Pressable, useControllable and the shared Nerd Font semicircle tokens.

## Notes

No animation or product-level setting persistence. Label remains required for focus metadata.
