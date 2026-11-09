import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { useRouter } from '@/router'

export default function HomePage() {
  const theme = useTheme()
  const { navigate } = useRouter()
  return (
    <box flexGrow={1} paddingX={3} paddingY={2} gap={1} flexDirection="column">
      <text fg={theme.foreground}>opentui-starter</text>
      <text fg={theme.mutedForeground}>
        Build terminal applications with React, OpenTUI and reusable UI
        components.
      </text>
      <Button icon="arrowRight" autoFocus onPress={() => navigate('/gallery')}>
        Gallery / explore components
      </Button>
      <Button
        icon="settings"
        variant="secondary"
        onPress={() => navigate('/tweak')}
      >
        Tweak / design component defaults
      </Button>
      <Button variant="secondary" onPress={() => navigate('/gallery/showcase')}>
        Showcase / components working together
      </Button>
      <text fg={theme.mutedForeground}>
        Tweak is a development tool. Exported drafts do not configure your
        application.
      </text>
      <text fg={theme.mutedForeground}>
        Tab / Shift+Tab: focus · Enter / Space: activate · Ctrl+C: exit
      </text>
    </box>
  )
}
