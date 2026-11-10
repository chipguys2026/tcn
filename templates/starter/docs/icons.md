# Icons

Use the built-in aliases for common actions or import typed glyphs from the complete Nerd Fonts catalog. The catalog requires TCN 0.2.0 or newer and includes **10,995 names across 17 sets**, pinned to Nerd Fonts **3.5.1**.

Configure a Nerd Font in your terminal to display the glyphs. TCN supplies Unicode mappings, not font binaries. A different Nerd Fonts version may have different glyph coverage.

## Use an existing alias

```tsx
import { Button } from '@/components/ui/button'

<Button icon="save">Save</Button>
```

The 18 aliases remain available: `plus`, `search`, `close`, `check`, `info`, `error`, `minus`, `save`, `trash`, `refresh`, `arrowRight`, `arrowsHorizontal`, `arrowsVertical`, `folder`, `settings`, `menu`, `chevronDown` and `chevronUp`.

## Install a set

From a project configured with TCN:

```sh
tcn list --icons
tcn add icons/fa
```

Import directly from the installed set:

```tsx
import { Button } from '@/components/ui/button'
import { fa } from '@/lib/ui/nerd-fonts/sets/fa'

<Button icon={fa.address_book}>Contacts</Button>
```

Glyphs work in component `icon` props, including Button, Alert and Empty Media, or directly inside `<text>`. Icon-only buttons still require a descriptive label.

```tsx
import { Button } from '@/components/ui/button'
import { md } from '@/lib/ui/nerd-fonts/sets/md'

<Button icon={md.account} label="Account" />
```

Install Material Design with `tcn add icons/md` before using that example. `IconName` remains the legacy alias names. `IconValue` accepts an alias or an imported `IconGlyph`, so TypeScript checks both the set's property names and the component's icon prop.

Names beginning with a digit use bracket access, such as `fa['500px']`. Names displayed as `nf-fa-address_book` follow Nerd Fonts' cheat-sheet naming; pass the imported glyph rather than that name string to a component.

## Choose how much source to install

| Command | Source installed |
| --- | --- |
| `tcn add button` | Button and its helpers; no full icon catalog. |
| `tcn add icons/fa` | Font Awesome and the small shared glyph helper. |
| `tcn add icons/fa icons/md` | The two selected sets. |
| `tcn add icons/all` | Every set plus the combined entry point. |

Individual sets do not import the combined catalog. Use direct set imports to keep dependencies explicit. `tcn add --all` selects UI components; install all icons explicitly with `icons/all`.

New starters include every set because Gallery browses the complete catalog. Existing applications can install only the sets they need. Removing Gallery and unused sets from a starter is an application cleanup; component updates do not remove sample screens.

## Browse and copy

Run `bun run dev`, open Gallery and choose **Nerd Fonts**, or navigate to `/gallery/icons`.

- Search by name, namespace, words or codepoint: `address book`, `nf-fa-address_book` or `U+F2B9`.
- Filter to a set and use Previous/Next to browse results.
- Activate a result to preview its glyph, name, codepoint and installation command.
- Copy its cheat-sheet name, Unicode glyph or usage example.

The browser displays 24 results per page. Copy uses the terminal clipboard transport; if unavailable, the name remains visible for manual copying.

## Available sets

Aliases can share a glyph. The 10,995 names map to 10,617 distinct Unicode glyphs.

| Set | Family | Names |
| --- | --- | ---: |
| `cod` | Codicons | 540 |
| `custom` | Custom | 45 |
| `dev` | Devicons | 613 |
| `extra` | Extra | 12 |
| `fa` | Font Awesome | 1,818 |
| `fae` | Font Awesome Extension | 170 |
| `iec` | IEC Power | 5 |
| `indent` | Indent | 2 |
| `indentation` | Indentation | 1 |
| `linux` | Font Logos | 134 |
| `md` | Material Design | 6,896 |
| `oct` | Octicons | 310 |
| `pl` | Powerline | 9 |
| `ple` | Powerline Extra | 34 |
| `pom` | Pomicons | 11 |
| `seti` | Seti UI | 167 |
| `weather` | Weather | 228 |

## Update or remove a set

```sh
tcn diff icons/fa
tcn add icons/fa --dry-run
tcn add icons/fa
tcn remove icons/fa --dry-run
```

Remove application imports before deleting a set. Gallery imports the complete catalog, and the complete pack also protects its dependent sets. Local edits and forced replacement follow the [normal source-management rules](tcn.md).

The mapping comes from the [official versioned dataset](https://github.com/ryanoasis/nerd-fonts/blob/v3.5.1/glyphnames.json). Generated source includes attribution, and the [upstream license](nerd-fonts-license.txt) accompanies the starter.
