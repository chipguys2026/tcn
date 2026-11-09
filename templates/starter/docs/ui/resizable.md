# Resizable

Split a screen into panels with keyboard-accessible, draggable dividers.

[Source](../../src/components/ui/resizable.tsx) · [Defaults](../../src/lib/ui/styles.ts) · Gallery: `/gallery/resizable`

## Usage

```tsx
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'

<ResizablePanelGroup orientation="horizontal" height={12}>
  <ResizablePanel defaultSize={30} minSize={15} maxSize={60}>
    <text>Navigation</text>
  </ResizablePanel>
  <ResizableHandle withHandle label="Resize navigation" />
  <ResizablePanel minSize={20}>
    <text>Workspace</text>
  </ResizablePanel>
</ResizablePanelGroup>
```

## API and behavior

| Component | Contract |
| --- | --- |
| ResizablePanelGroup | orientation horizontal/vertical; width=100%; height=10 (cells or percentage); disabled=false |
| Controlled layout | `layout: number[]`, `onLayoutChange`; or initial `defaultLayout` |
| ResizablePanel | Children; optional id/defaultSize/minSize/maxSize |
| ResizableHandle | Optional id/label; disabled=false, autoFocus=false, withHandle=false |

## Panel sizes

Sizes and layout arrays are **percentages of available panel space**, excluding the native handle cells and group gaps. They are not pixels/cells. Unspecified default sizes share the remaining percentage. Native flex weights allocate the actual remaining cells; rounding does not create extra track cells beyond the group. Panel min/max default to 0/100. Pure projection in `lib/ui/panel-layout.ts` normalizes invalid weights, preserves a total of 100 and honors feasible bounds. Impossible minimums scale down; impossible maximums expand to make a feasible total.

Children must directly alternate Panel, Handle, Panel. A single panel is valid; opaque wrappers/fragments or misplaced handles throw a descriptive error. Nest another complete PanelGroup inside a panel for nested splits. Each group has isolated state. Panels clip their overflow and zero-percent panels are hidden; put a ScrollArea inside a panel for scrolling.

## Interaction

Focus a divider with Tab. Left/Right resize horizontal groups by one cell; Up/Down resize vertical groups. Shift changes ten cells. Home/End reach the permitted adjacent-panel limits. Dragging snapshots the initial pointer/percentage and uses the real available cell extent. Only the adjacent pair changes; its total is preserved. Controlled owners can reject proposals. Disabled handles cannot focus or resize. Focus and rings use existing primitives.

Set `withHandle` to show a centered bidirectional arrow on a divider. Without it, the divider is a plain line. In either case the handle occupies one cell across its resizing axis.

Persist layout in your application through the controlled layout API. See [styling](../styling.md) for appearance changes.
