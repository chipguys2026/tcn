# Context Menu

Open actions for an item using a right click or keyboard context-menu command.

[Source](../../src/components/ui/context-menu.tsx) · [Defaults](../../src/lib/ui/styles.ts) · Gallery: `/gallery/context-menu`

## Usage

```tsx
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from '@/components/ui/context-menu'

<ContextMenu>
  <ContextMenuTrigger label="Project actions">Project</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem onSelect={open}>Open</ContextMenuItem>
    <ContextMenuItem disabled>Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

## API and behavior

| Part | Contract |
| --- | --- |
| ContextMenu | Children; controlled `open` or initial `defaultOpen`; `onOpenChange` |
| ContextMenuTrigger | Children; optional label/id/autoFocus; disabled=false |
| ContextMenuContent | Shared FloatingContentProps including auto width/height and min/max limits |
| ContextMenuItem | String children, optional id/value/textValue, disabled, onSelect; closeOnSelect=true |
| ContextMenuCheckboxItem | Item props except onSelect; checked/defaultChecked/onCheckedChange |
| ContextMenuRadioGroup | Children; value/defaultValue/onValueChange |
| ContextMenuRadioItem | Item props with required value |
| ContextMenuGroup, ContextMenuLabel | Group children; label string children |
| ContextMenuSeparator | Reused Separator props |

## Interaction

Right mouse down opens near the pointer. Shift+F10 or a terminal-reported menu key opens relative to the focused trigger. Left click only focuses the trigger. Disabled triggers do not open. Terminal support determines whether menu keys and right clicks reach the app.

Use arrows, Home, End or typeahead to move between enabled items. Select actions with Enter or Space. Escape or an outside click dismisses the menu, and closing restores focus to the trigger. In controlled mode, apply `onOpenChange` and selection callbacks to accept changes.

## Sizing and placement

Content fits its items by default, with a minimum width of 12 columns and maximum dimensions of 32 columns by 16 rows. Dimensions include one cell of padding on each side. The menu opens near the pointer and stays within the available terminal region. Its backdrop and scrolling behave like [Dropdown Menu](dropdown-menu.md).

Use flat groups, ordinary items, checkbox/radio items and separators. For nested application menus, see [Menubar](menubar.md). See [popup sizing](../popup-sizing.md) and [styling](../styling.md) for layout and appearance.
