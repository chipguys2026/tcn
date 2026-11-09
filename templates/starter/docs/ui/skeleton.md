# Skeleton

A loading placeholder inspired by [shadcn Skeleton](https://ui.shadcn.com/docs/components/skeleton).

[Source](../../src/components/ui/skeleton.tsx) · [Defaults](../../src/components/ui/skeleton.styles.ts) · Gallery: `/gallery/skeleton`

```tsx
<box gap={1}>
  <Skeleton width="60%" />
  <Skeleton width="90%" />
  <Skeleton height={3} />
</box>
```

Import from `@/components/ui/skeleton`.

| Prop | Contract |
| --- | --- |
| width | Cell count or percentage; default `100%`, capped by parent width |
| height | Row count; default `1` |

Skeleton renders a muted background rectangle. It owns no focus target, timer or animation, and does not imitate rounded browser geometry. Choose dimensions matching the loaded content to reduce layout movement; use Spinner when an animated busy indicator is needed.

Tweak exposes Skeleton dimensions, spacing and background on the real component. Defaults remain in source; see [styling](../styling.md).
