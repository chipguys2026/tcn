# Command

A searchable command list, optionally in a modal palette.

[Source](../../src/components/ui/command.tsx) · Gallery: `/gallery/command` · [Customization](../styling.md)

## Usage

```tsx
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup,
  CommandShortcut,
  CommandDialog,
  CommandSeparator,
} from '@/components/ui/command'

<Command>
  <CommandInput placeholder="Search actions" />
  <CommandList>
    <CommandEmpty />
    <CommandGroup heading="Actions">
      <CommandItem onSelect={() => run()}>Run</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

## API

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

Focus stays in the search input while Up and Down change the active result. Enter invokes that result when enabled. Filtering matches every query word against item labels, values and keywords.

## Appearance

Defaults are defined in [styles.ts](../../src/lib/ui/styles.ts). Edit this local file to change appearance across your application.

Compose group headings, an empty state, separators and shortcut hints around the results. Use CommandDialog for a modal palette or embed Command directly in a screen.

Default values:

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

## Usage guidance

Control the search text with `CommandInput`'s `value` and `onValueChange`. The root `value` identifies the active result. Register application shortcuts separately and use `CommandShortcut` to display their hints.
