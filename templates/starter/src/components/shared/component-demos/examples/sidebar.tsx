import { useState } from 'react'
import type { DemoProps } from '@/components/shared/component-demos/catalog'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export function SidebarDemo({ report }: DemoProps) {
  const [page, setPage] = useState('Projects')
  const select = (next: string) => {
    setPage(next)
    report(next)
  }
  return (
    <SidebarProvider height={18}>
      <Sidebar>
        <SidebarHeader>
          <text>opentui-starter</text>
          <SidebarInput
            label="Search navigation"
            placeholder="Search…"
            onValueChange={(query) => report(`Search: ${query}`)}
          />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupAction
              icon="plus"
              label="Create project"
              onPress={() => report('Create project')}
            />
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    icon="folder"
                    isActive={page === 'Projects'}
                    onPress={() => select('Projects')}
                  >
                    Projects
                  </SidebarMenuButton>
                  <SidebarMenuBadge>3</SidebarMenuBadge>
                  <SidebarMenuAction
                    icon="plus"
                    label="Add project"
                    onPress={() => report('Add project')}
                  />
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton onPress={() => select('Starter')}>
                        Starter
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    icon="settings"
                    isActive={page === 'Settings'}
                    onPress={() => select('Settings')}
                  >
                    Settings
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton icon="trash" disabled>
                    Trash
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <text>Personal workspace</text>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
        <text>{page}</text>
        <text>
          Toggle the sidebar to review icon mode. Navigation stays owned by the
          page.
        </text>
      </SidebarInset>
    </SidebarProvider>
  )
}
