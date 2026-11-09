# Routing

The router uses a Zustand navigation store and a generated static manifest. Filesystem discovery runs in tooling, not at production runtime.

## Starter routes

| Path | Route module | Feature |
| --- | --- | --- |
| `/` | `app/page.tsx` | Home introduction |
| `/gallery` | `app/gallery/page.tsx` | All 51 component families |
| `/gallery/:name` | `app/gallery/[name]/page.tsx` | One family, e.g. `/gallery/button` |
| `/gallery/showcase` | `app/gallery/showcase/page.tsx` | Composed examples |
| `/tweak` | `app/tweak/page.tsx` | Development parameter editor |

Static routes such as `showcase` take precedence over dynamic segments such as `[name]`.

## Add a route

Create `src/features/settings/settings-page.tsx`:

```tsx
export default function SettingsPage() {
  return <text>Settings</text>
}
```

Then create `src/app/settings/page.tsx` to connect it to the router:

```tsx
export { default } from '@/features/settings/settings-page'
```

Use `[id]/page.tsx` for dynamic parameters. A `(group)` directory organizes routes without adding a URL segment. Catch-all routes are not supported. Conflicting routes and repeated parameter names are rejected during generation.

## Navigate

```tsx
import { useRouter } from '@/router'

import { Button } from '@/components/ui/button'

export function SettingsLink() {
  const { navigate } = useRouter()

  return <Button onPress={() => navigate('/settings')}>Settings</Button>
}
```

The router also exposes `replace`, `back` and `forward`. Use `useParams()` for dynamic parameters and `usePathname()` for the current path; import both from `@/router`.

Invoke navigation from handlers or effects. Global `navigate`, `replace`, `back` and `forward` actions are exported for non-component handlers.

## Layout, errors and loading

Ancestor `layout.tsx` files receive children and stay mounted while their branch is active. Pages remount on pathname changes. An `error.tsx` receives `{ error, reset }` using `RouteErrorProps`; failures in its own layout reach a parent boundary. The starter includes a root route error fallback and an outer renderer application boundary.

An optional `loading.tsx` is a Suspense fallback for render-time suspension. It does not automatically track async event handlers, effects or network requests. Those operations need their own state. Without a loading module, the corresponding Suspense fallback is null.

## Generation

Run `bun run routes:generate` manually or use `bun run dev` to regenerate when route files change. `bun run build` also generates the manifest. Do not edit `src/router/routes.generated.ts` by hand.
