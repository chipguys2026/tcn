import { pillCaps } from './icons'

/** A single-row surface; cap backgrounds stay transparent to reveal the parent. */
export function Pill({
  children,
  backgroundColor,
  foregroundColor,
  surfaceStyle = {},
  textStyle = {},
}: {
  children: string
  backgroundColor?: string
  foregroundColor: string
  surfaceStyle?: Record<string, string | number>
  textStyle?: Record<string, string | number>
}) {
  const background =
    typeof surfaceStyle.backgroundColor === 'string'
      ? surfaceStyle.backgroundColor
      : backgroundColor
  const left = Math.max(
    0,
    Math.floor(Number(surfaceStyle.paddingLeft ?? surfaceStyle.paddingX ?? 1)),
  )
  const right = Math.max(
    0,
    Math.floor(Number(surfaceStyle.paddingRight ?? surfaceStyle.paddingX ?? 1)),
  )
  return (
    <box
      {...surfaceStyle}
      flexDirection="row"
      alignSelf="flex-start"
      maxWidth="100%"
      height={1}
      minHeight={1}
      maxHeight={1}
      overflow="hidden"
      paddingX={0}
      paddingY={0}
      paddingLeft={0}
      paddingRight={0}
      paddingTop={0}
      paddingBottom={0}
      backgroundColor="#00000000"
    >
      {left > 0 && (
        <text
          width={1}
          height={1}
          flexShrink={0}
          fg={background ?? '#00000000'}
          selectable={false}
        >
          {background ? pillCaps.left : ' '}
        </text>
      )}
      <box
        height={1}
        minWidth={0}
        flexShrink={1}
        paddingLeft={Math.max(0, left - 1)}
        paddingRight={Math.max(0, right - 1)}
        backgroundColor={background}
      >
        <text
          fg={foregroundColor}
          {...textStyle}
          height={1}
          wrapMode="none"
          truncate
        >
          {children}
        </text>
      </box>
      {right > 0 && (
        <text
          width={1}
          height={1}
          flexShrink={0}
          fg={background ?? '#00000000'}
          selectable={false}
        >
          {background ? pillCaps.right : ' '}
        </text>
      )}
    </box>
  )
}
