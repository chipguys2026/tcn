import type { BoxRenderable } from '@opentui/core'
import { createContext, type RefObject } from 'react'

/** Visual ownership only. Native editors keep their existing focus and input logic. */
export const EditorGroupContext = createContext<{
  surface: RefObject<BoxRenderable | null>
  background: string
  disabled: boolean
  invalid: boolean
} | null>(null)
