# Marker

Separate conversation events or display a compact system note.

[Source](../../src/components/ui/marker.tsx) · [Defaults](../../src/lib/ui/styles.ts) · Gallery: `/gallery/marker`

## Usage

```tsx
import { Marker, MarkerContent, MarkerIcon } from '@/components/ui/marker'

<Marker variant="separator">
  <MarkerIcon>
    <text>✓</text>
  </MarkerIcon>
  <MarkerContent>Session started</MarkerContent>
</Marker>
```

## API

| Part | Purpose |
| --- | --- |
| `Marker` | `variant="default"` for an inline note, `"separator"` for separators on both sides, or `"border"` for a separator below. |
| `MarkerIcon` | Nonshrinking slot for an application-provided icon or text. |
| `MarkerContent` | Muted string content or composed React children. |

The layout uses full width, zero horizontal padding and a gap of one cell. Markers are passive content: use application state to select their text/status and regular controls for actions.
