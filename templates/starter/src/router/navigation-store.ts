import { createStore } from 'zustand/vanilla'
import { normalizePath } from './matcher'

type NavigationState = {
  pathname: string
  entries: string[]
  cursor: number
  navigate: (path: string) => void
  replace: (path: string) => void
  back: () => void
  forward: () => void
}

export function createNavigationStore(initialPath = '/') {
  const initial = normalizePath(initialPath)
  return createStore<NavigationState>((set) => ({
    pathname: initial,
    entries: [initial],
    cursor: 0,
    navigate: (path) => {
      const pathname = normalizePath(path)
      set((state) => {
        if (state.pathname === pathname) return state
        const entries = [
          ...state.entries.slice(0, state.cursor + 1),
          pathname,
        ].slice(-100)
        return { pathname, entries, cursor: entries.length - 1 }
      })
    },
    replace: (path) => {
      const pathname = normalizePath(path)
      set((state) => {
        if (state.pathname === pathname) return state
        const entries = [...state.entries]
        entries[state.cursor] = pathname
        return { pathname, entries }
      })
    },
    back: () =>
      set((state) => {
        if (state.cursor === 0) return state
        const cursor = state.cursor - 1
        return { cursor, pathname: state.entries[cursor] ?? '/' }
      }),
    forward: () =>
      set((state) => {
        if (state.cursor === state.entries.length - 1) return state
        const cursor = state.cursor + 1
        return { cursor, pathname: state.entries[cursor] ?? '/' }
      }),
  }))
}

export type NavigationStore = ReturnType<typeof createNavigationStore>
export const navigationStore = createNavigationStore()
export const navigate = (path: string) =>
  navigationStore.getState().navigate(path)
export const replace = (path: string) =>
  navigationStore.getState().replace(path)
export const back = () => navigationStore.getState().back()
export const forward = () => navigationStore.getState().forward()
