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

Set `paused` to freeze the current frame. Spinner is skipped during keyboard navigation.

## Appearance

The spinner animates at eight frames per second and uses the theme primary color.

Default values:

| Parameter | Default |
| --- | --- |
| Spinner.label | `'Loading'` |
| Spinner.paused | `false` |

## Usage guidance

Show Spinner while an operation is pending, and replace it with a result or error when the operation completes.
