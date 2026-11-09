# Input Group

An editor surface with prefix/suffix content and actions, inspired by [shadcn Input Group](https://ui.shadcn.com/docs/components/input-group).

[Source](../../src/components/ui/input-group.tsx) · [Defaults](../../src/components/ui/input-group.styles.ts) · Gallery: `/gallery/input-group`

```tsx
<InputGroup>
  <InputGroupInput label="Search" value={query} onValueChange={setQuery} />
  <InputGroupAddon><InputGroupText>Search</InputGroupText></InputGroupAddon>
  <InputGroupAddon align="inline-end">
    <InputGroupButton onPress={search}>Go</InputGroupButton>
  </InputGroupAddon>
</InputGroup>
```

Import from `@/components/ui/input-group`.

| Part | Contract |
| --- | --- |
| InputGroup | Children; optional `id`; `width="100%"` (cell count or percentage), `disabled=false`, `invalid=false` |
| InputGroupInput | Existing Input props, including controlled/uncontrolled values, ref, readOnly and callbacks |
| InputGroupTextarea | Existing Textarea props; Enter inserts a newline, Ctrl+Enter submits |
| InputGroupAddon | Children; `align="inline-start"`, `"inline-end"`, `"block-start"` or `"block-end"` |
| InputGroupText | String children, muted foreground |
| InputGroupButton | Existing Button props; defaults to ghost variant; no size or round prop |

Use one editor per group. Addons must be direct children of InputGroup. Declare the editor first; align determines where addons appear visually. Inline addons sit beside the editor; block addons sit above/below it. When inline content cannot fit, the row wraps. For multiline editors, prefer block addons.

The root has zero padding/gap; addons have one cell of horizontal padding and a gap of one. Input/Textarea retain their own source text padding. The real Input/Textarea implements editing, focus, ref handles, readOnly, controlled reconciliation and submission. Disabled on the group disables its editor and InputGroupButtons; invalid is inherited by the editor. These states do not intercept arbitrary custom children.

An editor focus ring targets the entire group, without creating another focus manager or tab stop. Accessory buttons retain their own Button ring. Clicking passive group/addon space focuses its first enabled native editor through the focus coordinator; actions keep their own activation. Group background is shared with its editor. No frame border is added.

Tweak exposes every group part and the reused Input/Textarea observations. Shared Button spacing affects InputGroupButton. No Tweak JSON is loaded at runtime; see [styling](../styling.md).
