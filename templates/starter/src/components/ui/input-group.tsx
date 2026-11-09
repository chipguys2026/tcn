// biome-ignore-all lint/a11y/noStaticElementInteractions: Native group padding delegates clicks to its existing editor.
import {
  type BoxRenderable,
  InputRenderable,
  type Renderable,
  TextareaRenderable,
} from '@opentui/core'
import { useRenderer } from '@opentui/react'
import {
  Children,
  isValidElement,
  type PropsWithChildren,
  type ReactNode,
  useContext,
  useRef,
} from 'react'
import { EditorGroupContext } from '@/lib/ui/editor-group'
import { getFocusCoordinator } from '@/lib/ui/focus/coordinator'
import { createFocusRing } from '@/lib/ui/focus-ring'
import { PartBox, PartText } from '@/lib/ui/parts'
import { useComponentStyles } from '@/lib/ui/style-review'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { Button, type ButtonProps } from './button'
import { Input, type InputProps } from './input'
import { inputGroupDefaults } from './input-group.styles'
import { Textarea, type TextareaProps } from './textarea'

type AddonAlign = 'inline-start' | 'inline-end' | 'block-start' | 'block-end'
export function InputGroup({
  children,
  id,
  width = '100%',
  disabled = false,
  invalid = false,
}: PropsWithChildren<{
  width?: number | `${number}%`
  id?: string
  disabled?: boolean
  invalid?: boolean
}>) {
  const surface = useRef<BoxRenderable>(null),
    theme = useTheme(),
    styles = useComponentStyles('input-group')
  const renderer = useRenderer()
  function focusEditor() {
    const visit = (node: Renderable): Renderable | undefined => {
      if (!node.visible || node.isDestroyed) return
      if (
        (node instanceof InputRenderable ||
          node instanceof TextareaRenderable) &&
        node.focusable
      )
        return node
      for (const child of node.getChildren()) {
        const found = visit(child)
        if (found) return found
      }
    }
    const node = surface.current && visit(surface.current)
    const manager = getFocusCoordinator(renderer),
      owner = manager.owner(node ?? null)
    if (node && (!owner || manager.allowed(owner))) node.focus()
  }
  const defaults = {
    width,
    paddingX: inputGroupDefaults.paddingX,
    paddingY: inputGroupDefaults.paddingY,
    gap: inputGroupDefaults.gap,
    backgroundColor: theme.muted,
  }
  const appearance = { ...defaults, ...styles('InputGroup', defaults) }
  const slots: Record<AddonAlign | 'control', ReactNode[]> = {
    'inline-start': [],
    'inline-end': [],
    'block-start': [],
    'block-end': [],
    control: [],
  }
  for (const child of Children.toArray(children)) {
    if (
      isValidElement<{ align?: AddonAlign }>(child) &&
      child.type === InputGroupAddon
    )
      slots[child.props.align ?? 'inline-start'].push(child)
    else slots.control.push(child)
  }
  return (
    <EditorGroupContext
      value={{
        surface,
        background: String(appearance.backgroundColor),
        disabled,
        invalid,
      }}
    >
      <box
        id={id}
        ref={surface}
        minWidth={0}
        maxWidth="100%"
        flexDirection="column"
        overflow="visible"
        onMouseDown={(event) => {
          if (!disabled && event.button === 0 && !event.defaultPrevented)
            focusEditor()
        }}
        renderAfter={
          invalid && !disabled ? createFocusRing(theme.destructive) : undefined
        }
        {...appearance}
      >
        {slots['block-start']}
        <box
          width="100%"
          minWidth={0}
          flexDirection="row"
          flexWrap="wrap"
          alignItems="center"
          gap={Number(appearance.gap)}
        >
          {slots['inline-start']}
          {slots.control}
          {slots['inline-end']}
        </box>
        {slots['block-end']}
      </box>
    </EditorGroupContext>
  )
}
export function InputGroupAddon({
  children,
  align = 'inline-start',
}: PropsWithChildren<{ align?: AddonAlign }>) {
  return (
    <PartBox
      source="input-group"
      part="InputGroupAddon"
      width={align.startsWith('block') ? '100%' : undefined}
      flexDirection="row"
      flexShrink={0}
      flexWrap="wrap"
      paddingX={inputGroupDefaults.addonPaddingX}
      gap={inputGroupDefaults.addonGap}
    >
      {children}
    </PartBox>
  )
}
export function InputGroupText({ children }: { children: string }) {
  const group = useContext(EditorGroupContext)
  return (
    <PartText
      source="input-group"
      part="InputGroupText"
      tone="mutedForeground"
      opacity={group?.disabled ? 0.45 : 1}
    >
      {children}
    </PartText>
  )
}
export function InputGroupButton(props: ButtonProps) {
  const group = useContext(EditorGroupContext)
  return (
    <Button
      variant="ghost"
      {...props}
      disabled={props.disabled || group?.disabled}
      styleSource="input-group"
      stylePart="InputGroupButton"
    />
  )
}
export function InputGroupInput(props: InputProps) {
  return (
    <PartBox
      source="input-group"
      part="InputGroupInput"
      minWidth={3}
      flexGrow={1}
      flexShrink={1}
      flexBasis={0}
    >
      <Input {...props} />
    </PartBox>
  )
}
export function InputGroupTextarea(props: TextareaProps) {
  return (
    <PartBox
      source="input-group"
      part="InputGroupTextarea"
      minWidth={3}
      flexGrow={1}
      flexShrink={1}
      flexBasis={0}
    >
      <Textarea {...props} />
    </PartBox>
  )
}
