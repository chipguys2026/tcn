// Compile-time public API checks; not executed by the test runner.
import { Checkbox } from '@/components/ui/checkbox'

export const controlled = (
  <Checkbox checked={false} onCheckedChange={() => {}}>
    Choice
  </Checkbox>
)
export const uncontrolled = <Checkbox defaultChecked>Choice</Checkbox>
export const mixed = <Checkbox checked="indeterminate" label="Select all" />
export const conflicting = (
  // @ts-expect-error Controlled and uncontrolled props are mutually exclusive.
  <Checkbox checked={true} defaultChecked={false}>
    Choice
  </Checkbox>
)
// @ts-expect-error A standalone checkbox requires a descriptive label.
export const missingLabel = <Checkbox />
// @ts-expect-error Checked state is boolean or indeterminate, not arbitrary strings.
export const unsupportedState = <Checkbox checked="mixed">Choice</Checkbox>
// @ts-expect-error Checked changes use a state callback, not a DOM event.
export const domCallback = <Checkbox onChange={() => {}}>Choice</Checkbox>
