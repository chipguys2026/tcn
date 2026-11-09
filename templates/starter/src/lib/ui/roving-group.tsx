import type { KeyEvent } from '@opentui/core'
import {
  type PropsWithChildren,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createStrictContext } from './create-context'
import type { PressableHandle } from './pressable'

type Entry = { disabled: boolean; handle: PressableHandle; label: string }
type RovingValue = {
  active: string
  singleTabStop: boolean
  register: (value: string, entry: Entry) => () => void
  setActive: (value: string) => void
  onKey: (key: KeyEvent, value: string) => void
}
const [Context, useGroup] = createStrictContext<RovingValue>('Roving item')
export function RovingGroup({
  children,
  orientation = 'horizontal',
  value,
  onMove,
  singleTabStop = true,
}: PropsWithChildren<{
  orientation?: 'horizontal' | 'vertical'
  value?: string
  onMove?: (value: string) => void
  singleTabStop?: boolean
}>) {
  const entries = useRef(new Map<string, Entry>())
  const [active, setActive] = useState(value ?? '')
  const search = useRef({ text: '', time: 0 })
  const latest = useRef({ orientation, onMove })
  useLayoutEffect(() => {
    latest.current = { orientation, onMove }
    if (value !== undefined) setActive(value)
  }, [orientation, onMove, value])
  useLayoutEffect(() => {
    if (!entries.current.get(active) || entries.current.get(active)?.disabled) {
      const first =
        [...entries.current].find(([, entry]) => !entry.disabled)?.[0] ?? ''
      if (first !== active) setActive(first)
    }
  })
  const methods = useMemo(
    () => ({
      register(key: string, entry: Entry) {
        entries.current.set(key, entry)
        if (!entry.disabled) setActive((current) => current || key)
        return () => {
          entries.current.delete(key)
          setActive((current) =>
            current === key
              ? ([...entries.current].find(([, item]) => !item.disabled)?.[0] ??
                '')
              : current,
          )
        }
      },
      onKey(key: KeyEvent, current: string) {
        if (key.defaultPrevented || key.ctrl || key.meta || key.option) return
        const backwards =
          latest.current.orientation === 'horizontal' ? 'left' : 'up'
        const forwards =
          latest.current.orientation === 'horizontal' ? 'right' : 'down'
        const available = [...entries.current].filter(
          ([, entry]) => !entry.disabled,
        )
        if (!available.length) return
        const index = available.findIndex(([value]) => value === current)
        if (![backwards, forwards, 'home', 'end'].includes(key.name)) {
          if (key.name.length !== 1 || key.name === ' ') return
          const now = Date.now()
          const char = key.name.toLocaleLowerCase()
          search.current.text =
            now - search.current.time > 700 ? char : search.current.text + char
          search.current.time = now
          const query = [...search.current.text].every((c) => c === char)
            ? char
            : search.current.text
          const ordered = [
            ...available.slice(index + 1),
            ...available.slice(0, index + 1),
          ]
          const target = ordered.find(([, entry]) =>
            entry.label.toLocaleLowerCase().startsWith(query),
          )
          if (target) {
            key.preventDefault()
            key.stopPropagation()
            setActive(target[0])
            target[1].handle.focus()
            latest.current.onMove?.(target[0])
          }
          return
        }
        const next =
          key.name === 'home'
            ? 0
            : key.name === 'end'
              ? available.length - 1
              : (index + (key.name === backwards ? -1 : 1) + available.length) %
                available.length
        const target = available[next]
        if (target) {
          key.preventDefault()
          key.stopPropagation()
          setActive(target[0])
          target[1].handle.focus()
          latest.current.onMove?.(target[0])
        }
      },
    }),
    [],
  )
  return (
    <Context value={{ ...methods, active, setActive, singleTabStop }}>
      {children}
    </Context>
  )
}

export function useRovingItem(value: string, disabled = false, label = value) {
  const group = useGroup()
  const ref = useRef<PressableHandle>(null)
  const register = group.register
  useLayoutEffect(() => {
    if (ref.current)
      return register(value, { handle: ref.current, disabled, label })
  }, [register, value, disabled, label])
  return {
    ref,
    tabStop: !group.singleTabStop || !group.active || group.active === value,
    onFocus: () => group.setActive(value),
    onKeyDown: (key: KeyEvent) => group.onKey(key, value),
  }
}
