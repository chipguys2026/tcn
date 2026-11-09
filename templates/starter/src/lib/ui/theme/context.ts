import { createContext } from 'react'
import type { ThemeTokens } from './tokens'
import { themes } from './tokens'

export const ThemeContext = createContext<ThemeTokens>(themes.light)
