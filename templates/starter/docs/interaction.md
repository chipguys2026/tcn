# Interaction, focus and overlays

Use these keyboard and focus conventions when composing application screens. Component references describe any additional behavior specific to a control.

## Moving focus

Tab moves to the next enabled control; Shift+Tab moves to the previous one. Read-only editors remain focusable so users can navigate and select their text. Disabled and hidden controls are skipped. Groups such as radio buttons and tabs use arrow keys within a single Tab stop.

Use FocusScope to define a traversal region when a screen needs one. See [architecture](architecture.md#component-foundations) when maintaining the underlying focus and activation systems.

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

Focused controls display a ring above surrounding content. Leave one cell of space where a ring extends beyond the control's surface; rings do not reserve layout space. Rings stay within terminal bounds and are hidden when their controls are fully hidden.

Invalid outlines remain visible independently of focus. Checkbox highlights its indicator; other composite controls use the surface described in their component reference.

## Overlays

Modal dialogs keep Tab navigation inside the dialog and restore focus to the previous control when it is still available. Leaving a nonmodal popup with Tab dismisses it and continues after its trigger. Escape dismisses the topmost dismissible layer. Popup placement adjusts when the terminal resizes.

Dialog, AlertDialog, Sheet and CommandDialog dim underlying foreground/background by 55%. Popover, Select, DropdownMenu and Combobox dim by 28%. Tooltip does not dim or take focus. These are color transforms, not blur.

Dialog and Sheet have compact corner close buttons. AlertDialog has no corner close button, ignores outside clicks and focuses Cancel by default. Use a controlled open value when asynchronous work must finish before a close is accepted.

Tooltips appear beside their triggers. They can switch sides or shrink to fit the available space, and remain hidden if no space is available.

Interactive popup overflow scrolls and focused controls reveal themselves. Use meaningful focusable controls; an empty popup can still close with Escape.
