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

The compact right-hand button toggles on Enter/Space/click. The title is separate from that button. Hidden content leaves traversal; disabled prevents toggling.

## Appearance

Defaults are defined in [collapsible.styles.ts](../../src/components/ui/collapsible.styles.ts). Edit this local file to change appearance across your application.

Full-width label/header, small chevron button on the right and no enclosing border or automatic item separator.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| Collapsible.defaultOpen | `false` |
| Collapsible.disabled | `false` |
| CollapsibleTrigger.label | `'Toggle details'` |
| CollapsibleContent.forceMount | `false` |

## Reuse

Uses Pressable, useControllable and the shared focus/ring infrastructure.

## Notes

forceMount preserves the subtree but not visibility. It is one expandable region rather than an Accordion selection group.
