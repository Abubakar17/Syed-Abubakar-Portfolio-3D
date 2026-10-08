import { useSyncExternalStore } from 'react'
import { sections, type SectionId } from '../content/cv'

const ids = new Set<string>(sections.map((s) => s.id))
/** Old deep links from the previous site map onto the new sections. */
const aliases: Record<string, SectionId> = {
  deepdive: 'projects',
  aal: 'projects',
  lidar: 'projects',
  work: 'projects',
  research: 'projects',
}

export function parseHash(hash = window.location.hash): SectionId | null {
  const key = hash.replace(/^#\/?/, '').split(/[/?]/)[0].toLowerCase()
  if (ids.has(key)) return key as SectionId
  return aliases[key] ?? null
}

/** Sub-anchor inside a section, e.g. #/projects/deepdive or legacy #/deepdive. */
export function parseAnchor(hash = window.location.hash): string | null {
  const parts = hash.replace(/^#\/?/, '').split('/')
  if (parts[1]) return parts[1]
  return aliases[parts[0]] ? parts[0] : null
}

function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

export function useHash() {
  return useSyncExternalStore(subscribe, () => window.location.hash)
}

export function navigate(id: SectionId | null) {
  const next = id ? `#/${id}` : '#/'
  if (window.location.hash !== next) window.location.hash = next
}
