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

Enter/Space opens; arrows can open the trigger. Arrows/Home/End/typeahead move through enabled items; Enter/Space commits. Escape closes and focus returns.

## Appearance

Auto sizing and min/max behavior: [popup sizing](../popup-sizing.md).

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

Trigger/value and borderless popup/item/group/label/separator parts are composed separately. Popup dims underlying content 28%.

Defaults from the linked source:

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

## Reuse

Uses native focus/overlay primitives and the shared selection patterns.

## Notes

Item labels are strings. SelectValue derives labels from declared items; opaque custom wrappers should provide a custom value presentation.
