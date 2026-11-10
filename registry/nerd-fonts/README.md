# Nerd Fonts snapshot

This directory pins the official Nerd Fonts 3.5.1 glyph-name mapping used to generate TCN's icon catalog. No font binaries are distributed.

- `glyphnames.json`: unmodified upstream snapshot.
- `source.json`: version, source URL, SHA-256 and expected name/glyph counts.
- `LICENSE`: upstream attribution and license text.

Run `bun run icons:generate` from the repository root to regenerate typed sets. `bun run icons:check` verifies them without writing. Normal builds also verify the snapshot checksum and generated source, using no network access.

To update Nerd Fonts, review a versioned upstream snapshot, update the pin/counts, regenerate the sets, preserve upstream notices and run both CLI/starter suites. Update the icon guide and coverage expectations for the chosen version.
