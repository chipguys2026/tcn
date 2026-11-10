# Label

A text label that focuses an associated control when clicked.

[Source](../../src/components/ui/label.tsx) · Gallery: `/gallery/label` · [Customization](../styling.md)

## Usage

```tsx
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

<>
  <Label htmlFor="name">Name</Label>
  <Input id="name" />
</>
```

## API

Exports: `Label`.

| Component | Props contract |
| --- | --- |
| Label | `{ children: string; htmlFor?: string; disabled?: boolean; required?: boolean; invalid?: boolean; styleSource?: string; stylePart?: string }` |

## State and interaction

Set `htmlFor` to a control's `id`. Clicking the label focuses that control when it is enabled and reachable within the active focus scope. A disabled label ignores clicks.

## Appearance

Labels use one row of bold text with an optional required marker. Disabled labels appear dimmed; `invalid` uses the destructive foreground.

Default values:

| Parameter | Default |
| --- | --- |
| Label.disabled | `false` |
| Label.required | `false` |
| Label.invalid | `false` |

## Usage guidance

Set `htmlFor` to the target control's `id`. Keep control IDs unique within the mounted application.
