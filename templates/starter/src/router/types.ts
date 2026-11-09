import type { JSX } from '@opentui/react/jsx-runtime'
import type { PropsWithChildren } from 'react'

// Route modules are synchronous function components; suspension happens in render.
export type RouteComponent<Props = Record<never, never>> = (
  props: Props,
) => JSX.Element

export type RouteErrorProps = { error: Error; reset: () => void }

export type RouteLayer = {
  id: string
  layout?: RouteComponent<PropsWithChildren>
  error?: RouteComponent<RouteErrorProps>
  loading?: RouteComponent
}

export type RouteSegment = {
  kind: 'static' | 'dynamic'
  value: string
}

export type RouteDefinition = {
  path: string
  segments: readonly RouteSegment[]
  page: RouteComponent
  layers: readonly RouteLayer[]
}

export type RouteManifest = {
  root: RouteLayer
  routes: readonly RouteDefinition[]
}
