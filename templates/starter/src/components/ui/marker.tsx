import type { PropsWithChildren } from 'react'
import { PartBox, PartText } from '@/lib/ui/parts'
import { markerDefaults as d } from '@/lib/ui/styles'
import { Separator } from './separator'
export function Marker({
  children,
  variant = 'default',
}: PropsWithChildren<{ variant?: 'default' | 'border' | 'separator' }>) {
  return (
    <PartBox
      source="marker"
      part="Marker"
      width="100%"
      gap={d.gap}
      paddingX={d.paddingX}
    >
      <box flexDirection="row" alignItems="center" gap={d.gap}>
        {variant === 'separator' && (
          <box flexGrow={1}>
            <Separator />
          </box>
        )}
        {children}
        {variant === 'separator' && (
          <box flexGrow={1}>
            <Separator />
          </box>
        )}
      </box>
      {variant === 'border' && <Separator />}
    </PartBox>
  )
}
export function MarkerIcon({ children }: PropsWithChildren) {
  return (
    <PartBox source="marker" part="MarkerIcon" flexShrink={0}>
      {children}
    </PartBox>
  )
}
export function MarkerContent({ children }: PropsWithChildren) {
  return typeof children === 'string' ? (
    <PartText source="marker" part="MarkerContent" tone="mutedForeground">
      {children}
    </PartText>
  ) : (
    <PartBox
      source="marker"
      part="MarkerContent"
      flexDirection="row"
      gap={d.gap}
    >
      {children}
    </PartBox>
  )
}
