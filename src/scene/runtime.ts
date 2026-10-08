import { Vector3 } from 'three'
import { START } from './layout'

/**
 * Per-frame mutable state shared by scene components (avatar, camera, particles).
 * Kept outside React so 60fps updates never cause re-renders.
 */
export const avatar = {
  pos: START.clone(),
  heading: Math.PI, // facing down the aisle (−Z)
  speed: 0,
  /** Where the avatar stood before entering a rack — restored on exit. */
  saved: START.clone(),
  savedHeading: Math.PI,
}

/** Transition progress: 0 = in the aisle, 1 = fully inside the rack. */
export const transition = { p: 0 }

export const TRANSITION_SECONDS = 1.35

export const tmp = new Vector3()
