# Marker

[Source](../../src/components/ui/marker.tsx) · [Defaults](../../src/components/ui/marker.styles.ts) · Gallery: `/gallery/marker`

```tsx
<Marker variant="separator">
  <MarkerIcon><text>✓</text></MarkerIcon>
  <MarkerContent>Session started</MarkerContent>
</Marker>
```

Import Marker, MarkerIcon and MarkerContent from `@/components/ui/marker`. Variant default renders an inline note; separator adds existing Separators on both sides; border adds a separator below. Icon is an arbitrary nonshrinking slot. String content uses muted text; React children compose a row. Gap=1, paddingX=0, width=100%. No status store, focus or activation is added. Tweak observes the three parts and reused Separator. Defaults remain source-owned.
