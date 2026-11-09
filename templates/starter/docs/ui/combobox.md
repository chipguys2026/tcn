# combobox

A searchable single-selection adapter.

[Source](../../src/components/ui/combobox.tsx) · Gallery: `/gallery/combobox` · [Styling status](../styling.md)

## Usage

```tsx
import { Combobox } from '@/components/ui/combobox'

<Combobox options={[{value: "bun", label: "Bun"}, {value: "node", label: "Node.js"}]} value={runtime} onValueChange={setRuntime} />
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Combobox`.

| Component | Props contract |
| --- | --- |
| Combobox | `{ options: readonly ComboboxOption[] value?: string defaultValue?: string onValueChange?: (value: string) => void placeholder?: string searchPlaceholder?: string emptyText?: string disabled?: boolean width?: number }` |

### Declared prop types

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

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Trigger plus borderless search/list popup; underlying content dims 28%.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| Combobox.defaultValue | `''` |
| Combobox.placeholder | `'Select an option...'` |
| Combobox.searchPlaceholder | `'Search...'` |
| Combobox.emptyText | `'No options found.'` |
| Combobox.disabled | `false` |
| Combobox.width | `34` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Composes Popover and Command; search therefore reuses Input.

## TUI boundaries

Options are typed value/label/keywords/disabled records. No multiselect, arbitrary browser asChild composition or remote search engine.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
