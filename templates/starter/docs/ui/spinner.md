# Spinner

An animated busy indicator.

[Source](../../src/components/ui/spinner.tsx) · Gallery: `/gallery/spinner` · [Customization](../styling.md)

## Usage

```tsx
import { Spinner } from '@/components/ui/spinner'

<Spinner label="Loading" />
```

## API

Exports: `Spinner`.

| Component | Props contract |
| --- | --- |
| Spinner | `{ label?: string paused?: boolean }` |

## State and interaction

No focus. paused stops advancement; unmount releases the renderer clock subscription.

## Appearance

Uses a shared renderer animation clock at 8 fps and semantic text color.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| Spinner.label | `'Loading'` |
| Spinner.paused | `false` |

## Reuse

Uses the shared renderer lifecycle rather than a separate per-component interval.

## Notes

Indicates busy state only; it does not track an operation or its progress.
