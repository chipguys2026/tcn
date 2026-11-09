# Combobox

A searchable single-selection adapter.

[Source](../../src/components/ui/combobox.tsx) · Gallery: `/gallery/combobox` · [Customization](../styling.md)

## Usage

```tsx
import { Combobox } from '@/components/ui/combobox'

<Combobox
  options={[
    { value: 'bun', label: 'Bun' },
    { value: 'node', label: 'Node.js' },
  ]}
  value={runtime}
  onValueChange={setRuntime}
/>
```

## API

Exports: `Combobox`.

| Component | Props contract |
| --- | --- |
| Combobox | `{ options: readonly ComboboxOption[] value?: string defaultValue?: string onValueChange?: (value: string) => void placeholder?: string searchPlaceholder?: string emptyText?: string disabled?: boolean width?: number }` |

### Prop types

```ts
type ComboboxOption = {
  value: string
  label: string
  keywords?: readonly string[]
  disabled?: boolean
}
```

## State and interaction

Open the popup, type to filter, navigate enabled results and commit one value. Escape/outside dismissal uses the nonmodal overlay behavior.

## Appearance

Trigger plus borderless search/list popup; underlying content dims 28%.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| Combobox.defaultValue | `''` |
| Combobox.placeholder | `'Select an option...'` |
| Combobox.searchPlaceholder | `'Search...'` |
| Combobox.emptyText | `'No options found.'` |
| Combobox.disabled | `false` |
| Combobox.width | `34` |

## Reuse

Composes Popover and Command; search therefore reuses Input.

## Notes

Options are typed value/label/keywords/disabled records. No multiselect, arbitrary browser asChild composition or remote search engine.
