# Code Block

Display syntax-highlighted code, numbered or diff lines, and an optional copy action.

[Source](../../src/components/ui/code-block.tsx) · [Defaults](../../src/lib/ui/styles.ts) · Gallery: `/gallery/code-block`

## Usage

```tsx
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from '@/components/ui/code-block'

const source = "const greeting = 'Hello'\nconsole.log(greeting)"

export function CodeExample() {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>hello.ts</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={source} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent
        language="typescript"
        lineNumbers
        highlightedLines={[2]}
      >
        {source}
      </CodeBlockContent>
    </CodeBlock>
  )
}
```

## API

| Part | Purpose |
| --- | --- |
| `CodeBlock` | Muted surface with one-cell padding and a gap of one. |
| `CodeBlockHeader`, `CodeBlockTitle`, `CodeBlockActions`, `CodeBlockFooter` | Optional composition slots. |
| `CodeBlockContent` | String or custom children; `lineNumbers=false`, `startLine=1`, `wrap=false`, optional `height`, `maxHeight=12`. |
| `CodeBlockLine` | Custom string line; `variant="default"`, `"added"` or `"removed"`; `highlighted=false`. |
| `CodeBlockCopyButton` | Explicit `value` to copy, plus `onCopy` and `onCopyError` callbacks. |

String content uses OpenTUI's syntax and line-number renderers. Available languages depend on the installed highlighter. Updating the string supports streaming content. Highlighted line numbers are absolute, including `startLine`.

For explicit diff lines, place `CodeBlockLine` children inside `CodeBlockContent`.

## Scrolling and copying

Content accepts `id` and `label` (default `"Code block"`). Tab focuses its native scrollbox; arrows, PageUp/PageDown and Home/End scroll it. Long code scrolls horizontally unless wrapping is enabled.

Copy uses the terminal's OSC 52 clipboard transport. `onCopy` reports an accepted transfer; `onCopyError` reports unavailable transport. The terminal may still reject a transfer after accepting it, depending on its clipboard settings.
