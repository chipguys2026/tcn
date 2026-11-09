import { create } from 'zustand'
import type {
  ComponentReview,
  PartObservation,
  ReviewField,
  ReviewValue,
} from '@/lib/ui/style-review'
import type { ThemeName } from '@/lib/ui/styles'
import {
  emptyProfile,
  emptyReview,
  type ReviewDocument,
  validValue,
} from './schema'
export function createStyleReviewStore() {
  return create<{
    document: ReviewDocument
    hydrated: boolean
    revision: number
    undoStack: ReviewDocument['components'][]
    redoStack: ReviewDocument['components'][]
    load: (document: ReviewDocument) => void
    edit: (
      name: string,
      update: (profile: ComponentReview) => ComponentReview,
    ) => void
    setField: (
      name: string,
      part: string,
      field: ReviewField,
      value: ReviewValue | undefined,
    ) => void
    resetFields: (
      targets: { owner: string; part: string; field: ReviewField }[],
    ) => void
    observe: (name: string, theme: ThemeName, parts: PartObservation[]) => void
    undo: () => void
    redo: () => void
  }>((set, get) => ({
    document: emptyReview(),
    hydrated: false,
    revision: 0,
    undoStack: [],
    redoStack: [],
    load: (document) =>
      set((state) => ({
        document,
        hydrated: true,
        revision: state.revision + 1,
        undoStack: [],
        redoStack: [],
      })),
    edit(name, update) {
      set((state) => {
        const profile = update(
          state.document.components[name] ?? emptyProfile(),
        )
        if (
          JSON.stringify(profile) ===
          JSON.stringify(state.document.components[name] ?? emptyProfile())
        )
          return state
        return {
          document: {
            ...state.document,
            components: { ...state.document.components, [name]: profile },
          },
          revision: state.revision + 1,
          undoStack: [...state.undoStack.slice(-49), state.document.components],
          redoStack: [],
        }
      })
    },
    setField(name, part, field, value) {
      if (value !== undefined && !validValue(field, value))
        throw new Error(`Invalid ${field}`)
      get().edit(name, (profile) => {
        const style = { ...profile.parts[part] }
        if (value === undefined) delete style[field]
        else style[field] = value
        const parts = { ...profile.parts }
        if (Object.keys(style).length) parts[part] = style
        else delete parts[part]
        return { ...profile, parts, reviewed: false }
      })
    },
    resetFields(targets) {
      set((state) => {
        const components = { ...state.document.components }
        let changed = false
        for (const target of targets) {
          const profile = components[target.owner]
          if (profile?.parts[target.part]?.[target.field] === undefined)
            continue
          const style = { ...profile.parts[target.part] }
          delete style[target.field]
          const parts = { ...profile.parts }
          if (Object.keys(style).length) parts[target.part] = style
          else delete parts[target.part]
          components[target.owner] = { ...profile, parts, reviewed: false }
          changed = true
        }
        return changed
          ? {
              document: { ...state.document, components },
              revision: state.revision + 1,
              undoStack: [
                ...state.undoStack.slice(-49),
                state.document.components,
              ],
              redoStack: [],
            }
          : state
      })
    },
    observe(name, theme, parts) {
      set((state) => {
        const baseline = state.document.baselines[name]?.[theme] ?? {},
          next = { ...baseline }
        let changed = false
        for (const part of parts)
          if (JSON.stringify(baseline[part.part]) !== JSON.stringify(part)) {
            next[part.part] = part
            changed = true
          }
        if (!changed) return state
        return {
          document: {
            ...state.document,
            baselines: {
              ...state.document.baselines,
              [name]: { ...state.document.baselines[name], [theme]: next },
            },
          },
          revision: state.revision + 1,
        }
      })
    },
    undo() {
      set((state) => {
        const previous = state.undoStack.at(-1)
        if (!previous) return state
        return {
          document: { ...state.document, components: previous },
          undoStack: state.undoStack.slice(0, -1),
          redoStack: [...state.redoStack, state.document.components],
          revision: state.revision + 1,
        }
      })
    },
    redo() {
      set((state) => {
        const next = state.redoStack.at(-1)
        if (!next) return state
        return {
          document: { ...state.document, components: next },
          redoStack: state.redoStack.slice(0, -1),
          undoStack: [...state.undoStack, state.document.components],
          revision: state.revision + 1,
        }
      })
    },
  }))
}
export const useStyleReviewStore = createStyleReviewStore()
