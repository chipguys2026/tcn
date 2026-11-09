# Breadcrumb

Show the user's place in a hierarchy and provide actions for navigating to parent screens.

[Source](../../src/components/ui/breadcrumb.tsx) · [Defaults](../../src/components/ui/breadcrumb.styles.ts) · Gallery: `/gallery/breadcrumb`

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

Only links enter the focus order. They reuse Button activation, disabled handling and ring rendering. The application owns routing through onPress; no href/DOM anchor is introduced. Compose a DropdownMenu within a BreadcrumbItem when a collapsed path should be interactive.

BreadcrumbLink uses Button defaults with zero horizontal padding. Customize defaults in the linked source; see [styling](../styling.md).
