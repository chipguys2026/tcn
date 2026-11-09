# spinner

An animated busy indicator.

[Source](../../src/components/ui/spinner.tsx) · Gallery: `/gallery/spinner` · [Styling status](../styling.md)

## Usage

```tsx
import { Spinner } from '@/components/ui/spinner'

<Spinner label="Loading" />
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Spinner`.

| Component | Props contract |
| --- | --- |
| Spinner | `{ label?: string paused?: boolean }` |

## State and interaction

No focus. paused stops advancement; unmount releases the renderer clock subscription.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Uses a shared renderer animation clock at 8 fps and semantic text color.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| Spinner.label | `'Loading'` |
| Spinner.paused | `false` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses the shared renderer lifecycle rather than a separate per-component interval.

## TUI boundaries

Indicates busy state only; it does not track an operation or its progress.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
