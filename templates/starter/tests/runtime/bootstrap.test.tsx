import { expect, test } from 'bun:test'
import { testRender } from '@opentui/react/test-utils'
import { act } from 'react'
import { RouterView } from '@/router/router-view'

test('renders the component playground and releases the renderer', async () => {
  const setup = await testRender(<RouterView />, { width: 80, height: 24 })

  try {
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain('opentui-starter')
  } finally {
    act(() => setup.renderer.destroy())
  }
})
