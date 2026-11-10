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

Update `value` from application state as the operation progresses. The indicator is skipped during keyboard navigation.

## Appearance

Progress renders a bar in terminal cells with optional value text. Values are clamped to the accepted range.

Default values:

| Parameter | Default |
| --- | --- |
| Progress.max | `100` |
| Progress.width | `24` |
| Progress.showValue | `true` |

## Usage guidance

Pass the operation's current value from application state. Use [Spinner](spinner.md) when progress cannot be measured.
