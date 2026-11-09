import { createContext } from 'react'
import type { ThemeTokens } from '@/lib/ui/styles'
import { themes } from '@/lib/ui/styles'

export const ThemeContext = createContext<ThemeTokens>(themes.light)
