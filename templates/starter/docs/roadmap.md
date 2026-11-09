# Roadmap

TCN's starter includes 51 component families, filesystem routing, themes, Gallery examples and Tweak previews. This page tracks possible extensions; use the [component reference](ui/README.md) and [styling guide](styling.md) for available APIs.

## Styling API

Planned work includes a consistent typed per-part `styles` prop, colocated default definitions for remaining parts, and Tweak previews built on the same public override API.

These APIs are not available across the kit today. Customize components through their documented props and local source defaults.

## Application packaging

The current build produces a Bun entry point with external runtime dependencies. A standalone application executable would need a separate packaging and platform-validation workflow.

The TCN CLI is already distributed as a prebuilt npm-compatible archive through GitHub Releases; this is separate from packaging the application you build.

## Platform coverage

CI checks generated applications on Ubuntu and Windows. Additional operating systems and terminal/font combinations need targeted installation, rendering, input and shutdown validation.

## Propose an improvement

Open an [issue](https://github.com/chipguys2026/tcn/issues) describing the use case, expected behavior and an example. Planned features do not have a committed release date.
