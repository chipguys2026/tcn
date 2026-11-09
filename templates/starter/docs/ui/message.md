# Message

Compose a conversation entry with an avatar, content and action footer.

[Source](../../src/components/ui/message.tsx) · [Defaults](../../src/components/ui/message.styles.ts) · Gallery: `/gallery/message`

## Usage

```tsx
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from '@/components/ui/message'
import { Button } from '@/components/ui/button'

<MessageGroup>
  <Message align="start">
    <MessageAvatar>
      <text>AI</text>
    </MessageAvatar>
    <MessageContent>
      <MessageHeader>
        <text>Assistant</text>
      </MessageHeader>
      <text>Your workspace is ready.</text>
      <MessageFooter>
        <Button variant="ghost" onPress={copyMessage}>
          Copy
        </Button>
      </MessageFooter>
    </MessageContent>
  </Message>
</MessageGroup>
```

Supply `copyMessage` from your application.

## API and layout

| Part | Purpose |
| --- | --- |
| `MessageGroup` | Stack related messages. |
| `Message` | `align="start"` or `"end"` selects avatar side and content alignment. |
| `MessageAvatar` | Nonshrinking slot for text or an icon. |
| `MessageContent` | Arbitrary children; maximum width 85%, with shrinking on narrow terminals. |
| `MessageHeader`, `MessageFooter` | Wrapping rows for metadata and actions. |

Group, row and content gaps default to one. The avatar aligns with the bottom of the content before the footer, including when footer actions wrap.

The application owns conversation data, roles and content formatting. Compose Code Block or Trace inside the content and use [Message Scroller](message-scroller.md) for history and following new messages.
