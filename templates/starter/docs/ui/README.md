# UI components

The starter owns 51 reusable component families in `src/components/ui`. Gallery and Tweak use these real components.

Import from `@/components/ui/<name>`. Detailed documents describe the current implementation; planned styling contracts are marked explicitly.

| Family | Purpose |
| --- | --- |
| [slider](slider.md) | Stepped single/multiple-thumb values with keyboard and pointer input. |
| [resizable](resizable.md) | Horizontal/vertical panels with keyboard and draggable dividers. |
| [sidebar](sidebar.md) | Composable navigation with scrollable content and controlled collapse. |
| [breadcrumb](breadcrumb.md) | Hierarchical navigation with passive current-page text. |
| [context-menu](context-menu.md) | Pointer/keyboard context actions using the shared menu engine. |
| [toast](toast.md) | Scoped temporary notifications with pauseable timers and optional actions. |
| [field](field.md) | Form labels, descriptions, errors and grouped layouts. |
| [input-group](input-group.md) | Existing editors with addons and a shared editor focus ring. |
| [button-group](button-group.md) | Horizontal or vertical composition of existing buttons. |
| [item](item.md) | Media, content and action layouts for list items. |
| [pagination](pagination.md) | Page navigation controls with application-owned state. |
| [skeleton](skeleton.md) | Static loading placeholders sized in terminal cells. |
| [button](button.md) | A single-row action control with semantic variants and optional Nerd Font icons. |
| [input](input.md) | A controlled or uncontrolled single-line native editor. |
| [checkbox](checkbox.md) | A boolean or indeterminate selection control. |
| [accordion](accordion.md) | A group of expandable sections with single or multiple open values. |
| [collapsible](collapsible.md) | A flexible expandable region with a heading and a compact toggle. |
| [alert-dialog](alert-dialog.md) | A modal confirmation with explicit cancel and action controls. |
| [dialog](dialog.md) | A modal surface for a focused task. |
| [badge](badge.md) | A noninteractive semantic status label. |
| [kbd](kbd.md) | A visual hint for a key or key combination. |
| [card](card.md) | A compound content surface with optional header/footer. |
| [alert](alert.md) | An inline information or destructive message. |
| [empty](empty.md) | An empty-state composition with optional media and actions. |
| [separator](separator.md) | A horizontal or vertical content divider. |
| [label](label.md) | A text label that can delegate focus to a native control. |
| [spinner](spinner.md) | An animated busy indicator. |
| [progress](progress.md) | A determinate progress indicator. |
| [textarea](textarea.md) | A native multiline editor with controlled/uncontrolled state. |
| [switch](switch.md) | A boolean switch with a compact rounded track. |
| [radio-group](radio-group.md) | A mutually exclusive string-valued selection group. |
| [toggle](toggle.md) | A pressed/unpressed action control. |
| [toggle-group](toggle-group.md) | A group of single or multiple pressed values. |
| [tabs](tabs.md) | A selection group that reveals one associated panel. |
| [scroll-area](scroll-area.md) | A native scroll region for overflowing content. |
| [table](table.md) | A presentation table with optional row activation. |
| [select](select.md) | A string-valued selection popup. |
| [popover](popover.md) | An anchored nonmodal surface. |
| [tooltip](tooltip.md) | A delayed descriptive hint for a trigger. |
| [sheet](sheet.md) | A modal panel attached to a terminal edge. |
| [dropdown-menu](dropdown-menu.md) | An anchored action menu with ordinary, checkbox and radio items. |
| [command](command.md) | A searchable command list, optionally in a modal palette. |
| [combobox](combobox.md) | A searchable single-selection adapter. |

Read [interaction](../interaction.md), [styling](../styling.md) and [contribution requirements](../../CONTRIBUTING.md) before changing the kit.

| Family | Purpose |
| --- | --- |
| [menubar](menubar.md) | Top-level menus with nested submenus, checks/radios and shortcut hints. |
| [questionnaire](questionnaire.md) | Step-based questions, controlled answers and validation. |
| [code-block](code-block.md) | Native syntax highlighting, numbered/diff lines and copy. |
| [message](message.md) | Composable conversation content and action slots. |
| [message-scroller](message-scroller.md) | Follow-at-bottom, history anchoring and message jumps. |
| [marker](marker.md) | System notes, border rows and labeled separators. |
| [trace](trace.md) | Nested execution steps with collapsible details. |
| [chart](chart.md) | Native Bar and Line charts, legend and value inspection. |
