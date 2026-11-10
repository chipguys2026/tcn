import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import {
  parseReview,
  type ReviewDocument,
} from '@/features/tweak/schemas/review.schema'

export {
  emptyProfile,
  emptyReview,
  parseReview,
  type ReviewDocument,
  validValue,
} from '@/features/tweak/schemas/review.schema'

export function reviewPaths(directory = resolve(process.cwd(), 'design')) {
  return {
    directory,
    draft: join(directory, 'component-review.draft.json'),
    exported: join(directory, 'component-review.json'),
  }
}
export async function writeReview(path: string, document: ReviewDocument) {
  await mkdir(dirname(path), { recursive: true })
  const temporary = `${path}.${crypto.randomUUID()}.tmp`
  await writeFile(temporary, `${JSON.stringify(document, null, 2)}\n`, 'utf8')
  await rename(temporary, path)
}
export async function readReview(path: string): Promise<ReviewDocument | null> {
  try {
    return parseReview(await readFile(path, 'utf8'))
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'ENOENT'
    )
      return null
    throw error
  }
}
