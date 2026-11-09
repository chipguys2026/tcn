# Message Scroller

[Source](../../src/components/ui/message-scroller.tsx) · [Defaults](../../src/components/ui/message-scroller.styles.ts) · Gallery: `/gallery/message-scroller`

```tsx
<MessageScrollerProvider>
  <MessageScroller height={12}>
    <MessageScrollerViewport>
      <MessageScrollerContent>
        {messages.map(message => (
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

Import from `@/components/ui/message-scroller`. Provider owns one viewport and its ID registry; Item IDs must be unique within it and stable across prepend/update operations. Content owns message gap=1. Root width=100%, height=12 (or auto), minHeight=3. Viewport is a real native vertical scrollbox, focusable via Tab, using the existing focus ring. Native wheel/scrollbar/PageUp/PageDown/Home/End controls remain available.

New content follows only when already at the bottom (one-cell tolerance). Scrolling up pauses following. Prepending history preserves the first visible message and its offset. Streaming updates and resizing are measured against real native layout. Jump to latest resumes following. Button reserves a one-row slot, showing a regular Button only away from the bottom, so appearing/disappearing does not resize the viewport.

`useMessageScroller()` exposes atBottom, scrollToBottom(), scrollToMessage(id):boolean. Jumping to a message pauses following; unknown IDs return false. The application owns data fetching, loading indicators and message rendering. All mounted messages are measured; this component does not virtualize history. Tweak edits layout; JSON is never loaded for production styling.
