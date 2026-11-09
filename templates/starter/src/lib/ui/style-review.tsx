import type { BoxRenderable } from '@opentui/core'
import {
  createContext,
  type PropsWithChildren,
  type RefObject,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
} from 'react'
import { useTheme } from './theme/use-theme'

export const layoutFields = [
  'paddingX',
  'paddingY',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'gap',
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
] as const
export const colorFields = [
  'backgroundColor',
  'fg',
  'bg',
  'textColor',
  'focusedTextColor',
  'focusedBackgroundColor',
  'placeholderColor',
  'cursorColor',
] as const
export type ReviewField =
  | (typeof layoutFields)[number]
  | (typeof colorFields)[number]
export type ReviewValue = number | string
export type ReviewStyle = Partial<Record<ReviewField, ReviewValue>>
export type PartObservation = {
  part: string
  kind: string
  defaults: ReviewStyle
  fields: ReviewField[]
}
export type ComponentReview = {
  parts: Record<string, ReviewStyle>
  notes: string
  reviewed: boolean
}
export type ReviewContextValue = {
  profile: ComponentReview
  observe: (instance: string, parts: PartObservation[]) => void
  forget: (instance: string) => void
  viewport?: RefObject<BoxRenderable | null>
  openPopups?: boolean
}
const Context = createContext<ReviewContextValue | null>(null)
export type ComponentStyleProfiles = Record<string, ComponentReview>
const SharedStyles = createContext<ComponentStyleProfiles | null>(null)
export function ComponentStylesProvider({
  children,
  profiles,
}: PropsWithChildren<{ profiles: ComponentStyleProfiles | null }>) {
  return <SharedStyles value={profiles}>{children}</SharedStyles>
}
export const styleOwner = (part: string) => part.split('/')[0] ?? ''
const buttonSurfaces = new Set([
  'menubar/MenubarTrigger',
  'code-block/CodeBlockCopyButton',
  'questionnaire/QuestionnairePrevious',
  'questionnaire/QuestionnaireNext',
  'questionnaire/QuestionnaireSkip',
  'questionnaire/QuestionnaireSubmit',
  'sidebar/SidebarTrigger',
  'sidebar/SidebarMenuButton',
  'sidebar/SidebarMenuSubButton',
  'sidebar/SidebarMenuAction',
  'sidebar/SidebarGroupAction',
  'breadcrumb/BreadcrumbLink',
  'toast/ToastAction',
  'toast/ToastClose',
  'input-group/InputGroupButton',
  'pagination/PaginationLink',
  'pagination/PaginationPrevious',
  'pagination/PaginationNext',
  'dialog/Trigger',
  'dialog/Close',
  'alert-dialog/Trigger',
  'alert-dialog/AlertDialogAction',
  'alert-dialog/AlertDialogCancel',
  'sheet/Trigger',
  'sheet/Close',
  'popover/Trigger',
  'popover/Close',
  'dropdown-menu/Trigger',
  'select/SelectTrigger',
  'tooltip/TooltipTrigger',
  'tabs/TabsTrigger',
  'collapsible/CollapsibleTrigger',
  'accordion/AccordionTrigger',
  'toggle/Toggle',
  'toggle-group/ToggleGroupItem',
])
export function isButtonSurface(part: string) {
  return (
    /^button\/Button\.(default|secondary|ghost|destructive|link)$/.test(part) ||
    buttonSurfaces.has(part)
  )
}
export function isButtonText(part: string) {
  return (
    (part.endsWith('.text') && isButtonSurface(part.slice(0, -5))) ||
    part === 'select/SelectValue'
  )
}
export function isButtonLayoutPart(part: string) {
  return isButtonSurface(part) || isButtonText(part)
}
const reusedParts: Record<string, string> = {
  'menubar/Content': 'dropdown-menu/Content',
  'menubar/MenubarContent': 'dropdown-menu/DropdownMenuContent',
  'menubar/MenubarItem': 'dropdown-menu/DropdownMenuItem',
  'menubar/MenubarCheckboxItem': 'dropdown-menu/DropdownMenuCheckboxItem',
  'menubar/MenubarRadioGroup': 'dropdown-menu/DropdownMenuRadioGroup',
  'menubar/MenubarRadioItem': 'dropdown-menu/DropdownMenuRadioItem',
  'menubar/MenubarLabel': 'dropdown-menu/DropdownMenuLabel',
  'menubar/MenubarGroup': 'dropdown-menu/DropdownMenuGroup',
  'context-menu/Content': 'dropdown-menu/Content',
  'context-menu/ContextMenuContent': 'dropdown-menu/DropdownMenuContent',
  'context-menu/ContextMenuItem': 'dropdown-menu/DropdownMenuItem',
  'context-menu/ContextMenuCheckboxItem':
    'dropdown-menu/DropdownMenuCheckboxItem',
  'context-menu/ContextMenuRadioGroup': 'dropdown-menu/DropdownMenuRadioGroup',
  'context-menu/ContextMenuRadioItem': 'dropdown-menu/DropdownMenuRadioItem',
  'context-menu/ContextMenuLabel': 'dropdown-menu/DropdownMenuLabel',
  'context-menu/ContextMenuGroup': 'dropdown-menu/DropdownMenuGroup',
  'field/FieldLabel': 'label/Label',
  'button-group/ButtonGroupSeparator': 'separator/Separator',
  'item/ItemSeparator': 'separator/Separator',
}
export function sharedStyleTarget(part: string, field: ReviewField) {
  const reused = reusedParts[part]
  if (reused) return { owner: styleOwner(reused), part: reused }
  return isButtonLayoutPart(part) &&
    (layoutFields as readonly string[]).includes(field)
    ? {
        owner: 'button',
        part: isButtonText(part)
          ? 'button/Button.default.text'
          : 'button/Button.default',
      }
    : { owner: styleOwner(part), part }
}
function buttonLayout(
  profiles: ComponentStyleProfiles,
  part: string,
): ReviewStyle {
  const text = isButtonText(part)
  const style =
    profiles.button?.parts[
      text ? 'button/Button.default.text' : 'button/Button.default'
    ] ?? {}
  // No implicit geometry: a preview inherits real component defaults unless edited.
  const layout: ReviewStyle = {}
  for (const key of layoutFields)
    if (style[key] !== undefined) layout[key] = style[key]
  return layout
}
export function resolvePartStyle(
  profiles: ComponentStyleProfiles | null,
  part: string,
  local?: ComponentReview,
): ReviewStyle {
  const own = profiles?.[styleOwner(part)]?.parts[part] ?? {}
  const override = { ...local?.parts[part] }
  if (profiles && isButtonLayoutPart(part)) {
    // Button variants share geometry; visual variant colors stay independent.
    if (styleOwner(part) === 'button' && local === profiles.button)
      for (const field of layoutFields) delete override[field]
    return { ...own, ...buttonLayout(profiles, part), ...override }
  }
  const reused = reusedParts[part]
  const inherited = reused
    ? profiles?.[styleOwner(reused)]?.parts[reused]
    : undefined
  return { ...inherited, ...own, ...override }
}
export const useStyleReview = () => useContext(Context)
export function StyleReviewProvider({
  children,
  value,
}: PropsWithChildren<{ value: ReviewContextValue }>) {
  return <Context value={value}>{children}</Context>
}

function defaultsFor(
  props: Record<string, unknown>,
  kind: string,
  foreground: string,
): ReviewStyle {
  const defaults: ReviewStyle = {}
  for (const key of layoutFields) {
    const axis = key.startsWith('padding')
      ? 'padding'
      : key.startsWith('margin')
        ? 'margin'
        : null
    const horizontal = ['Left', 'Right'].some((side) => key.endsWith(side))
    const vertical = ['Top', 'Bottom'].some((side) => key.endsWith(side))
    const inherited = axis
      ? (props[`${axis}${horizontal ? 'X' : vertical ? 'Y' : ''}`] ??
        props[axis])
      : undefined
    const value =
      props[key] ??
      inherited ??
      (/^(min|max)?(Width|Height)$/.test(key) ||
      key === 'width' ||
      key === 'height'
        ? 'auto'
        : 0)
    if (typeof value === 'string' || typeof value === 'number')
      defaults[key] = value
  }
  for (const key of colorFields) {
    const value = props[key]
    if (typeof value === 'string') defaults[key] = value
  }
  if (kind === 'text' && defaults.fg === undefined) defaults.fg = foreground
  if (kind === 'box' && defaults.backgroundColor === undefined)
    defaults.backgroundColor = '#00000000'
  return defaults
}

/** An opt-in review adapter. Without a provider, native props are left untouched. */
export function useComponentStyles(source: string) {
  const context = useContext(Context),
    shared = useContext(SharedStyles),
    theme = useTheme(),
    instance = useId()
  const observed = useRef<PartObservation[]>([]),
    touched = useRef(new Map<string, Set<ReviewField>>())
  observed.current = []
  const observe = context?.observe,
    forget = context?.forget
  useLayoutEffect(() => {
    observe?.(instance, observed.current)
  })
  useLayoutEffect(() => () => forget?.(instance), [forget, instance])
  return (name: string, props: Record<string, unknown>, kind = 'box') => {
    if (!context && !shared) return {}
    const part = `${source}/${name}`,
      defaults = defaultsFor(props, kind, theme.foreground)
    const colors: ReviewField[] =
      kind === 'text'
        ? ['fg', 'bg']
        : kind === 'input' || kind === 'textarea'
          ? [
              'backgroundColor',
              'textColor',
              'focusedTextColor',
              'focusedBackgroundColor',
              'placeholderColor',
              'cursorColor',
            ]
          : ['backgroundColor']
    const fields: ReviewField[] =
      kind === 'text'
        ? ['marginLeft', 'marginRight', 'marginTop', 'marginBottom', ...colors]
        : [...layoutFields, ...colors]
    if (context) observed.current.push({ part, kind, defaults, fields })
    const overrides = resolvePartStyle(shared, part, context?.profile)
    const effectiveDefaults = defaultsFor(
      { ...props, ...overrides },
      kind,
      theme.foreground,
    )
    let keys = touched.current.get(part)
    if (!keys) {
      keys = new Set()
      touched.current.set(part, keys)
    }
    for (const key of fields) if (overrides[key] !== undefined) keys.add(key)
    const result: Record<string, string | number> = {}
    for (const key of keys) {
      const value = overrides[key] ?? effectiveDefaults[key] ?? '#00000000'
      result[key] =
        typeof value === 'string' && value.startsWith('@')
          ? (theme[value.slice(1) as keyof typeof theme] ?? value)
          : value
    }
    // Preserve the one-line content when experimenting with vertical control padding.
    const baseTop = Number(props.paddingTop ?? props.paddingY ?? 0)
    const baseBottom = Number(props.paddingBottom ?? props.paddingY ?? 0)
    const singleLine =
      props.height === 1 ||
      (typeof props.height === 'number' &&
        props.height - baseTop - baseBottom === 1)
    if (
      singleLine &&
      overrides.height === undefined &&
      (overrides.paddingY !== undefined ||
        overrides.paddingTop !== undefined ||
        overrides.paddingBottom !== undefined)
    ) {
      const top = Number(
        overrides.paddingTop ?? overrides.paddingY ?? defaults.paddingTop ?? 0,
      )
      const bottom = Number(
        overrides.paddingBottom ??
          overrides.paddingY ??
          defaults.paddingBottom ??
          0,
      )
      result.height = 1 + top + bottom
      keys.add('height')
    }
    return result
  }
}
