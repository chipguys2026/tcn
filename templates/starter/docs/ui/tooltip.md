# tooltip

A delayed descriptive hint for a trigger.

[Source](../../src/components/ui/tooltip.tsx) · Gallery: `/gallery/tooltip` · [Styling status](../styling.md)

## Usage

```tsx
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

<Tooltip><TooltipTrigger label="Save">Save</TooltipTrigger><TooltipContent>Save the current changes.</TooltipContent></Tooltip>
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent`.

| Component | Props contract |
| --- | --- |
| TooltipProvider | `PropsWithChildren<{ delayDuration?: number }>` |
| Tooltip | `PropsWithChildren<{ open?: boolean defaultOpen?: boolean onOpenChange?: (open: boolean) => void delayDuration?: number }>` |
| TooltipTrigger | `PropsWithChildren<{ label: string disabled?: boolean onPress?: () => void }>` |
| TooltipContent | `{ children: string side?: Side } & PopupSizing` |

## State and interaction

Focus/hover opens after a delay (default 350 ms). Blur/leave/activation hides. Timer is cancelled on unmount; the popup does not take focus.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Auto sizing and min/max behavior: [popup sizing](../popup-sizing.md).

Promoted defaults are defined in [tooltip.styles.ts](../../src/components/ui/tooltip.styles.ts) and consumed by the real component and its observations. No Tweak JSON is loaded here.

No dimming. Placement avoids the trigger, flips sides or shrinks to prevent hover flicker at edges.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| TooltipProvider.delayDuration | `350` |
| Tooltip.defaultOpen | `false` |
| TooltipTrigger.disabled | `false` |
| TooltipContent.side | `'top'` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses Pressable, the shared overlay placement and an optional TooltipProvider delay.

## TUI boundaries

Content is a string, not interactive rich content. If no free region exists, the visual is omitted.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
