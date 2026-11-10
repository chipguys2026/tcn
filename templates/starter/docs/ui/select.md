# Select

A string-valued selection popup.

[Source](../../src/components/ui/select.tsx) · Gallery: `/gallery/select` · [Customization](../styling.md)

## Usage

```tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '@/components/ui/select'

<Select defaultValue="bun">
  <SelectTrigger>
    <SelectValue placeholder="Runtime" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="bun">Bun</SelectItem>
    <SelectItem value="node">Node.js</SelectItem>
  </SelectContent>
</Select>
```

## API

Exports: `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator`.

| Component | Props contract |
| --- | --- |
| Select | `PropsWithChildren<{ value?: string defaultValue?: string onValueChange?: (value: string) => void open?: boolean defaultOpen?: boolean onOpenChange?: (open: boolean) => void disabled?: boolean }>` |
| SelectTrigger | `PropsWithChildren<{ label?: string; disabled?: boolean }>` |
| SelectValue | `{ placeholder?: string }` |
| SelectContent | `PropsWithChildren<PopupSizing>` |
| SelectItem | `ItemProps` |
| SelectGroup | `PropsWithChildren` |
| SelectLabel | `{ children: string }` |

## State and interaction

Press Enter, Space or an arrow key on the trigger to open the popup. Use arrows, Home, End or typeahead to navigate enabled items. Enter or Space selects an item. Escape closes the popup and restores focus.

## Appearance

Auto sizing and min/max behavior: [popup sizing](../popup-sizing.md).

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

Compose the trigger and selected value separately from popup items, groups, labels and separators. The popup is borderless and dims the background by 28%.

Default values:

| Parameter | Default |
| --- | --- |
| Select.defaultValue | `''` |
| Select.defaultOpen | `false` |
| Select.disabled | `false` |
| SelectTrigger.label | `'Choose an option'` |
| SelectTrigger.disabled | `false` |
| SelectValue.placeholder | `'Choose an option'` |
| SelectItem.children | `value` |
| SelectItem.disabled | `false` |

## Usage guidance

Give items string labels so `SelectValue` can display the selected label. Supply a custom value presentation when items are hidden behind custom wrapper components.
