# Menubar

Group application actions into top-level menus with optional nested submenus.

[Source](../../src/components/ui/menubar.tsx) · [Defaults](../../src/components/ui/menubar.styles.ts) · Gallery: `/gallery/menubar`

## Usage

```tsx
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar'

<Menubar>
  <MenubarMenu value="file">
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem onSelect={createProject}>New project</MenubarItem>
      <MenubarSeparator />
      <MenubarSub>
        <MenubarSubTrigger>Export</MenubarSubTrigger>
        <MenubarSubContent>
          <MenubarItem onSelect={exportJSON}>JSON</MenubarItem>
        </MenubarSubContent>
      </MenubarSub>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

Supply `createProject` and `exportJSON` from your application.

## API

| Part | Key props |
| --- | --- |
| `Menubar` | Open menu ID through `value` or `defaultValue=""`, with `onValueChange`. |
| `MenubarMenu` | Unique required `value` for each top-level menu. |
| `MenubarTrigger` | Trigger content and disabled state. |
| `MenubarItem` | Children, `textValue` for typeahead, `disabled`, `onSelect`, `closeOnSelect=true`. |
| `MenubarCheckboxItem` | `checked` or `defaultChecked`, with `onCheckedChange`. |
| `MenubarRadioGroup`, `MenubarRadioItem` | Group value/defaultValue/onValueChange; each item requires `value`. |
| `MenubarGroup`, `MenubarLabel`, `MenubarSeparator` | Group and label related items. |
| `MenubarShortcut` | Display a shortcut hint; bind the actual shortcut in your application. |
| `MenubarSub`, `MenubarSubTrigger`, `MenubarSubContent` | Compose nested submenus. |

Set `closeOnSelect=false` to keep a menu open while changing checkbox/radio values. Selecting a normal action closes the menu bar.

## Keyboard behavior

| Key | Behavior |
| --- | --- |
| Left/Right, Home/End on top-level triggers | Move between enabled triggers and switch an open menu. |
| Down/Up, Enter/Space on a trigger | Open its menu. |
| Arrows, Home/End, typeahead inside a menu | Move between enabled items. |
| Right on a submenu trigger | Open the submenu. |
| Left/Escape in a submenu | Close that level. |
| Escape in the top-level menu | Close and restore trigger focus. |
| Tab | Exit the popup scope. |

## Sizing

Content uses auto sizing, a trigger-width minimum, a maximum width of 40 columns and maximum height of 20 rows. It accepts the shared popup sizing and placement props. See [popup sizing](../popup-sizing.md) for how bounds interact.
