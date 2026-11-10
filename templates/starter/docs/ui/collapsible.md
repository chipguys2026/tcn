# Collapsible

A flexible expandable region with a heading and a compact toggle.

[Source](../../src/components/ui/collapsible.tsx) · Gallery: `/gallery/collapsible` · [Customization](../styling.md)

## Usage

```tsx
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'

<Collapsible defaultOpen>
  <CollapsibleTrigger label="Toggle details">
    Project details
  </CollapsibleTrigger>
  <CollapsibleContent>
    <text>Details</text>
  </CollapsibleContent>
</Collapsible>
```

## API

Exports: `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`.

| Component | Props contract |
| --- | --- |
| Collapsible | `PropsWithChildren<{ open?: boolean defaultOpen?: boolean onOpenChange?: (open: boolean) => void disabled?: boolean }>` |
| CollapsibleTrigger | `PropsWithChildren<{ label?: string }>` |
| CollapsibleContent | `PropsWithChildren<{ forceMount?: boolean }>` |

## State and interaction

Press Enter or Space on the right-hand button, or click it, to toggle the content. The title is displayed separately. Controls inside hidden content are skipped during navigation. Setting `disabled` prevents toggling.

## Appearance

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

The header fills the available width and places a small chevron button on the right. Add separators between sections when needed.

Default values:

| Parameter | Default |
| --- | --- |
| Collapsible.defaultOpen | `false` |
| Collapsible.disabled | `false` |
| CollapsibleTrigger.label | `'Toggle details'` |
| CollapsibleContent.forceMount | `false` |

## Usage guidance

Set `forceMount` to retain the content subtree while collapsed; the content remains hidden. Use [Accordion](accordion.md) to coordinate several expandable sections.
