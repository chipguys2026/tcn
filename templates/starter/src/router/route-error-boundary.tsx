import { Component, type ErrorInfo, type PropsWithChildren } from 'react'
import type { RouteComponent, RouteErrorProps } from './types'

type BoundaryProps = PropsWithChildren<{
  fallback: RouteComponent<RouteErrorProps>
  resetKey: string
}>

type BoundaryState = { error: Error | null; resetKey: string }

export class RouteErrorBoundary extends Component<
  BoundaryProps,
  BoundaryState
> {
  override state: BoundaryState = { error: null, resetKey: this.props.resetKey }

  static getDerivedStateFromProps(props: BoundaryProps, state: BoundaryState) {
    return props.resetKey === state.resetKey
      ? null
      : { error: null, resetKey: props.resetKey }
  }

  static getDerivedStateFromError(error: unknown) {
    return { error: error instanceof Error ? error : new Error(String(error)) }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Route render failed', error, info.componentStack)
  }

  private reset = () => this.setState({ error: null })

  override render() {
    if (this.state.error) {
      const Fallback = this.props.fallback
      return <Fallback error={this.state.error} reset={this.reset} />
    }
    return this.props.children
  }
}
