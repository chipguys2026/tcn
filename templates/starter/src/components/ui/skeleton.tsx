import { PartBox } from '@/lib/ui/parts'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { skeletonDefaults } from './skeleton.styles'

export function Skeleton({
  width = skeletonDefaults.width,
  height = skeletonDefaults.height,
}: {
  width?: number | `${number}%`
  height?: number
}) {
  const theme = useTheme()
  return (
    <PartBox
      source="skeleton"
      part="Skeleton"
      width={width}
      height={height}
      flexShrink={0}
      backgroundColor={theme.muted}
    />
  )
}
