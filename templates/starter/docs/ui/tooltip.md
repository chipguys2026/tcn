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
| Tooltip | Children; controlled `open` or initial `defaultOpen`; `onOpenChange`; `delayDuration` in milliseconds |
| TooltipTrigger | Children; required `label`; optional `disabled` and `onPress` |
| TooltipContent | String children; optional `side`; [popup sizing props](../popup-sizing.md) |

## State and interaction

Focus or hover opens the tooltip after a delay of 350 ms by default. Moving focus or the pointer away, or activating the trigger, hides it. The tooltip preserves focus on the trigger.

## Appearance

Auto sizing and min/max behavior: [popup sizing](../popup-sizing.md).

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

The tooltip preserves the background brightness and appears beside its trigger. It can switch sides or shrink to fit near terminal edges.

Default values:

| Parameter | Default |
| --- | --- |
| TooltipProvider.delayDuration | `350` |
| Tooltip.defaultOpen | `false` |
| TooltipTrigger.disabled | `false` |
| TooltipContent.side | `'top'` |

## Usage guidance

Keep tooltip content to a short text explanation. Use [Popover](popover.md) for interactive content. A tooltip is hidden when the terminal has no available space for it.
