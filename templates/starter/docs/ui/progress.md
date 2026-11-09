# progress

A determinate progress indicator.

[Source](../../src/components/ui/progress.tsx) · Gallery: `/gallery/progress` · [Styling status](../styling.md)

## Usage

```tsx
import { Progress } from '@/components/ui/progress'

<Progress value={45} max={100} showValue />
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Progress`.

| Component | Props contract |
| --- | --- |
| Progress | `{ value: number max?: number width?: number showValue?: boolean }` |

## State and interaction

No focus or activation; the owner updates value.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Cell-based bar with optional value text. Values are clamped to the accepted range.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| Progress.max | `100` |
| Progress.width | `24` |
| Progress.showValue | `true` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses semantic theme tokens.

## TUI boundaries

No indeterminate animation. Operation state belongs to the caller.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
