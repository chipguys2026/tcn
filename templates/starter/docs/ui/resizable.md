# Resizable

Panel composition inspired by [shadcn Resizable](https://ui.shadcn.com/docs/components/base/resizable), with native pointer/keyboard dividers.

[Source](../../src/components/ui/resizable.tsx) · [Defaults](../../src/components/ui/resizable.styles.ts) · Gallery: `/gallery/resizable`

```tsx
<ResizablePanelGroup orientation="horizontal" height={12}>
  <ResizablePanel defaultSize={30} minSize={15} maxSize={60}>
    <text>Navigation</text>
  </ResizablePanel>
  <ResizableHandle withHandle label="Resize navigation" />
  <ResizablePanel minSize={20}><text>Workspace</text></ResizablePanel>
</ResizablePanelGroup>
```

Import ResizablePanelGroup, ResizablePanel and ResizableHandle from `@/components/ui/resizable`.

| Component | Contract |
| --- | --- |
| ResizablePanelGroup | orientation horizontal/vertical; width=100%; height=10 (cells or percentage); disabled=false |
| Controlled layout | `layout: number[]`, `onLayoutChange`; or initial `defaultLayout` |
| ResizablePanel | Children; optional id/defaultSize/minSize/maxSize |
| ResizableHandle | Optional id/label; disabled=false, autoFocus=false, withHandle=false |

Sizes and layout arrays are **percentages of available panel space**, excluding the native handle cells and group gaps. They are not pixels/cells. Unspecified default sizes share the remaining percentage. Native flex weights allocate the actual remaining cells; rounding does not create extra track cells beyond the group. Panel min/max default to 0/100. Pure projection in `lib/ui/panel-layout.ts` normalizes invalid weights, preserves a total of 100 and honors feasible bounds. Impossible minimums scale down; impossible maximums expand to make a feasible total.

Children must directly alternate Panel, Handle, Panel. A single panel is valid; opaque wrappers/fragments or misplaced handles throw a descriptive error. Nest another complete PanelGroup inside a panel for nested splits. Each group has isolated state. Panels clip their overflow and zero-percent panels are hidden; put a ScrollArea inside a panel for scrolling.

Focus a divider with Tab. Left/Right resize horizontal groups by one cell; Up/Down resize vertical groups. Shift changes ten cells. Home/End reach the permitted adjacent-panel limits. Dragging snapshots the initial pointer/percentage and uses the real available cell extent. Only the adjacent pair changes; its total is preserved. Controlled owners can reject proposals. Disabled handles cannot focus or resize. Focus and rings use existing primitives.

Tweak edits PanelGroup, Panel and Handle parts; withHandle adds a centered Nerd Font bidirectional arrow: left/right for horizontal resizing, up/down for vertical resizing. Without withHandle, the divider is a plain line. The handle still occupies one cell across its resizing axis. There is no component frame, browser library dependency, persistent saved layout, auto-collapse, imperative panel ref or pixel-size syntax. Source defaults never load Tweak JSON at runtime. See [styling](../styling.md).
