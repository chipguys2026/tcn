import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Combobox } from '@/components/ui/combobox'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
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
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DialogDemo } from '@/features/gallery/examples/dialog'
import {
  AccordionDemo,
  CollapsibleDemo,
} from '@/features/gallery/examples/disclosures'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { basicDemos } from './examples/basic'
import { compositionDemos } from './examples/composition'
import { contentToolDemos } from './examples/content-tools'
import { formControlDemos } from './examples/form-controls'
import { navigationFeedbackDemos } from './examples/navigation-feedback'
import { panelDemos } from './examples/panels'
import { ScrollAreaDemo } from './examples/scroll-area'
import { SidebarDemo } from './examples/sidebar'

export type DemoProps = { report: (message: string) => void }
type Demo = {
  name: string
  hint: string
  render: (props: DemoProps) => import('@opentui/react/jsx-runtime').JSX.Element
}
function TextareaDemo({ report }: DemoProps) {
  const [value, setValue] = useState('First line\nSecond line')
  return (
    <>
      <Textarea
        label="Notes"
        value={value}
        onValueChange={setValue}
        onSubmit={report}
        height={5}
      />
      <Textarea label="Read only" defaultValue="Read only" readOnly />
      <Textarea label="Disabled notes" defaultValue="Disabled" disabled />
      <Textarea label="Invalid notes" placeholder="Required notes" invalid />
      <text>Characters: {value.length}</text>
    </>
  )
}
function ProgressDemo() {
  const [value, setValue] = useState(40)
  return (
    <>
      <Progress value={value} />
      <Progress value={0} />
      <Progress value={100} />
      <Button onPress={() => setValue((v) => (v + 20) % 120)}>Advance</Button>
    </>
  )
}
function CommandDemo({ report }: DemoProps) {
  const [open, setOpen] = useState(false)
  const content = (
    <>
      <CommandInput autoFocus={false} />
      <CommandList>
        <CommandEmpty />
        <CommandGroup heading="Actions">
          <CommandItem
            value="create"
            keywords={['new', 'project']}
            onSelect={report}
          >
            Create project
          </CommandItem>
          <CommandItem value="settings" onSelect={report}>
            Open settings
          </CommandItem>
          <CommandItem value="disabled" disabled>
            Unavailable action
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  )
  return (
    <>
      <Command>{content}</Command>
      <Button onPress={() => setOpen(true)}>Open command palette</Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput />
        <CommandList>
          <CommandEmpty />
          <CommandItem
            onSelect={(value) => {
              report(value)
              setOpen(false)
            }}
          >
            Create project
          </CommandItem>
          <CommandItem
            onSelect={(value) => {
              report(value)
              setOpen(false)
            }}
          >
            Open settings
          </CommandItem>
        </CommandList>
      </CommandDialog>
    </>
  )
}
const componentDemos: Demo[] = [
  {
    name: 'select',
    hint: 'Enter / Space / Down opens. Up/Down/Home/End or type to navigate; Enter commits.',
    render: ({ report }) => (
      <>
        <Select defaultValue="bun" onValueChange={report}>
          <SelectTrigger label="Runtime" />
          <SelectContent>
            <SelectGroup>
              <SelectLabel>JavaScript runtimes</SelectLabel>
              <SelectItem value="bun">Bun</SelectItem>
              <SelectItem value="node">Node.js</SelectItem>
              <SelectItem value="deno" disabled>
                Deno (unavailable)
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select disabled defaultValue="bun">
          <SelectTrigger label="Disabled runtime" />
          <SelectContent>
            <SelectItem value="bun">Bun</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value="bun"
          onValueChange={(v) => report(`Rejected proposal: ${v}`)}
        >
          <SelectTrigger label="Controlled runtime" />
          <SelectContent>
            <SelectItem value="bun">Bun</SelectItem>
            <SelectItem value="node">Node.js</SelectItem>
          </SelectContent>
        </Select>
      </>
    ),
  },
  {
    name: 'dropdown-menu',
    hint: 'Actions, checkbox and radio items. Arrows move; disabled items are skipped.',
    render: ({ report }) => (
      <DropdownMenu>
        <DropdownMenuTrigger>Project actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Project</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => report('New project')}>
            New project
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Delete (disabled)</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            defaultChecked
            closeOnSelect={false}
            onCheckedChange={(v) => report(`Status bar: ${v}`)}
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
    ),
  },
  {
    name: 'command',
    hint: 'Type to filter by label/value/keywords. Up/Down picks; Enter runs; includes modal palette.',
    render: CommandDemo,
  },
  {
    name: 'combobox',
    hint: 'Searchable single selection; unavailable items cannot be selected.',
    render: ({ report }) => (
      <>
        <Combobox
          placeholder="Choose a framework"
          options={[
            { value: 'react', label: 'React', keywords: ['ui'] },
            { value: 'vue', label: 'Vue' },
            { value: 'svelte', label: 'Svelte', disabled: true },
            { value: 'solid', label: 'Solid' },
          ]}
          onValueChange={report}
        />
        <Combobox placeholder="Disabled combobox" options={[]} disabled />
        <Combobox
          value="react"
          options={[
            { value: 'react', label: 'React' },
            { value: 'vue', label: 'Vue' },
          ]}
          onValueChange={(v) => report(`Rejected proposal: ${v}`)}
        />
      </>
    ),
  },
  {
    name: 'scroll-area',
    hint: 'Choose Vertical / Horizontal / Both, then focus the region and use arrows or the mouse wheel.',
    render: ScrollAreaDemo,
  },
  {
    name: 'table',
    hint: 'Presentational table with optional selectable rows. No automatic sort/filter.',
    render: ({ report }) => (
      <Table>
        <TableCaption>Recent invoices</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead align="right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {['Paid', 'Pending', 'Overdue'].map((status, i) => (
            <TableRow
              key={status}
              label={`Invoice ${i + 1}`}
              onSelect={() => report(`Selected invoice ${i + 1}`)}
            >
              <TableCell>{`INV-00${i + 1}`}</TableCell>
              <TableCell>{status}</TableCell>
              <TableCell align="right">$250.00</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ),
  },
  {
    name: 'dialog',
    hint: 'Modal: Tab stays inside, Escape / outside click closes, then focus returns.',
    render: DialogDemo,
  },
  {
    name: 'alert-dialog',
    hint: 'Outside clicks do not dismiss. Cancel receives initial focus.',
    render: ({ report }) => (
      <AlertDialog>
        <AlertDialogTrigger>Delete project</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This demo only reports the action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel autoFocus>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onPress={() => report('Deletion confirmed')}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
  },
  {
    name: 'popover',
    hint: 'Anchored popup; closes on Escape, outside click, or Tab past its last control.',
    render: ({ report }) => (
      <Popover>
        <PopoverTrigger>Open filters</PopoverTrigger>
        <PopoverContent width={34} height={12}>
          <text>Filter by name</text>
          <Input label="Filter" placeholder="Name..." />
          <PopoverClose onPress={() => report('Filter applied')}>
            Apply
          </PopoverClose>
        </PopoverContent>
      </Popover>
    ),
  },
  {
    name: 'tooltip',
    hint: 'Focus / hover, wait 350ms. Tooltip does not receive focus.',
    render: ({ report }) => (
      <Tooltip>
        <TooltipTrigger label="Save changes" onPress={() => report('Saved')}>
          Save (hover for hint)
        </TooltipTrigger>
        <TooltipContent>Save the current changes.</TooltipContent>
      </Tooltip>
    ),
  },
  {
    name: 'sheet',
    hint: 'Four screen edges. Modal keyboard behavior matches Dialog.',
    render: ({ report }) => (
      <>
        {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
          <Sheet key={side}>
            <SheetTrigger>{`Open ${side} sheet`}</SheetTrigger>
            <SheetContent side={side} width={35} height={14}>
              <SheetHeader>
                <SheetTitle>{`${side} sheet`}</SheetTitle>
                <SheetDescription>
                  A side panel for supporting tasks.
                </SheetDescription>
              </SheetHeader>
              <Input label={`${side} sheet name`} placeholder="Type here" />
              <SheetFooter>
                <SheetClose
                  variant="default"
                  onPress={() => report(`Closed ${side}`)}
                >
                  Done
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ))}
      </>
    ),
  },
  {
    name: 'label',
    hint: 'Click a label to focus its associated control.',
    render: () => (
      <>
        <Label htmlFor="label-demo" required>
          Display name
        </Label>
        <Input id="label-demo" placeholder="Click the label above" />
        <Label disabled>Disabled label</Label>
      </>
    ),
  },
  {
    name: 'separator',
    hint: 'Horizontal and vertical separators; no focus stop.',
    render: () => (
      <>
        <text>Section one</text>
        <Separator />
        <box flexDirection="row" gap={2} height={3}>
          <text>Left</text>
          <Separator orientation="vertical" length={3} />
          <text>Right</text>
        </box>
      </>
    ),
  },
  {
    name: 'badge',
    hint: 'Semantic variants, compact noninteractive text.',
    render: () => (
      <box flexDirection="row" gap={2} flexWrap="wrap">
        {(['default', 'secondary', 'ghost', 'destructive'] as const).map(
          (variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ),
        )}
      </box>
    ),
  },
  {
    name: 'kbd',
    hint: 'Key hints only; these do not install shortcuts.',
    render: () => (
      <>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <Kbd>Enter</Kbd>
        <Kbd>Esc</Kbd>
      </>
    ),
  },
  {
    name: 'card',
    hint: 'Header, title, description, content and footer.',
    render: ({ report }) => (
      <Card>
        <CardHeader>
          <CardTitle>Project settings</CardTitle>
          <CardDescription>Reusable compound composition</CardDescription>
        </CardHeader>
        <CardContent>
          <Input label="Project name" defaultValue="opentui-starter" />
        </CardContent>
        <CardFooter>
          <Button onPress={() => report('Saved project')}>Save</Button>
          <Button variant="secondary" onPress={() => report('Cancelled')}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    ),
  },
  {
    name: 'alert',
    hint: 'Default and destructive status messages.',
    render: () => (
      <>
        <Alert icon="check">
          <AlertTitle>Changes saved</AlertTitle>
          <AlertDescription>Your project is up to date.</AlertDescription>
        </Alert>
        <Alert variant="destructive" icon="close">
          <AlertTitle>Connection failed</AlertTitle>
          <AlertDescription>Please try again.</AlertDescription>
        </Alert>
      </>
    ),
  },
  {
    name: 'empty',
    hint: 'Empty state with an optional action.',
    render: ({ report }) => (
      <Empty>
        <EmptyHeader>
          <EmptyMedia icon="folder" />
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>
            Create your first project to continue.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button icon="plus" onPress={() => report('Create project')}>
            New project
          </Button>
        </EmptyContent>
      </Empty>
    ),
  },
  {
    name: 'spinner',
    hint: 'Nerd Font animation; paused state below.',
    render: () => (
      <>
        <Spinner label="Loading projects" />
        <Spinner label="Paused" paused />
      </>
    ),
  },
  {
    name: 'progress',
    hint: 'Determinate progress, clamped to its range.',
    render: ProgressDemo,
  },
  {
    name: 'textarea',
    hint: 'Enter: newline. Ctrl+Enter: submit. Includes read-only, disabled and invalid.',
    render: TextareaDemo,
  },
  {
    name: 'switch',
    hint: 'Space / Enter / click toggles the value.',
    render: ({ report }) => (
      <>
        <Switch
          label="Notifications"
          defaultChecked
          onCheckedChange={(v) => report(`Notifications: ${v}`)}
        />
        <Switch label="Offline mode" />
        <Switch label="Disabled switch" disabled />
        <Switch
          label="Controlled, owner rejects edits"
          checked={false}
          onCheckedChange={(v) => report(`Requested: ${v}`)}
        />
      </>
    ),
  },
  {
    name: 'radio-group',
    hint: 'Arrow keys select and move; Tab enters the group once.',
    render: ({ report }) => (
      <RadioGroup defaultValue="comfortable" onValueChange={report}>
        <RadioGroupItem value="compact" label="Compact" />
        <RadioGroupItem value="comfortable" label="Comfortable" />
        <RadioGroupItem value="unavailable" disabled label="Unavailable" />
        <RadioGroupItem value="spacious" label="Spacious" />
      </RadioGroup>
    ),
  },
  {
    name: 'toggle',
    hint: 'Independent pressed state, with disabled and controlled cases.',
    render: ({ report }) => (
      <>
        <Toggle label="Bold" onPressedChange={(v) => report(`Bold: ${v}`)} />
        <Toggle label="Italic" defaultPressed />
        <Toggle label="Disabled toggle" disabled />
        <Toggle
          label="Controlled toggle"
          pressed={false}
          onPressedChange={(v) => report(`Requested: ${v}`)}
        />
      </>
    ),
  },
  {
    name: 'toggle-group',
    hint: 'Single and multiple selection. Left/Right/Home/End move within a group.',
    render: ({ report }) => (
      <>
        <ToggleGroup type="single" defaultValue="left" onValueChange={report}>
          {['left', 'center', 'right'].map((value) => (
            <ToggleGroupItem key={value} value={value} />
          ))}
        </ToggleGroup>
        <ToggleGroup
          type="multiple"
          defaultValue={['bold']}
          onValueChange={(v) => report(v.join(', '))}
        >
          <ToggleGroupItem value="bold" />
          <ToggleGroupItem value="italic" />
          <ToggleGroupItem value="underline" disabled />
        </ToggleGroup>
      </>
    ),
  },
  {
    name: 'tabs',
    hint: 'Automatic activation, then manual activation with Enter / Space.',
    render: ({ report }) => (
      <>
        {(['automatic', 'manual'] as const).map((mode) => (
          <Tabs
            key={mode}
            defaultValue="account"
            activationMode={mode}
            onValueChange={(v) => report(`${mode}: ${v}`)}
          >
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="disabled" disabled>
                Disabled
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <text>{mode}: account panel</text>
              <Input label={`${mode} account`} placeholder="Name" />
            </TabsContent>
            <TabsContent value="password">
              <text>{mode}: password panel</text>
            </TabsContent>
          </Tabs>
        ))}
      </>
    ),
  },
  {
    name: 'collapsible',
    hint: 'Toggle details. Hidden content leaves the focus order.',
    render: CollapsibleDemo,
  },
  {
    name: 'accordion',
    hint: 'Single collapsible group, then multiple group. Up/Down/Home/End navigate.',
    render: AccordionDemo,
  },
]
export function DemoMessage({ children }: { children: string }) {
  const theme = useTheme()
  return (
    <text fg={theme.mutedForeground} height={1} flexShrink={0} truncate>
      {children}
    </text>
  )
}

export const demos: {
  name: string
  hint?: string
  render: (props: DemoProps) => React.ReactNode
}[] = [
  ...basicDemos,
  ...componentDemos,
  ...compositionDemos,
  ...formControlDemos,
  ...navigationFeedbackDemos,
  ...panelDemos,
  ...contentToolDemos,
  {
    name: 'sidebar',
    hint: 'Reusable navigation slots, scrollable content and controlled collapse to icons. Trigger and menu actions reuse Button.',
    render: SidebarDemo,
  },
]
export const styleDemos = demos
