import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { Combobox } from '@/components/ui/combobox'
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { useRouter } from '@/router/index'
export default function ShowcasePage() {
  const { navigate } = useRouter()
  const theme = useTheme()
  const [name, setName] = useState(''),
    [notes, setNotes] = useState(''),
    [runtime, setRuntime] = useState('bun'),
    [notify, setNotify] = useState(true)
  const [projects, setProjects] = useState([
      { id: 'starter', name: 'opentui-starter', runtime: 'bun' },
    ]),
    [message, setMessage] = useState('Ready'),
    [palette, setPalette] = useState(false)
  function save() {
    if (!name.trim()) {
      setMessage('Project name is required')
      return
    }
    setProjects((p) => [
      ...p,
      { id: crypto.randomUUID(), name: name.trim(), runtime },
    ])
    setMessage(
      `Created ${name.trim()} (${notes.length} notes chars, notifications ${notify})`,
    )
    setName('')
    setNotes('')
  }
  return (
    <box flexGrow={1} minHeight={0} padding={1} gap={1} flexDirection="column">
      <text fg={theme.foreground} height={1} flexShrink={0}>
        Composed review / project management
      </text>
      <box flexDirection="row" gap={2}>
        <Button autoFocus onPress={() => navigate('/gallery')}>
          Catalog
        </Button>
        <Button variant="secondary" onPress={() => setPalette(true)}>
          Command palette
        </Button>
      </box>
      <scrollbox
        flexGrow={1}
        flexBasis={0}
        minHeight={0}
        scrollY
        scrollX={false}
        focusable={false}
        viewportCulling={false}
      >
        <box flexDirection="column" gap={2} padding={2}>
          <Card>
            <CardTitle>Create project</CardTitle>
            <CardContent>
              <Label htmlFor="project-name" required>
                Project name
              </Label>
              <Input
                id="project-name"
                value={name}
                onValueChange={setName}
                placeholder="My project"
              />
              <Label>Runtime</Label>
              <Combobox
                value={runtime}
                onValueChange={setRuntime}
                options={[
                  { value: 'bun', label: 'Bun' },
                  { value: 'node', label: 'Node.js' },
                ]}
              />
              <Textarea
                label="Project notes"
                value={notes}
                onValueChange={setNotes}
                placeholder="Notes"
                height={3}
              />
              <Switch
                label="Notifications"
                checked={notify}
                onCheckedChange={setNotify}
              />
            </CardContent>
            <CardFooter>
              <Button onPress={save}>Create</Button>
              <Badge variant="secondary">Local demo</Badge>
            </CardFooter>
          </Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Runtime</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow
                  key={project.id}
                  label={project.name}
                  onSelect={() => setMessage(`Selected ${project.name}`)}
                >
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.runtime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </box>
      </scrollbox>
      <text fg={theme.mutedForeground} height={1} truncate>
        {message}
      </text>
      <CommandDialog open={palette} onOpenChange={setPalette}>
        <CommandInput />
        <CommandList>
          <CommandEmpty />
          <CommandItem
            onSelect={() => {
              save()
              setPalette(false)
            }}
          >
            Create project from form
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setName('')
              setNotes('')
              setMessage('Form cleared')
              setPalette(false)
            }}
          >
            Clear form
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setPalette(false)
              navigate('/gallery')
            }}
          >
            Open component catalog
          </CommandItem>
        </CommandList>
      </CommandDialog>
    </box>
  )
}
