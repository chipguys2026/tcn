import {
  type ComponentReview,
  colorFields,
  layoutFields,
  type PartObservation,
  type ReviewField,
  type ReviewStyle,
  type ReviewValue,
} from '@/lib/ui/style-review'
import { type ThemeName, themes } from '@/lib/ui/styles'

export type ReviewDocument = {
  version: 1
  partsVersion: 2
  styleMode: 'shared-with-overrides'
  units: 'terminal-cells'
  components: Record<string, ComponentReview>
  baselines: Record<
    string,
    Partial<Record<ThemeName, Record<string, PartObservation>>>
  >
}
export const emptyProfile = (): ComponentReview => ({
  parts: {},
  notes: '',
  reviewed: false,
})
export const emptyReview = (): ReviewDocument => ({
  version: 1,
  partsVersion: 2,
  styleMode: 'shared-with-overrides',
  units: 'terminal-cells',
  components: {},
  baselines: {},
})
export function validValue(
  field: ReviewField,
  value: unknown,
): value is ReviewValue {
  if ((colorFields as readonly string[]).includes(field))
    return (
      typeof value === 'string' &&
      (/^#[\da-f]{6}([\da-f]{2})?$/i.test(value) ||
        (value.startsWith('@') && Object.hasOwn(themes.light, value.slice(1))))
    )
  if (field === 'minWidth' && value === 'trigger') return true
  const dimension =
    /^(?:min|max)?(?:Width|Height)$/.test(field) ||
    field === 'width' ||
    field === 'height'
  if (dimension && typeof value === 'string')
    return value === 'auto' || /^(100|\d{1,2})%$/.test(value)
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= (dimension ? 1 : 0) &&
    value <= (dimension ? 240 : 20)
  )
}
const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value)
const safeKey = (key: string) =>
  /^[a-zA-Z][\w./-]{0,120}$/.test(key) &&
  !['__proto__', 'constructor', 'prototype'].includes(key)
const fields = new Set<string>([...layoutFields, ...colorFields])
export function parseReview(text: string): ReviewDocument {
  const data: unknown = JSON.parse(text)
  if (
    !record(data) ||
    data.version !== 1 ||
    (data.partsVersion !== undefined && data.partsVersion !== 2) ||
    (data.styleMode !== undefined &&
      data.styleMode !== 'shared-with-overrides') ||
    data.units !== 'terminal-cells' ||
    !record(data.components)
  )
    throw new Error('Unsupported component review file')
  const result = emptyReview()
  for (const [name, raw] of Object.entries(data.components)) {
    if (
      !safeKey(name) ||
      !record(raw) ||
      !record(raw.parts) ||
      typeof raw.notes !== 'string' ||
      raw.notes.length > 10000 ||
      typeof raw.reviewed !== 'boolean'
    )
      throw new Error(`Invalid component: ${name}`)
    const parts: Record<string, ReviewStyle> = {}
    for (const [part, style] of Object.entries(raw.parts)) {
      if (!safeKey(part) || !record(style))
        throw new Error(`Invalid part: ${part}`)
      const parsed: ReviewStyle = {}
      for (const [field, value] of Object.entries(style)) {
        if (!fields.has(field) || !validValue(field as ReviewField, value))
          throw new Error(`Invalid style: ${name}/${part}/${field}`)
        parsed[field as ReviewField] = value
      }
      parts[part] = parsed
    }
    result.components[name] = {
      parts,
      notes: raw.notes,
      reviewed: raw.reviewed,
    }
  }
  if (data.partsVersion !== 2) {
    // Preserve older shared proposals by snapshotting them into the newly independent parts.
    for (const profile of Object.values(result.components)) {
      const copy = (from: string, to: string) => {
        if (profile.parts[from] && !profile.parts[to])
          profile.parts[to] = { ...profile.parts[from] }
      }
      for (const suffix of ['', '.text']) {
        copy(`table/Cell${suffix}`, `table/TableHead${suffix}`)
        copy(`table/Cell${suffix}`, `table/TableCell${suffix}`)
        delete profile.parts[`table/Cell${suffix}`]
        copy(
          `dropdown-menu/DropdownMenuItem${suffix}`,
          `dropdown-menu/DropdownMenuCheckboxItem${suffix}`,
        )
        copy(
          `dropdown-menu/DropdownMenuItem${suffix}`,
          `dropdown-menu/DropdownMenuRadioItem${suffix}`,
        )
        copy(
          `alert-dialog/Close${suffix}`,
          `alert-dialog/AlertDialogAction${suffix}`,
        )
        copy(
          `alert-dialog/Close${suffix}`,
          `alert-dialog/AlertDialogCancel${suffix}`,
        )
        delete profile.parts[`alert-dialog/Close${suffix}`]
      }
      const tooltip = profile.parts['tooltip/TooltipContent']
      if (tooltip && (tooltip.fg !== undefined || tooltip.bg !== undefined)) {
        profile.parts['tooltip/TooltipContent.text'] = {
          ...profile.parts['tooltip/TooltipContent.text'],
          ...(tooltip.fg !== undefined ? { fg: tooltip.fg } : {}),
          ...(tooltip.bg !== undefined ? { bg: tooltip.bg } : {}),
        }
        delete tooltip.fg
        delete tooltip.bg
      }
    }
  }
  // Baselines are observations, not executable/imported styles; recapture from live components.
  return result
}
