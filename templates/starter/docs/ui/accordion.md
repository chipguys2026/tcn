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
| Accordion | Children; `type="single"` or `"multiple"`; controlled `value` or initial `defaultValue`; `onValueChange`; `disabled`; `collapsible` for single mode |
| AccordionItem | `PropsWithChildren<{ value: string; disabled?: boolean }>` |
| AccordionTrigger | `PropsWithChildren<{ label: string }>` |
| AccordionContent | `PropsWithChildren<{ forceMount?: boolean }>` |

## State and interaction

Use Up, Down, Home and End to move between enabled headings. Enter, Space or a click on the header toggles its section. In single mode, set `collapsible` to allow closing the selected section. Controls in hidden content are skipped during navigation.

## Appearance

Headings fill the available width, with right-aligned chevrons and dividers below each item. The default appearance keeps the background unchanged. Headers default to one content row with one row of vertical padding on either side. Content aligns with the title and has top/bottom spacing.

Default values:

| Parameter | Default |
| --- | --- |
| AccordionItem.disabled | `false` |
| AccordionContent.forceMount | `false` |

## Usage guidance

Set `forceMount` to retain a closed section in the component tree; its content stays hidden until expanded. Controls inside an expanded section participate in normal keyboard navigation.
