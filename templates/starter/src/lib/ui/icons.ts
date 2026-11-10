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

declare const nerdFontGlyph: unique symbol
/** A glyph from a generated, typed Nerd Fonts set. */
export type IconGlyph = string & { readonly [nerdFontGlyph]: true }
export type IconValue = IconName | IconGlyph

export function defineIconSet<const T extends Record<string, string>>(
  glyphs: T,
) {
  return Object.freeze(glyphs) as unknown as {
    readonly [K in keyof T]: IconGlyph
  }
}

export function resolveIcon(value: IconValue): string {
  return Object.hasOwn(icons, value) ? icons[value as IconName] : value
}

// Nerd Fonts Powerline Extra: left/right solid semicircles, one terminal cell each.
export const pillCaps = { left: '\ue0b6', right: '\ue0b4' } as const

/* Nerd Fonts glyph mapping data, MIT License.
Copyright (c) 2014 Ryan L McIntyre

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */
