# Toast

Show temporary notifications with optional descriptions and actions.

[Source](../../src/components/ui/toast.tsx) · [Defaults](../../src/lib/ui/styles.ts) · Gallery: `/gallery/toast`

## Usage

```tsx
import { ToastProvider, Toaster, useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'

function SaveButton() {
  const { toast } = useToast()
  return (
    <Button
      onPress={() =>
        toast({
          title: 'Project saved',
          description: 'Changes are ready.',
          action: { label: 'Undo', onPress: undo },
        })
      }
    >
      Save
    </Button>
  )
}

<ToastProvider>
  <SaveButton />
  <Toaster />
</ToastProvider>
```

## API and behavior

Mount one Toaster per provider. State is local to the provider; unrelated applications/tests do not share a singleton queue.

| API | Contract |
| --- | --- |
| ToastProvider | Children; limit=3 queued entries, newest first |
| useToast().toast | Accepts title, optional description/variant/duration/action; returns numeric ID |
| useToast().update | `(id, partialOptions)` updates an existing entry |
| useToast().dismiss | Optional ID; no ID dismisses all entries |
| Toaster | Maps queued entries to real Toast parts in ToastViewport |
| ToastViewport | Children; width=38, bounded to terminal or Tweak region, bottom-right, gap one |
| Toast | Children; open/defaultOpen/onOpenChange; duration=5000ms; variant=default or destructive |
| ToastTitle | String children; bold, one row, truncated |
| ToastDescription | String children; wraps, capped at two rows |
| ToastIcon | No props; Nerd Font info icon for default, error icon for destructive |
| ToastContent | Children; growing text column with zero gap between title and description |
| ToastAction | Button props; runs onPress then requests close |
| ToastClose | Optional label; icon-only ghost Button with horizontal padding inherited from Button |

## Appearance and layout

Toast keeps one cell/row padding and defaults to zero gap. Toaster places a status icon beside a title/description column, with a secondary Button action at the right. The icon and action align to the title row; the description follows immediately on the next row. Media/text stay together when an action wraps onto a right-aligned row below them. The close Button sits in the upper-right padding corner and consumes no space in the content row.

The surface is neutral for both variants, using the popover token (secondary when popover equals the application background). Destructive uses the error icon and destructive title/icon color; descriptions remain muted. There is no frame border, backdrop, rounded geometry or animation. Toasts stack in an expanded list, with the newest visible toast nearest the bottom edge. The provider's queue remains newest-first.

## Timing and focus

Timers use the renderer clock and clean up on unmount. Duration zero persists until dismissed. Hovering a toast or focusing its action/close pauses the remaining duration; leaving resumes it. Updating unchanged duration does not restart the clock. Controlled Toast owners may reject close requests.

Mounting a notification does not auto-focus or trap focus. Actions and close buttons reuse Button and normal focus coordination. Closing an actively focused toast attempts to return to the previously focused control if its focus scope still permits it; expiry while working elsewhere leaves current focus unchanged. Viewport z-index is below the existing popup/modal layer.

## Small terminals

Toaster limits visible entries to fit a seven-row notification budget (including a wrapped action). A normal two-line toast with an inline action takes four rows including padding. Waiting entries begin their timer when rendered. On short terminals it omits description/action when needed to preserve title and close; extremely small regions omit the visual until space is available. Overflow stays clipped to the viewport. Keep custom dimensions within the viewport budget to avoid clipping.

Create notifications through `useToast()` inside the provider. Wrap asynchronous operations in application code and call `toast`, `update` or `dismiss` as they progress. See [styling](../styling.md) for appearance changes.
