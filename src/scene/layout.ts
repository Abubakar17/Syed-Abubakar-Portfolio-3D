import { Vector3 } from 'three'
import { sections, type SectionId } from '../content/cv'

/** Aisle runs along −Z. Racks line both sides; section racks alternate left/right. */
export const RACK_W = 0.8
export const RACK_H = 2.2
export const RACK_D = 1.0
export const AISLE_HALF = 1.65 // x of each rack row's front face
export const ROW_START = 4 // z of the first rack slot
export const ROW_SLOTS = 27
export const WALK = { minX: -0.95, maxX: 0.95, minZ: -15.6, maxZ: 4.2 }
export const START = new Vector3(0, 0, 2.4)
export const NEAR_DIST = 1.7

export interface RackSlot {
  id: SectionId
  label: string
  rack: string
  side: -1 | 1
  slot: number
  /** Centre of the rack body. */
  center: Vector3
  /** Point on the aisle floor in front of the rack. */
  front: Vector3
  /** Unit vector pointing out of the rack face into the aisle. */
  normal: Vector3
}

export const slotZ = (slot: number) => ROW_START - slot * RACK_W

export const sectionRacks: RackSlot[] = sections.map((s, i) => {
  const side = (i % 2 === 0 ? -1 : 1) as -1 | 1
  const slot = 7 + i * 3
  const z = slotZ(slot)
  const x = side * (AISLE_HALF + RACK_D / 2)
  return {
    id: s.id,
    label: s.label,
    rack: s.rack,
    side,
    slot,
    center: new Vector3(x, RACK_H / 2, z),
    front: new Vector3(side * (AISLE_HALF - 0.55), 0, z),
    normal: new Vector3(-side, 0, 0),
  }
})

export const rackById = Object.fromEntries(sectionRacks.map((r) => [r.id, r])) as Record<SectionId, RackSlot>

/** Every (side, slot) not taken by a section rack gets a decorative filler rack. */
export const fillerSlots: { side: -1 | 1; slot: number }[] = []
for (const side of [-1, 1] as const) {
  for (let slot = 0; slot < ROW_SLOTS; slot++) {
    if (!sectionRacks.some((r) => r.side === side && r.slot === slot)) fillerSlots.push({ side, slot })
  }
}
