# Field

Compose form labels, controls, descriptions and validation messages.

[Source](../../src/components/ui/field.tsx) · [Defaults](../../src/lib/ui/styles.ts) · Gallery: `/gallery/field`

## Usage

```tsx
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

<Field invalid={invalid}>
  <FieldLabel htmlFor="name" required>
    Project name
  </FieldLabel>
  <Input id="name" value={name} onValueChange={setName} invalid={invalid} />
  <FieldDescription>A unique project name.</FieldDescription>
  <FieldError>{invalid ? 'A name is required.' : undefined}</FieldError>
</Field>
```

## API and behavior

| Part | Contract |
| --- | --- |
| Field | Children; `orientation="vertical"` or `"horizontal"`; `disabled=false`, `invalid=false` |
| FieldGroup, FieldSet, FieldContent | Children; group/fieldset stack fields, content grows within a horizontal field |
| FieldLegend, FieldTitle | String children, bold foreground |
| FieldLabel | Label props including `htmlFor`, `required`, `disabled`, `invalid` |
| FieldDescription | String children, muted foreground |
| FieldError | Optional string children or `errors: ({message?: string} \| undefined)[]` |
| FieldSeparator | Optional string label between separator segments |

## Layout and validation

Source gap is one cell/row; field padding is zero. A label delegates click focus through the existing Label implementation and focus coordinator. Field passes disabled/invalid appearance to FieldLabel; explicit label props can override it. Set disabled/invalid on the actual controls too: Field does not clone children or perform validation. There is no form submission or schema dependency.

FieldError renders only when it has a message. Explicit children take priority; error messages are deduplicated while preserving order. Descriptions and errors wrap in the available width. A terminal has no DOM label or ARIA relationship; keep meaningful control labels as well as the visible FieldLabel.

FieldLabel reuses Label; FieldSeparator reuses Separator. Field wrappers and text share the passive PartBox/PartText rendering primitives. See [styling](../styling.md) for customization.
