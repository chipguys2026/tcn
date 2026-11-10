# Empty

An empty-state composition with optional media and actions.

[Source](../../src/components/ui/empty.tsx) · Gallery: `/gallery/empty` · [Customization](../styling.md)

## Usage

```tsx
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'

<Empty>
  <EmptyHeader>
    <EmptyTitle>No projects</EmptyTitle>
    <EmptyDescription>Create a project to get started.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>Create</Button>
  </EmptyContent>
</Empty>
```

## API

Empty Media accepts a built-in icon alias or a typed glyph from an installed Nerd Fonts set. See [icons](../icons.md).

Exports: `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, `EmptyContent`.

| Component | Props contract |
| --- | --- |
| Empty | `PropsWithChildren` |
| EmptyHeader | `PropsWithChildren` |
| EmptyMedia | `{ icon: IconValue }` |
| EmptyTitle | `{ children: string }` |
| EmptyDescription | `{ children: string }` |
| EmptyContent | `PropsWithChildren` |

## State and interaction

Buttons and other child controls participate in normal keyboard navigation. The empty-state container itself is skipped.

## Appearance

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

Compose the header, media, title, description and content independently. Text colors follow the active theme.

## Usage guidance

Render Empty after your application determines that there are no results. Compose its content with actions such as creating an item or clearing a filter.
