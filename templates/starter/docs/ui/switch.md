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

Press Enter or Space, or click the track, thumb or label to toggle. Disabled switches are skipped during keyboard navigation. In controlled mode, update `checked` from `onCheckedChange` to accept a change.

## Appearance

The track is four cells wide and one row high. Its two-cell thumb moves left for Off and right for On. The track uses muted or primary colors, with the label alongside it.

The label is separated from the track by one cell. Change this gap in [styles.ts](../../src/lib/ui/styles.ts), or preview it with Tweak's `Switch.gap` control.

Default values:

| Parameter | Default |
| --- | --- |
| Switch.defaultChecked | `false` |

## Usage guidance

Provide a descriptive `label` and persist settings in application code when required.
