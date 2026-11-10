import { useState } from 'react'
import { DemoMessage, demos } from '@/components/shared/component-demos/catalog'
import { Button } from '@/components/ui/button'
import ButtonGalleryPage from '@/features/gallery/components/button-examples'
import CheckboxGalleryPage from '@/features/gallery/components/checkbox-examples'
import InputGalleryPage from '@/features/gallery/components/input-examples'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import { ThemeProvider } from '@/lib/ui/theme/provider'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { useParams, useRouter } from '@/router/index'

function Surface({ name }: { name: string }) {
  const theme = useTheme()
  const { navigate } = useRouter()
  const [last, report] = useState('No action yet')
  const [revision, reset] = useState(0)
  const demo = demos.find((item) => item.name === name)
  return (
    <box
      flexGrow={1}
      minHeight={0}
      flexDirection="column"
      backgroundColor={theme.background}
      padding={1}
      gap={1}
    >
      <text fg={theme.foreground} height={1} flexShrink={0}>
        Gallery / {name}
      </text>
      <DemoMessage>{demo?.hint ?? 'Component not found'}</DemoMessage>
      <box flexDirection="row" gap={2} flexShrink={0}>
        <Button
          autoFocus
          variant="secondary"
          onPress={() => navigate('/gallery')}
        >
          Catalog
        </Button>
        <Button
          variant="ghost"
          onPress={() => {
            reset((v) => v + 1)
            report('Reset')
          }}
        >
          Reset
        </Button>
      </box>
      <scrollbox
        flexGrow={1}
        flexBasis={0}
        minHeight={0}
        scrollY
        scrollX={false}
        focusable={false}
        viewportCulling={false}
      >
        <box key={revision} flexDirection="column" gap={2} padding={2}>
          {demo && <demo.render report={report} />}
        </box>
      </scrollbox>
      <DemoMessage>{`Last action: ${last}`}</DemoMessage>
    </box>
  )
}
export default function ComponentGalleryPage() {
  const { name = '' } = useParams()
  const [light, setLight] = useState(false)
  const DetailedPage =
    name === 'button'
      ? ButtonGalleryPage
      : name === 'input'
        ? InputGalleryPage
        : name === 'checkbox'
          ? CheckboxGalleryPage
          : null
  return (
    <ThemeProvider theme={light ? 'light' : 'dark'}>
      <FocusScope>
        <box flexDirection="column" flexGrow={1} minHeight={0}>
          <Button variant="ghost" onPress={() => setLight((v) => !v)}>
            {light ? 'Theme: light (switch)' : 'Theme: dark (switch)'}
          </Button>
          {DetailedPage ? (
            <DetailedPage key={name} />
          ) : (
            <Surface key={name} name={name} />
          )}
        </box>
      </FocusScope>
    </ThemeProvider>
  )
}
