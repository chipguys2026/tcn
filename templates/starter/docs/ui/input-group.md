# Input Group

Add prefix/suffix content and actions around a single-line or multiline editor.

[Source](../../src/components/ui/input-group.tsx) · [Defaults](../../src/lib/ui/styles.ts) · Gallery: `/gallery/input-group`

## Usage

```tsx
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupText,
  InputGroupButton,
} from '@/components/ui/input-group'

<InputGroup>
  <InputGroupInput label="Search" value={query} onValueChange={setQuery} />
  <InputGroupAddon>
    <InputGroupText>Search</InputGroupText>
  </InputGroupAddon>
  <InputGroupAddon align="inline-end">
    <InputGroupButton onPress={search}>Go</InputGroupButton>
  </InputGroupAddon>
</InputGroup>
```

## API and behavior

| Part | Contract |
| --- | --- |
| InputGroup | Children; optional `id`; `width="100%"` (cell count or percentage), `disabled=false`, `invalid=false` |
| InputGroupInput | Existing Input props, including controlled/uncontrolled values, ref, readOnly and callbacks |
| InputGroupTextarea | Existing Textarea props; Enter inserts a newline, Ctrl+Enter submits |
| InputGroupAddon | Children; `align="inline-start"`, `"inline-end"`, `"block-start"` or `"block-end"` |
| InputGroupText | String children, muted foreground |
| InputGroupButton | Button props; defaults to the ghost variant |

## Composition

Use one editor per group. Addons must be direct children of InputGroup. Declare the editor first; align determines where addons appear visually. Inline addons sit beside the editor; block addons sit above/below it. When inline content cannot fit, the row wraps. For multiline editors, prefer block addons.

The group has zero padding and gap. Addons have one cell of horizontal padding and a gap of one. The editor keeps its text padding and supports the corresponding Input or Textarea props, including refs and read-only behavior.

Setting `disabled` on the group disables its editor and InputGroupButtons. The editor also inherits `invalid`. Set these states separately on any additional custom controls.

## Focus and interaction

When the editor is focused, the focus ring surrounds the entire group. Accessory buttons keep their own focus rings and tab stops. Clicking the group or a passive addon focuses the first enabled editor; clicking an action button activates that button. The group and editor share a continuous background.

InputGroupButton uses Button defaults. See [styling](../styling.md) to customize the group's source defaults.
