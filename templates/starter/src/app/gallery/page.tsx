import { demos } from '@/components/shared/component-demos/catalog'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { useRouter } from '@/router/index'
export default function ComponentCatalogPage() {
  const { navigate } = useRouter()
  const theme = useTheme()
  return (
    <box flexGrow={1} minHeight={0} flexDirection="column" padding={1} gap={1}>
      <text fg={theme.foreground} height={1} flexShrink={0}>
        Component catalog / {demos.length} available
      </text>
      <text fg={theme.mutedForeground} height={1} flexShrink={0} truncate>
        Tab: navigate | Enter: open | Mouse wheel: scroll
      </text>
      <Button autoFocus variant="secondary" onPress={() => navigate('/')}>
        Home
      </Button>
      <Button variant="secondary" onPress={() => navigate('/gallery/showcase')}>
        Composed review: form / table / palette
      </Button>
      <Button variant="secondary" onPress={() => navigate('/tweak')}>
        Tweak / design component defaults
      </Button>
      <Button variant="secondary" onPress={() => navigate('/gallery/icons')}>
        Nerd Fonts / browse and copy icons
      </Button>
      <scrollbox
        flexGrow={1}
        flexBasis={0}
        minHeight={0}
        scrollY
        scrollX={false}
        focusable={false}
        viewportCulling={false}
      >
        <box flexDirection="column" gap={1} padding={2}>
          {demos.map((demo) => (
            <Button
              key={demo.name}
              variant="secondary"
              onPress={() => navigate(`/gallery/${demo.name}`)}
            >
              {demo.name}
            </Button>
          ))}
        </box>
      </scrollbox>
    </box>
  )
}
