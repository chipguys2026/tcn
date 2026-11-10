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

Fields have a gap of one cell and zero padding. Set `htmlFor` on FieldLabel to the control's `id` so clicking the label focuses that control.

Field passes disabled and invalid appearance to FieldLabel; explicit label props override these values. Also set `disabled` and `invalid` on the control itself. Validate values in application code and pass the resulting messages to FieldError.

FieldError renders when it has a message. Explicit children take priority over the `errors` array; duplicate error messages are removed while preserving order. Descriptions and errors wrap within the available width. Give controls meaningful labels as well as a visible FieldLabel.

See [styling](../styling.md) to customize field spacing and appearance.
