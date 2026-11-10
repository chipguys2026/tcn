// Compile-time public API checks; this module is not executed by the test runner.
import { Button } from '@/components/ui/button'
import type { IconValue } from '@/lib/ui/icons'
import { fa } from '@/lib/ui/nerd-fonts/sets/fa'
import { md } from '@/lib/ui/nerd-fonts/sets/md'

export const textButton = <Button icon="plus">Create</Button>
export const iconButton = <Button icon="search" label="Search" />
export const catalogButton = <Button icon={fa.address_book}>Contacts</Button>
export const supplementaryIconButton = (
  <Button icon={md.account} label="Account" />
)
// @ts-expect-error Generated set names are typed.
export const missingCatalogIcon = fa.not_a_real_icon
// @ts-expect-error Names from the cheat sheet must be imported from a typed set.
export const unresolvedCatalogName: IconValue = 'nf-fa-address_book'
// @ts-expect-error Icon-only controls require a descriptive label.
export const missingLabel = <Button icon="search" />
// @ts-expect-error Button has one fixed size.
export const unsupportedSize = <Button size="sm">Save</Button>
// @ts-expect-error Rounded buttons are intentionally unsupported.
export const unsupportedRounded = <Button rounded>Save</Button>
// @ts-expect-error Icon names are typed.
export const unsupportedIcon = <Button icon="missing">Save</Button>
