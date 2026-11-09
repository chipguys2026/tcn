import { createCliRenderer } from '@opentui/core'
import { createRoot } from '@opentui/react'
import { ErrorBoundary } from '@/components/shared/error-boundary'
import { RouterView } from '@/router/router-view'

const renderer = await createCliRenderer({ exitOnCtrlC: true })
const root = createRoot(renderer)

function shutdown() {
  try {
    root.unmount()
  } finally {
    renderer.destroy()
  }
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)
process.once('exit', shutdown)

try {
  root.render(
    <ErrorBoundary>
      <RouterView />
    </ErrorBoundary>,
  )
} catch (error) {
  shutdown()
  throw error
}
