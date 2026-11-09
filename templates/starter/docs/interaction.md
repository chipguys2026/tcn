# Interaction, focus and overlays

## Shared foundations

`usePress` handles activation; `useFocusable` handles native focus lifecycle, registration and programmatic requests; FocusScope controls traversal. Components use these primitives instead of each inventing an input manager. Focus rings are separate paint-only visuals.

Tab/Shift+Tab traverses enabled controls. Read-only editors remain focusable. Disabled controls are skipped. Group navigation uses native tree order and roving helpers where appropriate.

## Keyboard conventions

| Control | Convention |
| --- | --- |
| Button, Switch, Toggle, disclosure trigger | Enter or Space activates. |
| Checkbox | Space toggles; Enter does not. |
| Input | Space types; Enter submits. |
| Textarea | Enter inserts a newline; Ctrl/Meta+Enter invokes onSubmit. |
| RadioGroup | Arrows select enabled items; Home/End; one Tab stop. |
| Tabs | Arrows/Home/End move; manual mode requires activation. |
| Accordion | Up/Down/Home/End move between enabled headings. |
| Select/Menu | Arrows, Home/End and typeahead; Enter/Space commits. |
| Command | Input retains focus; Up/Down moves the result; Enter invokes it. |

See individual [component documents](ui/README.md) for details and boundaries.

## Focus rings

The shared final paint pass draws focused-control rings above normal content and popup surfaces. A ring may extend one cell beyond an ancestor clip, but fully hidden controls have no ring. Terminal bounds still apply. The pass creates no hit region and owns no focus policy.

Unfocused invalid outlines remain local. The indicator of Checkbox has its own ring target; other composites choose their documented surface. Use nested FocusScope boundaries when a screen needs its own traversal region.

## Overlays

Overlays portal to the renderer root and recompute bounds on terminal resize. Modal scopes contain Tab navigation and restore previous valid focus when closing. Nonmodal Tab exit dismisses and continues after the trigger. Escape dismisses the top layer. React context remains available across portals.

Dialog, AlertDialog, Sheet and CommandDialog dim underlying foreground/background by 55%. Popover, Select, DropdownMenu and Combobox dim by 28%. Tooltip does not dim or take focus. These are color transforms, not blur.

Dialog and Sheet have compact corner close buttons. AlertDialog has no corner close button, ignores outside clicks and focuses Cancel by default. Use a controlled open value when asynchronous work must finish before a close is accepted.

Tooltip placement avoids its trigger to prevent native hit testing from repeatedly removing and restoring hover. It tries alternative sides, shrinks to a free region when necessary and omits the visual if there is no free region.

Interactive popup overflow scrolls and focused controls reveal themselves. Use meaningful focusable controls; an empty popup can still close with Escape.
