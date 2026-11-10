import type { IconGlyph } from '@/lib/ui/icons'
import { type IconSetName, iconSets } from '@/lib/ui/nerd-fonts/index'

export type CatalogIcon = {
  set: IconSetName
  name: string
  qualifiedName: string
  glyph: IconGlyph
  codepoint: string
  reference: string
  usage: string
  searchable: string
}

export const catalogIcons: readonly CatalogIcon[] = Object.entries(
  iconSets,
).flatMap(([set, data]) =>
  Object.entries(data.glyphs).map(([name, glyph]) => {
    const codepoint = `U+${glyph.codePointAt(0)?.toString(16).toUpperCase()}`
    const reference = /^[a-zA-Z_$][\w$]*$/.test(name)
      ? `${set}.${name}`
      : `${set}[${JSON.stringify(name)}]`
    return {
      set: set as IconSetName,
      name,
      qualifiedName: `nf-${set}-${name}`,
      glyph,
      codepoint,
      reference,
      usage: `import { Button } from '@/components/ui/button'\nimport { ${set} } from '@/lib/ui/nerd-fonts/sets/${set}'\n\n<Button icon={${reference}}>Action</Button>`,
      searchable:
        `${set}-${name} ${set}:${name} ${reference} ${data.label} ${name.replaceAll('_', ' ')} ${codepoint} ${glyph}`.toLowerCase(),
    }
  }),
)

export function searchIcons(query: string, set: IconSetName | 'all' = 'all') {
  const terms = query
    .trim()
    .toLowerCase()
    .replace(/^nf-/, '')
    .split(/\s+/)
    .filter(Boolean)
  return catalogIcons.filter(
    (icon) =>
      (set === 'all' || icon.set === set) &&
      terms.every((term) => icon.searchable.includes(term)),
  )
}
export const iconsPerPage = 24
