import { create } from 'zustand'
import type { SectionId } from '../content/cv'

/**
 * aisle    → walking around
 * entering → avatar is being pulled into a rack (scene drives the progress)
 * open     → section overlay is shown
 * exiting  → reverse animation back to the aisle
 */
export type Phase = 'aisle' | 'entering' | 'open' | 'exiting'

interface State {
  phase: Phase
  active: SectionId | null
  nearest: SectionId | null
  sceneReady: boolean
  hasMoved: boolean
  /** Request to open a section. Instant when the scene isn't running or motion is reduced. */
  open: (id: SectionId, instant?: boolean) => void
  close: (instant?: boolean) => void
  finishTransition: () => void
  setNearest: (id: SectionId | null) => void
  setSceneReady: (ready: boolean) => void
  markMoved: () => void
}

export const useStore = create<State>((set, get) => ({
  phase: 'aisle',
  active: null,
  nearest: null,
  sceneReady: false,
  hasMoved: false,

  open: (id, instant = false) => {
    const { phase, sceneReady } = get()
    // Already inside a section → swap content without re-playing the transition.
    if (phase === 'open' || phase === 'entering') return set({ active: id })
    set({ active: id, phase: instant || !sceneReady ? 'open' : 'entering' })
  },

  close: (instant = false) => {
    const { phase, sceneReady } = get()
    if (phase === 'aisle' || phase === 'exiting') return
    if (instant || !sceneReady) return set({ phase: 'aisle', active: null })
    set({ phase: 'exiting' })
  },

  finishTransition: () => {
    const { phase } = get()
    if (phase === 'entering') set({ phase: 'open' })
    else if (phase === 'exiting') set({ phase: 'aisle', active: null })
  },

  setNearest: (id) => get().nearest !== id && set({ nearest: id }),
  setSceneReady: (ready) => set({ sceneReady: ready }),
  markMoved: () => !get().hasMoved && set({ hasMoved: true }),
}))
