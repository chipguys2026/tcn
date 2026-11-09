# Accordion

A group of expandable sections with single or multiple open values.

[Source](../../src/components/ui/accordion.tsx) · Gallery: `/gallery/accordion` · [Customization](../styling.md)

## Usage

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

<Accordion type="single" collapsible defaultValue="details">
  <AccordionItem value="details">
    <AccordionTrigger label="Details" />
    <AccordionContent>
      <text>Section content</text>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

## API

Exports: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`.

| Component | Props contract |
| --- | --- |
| Accordion | `PropsWithChildren< SelectionProps & { disabled?: boolean; collapsible?: boolean } >` |
| AccordionItem | `PropsWithChildren<{ value: string; disabled?: boolean }>` |
| AccordionTrigger | `PropsWithChildren<{ label: string }>` |
| AccordionContent | `PropsWithChildren<{ forceMount?: boolean }>` |

## State and interaction

Up/Down/Home/End move between enabled headings; Enter/Space or a click anywhere in the header toggles. Single mode needs collapsible to close the selected section. Hidden content leaves traversal.

## Appearance

Full-width headings, right-aligned chevrons, bottom item dividers and no default background highlight. Headers default to one content row with one row of vertical padding on either side. Content aligns with the title and has top/bottom spacing.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| AccordionItem.disabled | `false` |
| AccordionContent.forceMount | `false` |

## Reuse

Uses Pressable, RovingGroup and controlled selection. Trigger label/icon and content have separate inspection parts.

## Notes

A force-mounted closed section stays hidden. Content may contain normal controls; it is not a separate focus trap.
