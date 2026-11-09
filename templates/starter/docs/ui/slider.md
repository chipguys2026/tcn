# Slider

Choose one or more stepped numeric values with keyboard and pointer input.

[Source](../../src/components/ui/slider.tsx) · [Defaults](../../src/lib/ui/styles.ts) · Gallery: `/gallery/slider`

## Usage

```tsx
import { Slider } from '@/components/ui/slider'

<>
  <Slider
    label="Volume"
    value={volume}
    onValueChange={setVolume}
    onValueCommit={(values) => saveVolume(values)}
    min={0}
    max={100}
    step={5}
  />

  <Slider label="Range" defaultValue={[20, 80]} />
  <Slider label="Vertical" orientation="vertical" height={8} />
</>
```

## API and behavior

Values are arrays, including single-thumb sliders.

| Prop | Contract |
| --- | --- |
| value / defaultValue | Controlled array or initial uncontrolled array; default [50] |
| onValueChange | Proposes the next snapped, ordered array |
| onValueCommit | Called once at pointer release/drag end, or per handled keyboard operation |
| min / max / step | Default 0 / 100 / 1; invalid bounds/step fall back to a finite increasing range |
| orientation | horizontal (default) or vertical |
| width / height | Horizontal defaults to 24 columns by one row; vertical to one column by eight rows; width also accepts percentages |
| disabled / autoFocus | Default false; disabled thumbs are skipped; autoFocus targets the first thumb |
| label / id | Native focus label; supplied id generates thumb IDs `id-thumb-0`, `id-thumb-1`, etc. |

## Values and bounds

Values snap from min in step increments, clamp to the range and sort into thumb order. Empty/invalid arrays produce a finite fallback thumb. Thumb identity is its ordered slot, so updating a numeric value does not remount it or lose focus. A thumb cannot cross its neighbors; coincident thumbs remain separate keyboard stops. Single values fill the range from min; multiple values fill between the first and last thumbs.

## Interaction

Arrows adjust one step; Shift multiplies by ten. Page Up/Down adjust ten steps; Home/End request the first/last permitted value. Each thumb is a normal Tab stop using useFocusable and the shared final ring pass. Clicking the track selects the nearest thumb; dragging clamps/snaps its value. Vertical max is at the top. Pointer commits contain the final proposal even if a controlled owner rejects it.

Source defaults cover the root, track, range and thumb, including text colors. The real rendered dimensions determine pointer mapping and thumb placement after terminal resize. RTL/inversion, a minimum distance between thumbs and form serialization are not supported. See [styling](../styling.md).
