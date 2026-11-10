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
| Tabs | Children; controlled `value` or initial `defaultValue`; `onValueChange`; `orientation="horizontal"` or `"vertical"`; `activationMode="automatic"` or `"manual"` |
| TabsList | `PropsWithChildren` |
| TabsTrigger | `PropsWithChildren<{ value: string; label?: string; disabled?: boolean }>` |
| TabsContent | `PropsWithChildren<{ value: string; forceMount?: boolean }>` |

## State and interaction

Use arrows, Home and End to navigate triggers. Automatic mode activates a tab when focus moves; manual mode waits for Enter or Space. Controls in hidden panels are skipped during navigation.

## Appearance

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

Arrange triggers horizontally or vertically. The active trigger is highlighted using theme colors.

Default values:

| Parameter | Default |
| --- | --- |
| Tabs.defaultValue | `''` |
| Tabs.orientation | `'horizontal'` |
| Tabs.activationMode | `'automatic'` |
| TabsTrigger.disabled | `false` |
| TabsTrigger.label | `value` |
| TabsContent.forceMount | `false` |

## Usage guidance

Match every trigger value to its panel value. Use Tabs to switch content within a screen; use the [router](../routing.md) to navigate between screens.
