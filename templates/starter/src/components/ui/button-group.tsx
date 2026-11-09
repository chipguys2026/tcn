import { createContext, type PropsWithChildren, useContext } from 'react'
import { PartBox, PartText } from '@/lib/ui/parts'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { buttonGroupDefaults } from './button-group.styles'
import { Separator } from './separator'

const Orientation = createContext<'horizontal' | 'vertical'>('horizontal')
export function ButtonGroup({
  children,
  orientation = 'horizontal',
}: PropsWithChildren<{ orientation?: 'horizontal' | 'vertical' }>) {
  return (
    <Orientation value={orientation}>
      <PartBox
        source="button-group"
        part="ButtonGroup"
        flexDirection={orientation === 'horizontal' ? 'row' : 'column'}
        alignSelf="flex-start"
        flexWrap="wrap"
        gap={buttonGroupDefaults.gap}
      >
        {children}
      </PartBox>
    </Orientation>
  )
}
export function ButtonGroupText({ children }: { children: string }) {
  const theme = useTheme()
  return (
    <PartBox
      source="button-group"
      part="ButtonGroupText"
      paddingX={buttonGroupDefaults.textPaddingX}
      backgroundColor={theme.muted}
    >
      <PartText source="button-group" part="ButtonGroupText.text" height={1}>
        {children}
      </PartText>
    </PartBox>
  )
}
export function ButtonGroupSeparator() {
  const orientation = useContext(Orientation)
  return (
    <Separator
      orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
      length={orientation === 'horizontal' ? 1 : undefined}
      stretch={orientation === 'vertical'}
      styleSource="button-group"
      stylePart="ButtonGroupSeparator"
    />
  )
}
