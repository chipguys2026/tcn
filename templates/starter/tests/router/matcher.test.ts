import { expect, test } from 'bun:test'
import { matchRoute } from '@/router/matcher'
import type { RouteDefinition } from '@/router/types'

const Page = () => null
const routes: RouteDefinition[] = [
  { path: '/', segments: [], page: Page, layers: [] },
  {
    path: '/items/new',
    segments: [
      { kind: 'static', value: 'items' },
      { kind: 'static', value: 'new' },
    ],
    page: Page,
    layers: [],
  },
  {
    path: '/items/:id',
    segments: [
      { kind: 'static', value: 'items' },
      { kind: 'dynamic', value: 'id' },
    ],
    page: Page,
    layers: [],
  },
]

test('matches exact routes and prefers the generated static route over a dynamic route', () => {
  expect(matchRoute('/', routes)?.route.path).toBe('/')
  expect(matchRoute('/items/new', routes)?.route.path).toBe('/items/new')
  expect(matchRoute('/items/123/', routes)?.params.id).toBe('123')
  expect(matchRoute('/items/caf%C3%A9', routes)?.params.id).toBe('café')
  expect(matchRoute('/%69tems/123', routes)?.params.id).toBe('123')
})

test.each([
  '/unknown',
  '/items',
  '/items/123/extra',
  '/items/%ZZ',
  '/items/%2F',
  '/items/%5C',
  '/items/%2e%2e',
  '/items//123',
])('returns no match for an unknown or invalid path: %s', (path) =>
  expect(matchRoute(path, routes)).toBeNull(),
)
