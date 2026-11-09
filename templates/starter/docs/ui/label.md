# label

A text label that can delegate focus to a native control.

[Source](../../src/components/ui/label.tsx) · Gallery: `/gallery/label` · [Styling status](../styling.md)

## Usage

```tsx
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

<Label htmlFor="name">Name</Label>
<Input id="name" />
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Label`.

| Component | Props contract |
| --- | --- |
| Label | `{ children: string; htmlFor?: string; disabled?: boolean; required?: boolean; invalid?: boolean; styleSource?: string; stylePart?: string }` |

## State and interaction

Clicking resolves htmlFor and focuses the enabled control if the current focus scope permits it. Disabled labels do not delegate.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

One-row bold text, optional required marker and disabled opacity. `invalid` uses the destructive foreground. FieldLabel reuses this component; styleSource/stylePart are internal composition hooks for its Tweak identity.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| Label.disabled | `false` |
| Label.required | `false` |
| Label.invalid | `false` |
| Label.styleSource | `'label'` |
| Label.stylePart | `'Label'` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses the focus coordinator and native control IDs.

## TUI boundaries

This is native focus metadata, not browser label/ARIA parity. Keep IDs unique within a mounted application.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
