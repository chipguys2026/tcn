# Components

The starter includes 51 component families. Browse the tables below, or run the application and open Gallery to try their keyboard, pointer and layout behavior.

## Use a component

For component icons, use the existing action aliases or import from the [complete Nerd Fonts sets](../icons.md). Gallery includes a searchable browser at `/gallery/icons`.

Import from local source, using the module named in its reference page:

```tsx
import { Button } from '@/components/ui/button'
```

In an existing TCN-configured project, install the family with `tcn add button` first. New starters already include every family.

Examples show UI composition. Supply application state, data and handlers such as `save` or `onValueChange` where indicated. [Controlled components](../architecture.md#state) report proposed changes to their owner; uncontrolled components keep local state initialized by default props.

Dimensions are terminal cells. See [styling](../styling.md) for themes and source defaults and [interaction](../interaction.md) for focus and keyboard conventions.

## Actions and menus

| Component | Use it for |
| --- | --- |
| [Button](button.md) | Actions with variants and optional icons. |
| [Button Group](button-group.md) | Horizontal or vertical groups of buttons. |
| [Toggle](toggle.md) | An action with a pressed/unpressed state. |
| [Toggle Group](toggle-group.md) | Single or multiple pressed selections. |
| [Command](command.md) | Searchable actions or a command palette. |
| [Menubar](menubar.md) | Top-level menus and nested submenus. |
| [Dropdown Menu](dropdown-menu.md) | Actions opened from a trigger. |
| [Context Menu](context-menu.md) | Pointer or keyboard context actions. |

## Forms and input

| Component | Use it for |
| --- | --- |
| [Input](input.md) | Single-line text entry. |
| [Textarea](textarea.md) | Multiline text entry. |
| [Checkbox](checkbox.md) | Boolean or indeterminate selection. |
| [Switch](switch.md) | A compact boolean setting. |
| [Radio Group](radio-group.md) | One choice from a group. |
| [Select](select.md) | A string-valued popup selection. |
| [Combobox](combobox.md) | A searchable selection. |
| [Slider](slider.md) | One or more stepped numeric values. |
| [Field](field.md) | Labels, descriptions, errors and form layout. |
| [Input Group](input-group.md) | An editor with prefix/suffix content or actions. |
| [Label](label.md) | A label that can focus a control. |
| [Questionnaire](questionnaire.md) | Step-based questions and validation. |

## Navigation

| Component | Use it for |
| --- | --- |
| [Breadcrumb](breadcrumb.md) | Hierarchical navigation. |
| [Tabs](tabs.md) | Switching between related panels. |
| [Pagination](pagination.md) | Application-owned page navigation. |
| [Sidebar](sidebar.md) | Scrollable, collapsible navigation. |

## Layout and disclosure

| Component | Use it for |
| --- | --- |
| [Accordion](accordion.md) | A group of expandable sections. |
| [Collapsible](collapsible.md) | A single expandable region. |
| [Card](card.md) | Content with optional header/footer. |
| [Item](item.md) | Media, content and actions in a list entry. |
| [Resizable](resizable.md) | Panels with draggable and keyboard dividers. |
| [Scroll Area](scroll-area.md) | A bounded native scroll region. |
| [Separator](separator.md) | A horizontal or vertical divider. |

## Overlays

| Component | Use it for |
| --- | --- |
| [Dialog](dialog.md) | A modal task. |
| [Alert Dialog](alert-dialog.md) | Confirmation with explicit cancel/action choices. |
| [Sheet](sheet.md) | A modal panel at a terminal edge. |
| [Popover](popover.md) | An anchored nonmodal surface. |
| [Tooltip](tooltip.md) | A delayed descriptive hint. |

## Feedback and status

| Component | Use it for |
| --- | --- |
| [Alert](alert.md) | An inline information or error message. |
| [Badge](badge.md) | A compact status label. |
| [Empty](empty.md) | An empty state with optional actions. |
| [Kbd](kbd.md) | A visual shortcut hint. |
| [Spinner](spinner.md) | An animated busy indicator. |
| [Progress](progress.md) | Determinate progress. |
| [Skeleton](skeleton.md) | Static loading placeholders. |
| [Toast](toast.md) | Temporary notifications and optional actions. |

## Data display

| Component | Use it for |
| --- | --- |
| [Table](table.md) | Tabular content and optional row activation. |
| [Chart](chart.md) | Native Bar and Line charts with value inspection. |
| [Code Block](code-block.md) | Syntax-highlighted code, diff lines and copying. |

## Conversation and execution

| Component | Use it for |
| --- | --- |
| [Message](message.md) | Conversation content and action slots. |
| [Message Scroller](message-scroller.md) | Following new messages and preserving history position. |
| [Marker](marker.md) | System notes and labeled separators. |
| [Trace](trace.md) | Execution steps with collapsible details. |
