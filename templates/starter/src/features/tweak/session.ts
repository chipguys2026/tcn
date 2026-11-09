import { emptyReview, type ReviewDocument } from './schema'
import { readReview, reviewPaths, writeReview } from './storage'
import { useStyleReviewStore } from './store'

const hydrations = new Map<string, Promise<void>>()
let writes = Promise.resolve()
export function queueStyleDraft(path: string, document: ReviewDocument) {
  const next = writes.catch(() => {}).then(() => writeReview(path, document))
  writes = next
  return next
}
export async function hydrateStyleReview(path = reviewPaths().draft) {
  if (useStyleReviewStore.getState().hydrated) return
  let hydration = hydrations.get(path)
  if (!hydration) {
    hydration = readReview(path)
      .then((document) =>
        useStyleReviewStore.getState().load(document ?? emptyReview()),
      )
      .catch((error) => {
        hydrations.delete(path)
        throw error
      })
    hydrations.set(path, hydration)
  }
  await hydration
}
