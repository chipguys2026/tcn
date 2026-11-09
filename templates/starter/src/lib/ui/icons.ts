// Nerd Fonts 3.5.1, Font Awesome glyph set. Requires a terminal Nerd Font.
export const icons = {
  plus: '\uf067',
  search: '\uf002',
  close: '\uf00d',
  check: '\uf00c',
  info: '\uf05a',
  error: '\uf057',
  minus: '\uf068',
  save: '\uf0c7',
  trash: '\uf1f8',
  refresh: '\uf021',
  arrowRight: '\uf061',
  arrowsHorizontal: '\uf07e',
  arrowsVertical: '\uf07d',
  folder: '\uf07b',
  settings: '\uf013',
  menu: '\uf0c9',
  chevronDown: '\uf078',
  chevronUp: '\uf077',
} as const

export type IconName = keyof typeof icons

// Nerd Fonts Powerline Extra: left/right solid semicircles, one terminal cell each.
export const pillCaps = { left: '\ue0b6', right: '\ue0b4' } as const
