# Trace

[Source](../../src/components/ui/trace.tsx) · [Defaults](../../src/components/ui/trace.styles.ts) · Gallery: `/gallery/trace`

```tsx
<Trace>
  <TraceLine status="complete">
    <TraceIcon><text>✓</text></TraceIcon>
    <TraceTitle>Read project files</TraceTitle>
  </TraceLine>
  <TraceCollapsible>
    <TraceCollapsibleTrigger>Inspect result</TraceCollapsibleTrigger>
    <TraceCollapsibleContent>
      <TraceDescription>Eight files found.</TraceDescription>
      <CodeBlock><CodeBlockContent>{result}</CodeBlockContent></CodeBlock>
    </TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
```

Imports come from `@/components/ui/trace`. TraceLine status is pending/running/complete/error (default complete). Pending mutes the title; error uses destructive; app-owned TraceIcon can use Spinner or any icon. Description is muted. Trace can nest inside content for child operations.

TraceCollapsible delegates open/defaultOpen/onOpenChange/disabled to existing Collapsible; Trigger/Content reuse its keyboard, focus and visibility behavior. Details indent=2, gap=1. Trace owns no execution state, timers or logging transport. Tweak observes trace parts and inherited Collapsible/CodeBlock parts. Defaults remain source-owned.
