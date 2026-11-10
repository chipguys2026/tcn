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

Open the popup and type to filter options. Navigate to an enabled result and select it. Escape or an outside click dismisses the popup.

## Appearance

The trigger opens a borderless popup containing search and results. The background is dimmed by 28%.

Default values:

| Parameter | Default |
| --- | --- |
| Combobox.defaultValue | `''` |
| Combobox.placeholder | `'Select an option...'` |
| Combobox.searchPlaceholder | `'Search...'` |
| Combobox.emptyText | `'No options found.'` |
| Combobox.disabled | `false` |
| Combobox.width | `34` |

## Usage guidance

Each option supplies a value and label, with optional search keywords and a disabled state. Combobox selects one value. Fetch remote options in application code and pass the resulting records to the component.
