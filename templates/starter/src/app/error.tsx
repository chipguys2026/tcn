import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/ui/theme/use-theme'
import type { RouteErrorProps } from '@/router'

export default function RouteError({ error, reset }: RouteErrorProps) {
  const theme = useTheme()
  return (
    <box padding={2} gap={1} flexDirection="column">
      <text fg={theme.destructive}>This page failed to render.</text>
      <text fg={theme.mutedForeground}>{error.message}</text>
      <Button onPress={reset}>Try again</Button>
    </box>
  )
}
