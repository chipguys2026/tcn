import { expect, test } from 'bun:test'
import { createNavigationStore } from '@/router/navigation-store'

test('normalizes routes, ignores duplicate navigation, and bounds back/forward', () => {
  const store = createNavigationStore()
  const { navigate, back, forward } = store.getState()
  back()
  navigate('/settings/')
  navigate('/settings')
  expect(store.getState().entries).toEqual(['/', '/settings'])
  back()
  back()
  expect(store.getState().pathname).toBe('/')
  forward()
  forward()
  expect(store.getState().pathname).toBe('/settings')
})

test('navigation after back drops forward history, but replacing preserves it', () => {
  const store = createNavigationStore()
  const { navigate, back, replace, forward } = store.getState()
  navigate('/one')
  navigate('/two')
  back()
  replace('/changed')
  expect(store.getState().entries).toEqual(['/', '/changed', '/two'])
  forward()
  expect(store.getState().pathname).toBe('/two')
  back()
  navigate('/three')
  expect(store.getState().entries).toEqual(['/', '/changed', '/three'])
})

test('keeps at most 100 entries and discards the oldest', () => {
  const store = createNavigationStore()
  for (let index = 1; index <= 120; index++)
    store.getState().navigate(`/item-${index}`)
  expect(store.getState().entries).toHaveLength(100)
  expect(store.getState().entries[0]).toBe('/item-21')
  for (let index = 0; index < 120; index++) store.getState().back()
  expect(store.getState().pathname).toBe('/item-21')
})

test.each([
  'relative',
  '/items?query=1',
  '/items#hash',
  '/items//one',
  '/items\\one',
])('rejects unsupported path syntax without changing history: %s', (path) => {
  const store = createNavigationStore()
  expect(() => store.getState().navigate(path)).toThrow()
  expect(store.getState().entries).toEqual(['/'])
})
