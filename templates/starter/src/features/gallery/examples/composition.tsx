import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from '@/components/ui/button-group'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { Skeleton } from '@/components/ui/skeleton'
import { icons } from '@/lib/ui/icons'
import type { DemoProps } from '../catalog'

export function FieldDemo() {
  const [name, setName] = useState('')
  return (
    <FieldSet>
      <FieldLegend>Project settings</FieldLegend>
      <FieldGroup>
        <Field invalid={!name}>
          <FieldLabel htmlFor="field-project-name" required>
            Project name
          </FieldLabel>
          <Input
            id="field-project-name"
            value={name}
            onValueChange={setName}
            invalid={!name}
            placeholder="opentui-starter"
          />
          <FieldDescription>Used to identify this project.</FieldDescription>
          <FieldError>
            {!name ? 'Please enter a project name.' : undefined}
          </FieldError>
        </Field>
        <FieldSeparator>Preferences</FieldSeparator>
        <Field orientation="horizontal">
          <Checkbox id="field-updates" label="Enable updates" />
          <FieldContent>
            <FieldLabel htmlFor="field-updates">Enable updates</FieldLabel>
            <FieldTitle>Background checks</FieldTitle>
            <FieldDescription>
              Check for new releases when starting.
            </FieldDescription>
          </FieldContent>
        </Field>
        <Field disabled>
          <FieldLabel htmlFor="field-locked">Organization</FieldLabel>
          <Input id="field-locked" defaultValue="Personal" disabled />
          <FieldDescription>
            Organization changes are unavailable.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
export function ButtonGroupDemo({ report }: DemoProps) {
  return (
    <>
      <ButtonGroup>
        <ButtonGroupText>Changes</ButtonGroupText>
        <Button onPress={() => report('Saved')}>Save</Button>
        <ButtonGroupSeparator />
        <Button variant="secondary" onPress={() => report('Preview')}>
          Preview
        </Button>
        <Button disabled>Publish</Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical">
        <Button variant="secondary" onPress={() => report('Up')}>
          Move up
        </Button>
        <ButtonGroupSeparator />
        <Button variant="secondary" onPress={() => report('Down')}>
          Move down
        </Button>
      </ButtonGroup>
    </>
  )
}
export function ItemDemo({ report }: DemoProps) {
  return (
    <>
      <ItemGroup>
        <Item>
          <ItemMedia variant="icon">
            <text>{icons.folder}</text>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>opentui-starter</ItemTitle>
            <ItemDescription>
              Reusable components for terminal applications.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button onPress={() => report('Opened starter')}>Open</Button>
          </ItemActions>
        </Item>
        <ItemSeparator />
        <Item>
          <ItemMedia variant="icon">
            <text>{icons.settings}</text>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Project settings</ItemTitle>
            <ItemDescription>
              Manage preferences and configuration.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              variant="secondary"
              onPress={() => report('Opened settings')}
            >
              Manage
            </Button>
          </ItemActions>
        </Item>
      </ItemGroup>
      <ItemHeaderFooterDemo report={report} />
    </>
  )
}
export function ItemHeaderFooterDemo({ report }: DemoProps) {
  return (
    <>
      <text>With header and footer</text>
      <Item variant="muted">
        <ItemHeader>
          <Badge>Release</Badge>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>Starter update</ItemTitle>
          <ItemDescription>
            A separate composition with optional metadata.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="secondary" onPress={() => report('Viewed release')}>
            View
          </Button>
        </ItemActions>
        <ItemFooter>
          <text>Updated today</text>
        </ItemFooter>
      </Item>
    </>
  )
}
export function SkeletonDemo() {
  return (
    <>
      <box flexDirection="row" gap={1}>
        <Skeleton width={4} height={3} />
        <box flexGrow={1} gap={1}>
          <Skeleton width="60%" />
          <Skeleton width="90%" />
        </box>
      </box>
      <Skeleton height={3} />
      <text>Loading content…</text>
    </>
  )
}
export const compositionDemos = [
  {
    name: 'field',
    hint: 'Labels delegate focus; descriptions and validation compose around existing inputs.',
    render: FieldDemo,
  },
  {
    name: 'button-group',
    hint: 'Horizontal / vertical composition; buttons retain normal Tab and activation behavior.',
    render: ButtonGroupDemo,
  },
  {
    name: 'item',
    hint: 'Media, content and actions. Actions reuse Button; rows do not add nested focus targets.',
    render: ItemDemo,
  },
  {
    name: 'skeleton',
    hint: 'Static cell-sized loading placeholders; no focus or background timers.',
    render: SkeletonDemo,
  },
]
