import type { PropsWithChildren } from 'react'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import { ThemeProvider } from '@/lib/ui/theme/provider'
import { useTheme } from '@/lib/ui/theme/use-theme'

function ApplicationSurface({ children }: PropsWithChildren) {
  const theme = useTheme()

  return (
    <box
      width="100%"
      height="100%"
      flexDirection="column"
      backgroundColor={theme.background}
    >
      {children}
    </box>
  )
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme="dark">
      <FocusScope>
        <ApplicationSurface>{children}</ApplicationSurface>
      </FocusScope>
    </ThemeProvider>
  )
}
