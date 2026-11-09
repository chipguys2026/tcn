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

Exports: `Alert`, `AlertTitle`, `AlertDescription`.

| Component | Props contract |
| --- | --- |
| Alert | `PropsWithChildren<{ variant?: 'default' \| 'destructive' icon?: IconName }>` |
| AlertTitle | `{ children: string }` |
| AlertDescription | `{ children: string }` |

## State and interaction

Nonmodal and noninteractive unless callers supply controls.

## Appearance

Defaults are defined in [alert.styles.ts](../../src/components/ui/alert.styles.ts). Edit this local file to change appearance across your application.

No enclosing character border. Supports default/destructive variants and an optional typed Nerd Font icon; destructive uses a subtle tint.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| Alert.variant | `'default'` |

## Reuse

Uses semantic theme colors and compound title/description layout.

## Notes

Not a toast, confirmation dialog or live notification service.
