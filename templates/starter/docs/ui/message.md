# Message

[Source](../../src/components/ui/message.tsx) · [Defaults](../../src/components/ui/message.styles.ts) · Gallery: `/gallery/message`

```tsx
<MessageGroup>
  <Message align="start">
    <MessageAvatar><text>AI</text></MessageAvatar>
    <MessageContent>
      <MessageHeader><text>Assistant</text></MessageHeader>
      <text>Your workspace is ready.</text>
      <MessageFooter><Button variant="ghost">Copy</Button></MessageFooter>
    </MessageContent>
  </Message>
</MessageGroup>
```

Import parts from `@/components/ui/message`. Message align=start/end changes avatar side and content alignment. Content accepts arbitrary children, including CodeBlock and Trace; its maxWidth is 85% and it can shrink in narrow terminals. MessageAvatar is a nonshrinking slot for app-owned text/icons. Header/Footer are wrapping rows. Avatar aligns with the bottom of the content before Footer; the offset follows real native layout, including a wrapped footer. Group, row and content gaps default to 1.

These parts own layout only. They do not infer roles, format Markdown, store conversations or add another Avatar/Bubble family. Use MessageScroller for history/following and regular Button for actions. Tweak observes each real composition part; defaults remain source-owned.
