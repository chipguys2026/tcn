import type { RouteDefinition } from './types'

export function normalizePath(path: string): string {
  if (!path.startsWith('/') || /[?#\\]/.test(path)) {
    throw new Error(
      'A route must be an absolute pathname without query or hash',
    )
  }

  const normalized = path.replace(/\/+$/, '') || '/'
  if (normalized.includes('//')) {
    throw new Error('A route cannot contain empty path segments')
  }
  return normalized
}

export function matchRoute(
  pathname: string,
  routes: readonly RouteDefinition[],
) {
  let parts: string[]
  try {
    const normalized = normalizePath(pathname)
    parts =
      normalized === '/'
        ? []
        : normalized.slice(1).split('/').map(decodeURIComponent)
  } catch {
    return null
  }

  if (
    parts.some((part) => /[/\\]/.test(part) || part === '.' || part === '..')
  ) {
    return null
  }

  // The generator orders routes by segment specificity: static before dynamic.
  for (const route of routes) {
    if (route.segments.length !== parts.length) continue
    const params: Record<string, string> = Object.create(null)
    const matched = route.segments.every((segment, index) => {
      const part = parts[index]
      if (part === undefined) return false
      if (segment.kind === 'static') return part === segment.value
      params[segment.value] = part
      return true
    })
    if (matched) return { route, params }
  }

  return null
}
