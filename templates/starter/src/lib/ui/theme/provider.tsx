import type { PropsWithChildren } from 'react'
import type { ThemeName } from '@/lib/ui/styles'
import { themes } from '@/lib/ui/styles'
import { ThemeContext } from './context'

type ThemeProviderProps = PropsWithChildren<{ theme?: ThemeName }>

export function ThemeProvider({
  children,
  theme = 'light',
}: ThemeProviderProps) {
  return <ThemeContext value={themes[theme]}>{children}</ThemeContext>
}
