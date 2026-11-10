import type { BoxRenderable } from '@opentui/core'
import { useKeyboard, useRenderer, useTerminalDimensions } from '@opentui/react'
import {
  type PropsWithChildren,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { styleDemos } from '@/components/shared/component-demos/catalog'
import { Button, type ButtonHandle } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { exportDefaults } from '@/features/tweak/api/export-review'
import {
  emptyProfile,
  readReview,
  reviewPaths,
  validValue,
} from '@/features/tweak/api/review.storage'
import {
  elementLabel,
  matchesPiece,
  PiecePreview,
  piecesFor,
} from '@/features/tweak/components/part-preview'
import { useStyleReviewStore } from '@/features/tweak/stores/review.store'
import {
  hydrateStyleReview as hydrate,
  queueStyleDraft as queueDraft,
} from '@/features/tweak/stores/review-session'
import { FocusScope } from '@/lib/ui/focus/focus-scope'
import {
  ComponentStylesProvider,
  colorFields,
  isButtonLayoutPart,
  type PartObservation,
  type ReviewField,
  type ReviewValue,
  resolvePartStyle,
  StyleReviewProvider,
  sharedStyleTarget,
  styleOwner,
} from '@/lib/ui/style-review'
import { type ThemeName, themes } from '@/lib/ui/styles'
import { ThemeProvider } from '@/lib/ui/theme/provider'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { useRouter } from '@/router/index'

function ReviewPreview({
  name,
  theme,
  children,
  viewport,
  openPopups,
}: PropsWithChildren<{
  name: string
  theme: ThemeName
  viewport: RefObject<BoxRenderable | null>
  openPopups: boolean
}>) {
  const profile =
    useStyleReviewStore((state) => state.document.components[name]) ??
    emptyProfile()
  const profiles = useStyleReviewStore((state) => state.document.components)
  const instances = useRef(new Map<string, PartObservation[]>())
  const observe = useCallback(
    (instance: string, parts: PartObservation[]) => {
      instances.current.set(instance, parts)
      const first = new Map<string, PartObservation>()
      for (const records of instances.current.values())
        for (const part of records)
          if (!first.has(part.part)) first.set(part.part, part)
      useStyleReviewStore.getState().observe(name, theme, [...first.values()])
    },
    [name, theme],
  )
  const forget = useCallback((instance: string) => {
    instances.current.delete(instance)
  }, [])
  const value = useMemo(
    () => ({ profile, observe, forget, viewport, openPopups }),
    [profile, observe, forget, viewport, openPopups],
  )
  return (
    <ComponentStylesProvider profiles={profiles}>
      <StyleReviewProvider value={value}>{children}</StyleReviewProvider>
    </ComponentStylesProvider>
  )
}
function PreviewSurface({ children }: PropsWithChildren) {
  const theme = useTheme()
  return (
    <box
      flexDirection="column"
      gap={2}
      padding={2}
      backgroundColor={theme.background}
    >
      {children}
    </box>
  )
}

function Field({
  field,
  value,
  changed,
  onChange,
  onError,
}: {
  field: ReviewField
  value: ReviewValue | undefined
  changed: boolean
  onChange: (value: ReviewValue | undefined) => void
  onError: (error: string) => void
}) {
  const theme = useTheme(),
    [draft, setDraft] = useState(String(value ?? 'auto'))
  useEffect(() => setDraft(String(value ?? 'auto')), [value])
  const color = (colorFields as readonly string[]).includes(field)
  function apply(text: string) {
    if (!text.trim() || (color && text.trim() === 'auto')) {
      onChange(undefined)
      return
    }
    const next =
      color || text === 'auto' || text === 'trigger' || text.endsWith('%')
        ? text.trim()
        : Number(text)
    if (!validValue(field, next)) {
      onError(
        `${field}: ${color ? 'use #RRGGBB, #RRGGBBAA or @themeToken' : 'use whole cells (spacing 0..20, dimensions 1..240 / auto / %)'} `,
      )
      return
    }
    onChange(next)
  }
  function step(direction: number) {
    const next = Math.max(
      /width|height/i.test(field) ? 1 : 0,
      Math.min(
        /width|height/i.test(field) ? 240 : 20,
        (typeof value === 'number'
          ? value
          : field === 'width'
            ? 20
            : field === 'height'
              ? 1
              : 0) + direction,
      ),
    )
    setDraft(String(next))
    onChange(next)
  }
  return (
    <box flexDirection="column" gap={0}>
      <text
        height={1}
        fg={changed ? theme.primary : theme.mutedForeground}
      >{`${changed ? '* ' : ''}${field}`}</text>
      <box flexDirection="row" gap={1}>
        {!color && (
          <Button variant="ghost" onPress={() => step(-1)}>
            -
          </Button>
        )}
        <Input
          label={`Style ${field}`}
          value={draft}
          onValueChange={setDraft}
          onSubmit={apply}
          width={color ? 17 : 10}
        />
        {!color && (
          <Button variant="ghost" onPress={() => step(1)}>
            +
          </Button>
        )}
        {color && (
          <Select
            onValueChange={(token) => {
              setDraft(token)
              onChange(token)
            }}
          >
            <SelectTrigger label={`${field} palette`}>Palette</SelectTrigger>
            <SelectContent width={34} height={16}>
              {Object.keys(themes.light).map((token) => (
                <SelectItem key={token} value={`@${token}`}>
                  {token}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Button
          variant="ghost"
          disabled={!changed}
          onPress={() => onChange(undefined)}
        >
          Reset
        </Button>
      </box>
    </box>
  )
}

function TweakContent({
  storageDirectory,
}: {
  storageDirectory?: string
} = {}) {
  const paths = useMemo(() => reviewPaths(storageDirectory), [storageDirectory])
  const { navigate } = useRouter(),
    theme = useTheme(),
    dimensions = useTerminalDimensions(),
    renderer = useRenderer()
  const document = useStyleReviewStore((state) => state.document),
    hydrated = useStyleReviewStore((state) => state.hydrated)
  const undoCount = useStyleReviewStore((state) => state.undoStack.length),
    redoCount = useStyleReviewStore((state) => state.redoStack.length)
  const [name, setName] = useState('button'),
    [pieceName, setPieceName] = useState(''),
    [part, setPart] = useState(''),
    [editScope, setEditScope] = useState<'shared' | 'local' | null>(null),
    [previewTheme, setPreviewTheme] = useState<ThemeName>('dark'),
    [revision, resetPreview] = useState(0)
  const [status, setStatus] = useState('Loading draft...'),
    [loadError, setLoadError] = useState(false),
    [showJSON, setShowJSON] = useState(false),
    [busy, setBusy] = useState(false)
  const [view, setView] = useState<'split' | 'editor' | 'preview'>('split')
  const editorEntry = useRef<ButtonHandle>(null),
    previewEntry = useRef<ButtonHandle>(null),
    previewNode = useRef<BoxRenderable>(null),
    pageNode = useRef<BoxRenderable>(null)
  const alive = useRef(true)
  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
      const state = useStyleReviewStore.getState()
      if (state.hydrated)
        void queueDraft(paths.draft, state.document).catch(() => {})
    }
  }, [paths.draft])
  const load = useCallback(() => {
    setLoadError(false)
    void hydrate(paths.draft)
      .then(() => {
        if (alive.current)
          setStatus(
            'Draft loaded. Shared values update reused components in previews.',
          )
      })
      .catch((error) => {
        if (alive.current) {
          setLoadError(true)
          setStatus(String(error))
        }
      })
  }, [paths.draft])
  useEffect(load, [load])
  useEffect(() => {
    if (!hydrated) return
    const timer = setTimeout(() => {
      void queueDraft(paths.draft, document)
        .then(() => {
          if (alive.current)
            setStatus('Draft saved / design/component-review.draft.json')
        })
        .catch((error) => {
          if (alive.current) setStatus(`Draft save failed: ${String(error)}`)
        })
    }, 500)
    return () => clearTimeout(timer)
  }, [document, hydrated, paths.draft])
  const pieces = piecesFor(name)
  const selectedPiece =
    pieces.find((piece) => piece.name === pieceName) ?? pieces[0]
  const profile = document.components[name] ?? emptyProfile(),
    baseline = document.baselines[name]?.[previewTheme] ?? {}
  const parts = Object.values(baseline)
    .filter((part) => selectedPiece && matchesPiece(part.part, selectedPiece))
    .sort(
      (a, b) =>
        Number(!a.part.startsWith(`${name}/`)) -
          Number(!b.part.startsWith(`${name}/`)) ||
        a.part.localeCompare(b.part),
    )
  const current = parts.find((item) => item.part === part) ?? parts[0],
    activePart = current?.part ?? ''
  const buttonSurface = isButtonLayoutPart(activePart)
  const owner = buttonSurface ? 'button' : styleOwner(activePart) || name
  const composed = owner !== name
  const localStyle = profile.parts[activePart]
  const scope = composed
    ? (editScope ??
      (!buttonSurface && localStyle && Object.keys(localStyle).length
        ? 'local'
        : 'shared'))
    : 'shared'
  const effectiveStyle = resolvePartStyle(
    document.components,
    activePart,
    profile,
  )
  function targetFor(field: ReviewField) {
    return scope === 'local'
      ? { owner: name, part: activePart }
      : sharedStyleTarget(activePart, field)
  }
  const resetTargets = (current?.fields ?? []).map((field) => ({
    ...targetFor(field),
    field,
  }))
  const canReset = resetTargets.some(
    (target) =>
      document.components[target.owner]?.parts[target.part]?.[target.field] !==
      undefined,
  )
  function focusEditor() {
    if (view === 'preview') setView('editor')
    editorEntry.current?.focus()
  }
  function focusPreview() {
    if (view === 'editor') setView('preview')
    else previewEntry.current?.focus()
  }
  useEffect(() => {
    if (view === 'preview') previewEntry.current?.focus()
    else if (view === 'editor') editorEntry.current?.focus()
  }, [view])
  useKeyboard((key) => {
    if (key.defaultPrevented || key.name !== 'f6') return
    key.preventDefault()
    key.stopPropagation()
    let focused = renderer.currentFocusedRenderable
    let inPreview = false,
      inPage = false
    while (focused) {
      if (focused === previewNode.current) inPreview = true
      if (focused === pageNode.current) inPage = true
      focused = focused.parent
    }
    if (inPreview || !inPage || view === 'preview') focusEditor()
    else focusPreview()
  })
  async function exportJSON() {
    setBusy(true)
    try {
      await exportDefaults(
        paths.exported,
        useStyleReviewStore.getState().document,
      )
      setStatus('Exported / design/component-review.json')
    } catch (error) {
      setStatus(`Export failed: ${String(error)}`)
    } finally {
      setBusy(false)
    }
  }
  async function importJSON() {
    setBusy(true)
    try {
      const loaded = await readReview(paths.exported)
      if (!loaded) throw new Error('No design/component-review.json file found')
      useStyleReviewStore.getState().load(loaded)
      resetPreview((v) => v + 1)
      setStatus('Imported component-review.json')
    } catch (error) {
      setStatus(`Import failed: ${String(error)}`)
    } finally {
      setBusy(false)
    }
  }
  function updateNotes(notes: string) {
    const store = useStyleReviewStore.getState()
    store.edit(name, (profile) => ({
      ...profile,
      notes: notes.slice(0, 10000),
      reviewed: false,
    }))
  }
  const wide = dimensions.width >= 110
  return (
    <box
      ref={pageNode}
      flexGrow={1}
      minHeight={0}
      flexDirection="column"
      padding={1}
      gap={1}
    >
      <text height={1} flexShrink={0} fg={theme.foreground}>
        Tweak / component default parameters
      </text>
      <box flexDirection="row" gap={1} flexShrink={0} flexWrap="wrap">
        <Button
          ref={editorEntry}
          autoFocus
          variant="secondary"
          onPress={() => navigate('/gallery')}
        >
          Catalog
        </Button>
        <Select
          value={name}
          onValueChange={(value) => {
            setName(value)
            setEditScope(null)
            setPieceName('')
            setPart('')
            resetPreview((v) => v + 1)
          }}
        >
          <SelectTrigger label="Component">{name}</SelectTrigger>
          <SelectContent height={18} width={30}>
            {styleDemos.map((item) => (
              <SelectItem key={item.name} value={item.name}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          onPress={() =>
            setPreviewTheme((value) => (value === 'dark' ? 'light' : 'dark'))
          }
        >{`Preview: ${previewTheme}`}</Button>
        <Button variant="ghost" onPress={focusPreview}>
          Preview (F6)
        </Button>
        <Button
          variant="ghost"
          onPress={() =>
            setView((value) =>
              value === 'split'
                ? 'editor'
                : value === 'editor'
                  ? 'preview'
                  : 'split',
            )
          }
        >{`View: ${view}`}</Button>
      </box>
      <box flexDirection="row" gap={1} flexShrink={0} flexWrap="wrap">
        <Button disabled={!hydrated || busy} onPress={() => void exportJSON()}>
          Export JSON
        </Button>
        <Button
          variant="secondary"
          disabled={!hydrated || busy}
          onPress={() => void importJSON()}
        >
          Load exported
        </Button>
        <Button
          variant="ghost"
          disabled={!undoCount}
          onPress={() => useStyleReviewStore.getState().undo()}
        >
          Undo
        </Button>
        <Button
          variant="ghost"
          disabled={!redoCount}
          onPress={() => useStyleReviewStore.getState().redo()}
        >
          Redo
        </Button>
      </box>
      {!hydrated ? (
        <box flexDirection="column">
          <text fg={theme.mutedForeground}>
            {loadError
              ? 'Could not read draft. Existing file was preserved.'
              : 'Loading...'}
          </text>
          {loadError && <Button onPress={load}>Retry draft</Button>}
        </box>
      ) : (
        <box
          flexGrow={1}
          flexBasis={0}
          minHeight={0}
          flexDirection={wide ? 'row' : 'column'}
          gap={1}
        >
          <scrollbox
            visible={view !== 'preview'}
            width={wide && view === 'split' ? 49 : '100%'}
            flexGrow={wide && view === 'split' ? 0 : 1}
            flexBasis={wide && view === 'split' ? undefined : 0}
            minHeight={0}
            scrollY
            scrollX={false}
            focusable={false}
            viewportCulling={false}
            backgroundColor={theme.card}
          >
            <box flexDirection="column" gap={1} padding={1}>
              <text fg={theme.mutedForeground}>
                Subcomponent / shared across editor previews
              </text>
              {selectedPiece && (
                <Select
                  value={selectedPiece.name}
                  onValueChange={(value) => {
                    setPieceName(value)
                    setEditScope(null)
                    setPart('')
                    resetPreview((v) => v + 1)
                  }}
                >
                  <SelectTrigger label="Subcomponent">
                    {selectedPiece.label}
                  </SelectTrigger>
                  <SelectContent
                    width={46}
                    height={18}
                    maxWidth={46}
                    maxHeight={18}
                  >
                    {pieces.map((piece) => (
                      <SelectItem key={piece.name} value={piece.name}>
                        {piece.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {selectedPiece?.popup && (
                <text fg={theme.mutedForeground}>
                  Popup stays open while inspecting this part.
                </text>
              )}
              {parts.length > 0 && (
                <Select
                  value={activePart}
                  onValueChange={(value) => {
                    setPart(value)
                    setEditScope(null)
                  }}
                >
                  <SelectTrigger label="Component part">
                    {selectedPiece
                      ? elementLabel(activePart, selectedPiece)
                      : activePart}
                  </SelectTrigger>
                  <SelectContent
                    width={46}
                    height={18}
                    maxWidth={46}
                    maxHeight={18}
                  >
                    {parts.map((item) => (
                      <SelectItem key={item.part} value={item.part}>
                        {selectedPiece
                          ? elementLabel(item.part, selectedPiece)
                          : item.part}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <text
                fg={theme.mutedForeground}
              >{`Editing ${scope === 'local' ? `${name} override` : `shared ${owner}${buttonSurface ? ' layout' : ''}`} / ${activePart}`}</text>
              {buttonSurface && (
                <text fg={theme.mutedForeground}>
                  Button layout is shared; variant colors stay separate.
                </text>
              )}
              {composed && (
                <Button
                  variant="secondary"
                  onPress={() =>
                    setEditScope(scope === 'shared' ? 'local' : 'shared')
                  }
                >
                  {scope === 'shared'
                    ? `Override only in ${name}`
                    : `Edit shared ${owner}`}
                </Button>
              )}
              {composed && localStyle && Object.keys(localStyle).length > 0 && (
                <Button
                  variant="ghost"
                  onPress={() => {
                    useStyleReviewStore.getState().edit(name, (p) => {
                      const parts = { ...p.parts }
                      delete parts[activePart]
                      return { ...p, parts, reviewed: false }
                    })
                    setEditScope('shared')
                  }}
                >
                  Remove local override / inherit shared
                </Button>
              )}
              {composed &&
                scope === 'shared' &&
                localStyle &&
                Object.keys(localStyle).length > 0 && (
                  <text fg={theme.mutedForeground}>
                    Local overrides still take priority in this preview.
                  </text>
                )}
              <text fg={theme.mutedForeground}>
                +/-: live | typed values: Enter | *: override
              </text>
              {current?.fields.map((field) => {
                const target = targetFor(field)
                const value =
                  document.components[target.owner]?.parts[target.part]?.[field]
                const inherited =
                  scope === 'local'
                    ? resolvePartStyle(document.components, activePart)[field]
                    : undefined
                return (
                  <Field
                    key={`${name}/${activePart}/${field}`}
                    field={field}
                    value={value ?? inherited ?? current.defaults[field]}
                    changed={value !== undefined}
                    onError={setStatus}
                    onChange={(value) =>
                      useStyleReviewStore
                        .getState()
                        .setField(target.owner, target.part, field, value)
                    }
                  />
                )
              })}
              <Button
                variant="secondary"
                disabled={!canReset}
                onPress={() =>
                  useStyleReviewStore.getState().resetFields(resetTargets)
                }
              >
                {`Reset ${scope === 'local' ? 'override' : 'shared part'}`}
              </Button>
              <Button
                variant="secondary"
                disabled={!Object.keys(profile.parts).length}
                onPress={() =>
                  useStyleReviewStore
                    .getState()
                    .edit(name, (p) => ({ ...p, parts: {}, reviewed: false }))
                }
              >
                Reset component styles
              </Button>
              <text fg={theme.mutedForeground}>Notes for this component</text>
              <Textarea
                label="Review notes"
                height={3}
                value={profile.notes}
                onValueChange={updateNotes}
              />
              <Button
                variant={profile.reviewed ? 'secondary' : 'ghost'}
                onPress={() =>
                  useStyleReviewStore
                    .getState()
                    .edit(name, (p) => ({ ...p, reviewed: !p.reviewed }))
                }
              >
                {profile.reviewed ? 'Reviewed: yes' : 'Mark reviewed'}
              </Button>
              <Button
                variant="ghost"
                onPress={() => setShowJSON((value) => !value)}
              >
                {showJSON ? 'Hide component JSON' : 'Show component JSON'}
              </Button>
              {showJSON && (
                <Textarea
                  label="Component JSON"
                  height={8}
                  readOnly
                  value={JSON.stringify(
                    {
                      family: profile,
                      shared:
                        document.components[owner]?.parts[activePart] ?? {},
                      effective: effectiveStyle,
                    },
                    null,
                    2,
                  )}
                />
              )}
            </box>
          </scrollbox>
          <box
            ref={previewNode}
            visible={view !== 'editor'}
            flexGrow={1}
            flexBasis={0}
            minHeight={0}
            flexDirection="column"
          >
            <FocusScope loop={false} onExit={focusEditor}>
              <box flexDirection="row" gap={1} flexShrink={0}>
                <Button
                  ref={previewEntry}
                  variant="ghost"
                  onPress={focusEditor}
                >
                  Back to editor (F6)
                </Button>
                <Button
                  variant="ghost"
                  onPress={() => resetPreview((v) => v + 1)}
                >
                  Reset demo state
                </Button>
              </box>
              <ThemeProvider theme={previewTheme}>
                <scrollbox
                  flexGrow={1}
                  flexBasis={0}
                  minHeight={0}
                  scrollY
                  scrollX={false}
                  focusable={false}
                  viewportCulling={false}
                  backgroundColor={themes[previewTheme].background}
                >
                  <ReviewPreview
                    key={`${name}/${selectedPiece?.name}/${revision}`}
                    name={name}
                    theme={previewTheme}
                    viewport={previewNode}
                    openPopups={selectedPiece?.popup ?? false}
                  >
                    <PreviewSurface>
                      {selectedPiece && (
                        <PiecePreview
                          name={name}
                          piece={selectedPiece}
                          report={setStatus}
                        />
                      )}
                    </PreviewSurface>
                  </ReviewPreview>
                </scrollbox>
              </ThemeProvider>
            </FocusScope>
          </box>
        </box>
      )}
      <text height={1} flexShrink={0} fg={theme.mutedForeground} truncate>
        {status}
      </text>
    </box>
  )
}
export function TweakPage(props: { storageDirectory?: string } = {}) {
  return (
    <ComponentStylesProvider profiles={null}>
      <TweakContent {...props} />
    </ComponentStylesProvider>
  )
}

export default TweakPage
