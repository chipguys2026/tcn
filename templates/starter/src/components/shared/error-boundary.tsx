import { Component, type ErrorInfo, type PropsWithChildren } from 'react'
import { themes } from '@/lib/ui/styles'

type ErrorState = { failed: boolean }

export class ErrorBoundary extends Component<PropsWithChildren, ErrorState> {
  override state: ErrorState = { failed: false }

  static getDerivedStateFromError(): ErrorState {
    return { failed: true }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application render failed', error, info.componentStack)
  }

  override render() {
    if (this.state.failed) {
      return (
        <text fg={themes.light.destructive}>
          Application failed to render. Press Ctrl+C to exit.
        </text>
      )
    }

    return this.props.children
  }
}
