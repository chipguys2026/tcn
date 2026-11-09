import { useLayoutEffect, useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Toaster, ToastProvider, useToast } from '@/components/ui/toast'
import type { DemoProps } from '../catalog'

export function BreadcrumbDemo({ report }: DemoProps) {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onPress={() => report('Home')}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onPress={() => report('Components')}>
              Components
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onPress={() => report('Workspace')}>
              Workspace
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Current project</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  )
}
export function ContextMenuDemo({ report }: DemoProps) {
  const [checked, setChecked] = useState(true),
    [mode, setMode] = useState('list')
  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger label="Project context menu">
          Right-click here or press Shift+F10
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel>Project</ContextMenuLabel>
            <ContextMenuItem onSelect={() => report('Opened project')}>
              Open
            </ContextMenuItem>
            <ContextMenuItem disabled>Delete (unavailable)</ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem
            checked={checked}
            onCheckedChange={setChecked}
            closeOnSelect={false}
          >
            Show hidden files
          </ContextMenuCheckboxItem>
          <ContextMenuRadioGroup value={mode} onValueChange={setMode}>
            <ContextMenuRadioItem value="list" closeOnSelect={false}>
              List view
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="details" closeOnSelect={false}>
              Details view
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
      <ContextMenu>
        <ContextMenuTrigger disabled>Disabled context menu</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Unavailable</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  )
}
function ToastControls({ report, preview }: DemoProps & { preview: boolean }) {
  const { toast, dismiss } = useToast()
  useLayoutEffect(() => {
    if (!preview) return
    const id = toast({
      title: 'Project saved',
      description: 'Your changes are ready.',
      duration: 0,
      action: { label: 'Undo', onPress: () => report('Undone') },
    })
    return () => dismiss(id)
  }, [preview, toast, dismiss, report])
  return (
    <box flexDirection="row" flexWrap="wrap" gap={1}>
      <Button
        variant="secondary"
        onPress={() => toast({ title: 'Event created' })}
      >
        Simple notification
      </Button>
      <Button
        onPress={() =>
          toast({
            title: 'Project saved',
            description: 'Your changes are ready.',
            action: { label: 'Undo', onPress: () => report('Undone') },
          })
        }
      >
        With action
      </Button>
      <Button
        variant="secondary"
        onPress={() =>
          toast({
            title: 'Save failed',
            description: 'Please try again.',
            variant: 'destructive',
          })
        }
      >
        Show error
      </Button>
      <Button variant="ghost" onPress={() => dismiss()}>
        Dismiss all
      </Button>
    </box>
  )
}
export function ToastDemo({
  report,
  preview = false,
}: DemoProps & { preview?: boolean }) {
  return (
    <ToastProvider>
      <ToastControls report={report} preview={preview} />
      <Toaster />
    </ToastProvider>
  )
}
export const navigationFeedbackDemos = [
  {
    name: 'breadcrumb',
    hint: 'Hierarchy of reusable links. Current page and ellipsis are passive; application owns navigation.',
    render: BreadcrumbDemo,
  },
  {
    name: 'context-menu',
    hint: 'Right-click / Shift+F10 opens. Arrows, Home/End, typeahead and Escape reuse the menu engine.',
    render: ContextMenuDemo,
  },
  {
    name: 'toast',
    hint: 'Temporary notifications without stealing focus. Hover or focus an action to pause the timer.',
    render: ToastDemo,
  },
]
