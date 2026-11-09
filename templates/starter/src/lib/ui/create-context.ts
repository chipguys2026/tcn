// biome-ignore-all lint/correctness/noComponentHookFactories: Called only at module initialization; context and hook identities stay stable.
import { createContext, useContext } from 'react'

export function createStrictContext<T>(name: string) {
  const Context = createContext<T | null>(null)
  function useValue() {
    const value = useContext(Context)
    if (value === null)
      throw new Error(`${name} must be used inside its root component`)
    return value
  }
  return [Context, useValue] as const
}
