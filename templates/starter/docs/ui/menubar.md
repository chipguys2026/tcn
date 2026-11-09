# Menubar

[Source](../../src/components/ui/menubar.tsx) · [Defaults](../../src/components/ui/menubar.styles.ts) · Gallery: `/gallery/menubar`

Native TUI menu composition with the shadcn compound shape. Imports come from `@/components/ui/menubar`.

```tsx
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

Menubar owns the open menu ID: `value`, `defaultValue=''`, `onValueChange`. Every top-level Menu needs a unique value. Disabled triggers are excluded from navigation. Left/Right/Home/End move between top-level triggers, switching an already open menu. Down/Up/Enter/Space open; vertical arrows/Home/End and typeahead navigate menu items. Right opens a submenu; Left/Escape closes its level. Escape at the top closes and restores its trigger. Tab exits the popup scope.

Group, Label, Separator and Shortcut compose content. Item accepts React children, optional `textValue` for typeahead, `disabled`, `onSelect`, `closeOnSelect=true`. Shortcut displays a hint; the app binds actual accelerators. CheckboxItem supports checked/defaultChecked/onCheckedChange; RadioGroup supports value/defaultValue/onValueChange and RadioItem requires value. Use closeOnSelect=false to keep check/radio menus open.

Sub/SubTrigger/SubContent can nest. Menu selection closes the bar. Popup sizing is auto with minWidth=trigger, maxWidth=40 and maxHeight=20. Content accepts the shared popup sizing/placement props. Menubar reuses the shared DropdownMenu/ContextMenu selection, roving, floating placement and overlay primitives. Source defaults do not load Tweak JSON at runtime.
