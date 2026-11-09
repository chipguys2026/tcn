# Label

A text label that can delegate focus to a native control.

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

Clicking resolves htmlFor and focuses the enabled control if the current focus scope permits it. Disabled labels do not delegate.

## Appearance

One-row bold text, optional required marker and disabled opacity. `invalid` uses the destructive foreground. FieldLabel reuses this component; styleSource/stylePart are internal composition hooks for its Tweak identity.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| Label.disabled | `false` |
| Label.required | `false` |
| Label.invalid | `false` |
| Label.styleSource | `'label'` |
| Label.stylePart | `'Label'` |

## Reuse

Uses the focus coordinator and native control IDs.

## Notes

This is native focus metadata, not browser label/ARIA parity. Keep IDs unique within a mounted application.
