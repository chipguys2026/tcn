import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/lib/ui/theme/use-theme'

type DemoProps = { report?: (message: string) => void }
export function AccordionDemo({ report = () => {} }: DemoProps) {
  const theme = useTheme()
  return (
    <box width="100%" flexDirection="column" gap={2}>
      <box flexDirection="column" gap={1}>
        <text fg={theme.mutedForeground}>
          Frequently asked questions · one section at a time
        </text>
        <Accordion
          type="single"
          collapsible
          defaultValue="keyboard"
          onValueChange={report}
        >
          <AccordionItem value="keyboard">
            <AccordionTrigger label="Can I use the keyboard?" />
            <AccordionContent>
              <text fg={theme.mutedForeground}>
                Use Up/Down to move between headings. Enter or Space opens a
                section.
              </text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="settings">
            <AccordionTrigger label="Can a section contain controls?" />
            <AccordionContent>
              <text fg={theme.mutedForeground}>
                Controls inside an open section remain in the normal Tab order.
              </text>
              <Input label="Project name" defaultValue="My workspace" />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="unavailable" disabled>
            <AccordionTrigger label="Unavailable section" />
            <AccordionContent>
              <text>Not available</text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </box>
      <box flexDirection="column" gap={1}>
        <text fg={theme.mutedForeground}>
          Project settings · multiple sections
        </text>
        <Accordion
          type="multiple"
          defaultValue={['notifications']}
          onValueChange={(values) => report(values.join(', '))}
        >
          <AccordionItem value="notifications">
            <AccordionTrigger label="Notifications" />
            <AccordionContent>
              <Switch label="Enable notifications" defaultChecked />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="advanced">
            <AccordionTrigger label="Advanced settings" />
            <AccordionContent>
              <text fg={theme.mutedForeground}>
                Apply additional settings to this project.
              </text>
              <Button onPress={() => report('Settings saved')}>
                Save settings
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </box>
    </box>
  )
}

export function CollapsibleDemo({ report = () => {} }: DemoProps) {
  const theme = useTheme()
  return (
    <box width="100%" flexDirection="column" gap={2}>
      <Collapsible
        defaultOpen
        onOpenChange={(open) =>
          report(`Dependencies: ${open ? 'expanded' : 'collapsed'}`)
        }
      >
        <CollapsibleTrigger label="Toggle dependencies">
          Project dependencies
        </CollapsibleTrigger>
        <text fg={theme.mutedForeground}>
          3 packages used by this workspace
        </text>
        <CollapsibleContent>
          <text>@opentui/core</text>
          <text>@opentui/react</text>
          <text>zustand</text>
          <Button
            variant="secondary"
            onPress={() => report('Inspect dependencies')}
          >
            Inspect dependencies
          </Button>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible disabled>
        <CollapsibleTrigger label="Unavailable details">
          Unavailable details
        </CollapsibleTrigger>
        <CollapsibleContent>
          <text>Not available</text>
        </CollapsibleContent>
      </Collapsible>
    </box>
  )
}
