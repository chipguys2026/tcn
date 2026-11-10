import { useState } from 'react'
import type { DemoProps } from '@/components/shared/component-demos/catalog'
import { Button } from '@/components/ui/button'
import { Checkbox, type CheckedState } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

function Buttons() {
  return (
    <box flexDirection="column" gap={2}>
      {(['default', 'secondary', 'ghost', 'destructive', 'link'] as const).map(
        (variant) => (
          <Button key={variant} variant={variant} icon="save">
            {variant}
          </Button>
        ),
      )}
      <Button icon="plus" label="Create" />
      <Button disabled>Disabled button</Button>
    </box>
  )
}
function Inputs({ report }: DemoProps) {
  const [value, setValue] = useState('')
  return (
    <box flexDirection="column" gap={2}>
      <Input
        label="Editable input"
        value={value}
        onValueChange={setValue}
        placeholder="Type here"
        onSubmit={report}
      />
      <Input label="Read only" defaultValue="Read only" readOnly />
      <Input label="Invalid input" defaultValue="Invalid" invalid />
      <Input label="Disabled input" defaultValue="Disabled" disabled />
    </box>
  )
}
function Checkboxes({ report }: DemoProps) {
  const [value, setValue] = useState<CheckedState>(false)
  return (
    <box flexDirection="column" gap={2}>
      <Checkbox
        checked={value}
        onCheckedChange={(next) => {
          setValue(next)
          report(String(next))
        }}
      >
        Editable checkbox
      </Checkbox>
      <Checkbox defaultChecked>Checked</Checkbox>
      <Checkbox checked="indeterminate">Indeterminate</Checkbox>
      <Checkbox disabled>Disabled checkbox</Checkbox>
    </box>
  )
}
export const basicDemos = [
  { name: 'button', render: Buttons },
  { name: 'input', render: Inputs },
  { name: 'checkbox', render: Checkboxes },
]
