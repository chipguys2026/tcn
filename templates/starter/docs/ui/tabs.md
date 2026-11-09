# Tabs

A selection group that reveals one associated panel.

[Source](../../src/components/ui/tabs.tsx) · Gallery: `/gallery/tabs` · [Customization](../styling.md)

## Usage

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    <text>Overview</text>
  </TabsContent>
  <TabsContent value="settings">
    <text>Settings</text>
  </TabsContent>
</Tabs>
```

## API

Exports: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`.

| Component | Props contract |
| --- | --- |
| Tabs | `PropsWithChildren<{ value?: string defaultValue?: string onValueChange?: (value: string) => void orientation?: State['orientation'] activationMode?: State['activationMode'] }>` |
| TabsList | `PropsWithChildren` |
| TabsTrigger | `PropsWithChildren<{ value: string; label?: string; disabled?: boolean }>` |
| TabsContent | `PropsWithChildren<{ value: string; forceMount?: boolean }>` |

## State and interaction

Arrows/Home/End navigate triggers. Automatic mode activates on movement; manual mode waits for Enter/Space. Hidden panel controls leave traversal.

## Appearance

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

Horizontal or vertical trigger lists with semantic active state.

Defaults from the linked source:

| Parameter | Default |
| --- | --- |
| Tabs.defaultValue | `''` |
| Tabs.orientation | `'horizontal'` |
| Tabs.activationMode | `'automatic'` |
| TabsTrigger.disabled | `false` |
| TabsTrigger.label | `value` |
| TabsContent.forceMount | `false` |

## Reuse

Uses RovingGroup and controlled string selection.

## Notes

Tabs are local component state, not application routes. Values must match their panel values.
