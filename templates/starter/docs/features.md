# Add an application feature

Build a searchable users screen with a route page and a feature-owned table. This example uses a local list of names and the components included in the starter.

## Create the feature component

Create `src/features/users/components/user-table.tsx`:

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function UserTable({ users }: { users: readonly string[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((name) => (
          <TableRow key={name}>
            <TableCell>{name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

The table displays the filtered results supplied by its parent. The sample names are unique; use stable record IDs as keys when working with application data.

## Implement the route screen

Create `src/app/users/page.tsx`:

```tsx
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { UserTable } from '@/features/users/components/user-table'

const users = ['Alex', 'Casey', 'Morgan']

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const matches = users.filter((name) =>
    name.toLowerCase().includes(search.trim().toLowerCase()),
  )

  return (
    <box flexDirection="column" padding={1} gap={1}>
      <Input
        autoFocus
        label="Find a user"
        value={search}
        onValueChange={setSearch}
      />
      <UserTable users={matches} />
    </box>
  )
}
```

## Open the screen

Run `bun run dev` to discover the route and start the application. Add a navigation button to an existing screen, or use this component:

```tsx
import { Button } from '@/components/ui/button'
import { useRouter } from '@/router'

export function UsersLink() {
  const { navigate } = useRouter()

  return <Button onPress={() => navigate('/users')}>Users</Button>
}
```

Open Users and type in the search field to filter the table. Outside the development watcher, run `bun run routes:generate` after adding or moving route files.

## Add data access when needed

When replacing the sample list with backend data, put user operations in `src/features/users/api/user.api.ts`. Share transport configuration through `src/api/client.ts`. For filesystem-backed data, use a module such as `src/features/users/api/user.storage.ts`.

Validate incoming data before exposing it to the screen. Keep user-specific schemas in `src/features/users/schemas/user.schema.ts` and infer their types where supported. Place application-wide configuration schemas in `src/schemas`.

## Extend the feature

- Extract a custom hook for reusable React logic, such as a subscription or coordinated filtering behavior.
- Add `stores/user.store.ts` when independent consumers need shared state. Do not mirror query results there.
- Put pure user-specific transformations in `utils/`.
- Extract `components/user-editor.tsx` when editing owns fields, state and save behavior, even with one caller.
- Keep list, detail and editing flows together. Create another feature for a distinct capability with its own responsibilities.

## Verify behavior

Test filtering and empty results, then data errors and saves as introduced. Use existing headless component tests as examples. Check keyboard focus, navigation and narrow-terminal layout. Run `bun run check` and `bun run build` before submitting.
