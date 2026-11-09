# Skeleton

Reserve space for loading content with a static placeholder.

[Source](../../src/components/ui/skeleton.tsx) · [Defaults](../../src/components/ui/skeleton.styles.ts) · Gallery: `/gallery/skeleton`

## Usage

```tsx
import { Skeleton } from '@/components/ui/skeleton'

<box gap={1}>
  <Skeleton width="60%" />
  <Skeleton width="90%" />
  <Skeleton height={3} />
</box>
```

## API and behavior

| Prop | Contract |
| --- | --- |
| width | Cell count or percentage; default `100%`, capped by parent width |
| height | Row count; default `1` |

Skeleton renders a muted background rectangle. It owns no focus target, timer or animation, and does not imitate rounded browser geometry. Choose dimensions matching the loaded content to reduce layout movement; use Spinner when an animated busy indicator is needed.

Customize dimensions through props and colors through source defaults; see [styling](../styling.md).
