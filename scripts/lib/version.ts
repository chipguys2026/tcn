export type Version = { raw: string; core: bigint[]; pre: string[] }
export function parseVersion(raw: string): Version {
  if (raw.length > 256) throw new Error('Version is too long')
  const match =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/.exec(
      raw,
    )
  if (!match) throw new Error(`Invalid SemVer: ${raw}`)
  const pre = match[4]?.split('.') ?? []
  if (
    pre.some(
      (value) =>
        /^\d+$/.test(value) && value.length > 1 && value.startsWith('0'),
    )
  )
    throw new Error(`Invalid numeric prerelease: ${raw}`)
  return {
    raw,
    core: [
      BigInt(match[1] ?? ''),
      BigInt(match[2] ?? ''),
      BigInt(match[3] ?? ''),
    ],
    pre,
  }
}
export function compareVersions(left: string, right: string) {
  const a = parseVersion(left),
    b = parseVersion(right)
  for (let index = 0; index < 3; index++) {
    const x = a.core[index] ?? 0n,
      y = b.core[index] ?? 0n
    if (x !== y) return x > y ? 1 : -1
  }
  if (!a.pre.length || !b.pre.length)
    return a.pre.length === b.pre.length ? 0 : a.pre.length ? -1 : 1
  for (let index = 0; index < Math.max(a.pre.length, b.pre.length); index++) {
    const x = a.pre[index],
      y = b.pre[index]
    if (x === undefined) return -1
    if (y === undefined) return 1
    if (x === y) continue
    const xn = /^\d+$/.test(x),
      yn = /^\d+$/.test(y)
    if (xn && yn) return BigInt(x) > BigInt(y) ? 1 : -1
    if (xn !== yn) return xn ? -1 : 1
    return x > y ? 1 : -1
  }
  return 0
}
export function changelogSection(text: string, version: string) {
  const lines = text.split(/\r?\n/),
    start = lines.findIndex((line) => {
      const heading = /^##\s+([^\s]+)/.exec(line)?.[1]
      return heading?.replace(/^\[|\]$/g, '') === version
    })
  if (start < 0) throw new Error(`CHANGELOG.md needs a "## ${version}" section`)
  const tail = lines.slice(start + 1),
    end = tail.findIndex((line) => /^##\s/.test(line)),
    section = (end < 0 ? tail : tail.slice(0, end)).join('\n').trim()
  if (!section) throw new Error(`CHANGELOG.md section ${version} is empty`)
  return section
}
