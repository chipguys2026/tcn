import { createContext, type PropsWithChildren, useContext } from 'react'
import { PartBox, PartText } from '@/lib/ui/parts'
import { traceDefaults as d } from '@/lib/ui/styles'
import { useTheme } from '@/lib/ui/theme/use-theme'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible'

const Status = createContext<'pending' | 'running' | 'complete' | 'error'>(
  'complete',
)
export function Trace({ children }: PropsWithChildren) {
  return (
    <PartBox source="trace" part="Trace" width="100%" gap={d.gap}>
      {children}
    </PartBox>
  )
}
export function TraceLine({
  children,
  status = 'complete',
}: PropsWithChildren<{
  status?: 'pending' | 'running' | 'complete' | 'error'
}>) {
  return (
    <Status value={status}>
      <PartBox
        source="trace"
        part="TraceLine"
        width="100%"
        flexDirection="row"
        alignItems="flex-start"
        gap={d.gap}
      >
        {children}
      </PartBox>
    </Status>
  )
}
export function TraceIcon({ children }: PropsWithChildren) {
  return (
    <PartBox source="trace" part="TraceIcon" flexShrink={0}>
      {children}
    </PartBox>
  )
}
export function TraceTitle({ children }: { children: string }) {
  const status = useContext(Status),
    theme = useTheme()
  return (
    <PartText
      source="trace"
      part="TraceTitle"
      fg={
        status === 'error'
          ? theme.destructive
          : status === 'pending'
            ? theme.mutedForeground
            : theme.foreground
      }
      bold
    >
      {children}
    </PartText>
  )
}
export function TraceDescription({ children }: { children: string }) {
  return (
    <PartText source="trace" part="TraceDescription" tone="mutedForeground">
      {children}
    </PartText>
  )
}
export function TraceCollapsible(props: Parameters<typeof Collapsible>[0]) {
  return <Collapsible {...props} />
}
export function TraceCollapsibleTrigger(
  props: Parameters<typeof CollapsibleTrigger>[0],
) {
  return (
    <PartBox source="trace" part="TraceCollapsibleTrigger" width="100%">
      <CollapsibleTrigger {...props} />
    </PartBox>
  )
}
export function TraceCollapsibleContent(
  props: Parameters<typeof CollapsibleContent>[0],
) {
  return (
    <CollapsibleContent {...props}>
      <PartBox
        source="trace"
        part="TraceCollapsibleContent"
        width="100%"
        paddingLeft={d.indent}
        gap={d.gap}
      >
        {props.children}
      </PartBox>
    </CollapsibleContent>
  )
}
