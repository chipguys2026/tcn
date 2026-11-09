# Design proposals

This directory belongs to the Tweak development workflow. It is not read by ordinary application startup.

- `component-review.draft.json`: local autosave, ignored by git.
- `component-review.json`: explicit proposal export, optionally committed for design discussion.
- Temporary write files are ignored.
- `component-review.defaults-<timestamp>.backup.json`: preserved draft before source-default promotion; ignored by git.

Review exported parameters and apply approved changes to component source defaults. Exporting a proposal does not modify runtime defaults. See [Tweak](../docs/tweak.md) and [styling status](../docs/styling.md).
