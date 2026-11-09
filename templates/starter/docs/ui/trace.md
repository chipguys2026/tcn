# Trace

Present execution steps and expandable details using application-owned status.

[Source](../../src/components/ui/trace.tsx) · [Defaults](../../src/components/ui/trace.styles.ts) · Gallery: `/gallery/trace`

## Usage

```tsx
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from '@/components/ui/trace'

<Trace>
  <TraceLine status="complete">
    <TraceIcon>
      <text>✓</text>
    </TraceIcon>
    <TraceTitle>Read project files</TraceTitle>
  </TraceLine>
  <TraceCollapsible>
    <TraceCollapsibleTrigger>Inspect result</TraceCollapsibleTrigger>
    <TraceCollapsibleContent>
      <TraceDescription>Eight files found.</TraceDescription>
    </TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
```

## API

| Part | Purpose |
| --- | --- |
| `Trace` | Stack execution entries; traces can nest for child operations. |
| `TraceLine` | `status="pending"`, `"running"`, `"complete"` or `"error"`; default `"complete"`. |
| `TraceIcon` | Application-provided icon, text or Spinner. |
| `TraceTitle` | Step title; muted while pending and destructive on error. |
| `TraceDescription` | Muted supporting text. |
| `TraceCollapsible` | Controlled `open` or `defaultOpen`, with `onOpenChange` and `disabled`. |
| `TraceCollapsibleTrigger`, `TraceCollapsibleContent` | Disclosure controls and detail content. |

Details use an indent of two cells and a gap of one. Disclosure parts reuse Collapsible's keyboard, focus and visibility behavior. You can compose Code Block or other components inside details.

The application owns execution state and logging. Trace displays the status and content you provide.
