import type { JSX } from '@opentui/react/jsx-runtime'
import { type PropsWithChildren, Suspense, useMemo } from 'react'
import { useStore } from 'zustand'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { RouteContext } from './context'
import { matchRoute } from './matcher'
import { type NavigationStore, navigationStore } from './navigation-store'
import { RouteErrorBoundary } from './route-error-boundary'
import { routeManifest } from './routes.generated'
import type { RouteLayer, RouteManifest } from './types'

function Layer({
  layer,
  pathname,
  children,
}: PropsWithChildren<{
  layer: RouteLayer
  pathname: string
}>) {
  const Loading = layer.loading
  let content = Loading ? (
    <Suspense fallback={<Loading />}>{children}</Suspense>
  ) : (
    children
  )
  if (layer.error) {
    content = (
      <RouteErrorBoundary fallback={layer.error} resetKey={pathname}>
        {content}
      </RouteErrorBoundary>
    )
  }
  const Layout = layer.layout
  return Layout ? <Layout>{content}</Layout> : content
}

function NotFound() {
  const theme = useTheme()
  return <text fg={theme.foreground}>Page not found</text>
}

type RouterViewProps = { manifest?: RouteManifest; store?: NavigationStore }

export function RouterView({
  manifest = routeManifest,
  store = navigationStore,
}: RouterViewProps) {
  const pathname = useStore(store, (state) => state.pathname)
  const match = useMemo(
    () => matchRoute(pathname, manifest.routes),
    [pathname, manifest],
  )
  const context = useMemo(
    () => ({ pathname, params: match?.params ?? {}, store }),
    [pathname, match, store],
  )
  let content: JSX.Element

  if (match) {
    const Page = match.route.page
    content = <Page key={pathname} />
    for (const layer of [...match.route.layers].reverse()) {
      content = (
        <Layer key={layer.id} layer={layer} pathname={pathname}>
          {content}
        </Layer>
      )
    }
  } else {
    content = <NotFound key={pathname} />
  }

  return (
    <RouteContext value={context}>
      <Suspense fallback={null}>
        <Layer layer={manifest.root} pathname={pathname}>
          {content}
        </Layer>
      </Suspense>
    </RouteContext>
  )
}
