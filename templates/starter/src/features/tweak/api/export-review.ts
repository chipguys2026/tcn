import { writeReview } from '@/features/tweak/api/review.storage'
import type { ReviewDocument } from '@/features/tweak/schemas/review.schema'

/** A review proposal only; never loaded by normal application startup. */
export async function exportDefaults(path: string, document: ReviewDocument) {
  await writeReview(path, { ...document, baselines: {} })
}
