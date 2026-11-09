# Button

A single-row action control with semantic variants and optional Nerd Font icons.

[Source](../../src/components/ui/button.tsx) · Gallery: `/gallery/button` · [Customization](../styling.md)

## Usage

```tsx
import { Button } from '@/components/ui/button'

<Button icon="save" onPress={() => save()}>
  Save
</Button>
```

## API

Exports: `Button`.

| Component | Props contract |
| --- | --- |
| Button | `ButtonProps` |

### Prop types

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

## Appearance

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

Variants are default, secondary, ghost, destructive and link. Horizontal padding defaults to one cell; vertical padding is zero. There are no size/rounded variants. Focus has a separate outer ring.

Width is optional layout geometry (content-sized when omitted, a cell count, auto or percentage when supplied). SidebarMenuButton uses the same Button with width 100% to fill its row. onFocus/onBlur allow compositions such as Toast to pause timers without adding focus ownership.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| Button.variant | `'default'` |
| Button.disabled | `false` |
| Button.autoFocus | `false` |
| Button.styleSource | `'button'` |
| Button.stylePart | `Button.${variant}` |
| Button.paddingX | `buttonDefaults.paddingX` |

## Reuse

Uses usePress, useFocusable, the shared final ring pass and styles.ts. Modal actions reuse Button.

## Notes

Icon-only buttons require label. No implicit form submission. `styleSource` and `stylePart` identify parts for Tweak previews; use documented props or source defaults for appearance changes.
