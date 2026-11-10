# Alert

An inline information or destructive message.

[Source](../../src/components/ui/alert.tsx) · Gallery: `/gallery/alert` · [Customization](../styling.md)

## Usage

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

<Alert icon="check">
  <AlertTitle>Saved</AlertTitle>
  <AlertDescription>Your changes are available.</AlertDescription>
</Alert>
```

## API

The `icon` prop accepts a built-in alias or a typed glyph from an installed Nerd Fonts set. See [icons](../icons.md).

Exports: `Alert`, `AlertTitle`, `AlertDescription`.

| Component | Props contract |
| --- | --- |
| Alert | `PropsWithChildren<{ variant?: 'default' \| 'destructive' icon?: IconValue }>` |
| AlertTitle | `{ children: string }` |
| AlertDescription | `{ children: string }` |

## State and interaction

Alert stays in the page layout and preserves the current focus. Add child controls when the message needs an action.

## Appearance

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

Alert has a borderless surface with `default` and `destructive` variants and an optional Nerd Font icon. The destructive variant uses a subtle tint.

Default values:

| Parameter | Default |
| --- | --- |
| Alert.variant | `'default'` |

## Usage guidance

Use Alert for a message that stays in the page layout. Use [Toast](toast.md) for temporary notifications or [Alert Dialog](alert-dialog.md) when the user must confirm an action.
