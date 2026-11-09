// biome-ignore-all lint/correctness/noComponentHookFactories: Each fixture is created once per test, outside React render.
import { expect, test } from 'bun:test'
import type { BoxRenderable, InputRenderable } from '@opentui/core'
import { testRender } from '@opentui/react/test-utils'
import { act, createRef, useImperativeHandle, useState } from 'react'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import {
  type FocusableHandle,
  useFocusable,
} from '@/lib/ui/focus/use-focusable'

test('a non-button, multi-row control gets mouse/programmatic focus and preserves its own handlers', async () => {
  const ref = createRef<FocusableHandle>()
  let presses = 0
  let receiver = ''
  function Control() {
    const { focused, handle, getFocusProps } = useFocusable<BoxRenderable>({
      id: 'control',
      label: 'Generic control',
    })
    useImperativeHandle(ref, () => handle, [handle])
    return (
      <box
        {...getFocusProps({
          onMouseDown() {
            presses++
            receiver = this.id
          },
        })}
        width={14}
        height={2}
      >
        <text>{focused ? 'Focused' : 'Idle'}</text>
      </box>
    )
  }
  const setup = await testRender(
    <FocusScope>
      <box padding={2}>
        <Control />
      </box>
    </FocusScope>,
    { width: 40, height: 10 },
  )
  try {
    await setup.renderOnce()
    const node = setup.renderer.root.findDescendantById(
      'control',
    ) as BoxRenderable
    await act(async () =>
      setup.mockMouse.click(node.screenX + 2, node.screenY + 1),
    )
    await setup.renderOnce()
    expect(node.focused).toBe(true)
    expect(setup.captureCharFrame()).toContain('Focused')
    expect(presses).toBe(1)
    expect(receiver).toBe('control')
    expect(ref.current?.label).toBe('Generic control')
    await act(async () => ref.current?.blur())
    expect(node.focused).toBe(false)
    await act(async () => ref.current?.focus())
    expect(node.focused).toBe(true)
  } finally {
    act(() => setup.renderer.destroy())
  }
})

test('native inputs share focus traversal without stealing typing, skip disabled inputs, and unregister on unmount', async () => {
  let hideLast = () => {}
  let value = ''
  function Field({
    id,
    disabled = false,
    autoFocus = false,
  }: {
    id: string
    disabled?: boolean
    autoFocus?: boolean
  }) {
    const [text, setText] = useState('')
    const { getFocusProps } = useFocusable<InputRenderable>({
      id,
      label: id,
      disabled,
      autoFocus,
    })
    return (
      <input
        {...getFocusProps()}
        width={16}
        value={text}
        onInput={(next) => {
          setText(next)
          value = next
        }}
      />
    )
  }
  function Fixture() {
    const [show, setShow] = useState(true)
    hideLast = () => setShow(false)
    return (
      <FocusScope>
        <box padding={2} gap={1} flexDirection="column">
          <Field id="first" autoFocus />
          <Field id="disabled" disabled />
          {show && <Field id="last" />}
        </box>
      </FocusScope>
    )
  }
  const setup = await testRender(<Fixture />, {
    width: 40,
    height: 12,
    kittyKeyboard: true,
  })
  try {
    await setup.renderOnce()
    const first = setup.renderer.root.findDescendantById(
      'first',
    ) as InputRenderable
    const last = setup.renderer.root.findDescendantById(
      'last',
    ) as InputRenderable
    expect(first.focused).toBe(true)
    await act(async () => setup.mockInput.typeText('hello'))
    expect(value).toBe('hello')
    expect(first.focused).toBe(true)
    await act(async () => setup.mockInput.pressTab())
    expect(last.focused).toBe(true)
    await act(async () => hideLast())
    await act(async () => setup.mockInput.pressTab())
    expect(first.focused).toBe(true)
    expect(last.isDestroyed).toBe(true)
  } finally {
    act(() => setup.renderer.destroy())
  }
})
