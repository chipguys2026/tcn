import type { ScrollBoxRenderable } from '@opentui/core'
import { useRenderer } from '@opentui/react'
import { stringWidth } from 'bun'
import { type PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { useFocusable } from '@/lib/ui/focus/use-focusable'
import { useFocusRing } from '@/lib/ui/focus-ring'
import { PartBox, PartText } from '@/lib/ui/parts'
import { useComponentStyles } from '@/lib/ui/style-review'
import { codeBlockDefaults as d } from '@/lib/ui/styles'
import { useTheme } from '@/lib/ui/theme/use-theme'
import { useSyntaxStyle } from '@/lib/ui/use-syntax-style'
import { Button } from './button'
export function CodeBlock({ children }: PropsWithChildren) {
  const theme = useTheme()
  return (
    <PartBox
      source="code-block"
      part="CodeBlock"
      width="100%"
      paddingX={d.paddingX}
      paddingY={d.paddingY}
      gap={d.gap}
      backgroundColor={theme.muted}
    >
      {children}
    </PartBox>
  )
}
export function CodeBlockHeader({ children }: PropsWithChildren) {
  return (
    <PartBox
      source="code-block"
      part="CodeBlockHeader"
      width="100%"
      flexDirection="row"
      alignItems="center"
      gap={d.gap}
    >
      {children}
    </PartBox>
  )
}
export function CodeBlockTitle({ children }: { children: string }) {
  return (
    <PartBox
      source="code-block"
      part="CodeBlockTitle"
      flexGrow={1}
      flexShrink={1}
    >
      <PartText
        source="code-block"
        part="CodeBlockTitle.text"
        height={1}
        wrapMode="none"
        truncate
        bold
      >
        {children}
      </PartText>
    </PartBox>
  )
}
export function CodeBlockActions({ children }: PropsWithChildren) {
  return (
    <PartBox
      source="code-block"
      part="CodeBlockActions"
      flexDirection="row"
      flexWrap="wrap"
      alignSelf="flex-end"
      gap={d.gap}
    >
      {children}
    </PartBox>
  )
}
export function CodeBlockCopyButton({
  value,
  onCopy,
  onCopyError,
}: {
  value: string
  onCopy?: () => void
  onCopyError?: (error: Error) => void
}) {
  const renderer = useRenderer(),
    [copiedValue, setCopiedValue] = useState<string | null>(null)
  const copied = copiedValue === value
  useEffect(() => {
    if (copiedValue === null) return
    const timer = renderer.clock.setTimeout(() => setCopiedValue(null), 2000)
    return () => renderer.clock.clearTimeout(timer)
  }, [copiedValue, renderer])
  return (
    <Button
      variant="ghost"
      icon={copied ? 'check' : undefined}
      styleSource="code-block"
      stylePart="CodeBlockCopyButton"
      onPress={() => {
        const ok = renderer.copyToClipboardOSC52(value)
        setCopiedValue(ok ? value : null)
        if (ok) onCopy?.()
        else onCopyError?.(new Error('Terminal clipboard is unavailable'))
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </Button>
  )
}
export function CodeBlockContent({
  children,
  language,
  lineNumbers = false,
  startLine = 1,
  wrap = false,
  height,
  maxHeight = d.maxHeight,
  highlightedLines = [],
  id,
  label = 'Code block',
}: PropsWithChildren<{
  language?: string
  lineNumbers?: boolean
  startLine?: number
  wrap?: boolean
  height?: number
  maxHeight?: number
  highlightedLines?: number[]
  id?: string
  label?: string
}>) {
  const styles = useComponentStyles('code-block'),
    theme = useTheme(),
    syntax = useSyntaxStyle(),
    focus = useFocusable<ScrollBoxRenderable>({ id, label }),
    focusProps = focus.getFocusProps()
  useFocusRing(focusProps.ref, focus.focused, theme.ring)
  const metrics = useMemo(() => {
    if (typeof children !== 'string') return { width: 1, gutter: 0 }
    const lines = children.split('\n')
    return {
      width: lines.reduce(
        (max, line) => Math.max(max, stringWidth(line.replace(/\t/g, '    '))),
        1,
      ),
      gutter: lineNumbers
        ? String(Math.max(1, startLine) + lines.length - 1).length + 2
        : 0,
    }
  }, [children, lineNumbers, startLine])
  return (
    <scrollbox
      {...focusProps}
      width="100%"
      height={height}
      maxHeight={Math.max(1, maxHeight)}
      minHeight={1}
      scrollY
      scrollX={!wrap}
      viewportCulling={false}
      {...styles('CodeBlockContent', {
        width: '100%',
        height,
        maxHeight,
        minHeight: 1,
      })}
    >
      {typeof children === 'string' ? (
        <line-number
          showLineNumbers={lineNumbers}
          lineNumberOffset={Math.max(0, startLine - 1)}
          fg={theme.mutedForeground}
          paddingRight={lineNumbers ? 1 : 0}
          lineColors={
            new Map(
              highlightedLines.map((line) => [
                line - startLine,
                // Native distinguishes a line-color config by the gutter key.
                { gutter: undefined, content: theme.accent },
              ]),
            )
          }
          width={wrap ? '100%' : metrics.width + metrics.gutter}
          flexShrink={0}
        >
          <code
            content={children}
            width={wrap ? '100%' : metrics.width}
            flexShrink={0}
            filetype={language}
            syntaxStyle={syntax}
            fg={theme.foreground}
            wrapMode={wrap ? 'word' : 'none'}
          />
        </line-number>
      ) : (
        children
      )}
    </scrollbox>
  )
}
export function CodeBlockLine({
  children,
  variant = 'default',
  highlighted = false,
}: {
  children: string
  variant?: 'default' | 'added' | 'removed'
  highlighted?: boolean
}) {
  const theme = useTheme()
  return (
    <PartBox
      source="code-block"
      part="CodeBlockLine"
      width="100%"
      flexDirection="row"
      backgroundColor={highlighted ? theme.accent : undefined}
    >
      <PartText
        source="code-block"
        part="CodeBlockLine.sign"
        fg={variant === 'removed' ? theme.destructive : theme.primary}
      >
        {variant === 'added' ? '+' : variant === 'removed' ? '-' : ' '}
      </PartText>
      <PartText
        source="code-block"
        part="CodeBlockLine.text"
        fg={variant === 'removed' ? theme.destructive : theme.foreground}
      >
        {children}
      </PartText>
    </PartBox>
  )
}
export function CodeBlockFooter({ children }: PropsWithChildren) {
  return (
    <PartBox
      source="code-block"
      part="CodeBlockFooter"
      flexDirection="row"
      flexWrap="wrap"
      gap={d.gap}
    >
      {children}
    </PartBox>
  )
}
