# Breadcrumb

Show the user's place in a hierarchy and provide actions for navigating to parent screens.

[Source](../../src/components/ui/breadcrumb.tsx) · [Defaults](../../src/lib/ui/styles.ts) · Gallery: `/gallery/breadcrumb`

## Usage

```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink onPress={() => navigate('/')}>Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Projects</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## API and behavior

| Part | Contract |
| --- | --- |
| Breadcrumb | Children; full-width passive container |
| BreadcrumbList | Children; horizontal wrapping row, gap one |
| BreadcrumbItem | Children; one path segment |
| BreadcrumbLink | Button props; defaults to ghost with zero horizontal padding |
| BreadcrumbPage | String children; current-page text, truncated to available width |
| BreadcrumbSeparator | Optional string children; default `›` |
| BreadcrumbEllipsis | Passive ellipsis; no hidden navigation or automatic collapsing |

## Navigation

Tab navigation visits links and skips passive path text. Links support Enter, Space and click activation, with disabled states and focus rings. Navigate from the link's `onPress` handler. To expose a collapsed path, compose a [Dropdown Menu](dropdown-menu.md) within a BreadcrumbItem.

BreadcrumbLink uses Button defaults with zero horizontal padding. Customize defaults in the linked source; see [styling](../styling.md).
