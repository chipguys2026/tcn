# toggle

A pressed/unpressed action control.

[Source](../../src/components/ui/toggle.tsx) · Gallery: `/gallery/toggle` · [Styling status](../styling.md)

## Usage

```tsx
import { Toggle } from '@/components/ui/toggle'

<Toggle label="Bold" pressed={bold} onPressedChange={setBold} />
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Toggle`.

| Component | Props contract |
| --- | --- |
| Toggle | `ToggleProps` |

### Declared prop types

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

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Semantic pressed and interaction states; supports custom children.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| Toggle.defaultPressed | `false` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses Pressable and useControllable.

## TUI boundaries

A toggle button represents pressed state rather than an editor or boolean setting field.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
