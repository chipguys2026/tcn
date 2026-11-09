import type { CliRenderer, Renderable } from '@opentui/core'

export type FocusRecord = {
  parent: FocusRecord | null
  nodes: Map<Renderable, () => boolean>
  loop: boolean
  trap: boolean
}

export function within(scope: FocusRecord, ancestor: FocusRecord) {
  let current: FocusRecord | null = scope
  while (current) {
    if (current === ancestor) return true
    current = current.parent
  }
  return false
}

class FocusCoordinator {
  records = new Set<FocusRecord>()
  traps: FocusRecord[] = []
  active: FocusRecord | null = null
  constructor(readonly renderer: CliRenderer) {}
  owner(node: Renderable | null) {
    if (!node) return null
    return [...this.records].find((record) => record.nodes.has(node)) ?? null
  }
  allowed(record: FocusRecord) {
    const top = this.traps.at(-1)
    return !top || within(record, top)
  }
  handles(record: FocusRecord) {
    if (!this.allowed(record)) return false
    const owner = this.owner(this.renderer.currentFocusedRenderable)
    if (owner && this.allowed(owner)) return owner === record
    return (
      (this.traps.at(-1) ?? this.active ?? [...this.records].at(-1)) === record
    )
  }
  remove(record: FocusRecord) {
    this.records.delete(record)
    this.traps = this.traps.filter((scope) => scope !== record)
    if (this.active === record) this.active = record.parent
  }
}

const coordinators = new WeakMap<CliRenderer, FocusCoordinator>()
export function getFocusCoordinator(renderer: CliRenderer) {
  let coordinator = coordinators.get(renderer)
  if (!coordinator) {
    coordinator = new FocusCoordinator(renderer)
    coordinators.set(renderer, coordinator)
  }
  return coordinator
}
