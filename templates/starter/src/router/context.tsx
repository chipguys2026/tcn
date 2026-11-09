import { createContext, useContext } from 'react'
import type { NavigationStore } from './navigation-store'

type RouteContextValue = {
  pathname: string
  params: Readonly<Record<string, string>>
  store: NavigationStore
}

export const RouteContext = createContext<RouteContextValue | null>(null)

function useRouteContext() {
  const context = useContext(RouteContext)
  if (!context) throw new Error('Router hooks must be used inside RouterView')
  return context
}

export const usePathname = () => useRouteContext().pathname
export const useParams = () => useRouteContext().params

export function useRouter() {
  const { store } = useRouteContext()
  const { navigate, replace, back, forward } = store.getState()
  return { navigate, replace, back, forward }
}
