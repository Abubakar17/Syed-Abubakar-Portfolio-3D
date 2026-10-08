import { useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../lib/store'
import { prefersReducedMotion } from '../lib/device'
import { rackById } from './layout'
import { TRANSITION_SECONDS, avatar, transition } from './runtime'

/** Drives transition progress and keeps avatar bookkeeping consistent across phase changes. */
export default function Director() {
  useEffect(() => {
    const placeAt = (id: NonNullable<ReturnType<typeof useStore.getState>['active']>) => {
      const r = rackById[id]
      avatar.saved.copy(r.front).addScaledVector(r.normal, 0.35)
      avatar.savedHeading = Math.atan2(-r.normal.x, -r.normal.z)
    }
    // Deep link straight into a section: avatar waits in front of that rack.
    const s = useStore.getState()
    if (s.phase === 'open' && s.active) {
      placeAt(s.active)
      transition.p = 1
    }
    return useStore.subscribe((next, prev) => {
      if (next.phase === 'entering' && prev.phase === 'aisle') {
        avatar.saved.copy(avatar.pos)
        avatar.savedHeading = avatar.heading
      }
      if (next.phase === 'open' && prev.phase === 'aisle' && next.active) {
        placeAt(next.active)
        transition.p = 1
      }
      // Switched sections from inside the overlay: re-emerge from the new rack.
      if (next.phase === 'open' && prev.phase === 'open' && next.active && next.active !== prev.active) placeAt(next.active)
      if (next.phase === 'aisle' && prev.phase !== 'aisle' && transition.p > 0) {
        transition.p = 0
        avatar.pos.copy(avatar.saved)
      }
    })
  }, [])

  useFrame((_, dt) => {
    const { phase, finishTransition } = useStore.getState()
    const step = prefersReducedMotion() ? 1 : Math.min(dt, 0.05) / TRANSITION_SECONDS
    if (phase === 'entering') {
      transition.p = Math.min(1, transition.p + step)
      if (transition.p >= 1) finishTransition()
    } else if (phase === 'exiting') {
      transition.p = Math.max(0, transition.p - step)
      if (transition.p <= 0) finishTransition()
    }
  })

  return null
}
