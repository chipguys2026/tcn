import type { DemoProps } from '@/components/shared/component-demos/catalog'
import { styleDemos } from '@/components/shared/component-demos/catalog'
import { DialogDemo } from '@/components/shared/component-demos/examples/dialog'
import { CollapsibleDemo } from '@/components/shared/component-demos/examples/disclosures'
import { ToastDemo } from '@/components/shared/component-demos/examples/navigation-feedback'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Combobox } from '@/components/ui/combobox'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export type ReviewPiece = {
  name: string
  label: string
  targets: string[]
  popup?: boolean
}
const piece = (
  name: string,
  targets: string[],
  popup = false,
  label = name,
): ReviewPiece => ({ name, label, targets, popup })
const basic: Record<string, string[]> = {
  menubar: [
    'Menubar',
    'MenubarTrigger',
    'MenubarContent',
    'MenubarItem',
    'MenubarGroup',
    'MenubarLabel',
    'MenubarCheckboxItem',
    'MenubarRadioGroup',
    'MenubarRadioItem',
    'MenubarShortcut',
    'MenubarSubTrigger',
  ],
  questionnaire: [
    'Questionnaire',
    'QuestionnaireProgress',
    'QuestionnaireItem',
    'QuestionnaireTitle',
    'QuestionnaireDescription',
    'QuestionnaireChoices',
    'QuestionnaireChoice',
    'QuestionnaireInput',
    'QuestionnaireError',
    'QuestionnaireActions',
    'QuestionnairePrevious',
    'QuestionnaireSkip',
    'QuestionnaireNext',
    'QuestionnaireSubmit',
  ],
  'code-block': [
    'CodeBlock',
    'CodeBlockHeader',
    'CodeBlockTitle',
    'CodeBlockActions',
    'CodeBlockCopyButton',
    'CodeBlockContent',
    'CodeBlockLine',
    'CodeBlockFooter',
  ],
  message: [
    'MessageGroup',
    'Message',
    'MessageAvatar',
    'MessageContent',
    'MessageHeader',
    'MessageFooter',
  ],
  'message-scroller': [
    'MessageScroller',
    'MessageScrollerViewport',
    'MessageScrollerContent',
    'MessageScrollerItem',
    'MessageScrollerButton',
  ],
  marker: ['Marker', 'MarkerIcon', 'MarkerContent'],
  trace: [
    'Trace',
    'TraceLine',
    'TraceIcon',
    'TraceTitle',
    'TraceDescription',
    'TraceCollapsibleTrigger',
    'TraceCollapsibleContent',
  ],
  chart: [
    'ChartContainer',
    'BarChart',
    'LineChart',
    'ChartLegend',
    'ChartLegendContent',
    'ChartTooltip',
    'ChartTooltipContent',
  ],
  sidebar: [
    'SidebarProvider',
    'Sidebar',
    'SidebarInset',
    'SidebarHeader',
    'SidebarFooter',
    'SidebarContent',
    'SidebarGroup',
    'SidebarGroupLabel',
    'SidebarGroupAction',
    'SidebarGroupContent',
    'SidebarMenu',
    'SidebarMenuItem',
    'SidebarMenuButton',
    'SidebarMenuAction',
    'SidebarMenuBadge',
    'SidebarMenuSub',
    'SidebarMenuSubItem',
    'SidebarMenuSubButton',
    'SidebarMenuSkeleton',
    'SidebarInput',
    'SidebarSeparator',
    'SidebarTrigger',
  ],
  slider: ['Slider', 'SliderTrack', 'SliderRange', 'SliderThumb'],
  resizable: ['ResizablePanelGroup', 'ResizablePanel', 'ResizableHandle'],
  breadcrumb: [
    'Breadcrumb',
    'BreadcrumbList',
    'BreadcrumbItem',
    'BreadcrumbLink',
    'BreadcrumbPage',
    'BreadcrumbSeparator',
    'BreadcrumbEllipsis',
  ],
  'input-group': [
    'InputGroup',
    'InputGroupInput',
    'InputGroupTextarea',
    'InputGroupAddon',
    'InputGroupText',
    'InputGroupButton',
  ],
  pagination: [
    'Pagination',
    'PaginationContent',
    'PaginationItem',
    'PaginationLink',
    'PaginationPrevious',
    'PaginationNext',
    'PaginationEllipsis',
  ],
  field: [
    'Field',
    'FieldGroup',
    'FieldSet',
    'FieldLegend',
    'FieldContent',
    'FieldLabel',
    'FieldTitle',
    'FieldDescription',
    'FieldError',
    'FieldSeparator',
  ],
  'button-group': ['ButtonGroup', 'ButtonGroupText', 'ButtonGroupSeparator'],
  item: [
    'Item',
    'ItemGroup',
    'ItemMedia',
    'ItemContent',
    'ItemTitle',
    'ItemDescription',
    'ItemActions',
    'ItemHeader',
    'ItemFooter',
    'ItemSeparator',
  ],
  skeleton: ['Skeleton'],
  button: ['Button'],
  input: ['Input'],
  checkbox: ['Checkbox'],
  label: ['Label'],
  separator: ['Separator'],
  badge: ['Badge'],
  kbd: ['Kbd', 'KbdGroup'],
  card: [
    'Card',
    'CardHeader',
    'CardTitle',
    'CardDescription',
    'CardContent',
    'CardFooter',
  ],
  alert: ['Alert', 'AlertTitle', 'AlertDescription'],
  empty: [
    'Empty',
    'EmptyHeader',
    'EmptyMedia',
    'EmptyTitle',
    'EmptyDescription',
    'EmptyContent',
  ],
  spinner: ['Spinner'],
  progress: ['Progress'],
  textarea: ['Textarea'],
  switch: ['Switch', 'Track', 'Thumb', 'Switch.text'],
  'radio-group': ['RadioGroup', 'RadioGroupItem'],
  toggle: ['Toggle'],
  'toggle-group': ['ToggleGroup', 'ToggleGroupItem'],
  tabs: ['Tabs', 'TabsList', 'TabsTrigger', 'TabsContent'],
  collapsible: [
    'Collapsible',
    'CollapsibleHeader',
    'CollapsibleLabel',
    'CollapsibleTrigger',
    'CollapsibleContent',
  ],
  accordion: [
    'Accordion',
    'AccordionItem',
    'AccordionTrigger',
    'AccordionTrigger.icon',
    'AccordionContent',
  ],
  'scroll-area': ['ScrollArea'],
  table: [
    'Table',
    'TableHeader',
    'TableBody',
    'TableFooter',
    'TableRow',
    'TableHead',
    'TableCell',
    'TableCaption',
  ],
}
const parts: Record<string, ReviewPiece[]> = Object.fromEntries(
  Object.entries(basic).map(([source, names]) => [
    source,
    names.map((name) =>
      piece(
        name,
        [`${source}/${name}`],
        source === 'menubar' && name !== 'Menubar' && name !== 'MenubarTrigger',
      ),
    ),
  ]),
)
parts.menubar?.push(
  piece('MenubarPopup', ['menubar/Content'], true),
  piece('MenubarSubContent', ['menubar/MenubarSubContent'], true),
  piece('MenubarSubPopup', ['menubar/SubContent'], true),
  piece('MenubarSeparator', ['separator/Separator'], true),
)
parts.trace?.push(piece('TraceCollapsible', ['collapsible/Collapsible']))
parts.select = [
  piece('SelectTrigger', ['select/SelectTrigger']),
  piece('SelectValue', ['select/SelectValue']),
  piece(
    'SelectPopup',
    ['select/SelectContent'],
    true,
    'SelectPopup (SelectContent)',
  ),
  piece('SelectItem', ['select/SelectItem'], true),
  piece('SelectGroup', ['select/SelectGroup'], true),
  piece('SelectLabel', ['select/SelectLabel'], true),
  piece('SelectSeparator', ['separator/Separator'], true),
]
for (const [source, prefix] of [
  ['dialog', 'Dialog'],
  ['sheet', 'Sheet'],
] as const) {
  parts[source] = [
    piece(`${prefix}Trigger`, [`${source}/Trigger`]),
    piece(
      `${prefix}Popup`,
      [`${source}/Content`],
      true,
      `${prefix}Popup (${prefix}Content)`,
    ),
    ...['Header', 'Title', 'Description', 'Footer', 'Close'].map((name) =>
      piece(`${prefix}${name}`, [`${source}/${name}`], true),
    ),
  ]
}
parts.dialog?.push(piece('DialogCloseIcon', ['dialog/CloseIcon'], true))
parts.sheet?.push(piece('SheetCloseIcon', ['sheet/CloseIcon'], true))
parts['alert-dialog'] = [
  piece('AlertDialogTrigger', ['alert-dialog/Trigger']),
  piece(
    'AlertDialogPopup',
    ['alert-dialog/Content'],
    true,
    'AlertDialogPopup (AlertDialogContent)',
  ),
  ...[
    'Header',
    'Title',
    'Description',
    'Footer',
    'AlertDialogCancel',
    'AlertDialogAction',
  ].map((name) =>
    piece(
      name.startsWith('Alert') ? name : `AlertDialog${name}`,
      [`alert-dialog/${name}`],
      true,
    ),
  ),
]
parts.popover = [
  piece('PopoverTrigger', ['popover/Trigger']),
  piece(
    'PopoverPopup',
    ['popover/Content'],
    true,
    'PopoverPopup (PopoverContent)',
  ),
  piece('PopoverClose', ['popover/Close'], true),
]
parts.tooltip = [
  piece('TooltipTrigger', ['tooltip/TooltipTrigger']),
  piece(
    'TooltipPopup',
    ['tooltip/TooltipContent'],
    true,
    'TooltipPopup (TooltipContent)',
  ),
]
parts['dropdown-menu'] = [
  piece('DropdownMenuTrigger', ['dropdown-menu/Trigger']),
  piece(
    'DropdownMenuPopup',
    ['dropdown-menu/Content'],
    true,
    'DropdownMenuPopup (DropdownMenuContent)',
  ),
  ...[
    'DropdownMenuContent',
    'DropdownMenuItem',
    'DropdownMenuCheckboxItem',
    'DropdownMenuRadioGroup',
    'DropdownMenuRadioItem',
    'DropdownMenuLabel',
    'DropdownMenuGroup',
  ].map((name) =>
    piece(
      name,
      [`dropdown-menu/${name}`],
      true,
      name === 'DropdownMenuContent' ? 'DropdownMenuList' : name,
    ),
  ),
  piece('DropdownMenuSeparator', ['separator/Separator'], true),
]
parts['context-menu'] = [
  piece('ContextMenuTrigger', ['context-menu/Trigger']),
  piece('ContextMenuPopup', ['context-menu/Content'], true),
  ...[
    'ContextMenuContent',
    'ContextMenuItem',
    'ContextMenuGroup',
    'ContextMenuLabel',
    'ContextMenuCheckboxItem',
    'ContextMenuRadioGroup',
    'ContextMenuRadioItem',
  ].map((name) => piece(name, [`context-menu/${name}`], true)),
  piece('ContextMenuSeparator', ['separator/Separator'], true),
]
parts.toast = [
  'ToastViewport',
  'Toast',
  'ToastHeader',
  'ToastBody',
  'ToastIcon',
  'ToastContent',
  'ToastActions',
  'ToastTitle',
  'ToastDescription',
  'ToastAction',
  'ToastClose',
].map((name) => piece(name, [`toast/${name}`], true))
parts.command = [
  piece('Command', ['command/Command']),
  piece('CommandInput', ['input/Input']),
  ...['CommandList', 'CommandEmpty', 'CommandItem', 'CommandGroup'].map(
    (name) => piece(name, [`command/${name}`]),
  ),
  piece('CommandSeparator', ['separator/Separator']),
  piece('CommandShortcut', ['kbd/Kbd']),
  piece('CommandDialog', ['dialog/Content'], true),
]
parts.combobox = [
  piece('ComboboxTrigger', ['popover/Trigger']),
  piece('ComboboxPopup', ['popover/Content'], true),
  piece('ComboboxSearch', ['input/Input'], true),
  piece('ComboboxList', ['command/CommandList'], true),
  piece('ComboboxItem', ['command/CommandItem'], true),
  piece('ComboboxEmpty', ['command/CommandEmpty'], true),
]

export function piecesFor(name: string): ReviewPiece[] {
  return parts[name] ?? []
}
export function matchesPiece(part: string, piece: ReviewPiece) {
  return piece.targets.some(
    (target) => part === target || part.startsWith(`${target}.`),
  )
}
export function elementLabel(part: string, piece: ReviewPiece) {
  const target = piece.targets.find(
    (target) => part === target || part.startsWith(`${target}.`),
  )
  if (!target) return part
  const suffix = part.slice(target.length)
  return !suffix
    ? 'Layout / background'
    : suffix === '.text'
      ? 'Text'
      : suffix === '.items'
        ? 'Items layout'
        : suffix.slice(1)
}

/** Render one composition per family; selected popup pieces stay open via the review context. */
export function PiecePreview({
  name,
  piece: selected,
  report,
}: DemoProps & { name: string; piece: ReviewPiece }) {
  if (name === 'toast') return <ToastDemo report={report} preview />
  if (name === 'select')
    return (
      <Select defaultValue="bun" onValueChange={report}>
        <SelectTrigger label="Runtime">
          <SelectValue placeholder="Choose runtime" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Runtime</SelectLabel>
            <SelectItem value="bun">Bun</SelectItem>
            <SelectItem value="node">Node.js</SelectItem>
            <SelectSeparator />
            <SelectItem value="deno" disabled>
              Deno (disabled)
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  if (name === 'dropdown-menu')
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>Project actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Project</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => report('New project')}>
              New project
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Unavailable action</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            defaultChecked
            closeOnSelect={false}
            onCheckedChange={(value) => report(`Status: ${value}`)}
          >
            Status bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup
            defaultValue="personal"
            onValueChange={report}
          >
            <DropdownMenuRadioItem value="personal" closeOnSelect={false}>
              Personal
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="team" closeOnSelect={false}>
              Team
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  if (name === 'dialog') return <DialogDemo report={report} />
  if (name === 'alert-dialog')
    return (
      <AlertDialog>
        <AlertDialogTrigger>Delete project</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              Action and Cancel have independent styles.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel autoFocus>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onPress={() => report('Confirmed')}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  if (name === 'sheet')
    return (
      <Sheet>
        <SheetTrigger>Open sheet</SheetTrigger>
        <SheetContent side="right" width={40}>
          <SheetHeader>
            <SheetTitle>Project settings</SheetTitle>
            <SheetDescription>
              Review header, content and footer.
            </SheetDescription>
          </SheetHeader>
          <Input label="Sheet name" defaultValue="Project" />
          <SheetFooter>
            <SheetClose variant="default">Done</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  if (name === 'popover')
    return (
      <Popover>
        <PopoverTrigger>Open filters</PopoverTrigger>
        <PopoverContent width={34} height={12}>
          <Input label="Filter" placeholder="Search..." />
          <PopoverClose onPress={() => report('Filter applied')}>
            Apply
          </PopoverClose>
        </PopoverContent>
      </Popover>
    )
  if (name === 'tooltip')
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger label="Save" onPress={() => report('Saved')}>
            Save (hover for hint)
          </TooltipTrigger>
          <TooltipContent>Save the current changes.</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  if (name === 'combobox')
    return (
      <Combobox
        options={
          selected.name === 'ComboboxEmpty'
            ? []
            : [
                { value: 'bun', label: 'Bun' },
                { value: 'node', label: 'Node.js' },
                { value: 'deno', label: 'Deno (disabled)', disabled: true },
              ]
        }
        placeholder="Choose a runtime"
        onValueChange={report}
      />
    )
  if (name === 'collapsible') return <CollapsibleDemo report={report} />
  if (name === 'table')
    return (
      <Table>
        <TableCaption>Recent invoices</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            label="Invoice one"
            onSelect={() => report('Selected invoice')}
          >
            <TableCell>INV-001</TableCell>
            <TableCell>Paid</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>$250</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )
  if (name === 'command') {
    const content = (
      <>
        <CommandInput autoFocus={false} />
        <CommandList>
          <CommandEmpty />
          {selected.name !== 'CommandEmpty' && (
            <CommandGroup heading="Actions">
              <CommandItem onSelect={report}>Create project</CommandItem>
              <CommandItem onSelect={report}>Open settings</CommandItem>
              <CommandItem disabled>Unavailable action</CommandItem>
            </CommandGroup>
          )}
          <CommandSeparator />
          <CommandShortcut>Enter</CommandShortcut>
        </CommandList>
      </>
    )
    return selected.name === 'CommandDialog' ? (
      <CommandDialog open>{content}</CommandDialog>
    ) : (
      <Command>{content}</Command>
    )
  }
  const demo = styleDemos.find((item) => item.name === name)
  return demo ? <demo.render report={report} /> : null
}
