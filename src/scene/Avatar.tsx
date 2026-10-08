import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import { LoopOnce, MathUtils, Mesh, MeshStandardMaterial, type Group } from 'three'
import { input } from '../lib/input'
import { useStore } from '../lib/store'
import { AISLE_HALF, NEAR_DIST, WALK, rackById, sectionRacks } from './layout'
import { avatar, transition } from './runtime'

export const AVATAR_URL = `${import.meta.env.BASE_URL}models/robot.glb`
const SCALE = 0.27
const MAX_SPEED = 2.8

const ease = (t: number) => t * t * (3 - 2 * t)
const seg = (p: number, a: number, b: number) => MathUtils.clamp((p - a) / (b - a), 0, 1)

/** Shortest-path angle damping. */
function dampAngle(cur: number, target: number, lambda: number, dt: number) {
  let d = ((target - cur + Math.PI) % (Math.PI * 2)) - Math.PI
  if (d < -Math.PI) d += Math.PI * 2
  return cur + d * (1 - Math.exp(-lambda * dt))
}

export default function Avatar() {
  const root = useRef<Group>(null!)
  const { scene, animations } = useGLTF(AVATAR_URL, false, true)
  const { actions, mixer } = useAnimations(animations, root)
  const current = useRef<'Idle' | 'Walking'>('Idle')
  const vel = useRef({ x: 0, z: 0 })

  // Restyle the stock robot to fit the scene palette.
  useEffect(() => {
    scene.traverse((o) => {
      if (!(o instanceof Mesh)) return
      o.frustumCulled = false
      const m = o.material as MeshStandardMaterial
      if (m.name === 'Main') {
        m.color.set('#2fb4dc')
        m.emissive.set('#0b4a60')
        m.roughness = 0.35
        m.metalness = 0.35
      } else if (m.name === 'Grey') {
        m.color.set('#a8b8c4')
        m.roughness = 0.5
      } else if (m.name === 'Black') {
        m.emissive.set('#38e1ff')
        m.emissiveIntensity = 0.6
      }
    })
  }, [scene])

  // Idle loop, plus a one-off wave hello on first load.
  useEffect(() => {
    actions.Idle?.play()
    const wave = actions.Wave
    if (wave && useStore.getState().phase === 'aisle') {
      wave.setLoop(LoopOnce, 1).reset().setEffectiveWeight(1).fadeIn(0.3).play()
      wave.clampWhenFinished = false
      const done = () => wave.fadeOut(0.4)
      mixer.addEventListener('finished', done)
      return () => mixer.removeEventListener('finished', done)
    }
  }, [actions, mixer])

  const play = (name: 'Idle' | 'Walking') => {
    if (current.current === name) return
    actions[current.current]?.fadeOut(0.25)
    actions[name]?.reset().fadeIn(0.25).play()
    current.current = name
  }

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const { phase, active } = useStore.getState()
    const g = root.current
    let walking = false

    if (phase === 'aisle' && transition.p === 0) {
      const dir = input.vector()
      if (dir.x || dir.z) useStore.getState().markMoved()
      vel.current.x = MathUtils.damp(vel.current.x, dir.x * MAX_SPEED, 10, dt)
      vel.current.z = MathUtils.damp(vel.current.z, dir.z * MAX_SPEED, 10, dt)
      avatar.pos.x = MathUtils.clamp(avatar.pos.x + vel.current.x * dt, WALK.minX, WALK.maxX)
      avatar.pos.z = MathUtils.clamp(avatar.pos.z + vel.current.z * dt, WALK.minZ, WALK.maxZ)
      avatar.speed = Math.hypot(vel.current.x, vel.current.z)
      if (avatar.speed > 0.15) avatar.heading = dampAngle(avatar.heading, Math.atan2(vel.current.x, vel.current.z), 12, dt)
      walking = avatar.speed > 0.25
      if (actions.Walking) actions.Walking.timeScale = MathUtils.clamp(avatar.speed / 1.6, 0.6, 1.6)

      // Nearest rack within reach.
      let best: string | null = null
      let bestD = NEAR_DIST
      for (const r of sectionRacks) {
        const d = Math.hypot(r.front.x - avatar.pos.x, r.front.z - avatar.pos.z)
        if (d < bestD) {
          bestD = d
          best = r.id
        }
      }
      useStore.getState().setNearest(best as never)

      g.position.copy(avatar.pos)
      g.rotation.y = avatar.heading
      g.scale.setScalar(SCALE)
      g.visible = true
    } else if (active) {
      // Transition: step to the rack, turn to face it, then get pulled in.
      vel.current.x = vel.current.z = 0
      const r = rackById[active]
      const p = transition.p
      const step = ease(seg(p, 0, 0.3))
      const pull = ease(seg(p, 0.3, 0.85))
      const faceHeading = Math.atan2(-r.normal.x, -r.normal.z)
      const x0 = MathUtils.lerp(avatar.saved.x, r.front.x, step)
      const z0 = MathUtils.lerp(avatar.saved.z, r.front.z, step)
      g.position.set(
        MathUtils.lerp(x0, r.side * AISLE_HALF, pull),
        Math.sin(pull * Math.PI) * 0.35 + pull * 0.6,
        z0,
      )
      let turn = ((faceHeading - avatar.savedHeading + Math.PI) % (Math.PI * 2)) - Math.PI
      if (turn < -Math.PI) turn += Math.PI * 2
      g.rotation.y = avatar.savedHeading + turn * ease(seg(p, 0, 0.25)) + pull * Math.PI * 2
      g.scale.setScalar(SCALE * (1 - pull))
      g.visible = pull < 0.999
      walking = step > 0 && step < 1
      avatar.pos.set(g.position.x, 0, g.position.z)
      avatar.heading = g.rotation.y
    }
    play(walking ? 'Walking' : 'Idle')
  })

  return (
    <group ref={root} scale={SCALE} rotation-y={avatar.heading}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(AVATAR_URL, false, true)
