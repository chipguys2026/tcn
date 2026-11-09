# command

A searchable command list, optionally in a modal palette.

[Source](../../src/components/ui/command.tsx) · Gallery: `/gallery/command` · [Styling status](../styling.md)

## Usage

```tsx
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem, CommandGroup, CommandShortcut, CommandDialog, CommandSeparator } from '@/components/ui/command'

<Command><CommandInput placeholder="Search actions" /><CommandList><CommandEmpty /><CommandGroup heading="Actions"><CommandItem onSelect={() => run()}>Run</CommandItem></CommandGroup></CommandList></Command>
```

Examples use surrounding application state/handlers where shown; they do not add persistence or business behavior.

## Public API

Exports: `Command`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandItem`, `CommandGroup`, `CommandShortcut`, `CommandDialog`, `CommandSeparator`.

| Component | Props contract |
| --- | --- |
| Command | `PropsWithChildren<{ value?: string defaultValue?: string onValueChange?: (value: string) => void shouldFilter?: boolean loop?: boolean }>` |
| CommandInput | `{ placeholder?: string autoFocus?: boolean value?: string onValueChange?: (value: string) => void }` |
| CommandList | `PropsWithChildren<{ height?: number }>` |
| CommandEmpty | `{ children?: string }` |
| CommandItem | `{ children: string value?: string keywords?: readonly string[] disabled?: boolean onSelect?: (value: string) => void }` |
| CommandGroup | `PropsWithChildren<{ heading?: string }>` |
| CommandShortcut | `{ children: string }` |
| CommandDialog | `FloatingRootProps` |

## State and interaction

Input retains native focus while Up/Down changes the active result; Enter invokes the enabled result. Filtering matches every query word against label/value/keywords.

Stateful components follow the [controlled/uncontrolled conventions](../architecture.md#state).

## Source defaults and appearance

Promoted defaults are defined in [command.styles.ts](../../src/components/ui/command.styles.ts) and consumed by the real component and its observations. No Tweak JSON is loaded here.

Group headings, empty state, separators and shortcut hints. CommandDialog provides a dimmed modal palette; a plain Command can be embedded.

Declared parameter defaults (expressions refer to the linked source):

| Parameter | Default |
| --- | --- |
| Command.defaultValue | `''` |
| Command.shouldFilter | `true` |
| Command.loop | `true` |
| CommandInput.placeholder | `'Type a command...'` |
| CommandInput.autoFocus | `true` |
| CommandList.height | `8` |
| CommandEmpty.children | `'No results found.'` |
| CommandItem.value | `children` |
| CommandItem.keywords | `[]` |
| CommandItem.disabled | `false` |

The universal per-part `styles` override API is not complete yet; default-file migration is in progress. Current Tweak parameters are preview proposals, not a stable application style contract. See [styling](../styling.md) before customizing or promoting defaults.

## Reuse

CommandInput reuses Input; CommandShortcut reuses Kbd. CommandDialog reuses the modal overlay foundation.

## TUI boundaries

Root value describes the active result, not the query. CommandInput owns its own value/onValueChange. No fuzzy ranking or global shortcut registration.

All dimensions are terminal cells. Native glyph appearance depends on the terminal font; browser accessibility/DOM behavior is not implied.
