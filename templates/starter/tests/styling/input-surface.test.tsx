import { expect, test } from 'bun:test'
import type { InputRenderable } from '@opentui/core'
import { testRender } from '@opentui/react/test-utils'
import { act } from 'react'
import { Input } from '@/components/ui/input'
import { emptyProfile } from '@/features/tweak/storage'
import { ComponentStylesProvider } from '@/lib/ui/style-review'
import { ThemeProvider } from '@/lib/ui/theme/provider'
import { themes } from '@/lib/ui/theme/tokens'

for (const theme of ['light', 'dark'] as const)
  for (const disabled of [false, true])
    for (const paddingX of [0, 1, 2]) {
      test(`${theme} input disabled=${disabled} paddingX=${paddingX} has one continuous background`, async () => {
        const setup = await testRender(
          <ThemeProvider theme={theme}>
            <ComponentStylesProvider
              profiles={{
                input: {
                  ...emptyProfile(),
                  parts: { 'input/Input': { paddingX } },
                },
              }}
            >
              <box
                width="100%"
                height="100%"
                backgroundColor={themes[theme].background}
                padding={2}
              >
                <Input
                  id="surface-input"
                  width={14}
                  defaultValue="Off"
                  disabled={disabled}
                />
              </box>
            </ComponentStylesProvider>
          </ThemeProvider>,
          { width: 24, height: 8 },
        )
        try {
          await setup.renderOnce()
          const input = setup.renderer.root.findDescendantById(
              'surface-input',
            ) as InputRenderable,
            outer = input.parent
          if (!outer) throw new Error('Missing input surface')
          const colors =
            setup
              .captureSpans()
              .lines[outer.screenY]?.spans.flatMap((span) =>
                Array.from({ length: span.width }, () =>
                  span.bg.toInts().join(','),
                ),
              ) ?? []
          const background = colors.slice(
            outer.screenX,
            outer.screenX + outer.width,
          )
          expect([...new Set(background)]).toHaveLength(1)
        } finally {
          act(() => setup.renderer.destroy())
        }
      })
    }
