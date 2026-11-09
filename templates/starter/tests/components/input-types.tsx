// Compile-time public API checks; not executed by the test runner.
import { Input } from '@/components/ui/input'

export const controlled = <Input value="Name" onValueChange={() => {}} />
export const uncontrolled = <Input defaultValue="Name" />
export const readOnly = <Input value="Name" readOnly />
// @ts-expect-error Controlled and uncontrolled initial values are mutually exclusive.
export const conflictingValues = <Input value="Name" defaultValue="Other" />
// @ts-expect-error Native values are strings, not DOM events or numbers.
export const invalidValue = <Input value={42} />
// @ts-expect-error DOM onChange is replaced by onValueChange.
export const domCallback = <Input onChange={() => {}} />
// @ts-expect-error Input has one fixed height, with no size variants.
export const unsupportedSize = <Input size="sm" />
