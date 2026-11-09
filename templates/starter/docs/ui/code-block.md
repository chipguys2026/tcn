# Code Block

[Source](../../src/components/ui/code-block.tsx) · [Defaults](../../src/components/ui/code-block.styles.ts) · Gallery: `/gallery/code-block`

```tsx
<CodeBlock>
  <CodeBlockHeader>
    <CodeBlockTitle>hello.ts</CodeBlockTitle>
    <CodeBlockActions><CodeBlockCopyButton value={source} /></CodeBlockActions>
  </CodeBlockHeader>
  <CodeBlockContent language="typescript" lineNumbers highlightedLines={[2]}>
    {source}
  </CodeBlockContent>
  <CodeBlockFooter><text>TypeScript</text></CodeBlockFooter>
</CodeBlock>
```

Import these parts from `@/components/ui/code-block`. Content accepts a string or custom children. Strings use OpenTUI's code/line-number renderers and theme-owned syntax styles; updated strings support streaming. `lineNumbers=false`, `startLine=1`, `wrap=false`, optional height, maxHeight=12. Highlighted line numbers are absolute, including startLine. Wrapping disables horizontal scrolling; long code otherwise scrolls both axes. Native scroll tracks handle pointer input.

CodeBlockLine renders custom/diff content: string children, variant default/added/removed, highlighted=false. Supply these inside Content for explicit diff lines. Header, Title, Actions and Footer are optional composition slots. CopyButton uses the existing Button and OSC 52 terminal clipboard; value is explicit. onCopy reports an accepted transfer, onCopyError reports unavailable clipboard transport; a terminal may still reject an accepted transfer. No browser clipboard API is used.

The root uses the muted surface, paddingX/Y=1 and gap=1. Tweak edits actual parts; defaults never load JSON at runtime. Syntax language availability follows the installed OpenTUI highlighter.

Content accepts optional id/label (default Code block). Tab focuses its native scrollbox; arrows/PageUp/PageDown/Home/End scroll it with the existing focus ring.
