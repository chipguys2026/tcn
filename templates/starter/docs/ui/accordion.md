# accordion

A group of expandable sections with single or multiple open values.

[Source](../../src/components/ui/accordion.tsx) · Gallery: `/gallery/accordion` · [Styling status](../styling.md)

## Usage

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

<Accordion type="single" collapsible defaultValue="details">
  <AccordionItem value="details">
    <AccordionTrigger label="Details" />
    <AccordionContent><text>Section content</text></AccordionContent>
  </AccordionItem>
</Accordion>
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`.

| Component | Props contract |
| --- | --- |
| Accordion | `PropsWithChildren< SelectionProps & { disabled?: boolean; collapsible?: boolean } >` |
| AccordionItem | `PropsWithChildren<{ value: string; disabled?: boolean }>` |
| AccordionTrigger | `PropsWithChildren<{ label: string }>` |
| AccordionContent | `PropsWithChildren<{ forceMount?: boolean }>` |

## State and interaction

Up/Down/Home/End move between enabled headings; Enter/Space or a click anywhere in the header toggles. Single mode needs collapsible to close the selected section. Hidden content leaves traversal.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Full-width headings, right-aligned chevrons, bottom item dividers and no default background highlight. Headers default to one content row with one row of vertical padding on either side. Content aligns with the title and has top/bottom spacing.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| AccordionItem.disabled | `false` |
| AccordionContent.forceMount | `false` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses Pressable, RovingGroup and controlled selection. Trigger label/icon and content have separate inspection parts.

## TUI boundaries

A force-mounted closed section stays hidden. Content may contain normal controls; it is not a separate focus trap.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
