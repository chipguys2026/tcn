// Compile-time public API checks; this module is not executed by the test runner.
import { Button } from '@/components/ui/button'

export const textButton = <Button icon="plus">Create</Button>
export const iconButton = <Button icon="search" label="Search" />
// @ts-expect-error Icon-only controls require a descriptive label.
export const missingLabel = <Button icon="search" />
// @ts-expect-error Button has one fixed size.
export const unsupportedSize = <Button size="sm">Save</Button>
// @ts-expect-error Rounded buttons are intentionally unsupported.
export const unsupportedRounded = <Button rounded>Save</Button>
// @ts-expect-error Icon names are typed.
export const unsupportedIcon = <Button icon="missing">Save</Button>
