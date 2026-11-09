import {
  type ComponentProps,
  createContext,
  type PropsWithChildren,
  useContext,
} from 'react'
import { PartBox, PartText } from '@/lib/ui/parts'
import { fieldDefaults } from './field.styles'
import { Label } from './label'
import { Separator } from './separator'

const FieldState = createContext({ disabled: false, invalid: false })
export function Field({
  children,
  orientation = 'vertical',
  disabled = false,
  invalid = false,
}: PropsWithChildren<{
  orientation?: 'vertical' | 'horizontal'
  disabled?: boolean
  invalid?: boolean
}>) {
  return (
    <FieldState value={{ disabled, invalid }}>
      <PartBox
        source="field"
        part="Field"
        width="100%"
        flexDirection={orientation === 'horizontal' ? 'row' : 'column'}
        gap={fieldDefaults.gap}
        paddingX={fieldDefaults.paddingX}
        paddingY={fieldDefaults.paddingY}
      >
        {children}
      </PartBox>
    </FieldState>
  )
}
export function FieldGroup({ children }: PropsWithChildren) {
  return (
    <PartBox
      source="field"
      part="FieldGroup"
      width="100%"
      gap={fieldDefaults.groupGap}
    >
      {children}
    </PartBox>
  )
}
export function FieldSet({ children }: PropsWithChildren) {
  return (
    <PartBox
      source="field"
      part="FieldSet"
      width="100%"
      gap={fieldDefaults.groupGap}
    >
      {children}
    </PartBox>
  )
}
export function FieldLegend({ children }: { children: string }) {
  return (
    <PartText source="field" part="FieldLegend" bold>
      {children}
    </PartText>
  )
}
export function FieldContent({ children }: PropsWithChildren) {
  return (
    <PartBox
      source="field"
      part="FieldContent"
      flexGrow={1}
      gap={fieldDefaults.gap}
    >
      {children}
    </PartBox>
  )
}
export function FieldLabel(props: ComponentProps<typeof Label>) {
  const { disabled, invalid } = useContext(FieldState)
  return (
    <Label
      disabled={disabled}
      invalid={invalid}
      {...props}
      styleSource="field"
      stylePart="FieldLabel"
    />
  )
}
export function FieldTitle({ children }: { children: string }) {
  return (
    <PartText source="field" part="FieldTitle" bold>
      {children}
    </PartText>
  )
}
export function FieldDescription({ children }: { children: string }) {
  return (
    <PartText source="field" part="FieldDescription" tone="mutedForeground">
      {children}
    </PartText>
  )
}
export function FieldError({
  children,
  errors = [],
}: {
  children?: string
  errors?: ({ message?: string } | undefined)[]
}) {
  const messages = children
    ? [children]
    : [
        ...new Set(
          errors.flatMap((error) => (error?.message ? [error.message] : [])),
        ),
      ]
  if (!messages.length) return null
  return (
    <PartText source="field" part="FieldError" tone="destructive">
      {messages.join('\n')}
    </PartText>
  )
}
export function FieldSeparator({ children }: { children?: string }) {
  return (
    <PartBox
      source="field"
      part="FieldSeparator"
      width="100%"
      flexDirection="row"
      gap={fieldDefaults.gap}
      alignItems="center"
    >
      <box flexGrow={1}>
        <Separator />
      </box>
      {children && (
        <PartText
          source="field"
          part="FieldSeparator.text"
          tone="mutedForeground"
        >
          {children}
        </PartText>
      )}
      <box flexGrow={1}>
        <Separator />
      </box>
    </PartBox>
  )
}
