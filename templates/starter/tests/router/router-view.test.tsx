// biome-ignore-all lint/correctness/noComponentHookFactories: Fixtures are created once per test, never during a React render.
import { expect, spyOn, test } from 'bun:test'
import { testRender } from '@opentui/react/test-utils'
import { act, type PropsWithChildren, useEffect, useState } from 'react'
import RootLayout from '@/app/layout'
import { useParams, usePathname, useRouter } from '@/router/context'
import { createNavigationStore } from '@/router/navigation-store'
import { RouterView } from '@/router/router-view'
import type {
  RouteDefinition,
  RouteErrorProps,
  RouteManifest,
} from '@/router/types'

function route(
  path: string,
  page: RouteDefinition['page'],
  layers: RouteDefinition['layers'] = [],
): RouteDefinition {
  return {
    path,
    page,
    layers,
    segments:
      path === '/'
        ? []
        : path
            .slice(1)
            .split('/')
            .map((value) => ({
              kind: value.startsWith(':') ? 'dynamic' : 'static',
              value: value.replace(/^:/, ''),
            })),
  }
}

async function render(
  manifest: RouteManifest,
  path = '/',
  width = 80,
  height = 24,
) {
  const store = createNavigationStore(path)
  const setup = await testRender(
    <RouterView manifest={manifest} store={store} />,
    { width, height },
  )
  const frame = async () => {
    await setup.renderOnce()
    return setup.captureCharFrame()
  }
  const navigate = async (pathname: string) => {
    await act(async () => store.getState().navigate(pathname))
    return frame()
  }
  return {
    ...setup,
    store,
    frame,
    navigate,
    destroy: () => act(() => setup.renderer.destroy()),
  }
}

test('keeps root/nested layouts mounted across sibling routes and resets page state by pathname', async () => {
  let rootMounts = 0
  let nestedMounts = 0
  let pageMounts = 0
  let updateRoot = (_value: number) => {}
  let updateNested = (_value: number) => {}

  function Root({ children }: PropsWithChildren) {
    const [value, setValue] = useState(0)
    updateRoot = setValue
    useEffect(() => {
      rootMounts++
    }, [])
    return (
      <box flexDirection="column">
        <text>Root {value}</text>
        {children}
      </box>
    )
  }
  function Nested({ children }: PropsWithChildren) {
    const [value, setValue] = useState(0)
    updateNested = setValue
    useEffect(() => {
      nestedMounts++
    }, [])
    return (
      <box flexDirection="column">
        <text>Nested {value}</text>
        {children}
      </box>
    )
  }
  function Page() {
    useEffect(() => {
      pageMounts++
    }, [])
    return <text>Item {useParams().id}</text>
  }
  const layer = { id: 'items', layout: Nested }
  const manifest: RouteManifest = {
    root: { id: '.', layout: Root },
    routes: [
      route('/items/:id', Page, [layer]),
      route('/other', () => <text>Other</text>),
    ],
  }
  const setup = await render(manifest, '/items/one')
  try {
    await act(async () => {
      updateRoot(7)
      updateNested(8)
    })
    expect(await setup.navigate('/items/two')).toContain('Item two')
    expect(await setup.frame()).toContain('Nested 8')
    expect(rootMounts).toBe(1)
    expect(nestedMounts).toBe(1)
    expect(pageMounts).toBe(2)
    expect(await setup.navigate('/other')).toContain('Root 7')
    expect(await setup.navigate('/items/three')).toContain('Nested 0')
    expect(nestedMounts).toBe(2)
    expect(rootMounts).toBe(1)
  } finally {
    setup.destroy()
  }
})

test('makes route context available in layouts, supports hooks, back and forward', async () => {
  let router: ReturnType<typeof useRouter> | undefined
  function Page() {
    router = useRouter()
    return (
      <text>
        {usePathname()} {useParams().id}
      </text>
    )
  }
  const setup = await render({
    root: { id: '.', layout: RootLayout },
    routes: [route('/', Page), route('/items/:id', Page)],
  })
  try {
    await act(async () => router?.navigate('/items/123'))
    expect(await setup.frame()).toContain('/items/123 123')
    await act(async () => router?.back())
    expect(setup.store.getState().pathname).toBe('/')
    await act(async () => router?.forward())
    expect(await setup.frame()).toContain('/items/123 123')
  } finally {
    setup.destroy()
  }
})

test.each([
  [80, 24],
  [120, 40],
  [60, 18],
])(
  'renders unknown/invalid encoded paths in the root layout at %sx%s',
  async (width, height) => {
    function Root({ children }: PropsWithChildren) {
      return (
        <box flexDirection="column">
          <text>Shell</text>
          {children}
        </box>
      )
    }
    const setup = await render(
      { root: { id: '.', layout: Root }, routes: [route('/', () => null)] },
      '/missing',
      width,
      height,
    )
    try {
      expect(await setup.frame()).toContain('Shell')
      expect(await setup.frame()).toContain('Page not found')
      expect(await setup.navigate('/%ZZ')).toContain('Page not found')
    } finally {
      setup.destroy()
    }
  },
)

test('uses the nearest loading fallback for render suspension, including root loading', async () => {
  let ready = false
  let release = () => {}
  const pending = new Promise<void>((resolve) => {
    release = resolve
  })
  function Page() {
    if (!ready) throw pending
    return <text>Loaded</text>
  }
  const setup = await render({
    root: { id: '.', loading: () => <text>Root loading</text> },
    routes: [
      route('/', Page),
      route('/nested', Page, [
        { id: 'nested', loading: () => <text>Nested loading</text> },
      ]),
    ],
  })
  try {
    expect(await setup.frame()).toContain('Root loading')
    expect(await setup.navigate('/nested')).toContain('Nested loading')
    await act(async () => {
      ready = true
      release()
      await pending
    })
    expect(await setup.frame()).toContain('Loaded')
  } finally {
    setup.destroy()
  }
})

test('renders nearest error fallback, supports reset, and recovers on navigation', async () => {
  const logger = spyOn(console, 'error').mockImplementation(() => {})
  let broken = true
  let reset = () => {}
  function Page() {
    if (broken) throw new Error('Fixture failure')
    return <text>Recovered</text>
  }
  function Fallback(props: RouteErrorProps) {
    reset = props.reset
    return <text>Local error: {props.error.message}</text>
  }
  const setup = await render({
    root: { id: '.', error: () => <text>Root error</text> },
    routes: [
      route('/', Page, [{ id: '(group)', error: Fallback }]),
      route('/healthy', () => <text>Healthy</text>),
    ],
  })
  try {
    expect(await setup.frame()).toContain('Local error: Fixture failure')
    broken = false
    await act(async () => reset())
    expect(await setup.frame()).toContain('Recovered')
    broken = true
    await setup.navigate('/healthy')
    expect(await setup.navigate('/')).toContain('Local error')
    expect(await setup.navigate('/healthy')).toContain('Healthy')
    expect(logger).toHaveBeenCalled()
  } finally {
    setup.destroy()
    logger.mockRestore()
  }
})

test('a layout failure bubbles to the parent error boundary and navigation resets it', async () => {
  const logger = spyOn(console, 'error').mockImplementation(() => {})
  function BrokenLayout(): never {
    throw new Error('Layout failed')
  }
  const setup = await render(
    {
      root: { id: '.', error: () => <text>Parent error</text> },
      routes: [
        route('/', () => <text>Healthy</text>),
        route('/broken', () => null, [
          {
            id: 'broken',
            layout: BrokenLayout,
            error: () => <text>Child error</text>,
          },
        ]),
      ],
    },
    '/broken',
  )
  try {
    expect(await setup.frame()).toContain('Parent error')
    expect(await setup.navigate('/')).toContain('Healthy')
  } finally {
    setup.destroy()
    logger.mockRestore()
  }
})
