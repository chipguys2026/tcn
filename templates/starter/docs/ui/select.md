# select

A string-valued selection popup.

[Source](../../src/components/ui/select.tsx) · Gallery: `/gallery/select` · [Styling status](../styling.md)

## Usage

```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel, SelectSeparator } from '@/components/ui/select'

<Select defaultValue="bun"><SelectTrigger><SelectValue placeholder="Runtime" /></SelectTrigger><SelectContent><SelectItem value="bun">Bun</SelectItem><SelectItem value="node">Node.js</SelectItem></SelectContent></Select>
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

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

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Auto sizing and min/max behavior: [popup sizing](../popup-sizing.md).

Promoted defaults are defined in [select.styles.ts](../../src/components/ui/select.styles.ts) and consumed by the real component and its observations. No Tweak JSON is loaded here.

Trigger/value and borderless popup/item/group/label/separator parts are composed separately. Popup dims underlying content 28%.

Declared parameter defaults (expressions refer to the linked source):

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

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses native focus/overlay primitives and the shared selection patterns.

## TUI boundaries

Item labels are strings. SelectValue derives labels from declared items; opaque custom wrappers should provide a custom value presentation.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
