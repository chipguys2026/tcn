import { useRenderer } from '@opentui/react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import {
  type CatalogIcon,
  catalogIcons,
  iconsPerPage,
  searchIcons,
} from '@/features/gallery/utils/icon-catalog'
import {
  type IconSetName,
  iconSets,
  nerdFontsVersion,
} from '@/lib/ui/nerd-fonts/index'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { useRouter } from '@/router/index'

export default function IconsPage() {
  const theme = useTheme()
  const renderer = useRenderer()
  const { navigate } = useRouter()
  const [query, setQuery] = useState('')
  const [set, setSet] = useState<IconSetName | 'all'>('all')
  const [page, setPage] = useState(0)
  const [selection, setSelection] = useState<CatalogIcon | null>(null)
  const [status, setStatus] = useState(
    'Select a result, then copy its name, glyph or usage.',
  )
  const matches = useMemo(() => searchIcons(query, set), [query, set])
  const pages = Math.max(1, Math.ceil(matches.length / iconsPerPage))
  const currentPage = Math.min(page, pages - 1)
  const results = matches.slice(
    currentPage * iconsPerPage,
    (currentPage + 1) * iconsPerPage,
  )
  const selected = selection ?? results[0]
  function resetSelection() {
    setPage(0)
    setSelection(null)
    setStatus('Select a result, then copy its name, glyph or usage.')
  }
  function copy(value: string, label: string) {
    try {
      setStatus(
        renderer.copyToClipboardOSC52(value)
          ? `${label} sent to the terminal clipboard.`
          : 'Clipboard unavailable. Select and copy the displayed name instead.',
      )
    } catch {
      setStatus(
        'Clipboard unavailable. Select and copy the displayed name instead.',
      )
    }
  }
  return (
    <box flexGrow={1} minHeight={0} flexDirection="column" padding={1} gap={1}>
      <text fg={theme.foreground} height={1} flexShrink={0} truncate>
        {`Nerd Fonts ${nerdFontsVersion} / ${catalogIcons.length} names / ${Object.keys(iconSets).length} sets`}
      </text>
      <box flexDirection="row" flexWrap="wrap" gap={1} flexShrink={0}>
        <Button
          id="icons-back"
          variant="secondary"
          onPress={() => navigate('/gallery')}
        >
          Components
        </Button>
        <Button variant="ghost" onPress={() => navigate('/')}>
          Home
        </Button>
      </box>
      <Input
        id="icons-search"
        autoFocus
        label="Search icons"
        placeholder="Search name, set or U+codepoint"
        value={query}
        onValueChange={(value) => {
          setQuery(value)
          resetSelection()
        }}
      />
      <box flexDirection="row" flexWrap="wrap" gap={1} flexShrink={0}>
        <Select
          value={set}
          onValueChange={(value) => {
            setSet(value as IconSetName | 'all')
            resetSelection()
          }}
        >
          <SelectTrigger label="Icon set">
            {set === 'all' ? 'All icon sets' : iconSets[set].label}
          </SelectTrigger>
          <SelectContent maxWidth={36}>
            <SelectItem value="all">All icon sets</SelectItem>
            {Object.entries(iconSets).map(([name, data]) => (
              <SelectItem
                key={name}
                value={name}
              >{`${data.label} (${data.count})`}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          id="icons-previous"
          variant="secondary"
          disabled={currentPage === 0}
          onPress={() => {
            setPage(currentPage - 1)
            setSelection(null)
          }}
        >
          Previous
        </Button>
        <Button
          id="icons-next"
          variant="secondary"
          disabled={currentPage + 1 >= pages}
          onPress={() => {
            setPage(currentPage + 1)
            setSelection(null)
          }}
        >
          Next
        </Button>
      </box>
      <text fg={theme.mutedForeground} height={1} flexShrink={0} truncate>
        {`${matches.length} results / Page ${currentPage + 1} of ${pages} / Requires a Nerd Font in your terminal`}
      </text>
      <scrollbox
        flexGrow={1}
        flexBasis={0}
        minHeight={0}
        scrollY
        scrollX={false}
        focusable={false}
        viewportCulling={false}
      >
        <box flexDirection="column" gap={1} paddingX={1}>
          {results.length ? (
            results.map((icon) => (
              <Button
                id={`icon-result-${icon.set}-${icon.name}`}
                key={icon.qualifiedName}
                icon={icon.glyph}
                width="100%"
                variant={
                  selected?.qualifiedName === icon.qualifiedName
                    ? 'secondary'
                    : 'ghost'
                }
                onPress={() => {
                  setSelection(icon)
                  setStatus(`Selected ${icon.qualifiedName}`)
                }}
              >
                {`${icon.qualifiedName} / ${icon.codepoint}`}
              </Button>
            ))
          ) : (
            <text fg={theme.mutedForeground}>
              No matching icons. Try another name or set.
            </text>
          )}
        </box>
      </scrollbox>
      <box flexDirection="column" gap={0} flexShrink={0}>
        <text fg={theme.foreground} height={1} truncate>
          {selected
            ? `${selected.glyph}  ${selected.qualifiedName}  ${selected.codepoint}`
            : 'No icon selected'}
        </text>
        <text fg={theme.mutedForeground} height={1} truncate>
          {selected
            ? `Install: tcn add icons/${selected.set} / Use: icon={${selected.reference}}`
            : ''}
        </text>
        <box flexDirection="row" flexWrap="wrap" gap={1} marginY={1}>
          <Button
            id="icons-copy-name"
            disabled={!selected}
            onPress={() => {
              if (selected) copy(selected.qualifiedName, 'Name')
            }}
          >
            Copy name
          </Button>
          <Button
            id="icons-copy-glyph"
            disabled={!selected}
            onPress={() => {
              if (selected) copy(selected.glyph, 'Glyph')
            }}
          >
            Copy glyph
          </Button>
          <Button
            id="icons-copy-usage"
            disabled={!selected}
            onPress={() => {
              if (selected) copy(selected.usage, 'Usage')
            }}
          >
            Copy usage
          </Button>
        </box>
        <text fg={theme.mutedForeground} height={1} truncate>
          {status}
        </text>
      </box>
    </box>
  )
}
