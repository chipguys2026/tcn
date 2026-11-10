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

Press Enter or Space, or click the control, to change its pressed state. Disabled controls are skipped during keyboard navigation.

## Appearance

Theme colors distinguish pressed and interaction states. Supply children to customize the content.

Default values:

| Parameter | Default |
| --- | --- |
| Toggle.defaultPressed | `false` |

## Usage guidance

Use Toggle for a pressed action, such as enabling an editor tool. Use [Switch](switch.md) for an on/off setting.
