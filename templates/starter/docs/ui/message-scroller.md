# Message Scroller

Keep new messages in view while preserving the reader's position when browsing history.

[Source](../../src/components/ui/message-scroller.tsx) · [Defaults](../../src/components/ui/message-scroller.styles.ts) · Gallery: `/gallery/message-scroller`

## Usage

```tsx
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@/components/ui/message-scroller'

<MessageScrollerProvider>
  <MessageScroller height={12}>
    <MessageScrollerViewport>
      <MessageScrollerContent>
        {messages.map((message) => (
          <MessageScrollerItem key={message.id} id={message.id}>
            <text>{message.text}</text>
          </MessageScrollerItem>
        ))}
      </MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton />
  </MessageScroller>
</MessageScrollerProvider>
```

Supply `messages` from your application. Item IDs must be unique within the provider and stable when you prepend or update messages.

## Parts and defaults

| Part | Purpose |
| --- | --- |
| `MessageScrollerProvider` | Own one viewport and its message-ID registry. |
| `MessageScroller` | `width="100%"`, `height=12` or `"auto"`, `minHeight=3`. |
| `MessageScrollerViewport` | Focusable native vertical scrollbox. |
| `MessageScrollerContent` | Message layout with a gap of one. |
| `MessageScrollerItem` | Register a message by its required `id`. |
| `MessageScrollerButton` | One-row slot showing a jump-to-latest button when away from the bottom. |

## Following and history

New content follows when the viewport is already at the bottom, with one-cell tolerance. Scrolling up pauses following. Prepending history preserves the first visible message and its offset. Jumping to latest resumes following.

Tab focuses the viewport. Native wheel, scrollbars, PageUp/PageDown and Home/End remain available. Streaming updates and resizing use the current native layout.

## Programmatic navigation

Call `useMessageScroller()` inside the provider to access:

| Member | Behavior |
| --- | --- |
| `atBottom` | Whether the viewport is at the bottom. |
| `scrollToBottom()` | Jump to latest and resume following. |
| `scrollToMessage(id)` | Jump to a registered message and pause following; returns false for an unknown ID. |

The application owns fetching, loading indicators and message rendering. All mounted messages are measured; history is not virtualized.
