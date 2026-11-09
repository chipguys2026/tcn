// biome-ignore-all lint/a11y/noStaticElementInteractions: Native terminal label delegates mouse focus; OpenTUI has no DOM label/role API.
import { TextAttributes } from '@opentui/core'
import { useRenderer } from '@opentui/react'
import { getFocusCoordinator } from '@/lib/ui/focus/coordinator'
import { useComponentStyles } from '@/lib/ui/style-review'
import { useTheme } from '@/lib/ui/theme/use-theme'

export function Label({
  children,
  htmlFor,
  disabled = false,
  required = false,
  invalid = false,
  styleSource = 'label',
  stylePart = 'Label',
}: {
  children: string
  htmlFor?: string
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  styleSource?: string
  stylePart?: string
}) {
  const componentStyle = useComponentStyles(styleSource)

  const theme = useTheme(),
    renderer = useRenderer()
  return (
    <text
      height={1}
      fg={invalid ? theme.destructive : theme.foreground}
      attributes={TextAttributes.BOLD}
      opacity={disabled ? 0.45 : 1}
      selectable={false}
      onMouseUp={(event) => {
        if (disabled || !htmlFor || event.button !== 0) return
        const target = renderer.root.findDescendantById(htmlFor)
        const manager = getFocusCoordinator(renderer),
          owner = manager.owner(target ?? null)
        if (
          target &&
          !target.isDestroyed &&
          target.focusable &&
          target.visible &&
          (!owner || manager.allowed(owner))
        )
          target.focus()
      }}
      {...componentStyle(
        stylePart,
        { height: 1, fg: invalid ? theme.destructive : theme.foreground },
        'text',
      )}
    >
      {children}
      {required && <span fg={theme.destructive}> *</span>}
    </text>
  )
}
