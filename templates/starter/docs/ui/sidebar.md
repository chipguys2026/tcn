# Sidebar

Build scrollable navigation with collapsible sections and a main content region.

[Source](../../src/components/ui/sidebar.tsx) · [Defaults](../../src/components/ui/sidebar.styles.ts) · Gallery: `/gallery/sidebar`

## Usage

```tsx
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarInput,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'

<SidebarProvider height="100%">
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <SidebarInput label="Search" placeholder="Search…" />
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Workspace</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton icon="folder" isActive onPress={openProjects}>
              Projects
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <text>Personal workspace</text>
    </SidebarFooter>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    <text>Main content</text>
  </SidebarInset>
</SidebarProvider>
```

## API and behavior

The page owns active navigation, filtering and routing; no router dependency lives in Sidebar.

| Part | Contract |
| --- | --- |
| SidebarProvider | Children; open/defaultOpen=true/onOpenChange; width=100%; height=16, cell count or percentage |
| useSidebar | open, state (expanded/collapsed), setOpen, toggleSidebar |
| Sidebar | Children; optional id; width=24; collapsible icon (default), offcanvas or none |
| SidebarInset | Growing main column beside the sidebar |
| SidebarHeader, SidebarFooter | Padded nonshrinking regions above/below the scrollable content |
| SidebarContent | Native vertical scrollbox; no separate Tab stop; focused controls reveal themselves |
| SidebarGroup, SidebarGroupContent | A section and its content; GroupLabel/GroupAction are placed in a heading row |
| SidebarGroupLabel | String children, muted section heading |
| SidebarMenu, SidebarMenuItem | Menu container and row; direct SidebarMenuSub appears below that row |
| SidebarMenuButton, SidebarMenuSubButton | Button props plus isActive; full row width, secondary when active, ghost otherwise |
| SidebarMenuAction, SidebarGroupAction | Reused Button props for supplementary actions |
| SidebarMenuBadge | String children; reused Badge |
| SidebarMenuSub, SidebarMenuSubItem | Indented submenu composition; use Collapsible explicitly for expanding sections |
| SidebarMenuSkeleton | Reused Skeleton in a single-row menu slot |
| SidebarInput | Existing Input props and editing behavior |
| SidebarSeparator | Reused horizontal Separator |
| SidebarTrigger | Icon-only Button props; default menu icon/Toggle sidebar label; invokes onPress then toggleSidebar |

## Layout and collapse

The provider leaves two columns between sidebar and inset. Expanded sections retain one cell/row padding; scroll content adds one row of vertical padding, two rows between groups, one row between menu entries/submenu entries and one cell between a menu button, badge and action. Submenus indent by two columns. Header/footer stay fixed while navigation scrolls.

The surface uses sidebar theme tokens with no frame border. Sidebar width is capped to leave eight cells for the inset when possible; terminal limits win. Icon collapse uses four columns, retaining menu icons (or the first label character when no icon was supplied). In icon mode, fewer than 16 available/requested sidebar columns forces the compact layout; this does not change the provider's requested open state. Widening the terminal restores the expanded layout if open is still true. Header/footer, group headings, search, supplemental actions, badges and submenus hide in icon mode. Offcanvas hides the whole sidebar; none keeps it visible regardless of the provider's open state.

## Focus and state

Controls keep ordinary Button/Input focus and activation. Hiding a region that held focus attempts to focus the registered SidebarTrigger; visible menu controls retain focus during icon collapse. Hidden controls are excluded by the existing scope's ancestor-visibility checks. A controlled owner may reject toggle proposals. One trigger ref per provider is used for hidden-focus recovery.

The application owns shortcuts, active navigation, filtering and persistence. Sidebar uses Button, Input, Badge, Skeleton and Separator defaults; changing those shared controls can affect the sidebar. See [styling](../styling.md).
