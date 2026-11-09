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
| InputGroupButton | Existing Button props; defaults to ghost variant; no size or round prop |

## Composition

Use one editor per group. Addons must be direct children of InputGroup. Declare the editor first; align determines where addons appear visually. Inline addons sit beside the editor; block addons sit above/below it. When inline content cannot fit, the row wraps. For multiline editors, prefer block addons.

The root has zero padding/gap; addons have one cell of horizontal padding and a gap of one. Input/Textarea retain their own source text padding. The real Input/Textarea implements editing, focus, ref handles, readOnly, controlled reconciliation and submission. Disabled on the group disables its editor and InputGroupButtons; invalid is inherited by the editor. These states do not intercept arbitrary custom children.

## Focus and interaction

An editor focus ring targets the entire group, without creating another focus manager or tab stop. Accessory buttons retain their own Button ring. Clicking passive group/addon space focuses its first enabled native editor through the focus coordinator; actions keep their own activation. Group background is shared with its editor. No frame border is added.

InputGroupButton uses Button defaults. See [styling](../styling.md) to customize the group's source defaults.
