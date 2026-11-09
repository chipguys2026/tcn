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

`showcase` is a static route and takes precedence over `[name]`. Legacy `/gallery/components` and `/gallery/style-editor` routes have been replaced, not retained as aliases.

## Add a route

Create `src/app/settings/page.tsx` and export a React component. Prefer delegating to a feature:

```tsx
export { default } from '@/features/settings/settings-page'
```

Use `[id]/page.tsx` for dynamic parameters. A `(group)` directory organizes routes without adding a URL segment. Catch-all routes are not supported. Conflicting routes and repeated parameter names are rejected during generation.

## Navigate

```tsx
import { useParams, usePathname, useRouter } from '@/router'

const { navigate, replace, back, forward } = useRouter()
const { id } = useParams()
const pathname = usePathname()
```

Invoke navigation from handlers or effects, not as a render side effect. Global `navigate`, `replace`, `back` and `forward` actions are also exported for non-component handlers.

## Layout, errors and loading

Ancestor `layout.tsx` files receive children and stay mounted while their branch is active. Pages remount on pathname changes. An `error.tsx` receives `{ error, reset }` using `RouteErrorProps`; failures in its own layout reach a parent boundary. The starter includes a root route error fallback and an outer renderer application boundary.

An optional `loading.tsx` is a Suspense fallback for render-time suspension. It does not automatically track async event handlers, effects or network requests. Those operations need their own state. Without a loading module, the corresponding Suspense fallback is null.

## Generation

Run `bun run routes:generate` manually or use `bun run dev` to regenerate when route files change. `bun run build` also generates the manifest. Do not edit `src/router/routes.generated.ts` by hand.
