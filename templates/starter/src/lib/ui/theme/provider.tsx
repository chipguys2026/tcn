import type { PropsWithChildren } from 'react'
import { ThemeContext } from './context'
import type { ThemeName } from './tokens'
import { themes } from './tokens'

type ThemeProviderProps = PropsWithChildren<{ theme?: ThemeName }>

export function ThemeProvider({
  children,
  theme = 'light',
}: ThemeProviderProps) {
  return <ThemeContext value={themes[theme]}>{children}</ThemeContext>
}
