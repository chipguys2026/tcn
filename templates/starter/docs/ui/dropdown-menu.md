# dropdown-menu

An anchored action menu with ordinary, checkbox and radio items.

[Source](../../src/components/ui/dropdown-menu.tsx) · Gallery: `/gallery/dropdown-menu` · [Styling status](../styling.md)

## Usage

```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuGroup, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'

<DropdownMenu><DropdownMenuTrigger>Actions</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onSelect={() => run()}>Run</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>Pinned</DropdownMenuCheckboxItem></DropdownMenuContent></DropdownMenu>
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuLabel`, `DropdownMenuGroup`, `DropdownMenuSeparator`.

| Component | Props contract |
| --- | --- |
| DropdownMenuTrigger | `Omit<ComponentProps<typeof family.Trigger>, 'openOnArrow'>` |
| DropdownMenuContent | `FloatingContentProps` |
| DropdownMenuItem | `ItemProps` |
| DropdownMenuCheckboxItem | `Omit<ItemProps, 'onSelect'> & { checked?: boolean defaultChecked?: boolean onCheckedChange?: (checked: boolean) => void }` |
| DropdownMenuRadioGroup | `PropsWithChildren<{ value?: string defaultValue?: string onValueChange?: (value: string) => void }>` |
| DropdownMenuRadioItem | `ItemProps & { value: string }` |
| DropdownMenuLabel | `{ children: string }` |
| DropdownMenuGroup | `PropsWithChildren` |

## State and interaction

Arrows/Home/End/typeahead navigate; Enter/Space activates. Disabled items are skipped. Escape closes. closeOnSelect=false can keep checkbox/radio actions open.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Auto sizing and min/max behavior: [popup sizing](../popup-sizing.md).

Promoted defaults are defined in [dropdown-menu.styles.ts](../../src/components/ui/dropdown-menu.styles.ts) and consumed by the real component and its observations. No Tweak JSON is loaded here.

Borderless popup with semantic active/disabled items, labels, shortcuts and separators. Dims underlying content 28%.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| DropdownMenuCheckboxItem.defaultChecked | `false` |
| DropdownMenuRadioGroup.defaultValue | `''` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

DropdownMenu and ContextMenu use the same [menu engine](../../src/lib/ui/menu.tsx). Public DropdownMenu exports remain in this module; item props also accept an optional native `id`. Each family keeps isolated selection/open contexts.

Uses the shared floating, grouped-navigation and activation helpers.

## TUI boundaries

Nested submenus are not supplied. Domain commands and global hotkeys belong to the application.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
