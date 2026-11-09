# Toast

Temporary notifications following [shadcn Base UI Toast](https://ui.shadcn.com/docs/components/base/toast), rendered by OpenTUI. The existing Toast provider/hook API is unchanged.

[Source](../../src/components/ui/toast.tsx) · [Defaults](../../src/components/ui/toast.styles.ts) · Gallery: `/gallery/toast`

```tsx
function SaveButton() {
  const { toast } = useToast()
  return <Button onPress={() => toast({
    title: 'Project saved',
    description: 'Changes are ready.',
    action: { label: 'Undo', onPress: undo },
  })}>Save</Button>
}

<ToastProvider>
  <SaveButton />
  <Toaster />
</ToastProvider>
```

Import all Toast parts and useToast from `@/components/ui/toast`. Mount one Toaster per provider. State is local to the provider; unrelated applications/tests do not share a singleton queue.

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

Toast keeps one cell/row padding and defaults to zero gap. Toaster places a status icon beside a title/description column, with a secondary Button action at the right. The icon and action align to the title row; the description follows immediately on the next row. Media/text stay together when an action wraps onto a right-aligned row below them. The close Button sits in the upper-right padding corner and consumes no space in the content row.

The surface is neutral for both variants, using the popover token (secondary when popover equals the application background). Destructive uses the error icon and destructive title/icon color; descriptions remain muted. There is no frame border, backdrop, rounded geometry or animation. Toasts stack in an expanded list, with the newest visible toast nearest the bottom edge. The provider's queue remains newest-first.

Tweak observes ToastBody (wrapping body), ToastHeader (icon/content leading group), ToastIcon, ToastContent and ToastActions in addition to the existing title/description/action/close/viewport parts. Body/header gaps are one cell; title/description content gap is zero. ToastBody/ToastHeader/ToastActions are internal observed layouts, not public exports.

Timers use the renderer clock and clean up on unmount. Duration zero persists until dismissed. Hovering a toast or focusing its action/close pauses the remaining duration; leaving resumes it. Updating unchanged duration does not restart the clock. Controlled Toast owners may reject close requests.

Mounting a notification does not auto-focus or trap focus. Actions and close buttons reuse Button and normal focus coordination. Closing an actively focused toast attempts to return to the previously focused control if its focus scope still permits it; expiry while working elsewhere leaves current focus unchanged. Viewport z-index is below the existing popup/modal layer.

Toaster limits visible entries to fit a seven-row notification budget (including a wrapped action). A normal two-line toast with an inline action takes four rows including padding. Waiting entries begin their timer when rendered. On short terminals it omits description/action when needed to preserve title and close; extremely small regions omit the visual until space is available. Overflow stays clipped to the viewport. Source defaults fit this budget; oversized Tweak proposals can still clip within the bounded preview.

Tweak renders a persistent full example for every part, including actions and viewport. Its proposals never configure application runtime. This port has no singleton toast.add API, promise helper, swipe dismissal or live-region accessibility announcement. See [styling](../styling.md).
