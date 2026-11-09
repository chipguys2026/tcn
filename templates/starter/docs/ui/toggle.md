# Toggle

A pressed/unpressed action control.

[Source](../../src/components/ui/toggle.tsx) · Gallery: `/gallery/toggle` · [Customization](../styling.md)

## Usage

```tsx
import { Toggle } from '@/components/ui/toggle'

<Toggle label="Bold" pressed={bold} onPressedChange={setBold} />
```

## API

Exports: `Toggle`.

| Component | Props contract |
| --- | --- |
| Toggle | `ToggleProps` |

### Prop types

```ts
type ToggleProps = PropsWithChildren<{
  label: string
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  disabled?: boolean
  autoFocus?: boolean
}>
```

## State and interaction

Enter/Space/click proposes a pressed change; disabled controls are skipped.

## Appearance

Semantic pressed and interaction states; supports custom children.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| Toggle.defaultPressed | `false` |

## Reuse

Uses Pressable and useControllable.

## Notes

A toggle button represents pressed state rather than an editor or boolean setting field.
