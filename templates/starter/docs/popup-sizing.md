# Popup sizing

SelectContent, DropdownMenuContent and TooltipContent accept `width`/`height` as a cell count or `auto`, plus numeric `minWidth`, `maxWidth`, `minHeight` and `maxHeight`. `minWidth="trigger"` uses the current native trigger width.

| Component | Width | Height | Minimum | Maximum |
| --- | --- | --- | --- | --- |
| Select | auto | auto | Trigger width; 3 rows | 32 columns; 16 rows |
| DropdownMenu | auto | auto | Trigger width; 3 rows | 32 columns; 16 rows |
| Tooltip | auto | auto | 3 columns; 3 rows | 32 columns; available region height |

Dimensions include one cell of padding on each side. Auto width fits the rendered content; auto height accounts for text wrapping. The popup adjusts when its content or the terminal dimensions change.

The first visible frame uses the measured size and placement. Focus moves into an interactive popup when it becomes visible.

Interactive popups dim the background immediately on opening; the dimming does not change while layout settles. Closing removes the popup and backdrop and restores focus according to the component's normal behavior. Tooltips do not dim the background or take focus.

Maximum dimensions and available terminal space take precedence when a minimum cannot fit. A trigger wider than `maxWidth` does not expand the popup beyond that limit. To create a wider popup, increase both `width` and `maxWidth`.

Anchored selection/menu/tooltip popups prefer the requested side, then try alternatives without covering the trigger. If no side can fit, the available region caps the result. Extremely small regions may reduce padding to preserve a content cell; if there is no free region, the popup visual is omitted.

Select and menu items occupy one row and truncate when necessary. Content scrolls vertically when it exceeds the available height; keyboard navigation keeps the focused item visible, including after resize. Tooltip text wraps and clips within its available region.

```tsx
<>
  <SelectContent
    width="auto"
    height="auto"
    minWidth="trigger"
    maxWidth={32}
    maxHeight={16}
  >
    <SelectItem value="bun">Bun</SelectItem>
  </SelectContent>
  {/* Set both width and maxWidth for a wider picker. */}
  <SelectContent width={46} maxWidth={46} height={18} maxHeight={18}>
    {/* options */}
  </SelectContent>
</>
```

Set these limits through component props or [shared source defaults](styling.md).
