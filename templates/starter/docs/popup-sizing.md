# Popup sizing

SelectContent, DropdownMenuContent and TooltipContent accept `width`/`height` as a cell count or `auto`, plus numeric `minWidth`, `maxWidth`, `minHeight` and `maxHeight`. `minWidth="trigger"` uses the current native trigger width.

| Component | Width | Height | Minimum | Maximum |
| --- | --- | --- | --- | --- |
| Select | auto | auto | Trigger width; 3 rows | 32 columns; 16 rows |
| DropdownMenu | auto | auto | Trigger width; 3 rows | 32 columns; 16 rows |
| Tooltip | auto | auto | 3 columns; 3 rows | 32 columns; available region height |

The size includes the source padding (one cell on each side). Auto width measures the real rendered text/layout tree using terminal-cell widths; it does not mount a second copy of the controls. Auto height follows actual content after layout/wrapping. Measurement settles across layout passes and responds to content and terminal changes.

When a popup opens, native resize hooks apply its measured dimensions before paint. Its first visible frame uses the settled size and placement, including any text wrapping. The popup remains mounted for layout while waiting, and focus moves into it only when it is ready to display.

Interactive popups dim the background immediately on opening; the dimming does not change while layout settles. Closing removes the popup and backdrop and restores focus according to the component's normal behavior. Tooltips do not dim the background or take focus.

Source min/max limits apply before placement. Maximum and terminal/free-region bounds take precedence over an impossible minimum. A trigger wider than maxWidth does not force the popup beyond the cap. To intentionally use a wider popup, override maxWidth as well as width.

Anchored selection/menu/tooltip popups prefer the requested side, then try alternatives without covering the trigger. If no side can fit, the available region caps the result. Extremely small regions may reduce padding to preserve a content cell; if there is no free region, the popup visual is omitted.

Select/Menu items remain one row and truncate when needed. A native vertical scrollbar handles excess height; keyboard focus reveals its item, including after resize. Tooltip wraps text and clips to its region without installing a scrollbox or taking focus.

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
  // A deliberate exception for a wider control picker:
  <SelectContent width={46} maxWidth={46} height={18} maxHeight={18}>
    {/* options */}
  </SelectContent>
</>
```

The limits are ordinary source/props. No exported Tweak JSON is loaded at runtime.
