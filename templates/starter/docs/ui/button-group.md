# Button Group

Composition of existing buttons, inspired by [shadcn Button Group](https://ui.shadcn.com/docs/components/button-group).

[Source](../../src/components/ui/button-group.tsx) · [Defaults](../../src/components/ui/button-group.styles.ts) · Gallery: `/gallery/button-group`

```tsx
<ButtonGroup>
  <ButtonGroupText>Changes</ButtonGroupText>
  <Button onPress={save}>Save</Button>
  <ButtonGroupSeparator />
  <Button variant="secondary" onPress={preview}>Preview</Button>
</ButtonGroup>
```

Import from `@/components/ui/button-group`; import Button from its own module.

| Part | Contract |
| --- | --- |
| ButtonGroup | Children; `orientation="horizontal"` or `"vertical"` |
| ButtonGroupText | String children; muted surface, one cell horizontal padding |
| ButtonGroupSeparator | No props; separator perpendicular to the containing group's orientation |

The source gap is zero; horizontal groups wrap at the available width. Nested groups scope their own orientation. ButtonGroupSeparator reuses Separator. The group creates no focus target: ordinary Tab order, disabled handling, Enter/Space/click activation and focus rings come from each Button. This is a visual grouping, not a ToggleGroup or a roving-focus toolbar.

All three parts are editable in Tweak; buttons keep shared Button defaults and preview inheritance. No size or round variant is introduced. See [styling](../styling.md).
