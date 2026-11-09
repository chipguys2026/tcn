import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { useRouter } from '@/router'

export default function InputGalleryPage() {
  const theme = useTheme()
  const { navigate } = useRouter()
  const [name, setName] = useState('')
  const [focused, setFocused] = useState('Name')
  const [submitted, setSubmitted] = useState('No submission yet')
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
          Gallery / input · Input gallery / single line
        </text>
        <text fg={theme.mutedForeground} height={1} flexShrink={0}>
          Tab: next control | Enter: submit | Mouse: place cursor
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
            <text fg={theme.mutedForeground} height={1}>
              Controlled / Name
            </text>
            <Input
              id="gallery-name"
              label="Name"
              value={name}
              onValueChange={setName}
              placeholder="Type your name..."
              autoFocus
              onSubmit={setSubmitted}
            />
            <text fg={theme.foreground} height={1} truncate>
              Value: {name || '(empty)'}
            </text>
            <text fg={theme.mutedForeground} height={1}>
              Uncontrolled / initial value
            </text>
            <Input
              label="Uncontrolled input"
              defaultValue="Edit this text"
              onSubmit={setSubmitted}
            />
            <text fg={theme.mutedForeground} height={1}>
              Read only / selectable, no edits
            </text>
            <Input
              label="Read-only input"
              defaultValue="Read-only value"
              readOnly
            />
            <text fg={theme.mutedForeground} height={1}>
              Disabled / skipped by Tab
            </text>
            <Input
              label="Disabled input"
              defaultValue="Disabled value"
              disabled
            />
            <text fg={theme.mutedForeground} height={1}>
              Invalid / destructive ring
            </text>
            <Input
              label="Invalid input"
              defaultValue="invalid@example"
              invalid
              onSubmit={setSubmitted}
            />
            <box flexDirection="row" gap={3} flexWrap="wrap">
              <Button icon="check" onPress={() => setSubmitted(name)}>
                Submit name
              </Button>
              <Button variant="secondary" onPress={() => setName('')}>
                Clear name
              </Button>
              <Button variant="link" onPress={() => navigate('/gallery')}>
                Buttons
              </Button>
            </box>
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
        <text fg={theme.mutedForeground} height={1} flexShrink={0} truncate>
          Focused: {focused}
        </text>
        <text fg={theme.foreground} height={1} flexShrink={0} truncate>
          Submitted: {submitted || '(empty)'}
        </text>
      </box>
    </FocusScope>
  )
}
