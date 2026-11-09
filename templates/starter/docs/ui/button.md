# button

A single-row action control with semantic variants and optional Nerd Font icons.

[Source](../../src/components/ui/button.tsx) · Gallery: `/gallery/button` · [Styling status](../styling.md)

## Usage

```tsx
import { Button } from '@/components/ui/button'

<Button icon="save" onPress={() => save()}>Save</Button>
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Button`.

| Component | Props contract |
| --- | --- |
| Button | `ButtonProps` |

### Declared prop types

```ts
type ButtonHandle = FocusableHandle

type SharedProps = {
  id?: string
  ref?: Ref<ButtonHandle>
  variant?: ButtonVariant
  disabled?: boolean
  autoFocus?: boolean
  onPress?: () => void
  onFocus?: () => void
  onBlur?: () => void
  styleSource?: string
  stylePart?: string
  paddingX?: number
  width?: number | 'auto' | `${number}%`
}

type ButtonProps = SharedProps &
  (
    | { children: string; icon?: IconName; label?: string }
    | { children?: never; icon: IconName; label: string }
  )
```

## State and interaction

Enter/Space or left click invokes onPress. Disabled buttons do not activate or receive Tab focus. A ref exposes focus(), blur() and label.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Promoted defaults are defined in [button.styles.ts](../../src/components/ui/button.styles.ts) and consumed by the real component and its observations. No Tweak JSON is loaded here.

Variants are default, secondary, ghost, destructive and link. Horizontal padding defaults to one cell; vertical padding is zero. There are no size/rounded variants. Focus has a separate outer ring.

Width is optional layout geometry (content-sized when omitted, a cell count, auto or percentage when supplied). SidebarMenuButton uses the same Button with width 100% to fill its row. onFocus/onBlur allow compositions such as Toast to pause timers without adding focus ownership.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| Button.variant | `'default'` |
| Button.disabled | `false` |
| Button.autoFocus | `false` |
| Button.styleSource | `'button'` |
| Button.stylePart | `Button.${variant}` |
| Button.paddingX | `buttonDefaults.paddingX` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses usePress, useFocusable, the shared final ring pass and button.styles.ts. Modal actions reuse Button.

## TUI boundaries

Icon-only buttons require label. No implicit form submission. styleSource/stylePart are composition plumbing, not the planned public styles API.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
