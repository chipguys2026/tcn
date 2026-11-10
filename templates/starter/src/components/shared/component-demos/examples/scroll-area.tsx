import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTheme } from '@/lib/ui/theme/use-theme'

export function ScrollAreaDemo({
  report,
  initialOrientation = 'vertical',
}: {
  report?: (value: string) => void
  initialOrientation?: 'vertical' | 'horizontal' | 'both'
}) {
  const [orientation, setOrientation] = useState(initialOrientation),
    theme = useTheme()
  const horizontal = orientation !== 'vertical',
    rows = orientation === 'horizontal' ? 3 : 30
  return (
    <box flexDirection="column" gap={1}>
      <box flexDirection="row" gap={1} flexWrap="wrap">
        {(['vertical', 'horizontal', 'both'] as const).map((value) => (
          <Button
            key={value}
            variant={orientation === value ? 'secondary' : 'ghost'}
            onPress={() => {
              setOrientation(value)
              report?.(`Scroll: ${value}`)
            }}
          >
            {value === 'vertical'
              ? 'Vertical'
              : value === 'horizontal'
                ? 'Horizontal'
                : 'Both'}
          </Button>
        ))}
      </box>
      <text fg={theme.mutedForeground}>
        {horizontal
          ? 'Focus the region: Left/Right scroll horizontally.'
          : 'Focus the region: Up/Down or PageUp/PageDown.'}
      </text>
      <ScrollArea
        key={orientation}
        orientation={orientation}
        height={8}
        label={`${orientation} scrolling`}
      >
        <box
          width={horizontal ? 180 : '100%'}
          height={rows}
          flexShrink={0}
          flexDirection="column"
        >
          {Array.from({ length: rows }, (_, index) => index + 1).map((row) => (
            <text
              key={`row-${row}`}
              height={1}
              flexShrink={0}
              wrapMode="none"
              fg={theme.foreground}
            >
              {horizontal
                ? `Row ${row}  ${Array.from({ length: 14 }, (_, index) => `Column ${index + 1}`.padEnd(12)).join('')}`
                : `Scrollable row ${row}`}
            </text>
          ))}
        </box>
      </ScrollArea>
    </box>
  )
}
