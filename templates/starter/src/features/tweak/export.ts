import type { ReviewDocument } from './schema'
import { writeReview } from './storage'

/** A review proposal only; never loaded by normal application startup. */
export async function exportDefaults(path: string, document: ReviewDocument) {
  await writeReview(path, { ...document, baselines: {} })
}
