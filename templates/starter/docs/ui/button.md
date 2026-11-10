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

The `icon` prop accepts a built-in alias or a typed glyph imported from a Nerd Fonts set. See [icons](../icons.md) for installation and usage.

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
    | { children: string; icon?: IconValue; label?: string }
    | { children?: never; icon: IconValue; label: string }
  )
```

## State and interaction

Enter, Space or a left click invokes `onPress`. Disabled buttons are skipped during Tab navigation and cannot be activated. A ref exposes `focus()`, `blur()` and `label`.

## Appearance

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

Variants are `default`, `secondary`, `ghost`, `destructive` and `link`. Horizontal padding defaults to one cell and vertical padding to zero. Focus is indicated by an outer ring.

Buttons fit their content by default. Set `width` to a cell count, `auto` or a percentage for explicit layout control. Use `onFocus` and `onBlur` to respond to focus changes.

Default values:

| Parameter | Default |
| --- | --- |
| Button.variant | `'default'` |
| Button.disabled | `false` |
| Button.autoFocus | `false` |
| Button.paddingX | `1` |

## Usage guidance

Provide a descriptive `label` for icon-only buttons. Connect save or submit behavior through `onPress`. Customize appearance with the documented props and [shared source defaults](../styling.md).
