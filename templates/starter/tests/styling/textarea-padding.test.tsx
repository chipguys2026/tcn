import { expect, test } from 'bun:test'
import type { BoxRenderable, TextareaRenderable } from '@opentui/core'
import { testRender } from '@opentui/react/test-utils'
import { act } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { emptyProfile } from '@/features/tweak/api/review.storage'
import { ComponentStylesProvider } from '@/lib/ui/style-review'
import { ThemeProvider } from '@/lib/ui/theme/provider'

for (const theme of ['light', 'dark'] as const)
  for (const disabled of [false, true])
    for (const part of ['textarea/Textarea', 'textarea/Textarea.textarea'])
      test(`${theme} disabled=${disabled} ${part} padding insets text inside a continuous surface`, async () => {
        const setup = await testRender(
          <ThemeProvider theme={theme}>
            <ComponentStylesProvider
              profiles={{
                textarea: {
                  ...emptyProfile(),
                  parts: { [part]: { paddingX: 2, paddingY: 1 } },
                },
              }}
            >
              <box padding={2}>
                <Textarea
                  id="padded-textarea"
                  width={18}
                  height={6}
                  defaultValue="Hello"
                  disabled={disabled}
                />
              </box>
            </ComponentStylesProvider>
          </ThemeProvider>,
          { width: 30, height: 12 },
        )
        try {
          await act(async () => setup.renderOnce())
          const editor = setup.renderer.root.findDescendantById(
            'padded-textarea',
          ) as TextareaRenderable
          const content = editor.parent as BoxRenderable
          const surface = content.parent as BoxRenderable
          expect(content.screenX).toBe(surface.screenX)
          expect(content.screenY).toBe(surface.screenY)
          expect(content.width).toBe(surface.width)
          expect(content.height).toBe(surface.height)
          expect(surface.width).toBe(18)
          expect(surface.height).toBe(6)
          const lines = setup.captureCharFrame().split('\n')
          expect(lines[surface.screenY + 1]?.indexOf('Hello')).toBe(
            surface.screenX + 2,
          )
          const rows = setup
            .captureSpans()
            .lines.slice(surface.screenY, surface.screenY + surface.height)
          const colors = rows.flatMap((row) =>
            row.spans
              .flatMap((span) =>
                Array.from({ length: span.width }, () =>
                  span.bg.toInts().join(','),
                ),
              )
              .slice(surface.screenX, surface.screenX + surface.width),
          )
          expect(new Set(colors).size).toBe(1)
          await act(async () =>
            setup.mockMouse.click(surface.screenX, surface.screenY),
          )
          expect(setup.renderer.currentFocusedRenderable === editor).toBe(
            !disabled,
          )
          if (disabled) return
          await act(async () => setup.mockInput.typeText('X'))
          expect(editor.plainText).toBe('XHello')
          await act(async () => {
            editor.cursorOffset = 0
            setup.mockInput.pressArrow('right', { shift: true })
          })
          expect(editor.hasSelection()).toBe(true)
          expect(editor.getSelectedText().startsWith('X')).toBe(true)
          await act(async () => {
            editor.clearSelection()
            editor.setText(
              Array.from({ length: 20 }, (_, index) => `Line ${index}`).join(
                '\n',
              ),
            )
            editor.cursorOffset = 0
          })
          await act(async () => setup.renderOnce())
          expect(editor.editorView.getViewport().width).toBe(14)
          expect(editor.editorView.getViewport().height).toBe(4)
          const before = editor.scrollY
          await act(async () =>
            setup.mockMouse.scroll(surface.screenX, surface.screenY, 'down'),
          )
          expect(editor.scrollY).toBeGreaterThan(before)
        } finally {
          act(() => setup.renderer.destroy())
        }
      })
