import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import type { ButtonVariant } from '@/lib/ui/styles'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { useRouter } from '@/router/index'

const variants: ButtonVariant[] = [
  'default',
  'secondary',
  'ghost',
  'destructive',
  'link',
]

export default function GalleryPage() {
  const theme = useTheme()
  const { navigate } = useRouter()
  const [lastAction, setLastAction] = useState('No action yet')
  const [focusedLabel, setFocusedLabel] = useState('Save')
  const [count, setCount] = useState(0)
  function activate(label: string) {
    setLastAction(label)
    setCount((value) => value + 1)
  }

  return (
    <FocusScope onFocusChange={setFocusedLabel}>
      <box
        flexGrow={1}
        flexDirection="column"
        paddingX={2}
        paddingY={1}
        gap={1}
      >
        <text fg={theme.foreground} height={1} flexShrink={0}>
          Gallery / button · Button gallery / one row / no border
        </text>
        <text fg={theme.mutedForeground} height={1} flexShrink={0}>
          Tab / Shift+Tab: focus | Enter / Space / click: press
        </text>
        <scrollbox
          flexGrow={1}
          minHeight={0}
          scrollX={false}
          scrollY
          viewportCulling={false}
          focusable={false}
        >
          <box flexDirection="column" padding={2} gap={2}>
            {variants.map((variant, index) => (
              <box
                key={variant}
                flexDirection="row"
                gap={2}
                flexWrap="wrap"
                alignItems="center"
                overflow="visible"
              >
                <text fg={theme.mutedForeground} width={12}>
                  {variant}
                </text>
                <Button
                  variant={variant}
                  autoFocus={index === 0}
                  onPress={() => activate(`${variant}: Save`)}
                >
                  Save
                </Button>
                <Button
                  variant={variant}
                  icon="plus"
                  onPress={() => activate(`${variant}: Create`)}
                >
                  Create
                </Button>
                <Button
                  variant={variant}
                  icon="search"
                  label={`${variant}: Search`}
                  onPress={() => activate(`${variant}: Search`)}
                />
              </box>
            ))}
            <box
              flexDirection="row"
              gap={2}
              flexWrap="wrap"
              alignItems="center"
            >
              <text fg={theme.mutedForeground} width={12}>
                disabled
              </text>
              <Button
                disabled
                onPress={() => activate('Unexpected disabled press')}
              >
                Save
              </Button>
              <Button variant="secondary" icon="plus" disabled>
                Create
              </Button>
              <Button
                variant="ghost"
                icon="search"
                label="Disabled search"
                disabled
              />
            </box>
            <box flexDirection="row" gap={3} flexWrap="wrap">
              <Button icon="save" onPress={() => activate('Saved changes')}>
                Save changes
              </Button>
              <Button variant="secondary" onPress={() => activate('Cancelled')}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                icon="trash"
                onPress={() => activate('Delete pressed (demo only)')}
              >
                Delete
              </Button>
            </box>
            <Button
              variant="link"
              icon="arrowRight"
              onPress={() => navigate('/gallery/input')}
            >
              Input gallery
            </Button>
            <Button
              variant="link"
              icon="check"
              onPress={() => navigate('/gallery/checkbox')}
            >
              Checkbox gallery
            </Button>
            <Button variant="link" onPress={() => navigate('/')}>
              Back to home
            </Button>
          </box>
        </scrollbox>
        <text fg={theme.mutedForeground} height={1} flexShrink={0}>
          Focused: {focusedLabel}
        </text>
        <text fg={theme.foreground} height={1} flexShrink={0}>
          Presses: {count} | Last: {lastAction}
        </text>
        <text fg={theme.mutedForeground} height={1} flexShrink={0}>
          Icons require a Nerd Font in your terminal.
        </text>
      </box>
    </FocusScope>
  )
}
