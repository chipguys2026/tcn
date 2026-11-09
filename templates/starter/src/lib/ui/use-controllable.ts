import {
  type SetStateAction,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

export function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
) {
  const [internal, setInternal] = useState(defaultValue)
  const current = value === undefined ? internal : value
  const latest = useRef({ current, controlled: value !== undefined, onChange })
  useLayoutEffect(() => {
    latest.current = { current, controlled: value !== undefined, onChange }
  }, [current, value, onChange])
  const set = useCallback((action: SetStateAction<T>) => {
    const state = latest.current
    const next =
      typeof action === 'function'
        ? (action as (value: T) => T)(state.current)
        : action
    if (Object.is(next, state.current)) return
    if (!state.controlled) {
      state.current = next
      setInternal(next)
    }
    state.onChange?.(next)
  }, [])
  return [current, set] as const
}
