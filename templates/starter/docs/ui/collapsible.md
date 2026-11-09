# collapsible

A flexible expandable region with a heading and a compact toggle.

[Source](../../src/components/ui/collapsible.tsx) · Gallery: `/gallery/collapsible` · [Styling status](../styling.md)

## Usage

```tsx
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'

<Collapsible defaultOpen>
  <CollapsibleTrigger label="Toggle details">Project details</CollapsibleTrigger>
  <CollapsibleContent><text>Details</text></CollapsibleContent>
</Collapsible>
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`.

| Component | Props contract |
| --- | --- |
| Collapsible | `PropsWithChildren<{ open?: boolean defaultOpen?: boolean onOpenChange?: (open: boolean) => void disabled?: boolean }>` |
| CollapsibleTrigger | `PropsWithChildren<{ label?: string }>` |
| CollapsibleContent | `PropsWithChildren<{ forceMount?: boolean }>` |

## State and interaction

The compact right-hand button toggles on Enter/Space/click. The title is separate from that button. Hidden content leaves traversal; disabled prevents toggling.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Promoted defaults are defined in [collapsible.styles.ts](../../src/components/ui/collapsible.styles.ts) and consumed by the real component and its observations. No Tweak JSON is loaded here.

Full-width label/header, small chevron button on the right and no enclosing border or automatic item separator.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| Collapsible.defaultOpen | `false` |
| Collapsible.disabled | `false` |
| CollapsibleTrigger.label | `'Toggle details'` |
| CollapsibleContent.forceMount | `false` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses Pressable, useControllable and the shared focus/ring infrastructure.

## TUI boundaries

forceMount preserves the subtree but not visibility. It is one expandable region rather than an Accordion selection group.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
