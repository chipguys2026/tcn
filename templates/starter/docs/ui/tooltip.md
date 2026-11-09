# Tooltip

A delayed descriptive hint for a trigger.

[Source](../../src/components/ui/tooltip.tsx) · Gallery: `/gallery/tooltip` · [Customization](../styling.md)

## Usage

```tsx
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'

<Tooltip>
  <TooltipTrigger label="Save">Save</TooltipTrigger>
  <TooltipContent>Save the current changes.</TooltipContent>
</Tooltip>
```

## API

Exports: `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent`.

| Component | Props contract |
| --- | --- |
| TooltipProvider | `PropsWithChildren<{ delayDuration?: number }>` |
| Tooltip | `PropsWithChildren<{ open?: boolean defaultOpen?: boolean onOpenChange?: (open: boolean) => void delayDuration?: number }>` |
| TooltipTrigger | `PropsWithChildren<{ label: string disabled?: boolean onPress?: () => void }>` |
| TooltipContent | `{ children: string side?: Side } & PopupSizing` |

## State and interaction

Focus/hover opens after a delay (default 350 ms). Blur/leave/activation hides. Timer is cancelled on unmount; the popup does not take focus.

## Appearance

Auto sizing and min/max behavior: [popup sizing](../popup-sizing.md).

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

No dimming. Placement avoids the trigger, flips sides or shrinks to prevent hover flicker at edges.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| TooltipProvider.delayDuration | `350` |
| Tooltip.defaultOpen | `false` |
| TooltipTrigger.disabled | `false` |
| TooltipContent.side | `'top'` |

## Reuse

Uses Pressable, the shared overlay placement and an optional TooltipProvider delay.

## Notes

Content is a string, not interactive rich content. If no free region exists, the visual is omitted.
