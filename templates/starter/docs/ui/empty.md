# empty

An empty-state composition with optional media and actions.

[Source](../../src/components/ui/empty.tsx) · Gallery: `/gallery/empty` · [Styling status](../styling.md)

## Usage

```tsx
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '@/components/ui/empty'
import { Button } from '@/components/ui/button'

<Empty><EmptyHeader><EmptyTitle>No projects</EmptyTitle><EmptyDescription>Create a project to get started.</EmptyDescription></EmptyHeader><EmptyContent><Button>Create</Button></EmptyContent></Empty>
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, `EmptyContent`.

| Component | Props contract |
| --- | --- |
| Empty | `PropsWithChildren` |
| EmptyHeader | `PropsWithChildren` |
| EmptyMedia | `{ icon: IconName }` |
| EmptyTitle | `{ children: string }` |
| EmptyDescription | `{ children: string }` |
| EmptyContent | `PropsWithChildren` |

## State and interaction

Only child controls participate in focus/activation.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Promoted defaults are defined in [empty.styles.ts](../../src/components/ui/empty.styles.ts) and consumed by the real component and its observations. No Tweak JSON is loaded here.

Header/media/title/description/content are independently composed parts with semantic text colors.

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses theme and accepts real child controls.

## TUI boundaries

Does not fetch data or decide whether a collection is empty.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
