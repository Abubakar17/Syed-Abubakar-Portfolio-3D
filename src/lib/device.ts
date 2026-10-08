export type ViewMode = '3d' | 'classic'

const KEY = 'portfolio:view'

export const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

export const isTouch = () => typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches

function hasWebGL2() {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

/** Very rough low-end heuristic: no WebGL2, ≤2 cores, ≤2 GB RAM or data-saver on. */
export function isLowEnd() {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  if (!hasWebGL2()) return true
  if ((nav.hardwareConcurrency ?? 4) <= 2) return true
  if ((nav.deviceMemory ?? 4) <= 2) return true
  return !!nav.connection?.saveData
}

export function canRun3D() {
  return hasWebGL2()
}

export function initialView(): ViewMode {
  const q = new URLSearchParams(window.location.search).get('view')
  if (q === 'classic' || q === '3d') return q
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'classic' || saved === '3d') return saved
  } catch {
    /* storage unavailable */
  }
  return prefersReducedMotion() || isLowEnd() ? 'classic' : '3d'
}

export function saveView(v: ViewMode) {
  try {
    localStorage.setItem(KEY, v)
  } catch {
    /* storage unavailable */
  }
}
