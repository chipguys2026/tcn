# alert

An inline information or destructive message.

[Source](../../src/components/ui/alert.tsx) · Gallery: `/gallery/alert` · [Styling status](../styling.md)

## Usage

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

<Alert icon="check"><AlertTitle>Saved</AlertTitle><AlertDescription>Your changes are available.</AlertDescription></Alert>
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Alert`, `AlertTitle`, `AlertDescription`.

| Component | Props contract |
| --- | --- |
| Alert | `PropsWithChildren<{ variant?: 'default' \| 'destructive' icon?: IconName }>` |
| AlertTitle | `{ children: string }` |
| AlertDescription | `{ children: string }` |

## State and interaction

Nonmodal and noninteractive unless callers supply controls.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Promoted defaults are defined in [alert.styles.ts](../../src/components/ui/alert.styles.ts) and consumed by the real component and its observations. No Tweak JSON is loaded here.

No enclosing character border. Supports default/destructive variants and an optional typed Nerd Font icon; destructive uses a subtle tint.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| Alert.variant | `'default'` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses semantic theme colors and compound title/description layout.

## TUI boundaries

Not a toast, confirmation dialog or live notification service.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
