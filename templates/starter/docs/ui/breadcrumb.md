# Breadcrumb

Hierarchy of links inspired by [shadcn Breadcrumb](https://ui.shadcn.com/docs/components/breadcrumb).

[Source](../../src/components/ui/breadcrumb.tsx) · [Defaults](../../src/components/ui/breadcrumb.styles.ts) · Gallery: `/gallery/breadcrumb`

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink onPress={() => navigate('/')}>Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Projects</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

Import from `@/components/ui/breadcrumb`.

| Part | Contract |
| --- | --- |
| Breadcrumb | Children; full-width passive container |
| BreadcrumbList | Children; horizontal wrapping row, gap one |
| BreadcrumbItem | Children; one path segment |
| BreadcrumbLink | Button props; defaults to ghost with zero horizontal padding |
| BreadcrumbPage | String children; current-page text, truncated to available width |
| BreadcrumbSeparator | Optional string children; default `›` |
| BreadcrumbEllipsis | Passive ellipsis; no hidden navigation or automatic collapsing |

Only links enter the focus order. They reuse Button activation, disabled handling and ring rendering. The application owns routing through onPress; no href/DOM anchor is introduced. Compose a DropdownMenu within a BreadcrumbItem when a collapsed path should be interactive.

All parts appear in Tweak. Shared Button geometry proposals affect BreadcrumbLink; the source padding exception is explicit. No Tweak JSON is loaded at runtime. See [styling](../styling.md).
