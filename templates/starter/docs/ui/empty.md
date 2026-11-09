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

## Appearance

Defaults are defined in [empty.styles.ts](../../src/components/ui/empty.styles.ts). Edit this local file to change appearance across your application.

Header/media/title/description/content are independently composed parts with semantic text colors.

## Reuse

Uses theme and accepts real child controls.

## Notes

Does not fetch data or decide whether a collection is empty.
