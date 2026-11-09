# tabs

A selection group that reveals one associated panel.

[Source](../../src/components/ui/tabs.tsx) · Gallery: `/gallery/tabs` · [Styling status](../styling.md)

## Usage

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

<Tabs defaultValue="overview"><TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="settings">Settings</TabsTrigger></TabsList><TabsContent value="overview"><text>Overview</text></TabsContent><TabsContent value="settings"><text>Settings</text></TabsContent></Tabs>
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`.

| Component | Props contract |
| --- | --- |
| Tabs | `PropsWithChildren<{ value?: string defaultValue?: string onValueChange?: (value: string) => void orientation?: State['orientation'] activationMode?: State['activationMode'] }>` |
| TabsList | `PropsWithChildren` |
| TabsTrigger | `PropsWithChildren<{ value: string; label?: string; disabled?: boolean }>` |
| TabsContent | `PropsWithChildren<{ value: string; forceMount?: boolean }>` |

## State and interaction

Arrows/Home/End navigate triggers. Automatic mode activates on movement; manual mode waits for Enter/Space. Hidden panel controls leave traversal.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Promoted defaults are defined in [tabs.styles.ts](../../src/components/ui/tabs.styles.ts) and consumed by the real component and its observations. No Tweak JSON is loaded here.

Horizontal or vertical trigger lists with semantic active state.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| Tabs.defaultValue | `''` |
| Tabs.orientation | `'horizontal'` |
| Tabs.activationMode | `'automatic'` |
| TabsTrigger.disabled | `false` |
| TabsTrigger.label | `value` |
| TabsContent.forceMount | `false` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

Uses RovingGroup and controlled string selection.

## TUI boundaries

Tabs are local component state, not application routes. Values must match their panel values.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
