# Progress

A determinate progress indicator.

[Source](../../src/components/ui/progress.tsx) · Gallery: `/gallery/progress` · [Customization](../styling.md)

## Usage

```tsx
import { Progress } from '@/components/ui/progress'

<Progress value={45} max={100} showValue />
```

## API

Exports: `Progress`.

| Component | Props contract |
| --- | --- |
| Progress | `{ value: number max?: number width?: number showValue?: boolean }` |

## State and interaction

No focus or activation; the owner updates value.

## Appearance

Cell-based bar with optional value text. Values are clamped to the accepted range.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| Progress.max | `100` |
| Progress.width | `24` |
| Progress.showValue | `true` |

## Reuse

Uses semantic theme tokens.

## Notes

No indeterminate animation. Operation state belongs to the caller.
