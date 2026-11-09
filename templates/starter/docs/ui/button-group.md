# Button Group

Arrange related buttons horizontally or vertically, with optional text and separators.

[Source](../../src/components/ui/button-group.tsx) · [Defaults](../../src/components/ui/button-group.styles.ts) · Gallery: `/gallery/button-group`

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

The source gap is zero; horizontal groups wrap at the available width. Nested groups scope their own orientation. ButtonGroupSeparator reuses Separator. The group creates no focus target: ordinary Tab order, disabled handling, Enter/Space/click activation and focus rings come from each Button. This is a visual grouping, not a ToggleGroup or a roving-focus toolbar.

Buttons keep their own variants and source defaults. See [styling](../styling.md) to customize appearance.
