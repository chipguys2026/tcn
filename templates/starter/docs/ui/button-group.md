# Button Group

Arrange related buttons horizontally or vertically, with optional text and separators.

[Source](../../src/components/ui/button-group.tsx) · [Defaults](../../src/lib/ui/styles.ts) · Gallery: `/gallery/button-group`

## Usage

```tsx
import {
  ButtonGroup,
  ButtonGroupText,
  ButtonGroupSeparator,
} from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'

<ButtonGroup>
  <ButtonGroupText>Changes</ButtonGroupText>
  <Button onPress={save}>Save</Button>
  <ButtonGroupSeparator />
  <Button variant="secondary" onPress={preview}>
    Preview
  </Button>
</ButtonGroup>
```

## API and behavior

| Part | Contract |
| --- | --- |
| ButtonGroup | Children; `orientation="horizontal"` or `"vertical"` |
| ButtonGroupText | String children; muted surface, one cell horizontal padding |
| ButtonGroupSeparator | No props; separator perpendicular to the containing group's orientation |

## Layout and interaction

Buttons have zero gap between them, and horizontal groups wrap at the available width. Nested groups can use their own orientation. Each button keeps its normal Tab stop, activation keys, disabled state and focus ring. Use [Toggle Group](toggle-group.md) when the controls represent a selection.

Buttons keep their own variants and source defaults. See [styling](../styling.md) to customize appearance.
