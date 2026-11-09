# Context Menu

Open actions for an item using a right click or keyboard context-menu command.

[Source](../../src/components/ui/context-menu.tsx) · [Defaults](../../src/components/ui/context-menu.styles.ts) · Gallery: `/gallery/context-menu`

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

Arrows/Home/End/typeahead, disabled skipping, controlled checkbox/radio proposals, selection closing and Escape/outside dismissal share `lib/ui/menu.tsx` with DropdownMenu. Each family has its own context. Closing restores trigger focus through the existing overlay scope. Controlled owners may reject open or selection proposals.

## Sizing and placement

Content inherits DropdownMenu source defaults, except minWidth is 12 cells rather than trigger width. Width/height are auto, capped at 32 columns/16 rows, including one-cell padding. Pointer coordinates are absolute terminal coordinates; the shared Overlay converts them into the preview region and clamps placement. Popup backdrop and scrolling match DropdownMenu.

Use flat groups, ordinary items, checkbox/radio items and separators. For nested application menus, see [Menubar](menubar.md). See [popup sizing](../popup-sizing.md) and [styling](../styling.md) for layout and appearance.
