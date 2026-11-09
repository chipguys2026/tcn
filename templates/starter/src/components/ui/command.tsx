import type { BoxRenderable, Renderable } from '@opentui/core'
import { useKeyboard, useRenderer } from '@opentui/react'
import {
  Children,
  isValidElement,
  type PropsWithChildren,
  type RefObject,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createStrictContext } from '@/lib/ui/create-context'
import type { FloatingRootProps } from '@/lib/ui/floating'
import { revealFocusedNode } from '@/lib/ui/focus/focus-scope'
import { Pressable, type PressableHandle } from '@/lib/ui/pressable'
import { useComponentStyles } from '@/lib/ui/style-review'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { useControllable } from '@/lib/ui/use-controllable'
import { commandDefaults } from './command.styles'
import { Dialog, DialogContent } from './dialog'
import { Input, type InputHandle } from './input'
import { Kbd } from './kbd'

type Entry = {
  value: string
  label: string
  keywords: readonly string[]
  disabled: boolean
  select?: (value: string) => void
  ref: RefObject<PressableHandle | null>
}
const matches = (
  entry: Pick<Entry, 'value' | 'label' | 'keywords'>,
  query: string,
) =>
  query
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .every((word) =>
      `${entry.label} ${entry.value} ${entry.keywords.join(' ')}`
        .toLocaleLowerCase()
        .includes(word),
    )
const [Context, useCommand] = createStrictContext<{
  query: string
  setQuery: (query: string) => void
  active: string
  setActive: (value: string) => void
  register: (entry: Entry) => () => void
  count: number
  shouldFilter: boolean
  input: RefObject<InputHandle | null>
}>('Command child')
export function Command({
  children,
  value,
  defaultValue = '',
  onValueChange,
  shouldFilter = true,
  loop = true,
}: PropsWithChildren<{
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  shouldFilter?: boolean
  loop?: boolean
}>) {
  const componentStyle = useComponentStyles('command')

  const [active, setActive] = useControllable(
      value,
      defaultValue,
      onValueChange,
    ),
    [query, setQuery] = useState(''),
    [, refresh] = useState(0)
  const entries = useRef(new Map<string, Entry>()),
    root = useRef<BoxRenderable>(null),
    input = useRef<InputHandle>(null),
    renderer = useRenderer()
  const register = useCallback((entry: Entry) => {
    entries.current.set(entry.value, entry)
    refresh((n) => n + 1)
    return () => {
      entries.current.delete(entry.value)
      refresh((n) => n + 1)
    }
  }, [])
  const available = [...entries.current.values()].filter(
    (entry) => !entry.disabled && (!shouldFilter || matches(entry, query)),
  )
  useLayoutEffect(() => {
    if (!available.some((entry) => entry.value === active) && available[0])
      setActive(available[0].value)
  }, [available, active, setActive])
  useKeyboard((key) => {
    if (
      key.defaultPrevented ||
      key.ctrl ||
      key.meta ||
      key.option ||
      !['up', 'down', 'return'].includes(key.name)
    )
      return
    let focused: Renderable | null | undefined =
      renderer.currentFocusedRenderable
    while (focused && focused !== root.current) focused = focused.parent
    if (!focused) return
    const index = available.findIndex((entry) => entry.value === active)
    if (key.name === 'return') {
      if (available[index]) {
        key.preventDefault()
        key.stopPropagation()
        available[index]?.select?.(active)
      }
      return
    }
    if (!available.length) return
    key.preventDefault()
    key.stopPropagation()
    const raw = index + (key.name === 'up' ? -1 : 1),
      next = loop
        ? (raw + available.length) % available.length
        : Math.max(0, Math.min(raw, available.length - 1))
    const item = available[next]
    if (item) {
      setActive(item.value)
      const node = item.ref.current?.getNode()
      if (node) revealFocusedNode(node)
    }
  })
  return (
    <Context
      value={{
        query,
        setQuery,
        active,
        setActive,
        register,
        count: [...entries.current.values()].filter(
          (entry) => !shouldFilter || matches(entry, query),
        ).length,
        shouldFilter,
        input,
      }}
    >
      <box
        ref={root}
        width="100%"
        flexDirection="column"
        gap={1}
        {...componentStyle('Command', { width: '100%', gap: 1 }, 'box')}
      >
        {children}
      </box>
    </Context>
  )
}
export function CommandInput({
  placeholder = 'Type a command...',
  autoFocus = true,
  value,
  onValueChange,
}: {
  placeholder?: string
  autoFocus?: boolean
  value?: string
  onValueChange?: (value: string) => void
}) {
  const state = useCommand()
  useLayoutEffect(() => {
    if (value !== undefined && value !== state.query) state.setQuery(value)
  }, [value, state.query, state.setQuery])
  return (
    <Input
      ref={state.input}
      label="Search commands"
      placeholder={placeholder}
      autoFocus={autoFocus}
      value={value ?? state.query}
      onValueChange={(next) => {
        if (value === undefined) state.setQuery(next)
        onValueChange?.(next)
      }}
    />
  )
}
export function CommandList({
  children,
  height = 8,
}: PropsWithChildren<{ height?: number }>) {
  const componentStyle = useComponentStyles('command')

  return (
    <scrollbox
      {...commandDefaults.list}
      height={height}
      maxHeight={height}
      minHeight={0}
      scrollY
      scrollX={false}
      focusable={false}
      viewportCulling={false}
      {...componentStyle(
        'CommandList',
        { height: height, ...commandDefaults.list },
        'scrollbox',
      )}
    >
      <box
        flexDirection="column"
        gap={1}
        {...componentStyle('CommandList.box', { gap: 1 }, 'box')}
      >
        {children}
      </box>
    </scrollbox>
  )
}
export function CommandEmpty({
  children = 'No results found.',
}: {
  children?: string
}) {
  const componentStyle = useComponentStyles('command')

  const state = useCommand()
  const theme = useTheme()
  return state.count ? null : (
    <text
      fg={theme.mutedForeground}
      {...componentStyle('CommandEmpty', { fg: theme.mutedForeground }, 'text')}
    >
      {children}
    </text>
  )
}
export function CommandItem({
  children,
  value = children,
  keywords = [],
  disabled = false,
  onSelect,
}: {
  children: string
  value?: string
  keywords?: readonly string[]
  disabled?: boolean
  onSelect?: (value: string) => void
}) {
  const state = useCommand(),
    ref = useRef<PressableHandle>(null)
  const register = state.register
  const keywordsKey = keywords.join('\u0000')
  useLayoutEffect(
    () =>
      register({
        value,
        label: children,
        keywords: keywordsKey.split('\u0000'),
        disabled,
        select: onSelect,
        ref,
      }),
    [register, value, children, keywordsKey, disabled, onSelect],
  )
  if (
    state.shouldFilter &&
    !matches({ value, label: children, keywords }, state.query)
  )
    return null
  return (
    <Pressable
      styleSource="command"
      stylePart="CommandItem"
      {...commandDefaults.item}
      ref={ref}
      label={children}
      disabled={disabled}
      tabStop={false}
      ring={false}
      selected={state.active === value}
      onFocus={() => state.setActive(value)}
      onHoverChange={(hovered) => {
        if (hovered) state.setActive(value)
      }}
      onPress={() => {
        state.setActive(value)
        state.input.current?.focus()
        onSelect?.(value)
      }}
    >
      {children}
    </Pressable>
  )
}
function hasMatch(children: React.ReactNode, query: string): boolean {
  return Children.toArray(children).some((child) => {
    if (
      !isValidElement<{
        children?: React.ReactNode
        value?: string
        keywords?: string[]
      }>(child)
    )
      return false
    if (child.type === CommandItem) {
      const label =
        typeof child.props.children === 'string' ? child.props.children : ''
      return matches(
        {
          value: child.props.value ?? label,
          label,
          keywords: child.props.keywords ?? [],
        },
        query,
      )
    }
    return hasMatch(child.props.children, query)
  })
}
export function CommandGroup({
  children,
  heading,
}: PropsWithChildren<{ heading?: string }>) {
  const componentStyle = useComponentStyles('command')

  const theme = useTheme()
  const state = useCommand()
  return (
    <box
      flexDirection="column"
      gap={1}
      {...componentStyle('CommandGroup', { gap: 1 }, 'box')}
    >
      {heading && (!state.shouldFilter || hasMatch(children, state.query)) && (
        <text
          fg={theme.mutedForeground}
          {...componentStyle(
            'CommandGroup.text',
            { fg: theme.mutedForeground },
            'text',
          )}
        >
          {heading}
        </text>
      )}
      {children}
    </box>
  )
}
export function CommandShortcut({ children }: { children: string }) {
  return <Kbd>{children}</Kbd>
}
export function CommandDialog({ children, ...props }: FloatingRootProps) {
  return (
    <Dialog {...props}>
      <DialogContent width={50} height={18}>
        <Command>{children}</Command>
      </DialogContent>
    </Dialog>
  )
}
export { Separator as CommandSeparator } from './separator'
