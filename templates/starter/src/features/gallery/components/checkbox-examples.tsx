import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox, type CheckedState } from '@/components/ui/checkbox'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { useRouter } from '@/router/index'

const permissions = ['Read', 'Write', 'Execute'] as const

export default function CheckboxGalleryPage() {
  const theme = useTheme()
  const { navigate } = useRouter()
  const [accepted, setAccepted] = useState<CheckedState>(false)
  const [items, setItems] = useState([true, false, false])
  const [focused, setFocused] = useState('Accept terms')
  const selectedCount = items.filter(Boolean).length
  const all: CheckedState =
    selectedCount === items.length
      ? true
      : selectedCount
        ? 'indeterminate'
        : false

  return (
    <FocusScope onFocusChange={setFocused}>
      <box
        flexGrow={1}
        flexDirection="column"
        paddingX={2}
        paddingY={1}
        gap={1}
      >
        <text fg={theme.foreground} height={1} flexShrink={0}>
          Gallery / checkbox · Checkbox gallery / Space to toggle
        </text>
        <text fg={theme.mutedForeground} height={1} flexShrink={0} truncate>
          Tab: focus | Click mark or label: toggle | Disabled: skipped
        </text>
        <scrollbox
          flexGrow={1}
          minHeight={0}
          scrollY
          scrollX={false}
          viewportCulling={false}
          focusable={false}
        >
          <box flexDirection="column" padding={2} gap={2}>
            <Checkbox
              id="gallery-accept"
              checked={accepted}
              onCheckedChange={setAccepted}
              autoFocus
            >
              Accept terms
            </Checkbox>
            <Checkbox defaultChecked>Remember me (uncontrolled)</Checkbox>
            <Checkbox disabled>Unavailable option</Checkbox>
            <Checkbox defaultChecked disabled>
              Enabled by policy (disabled)
            </Checkbox>
            <text fg={theme.mutedForeground} height={1}>
              Indeterminate / select all permissions
            </text>
            <Checkbox
              id="gallery-all"
              checked={all}
              onCheckedChange={(next) =>
                setItems(items.map(() => next === true))
              }
            >
              Select all permissions
            </Checkbox>
            <box paddingLeft={2} flexDirection="column" gap={2}>
              {permissions.map((permission, index) => (
                <Checkbox
                  key={permission}
                  id={`permission-${permission.toLowerCase()}`}
                  checked={items[index] ?? false}
                  onCheckedChange={(next) =>
                    setItems((current) =>
                      current.map((value, itemIndex) =>
                        itemIndex === index ? next === true : value,
                      ),
                    )
                  }
                >
                  {permission}
                </Checkbox>
              ))}
            </box>
            <text fg={theme.mutedForeground} height={1}>
              Without visible text / label is focus metadata
            </text>
            <Checkbox label="Compact checkbox" defaultChecked="indeterminate" />
            <box flexDirection="row" gap={3} flexWrap="wrap">
              <Button variant="link" onPress={() => navigate('/gallery')}>
                Buttons
              </Button>
              <Button variant="link" onPress={() => navigate('/gallery/input')}>
                Inputs
              </Button>
              <Button variant="link" onPress={() => navigate('/')}>
                Home
              </Button>
            </box>
          </box>
        </scrollbox>
        <text fg={theme.mutedForeground} height={1} flexShrink={0} truncate>
          Focused: {focused}
        </text>
        <text fg={theme.foreground} height={1} flexShrink={0}>
          Accepted: {String(accepted)} | Permissions: {selectedCount}/3
        </text>
      </box>
    </FocusScope>
  )
}
