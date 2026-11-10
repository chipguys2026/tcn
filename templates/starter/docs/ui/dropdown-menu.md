# Dropdown Menu

An anchored action menu with ordinary, checkbox and radio items.

[Source](../../src/components/ui/dropdown-menu.tsx) · Gallery: `/gallery/dropdown-menu` · [Customization](../styling.md)

## Usage

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

<DropdownMenu>
  <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onSelect={() => run()}>Run</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>
      Pinned
    </DropdownMenuCheckboxItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## API

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

Use arrows, Home, End or typeahead to navigate enabled items. Enter or Space activates the selected item; Escape closes the menu. Set `closeOnSelect={false}` to keep the menu open when changing checkbox or radio values.

## Appearance

Auto sizing and min/max behavior: [popup sizing](../popup-sizing.md).

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

The borderless popup uses distinct active and disabled item colors, with optional labels, shortcuts and separators. The background is dimmed by 28%.

Default values:

| Parameter | Default |
| --- | --- |
| DropdownMenuCheckboxItem.defaultChecked | `false` |
| DropdownMenuRadioGroup.defaultValue | `''` |

## Usage guidance

Items accept an optional `id`. Implement commands in selection handlers and register application-wide shortcuts separately. For nested submenus, use [Menubar](menubar.md).
