import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, PerspectiveCamera, Vector3 } from 'three'
import { useStore } from '../lib/store'
import { AISLE_HALF, RACK_H, rackById } from './layout'
import { avatar, transition } from './runtime'

const smooth = (a: number, b: number, t: number) => {
  const x = MathUtils.clamp((t - a) / (b - a), 0, 1)
  return x * x * (3 - 2 * x)
}

/** Third-person follow camera that dollies into the chosen rack during transitions. */
export default function CameraRig() {
  const { camera, size } = useThree()
  const v = useMemo(
    () => ({ pos: new Vector3(), look: new Vector3(), aislePos: new Vector3(), aisleLook: new Vector3(), rackPos: new Vector3(), rackLook: new Vector3(), curLook: new Vector3(0, 1, -2) }),
    [],
  )
  const portrait = size.width / size.height < 0.85

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const cam = camera as PerspectiveCamera
    const targetFov = portrait ? 74 : 50
    if (Math.abs(cam.fov - targetFov) > 0.01) {
      cam.fov = MathUtils.damp(cam.fov, targetFov, 4, dt)
      cam.updateProjectionMatrix()
    }

    // Aisle framing: behind + above the avatar, looking down the aisle.
    const back = portrait ? 4.6 : 4.4
    const up = portrait ? 3.3 : 2.55
    v.aislePos.set(avatar.pos.x * 0.55, up, Math.min(avatar.pos.z + back, 6.7))
    v.aisleLook.set(avatar.pos.x * 0.4, 0.9, avatar.pos.z - 3)

    const { active } = useStore.getState()
    const p = transition.p
    if (active && p > 0) {
      const r = rackById[active]
      const face = v.rackLook.set(r.side * AISLE_HALF, RACK_H * 0.55, r.center.z)
      const dist = MathUtils.lerp(portrait ? 2.8 : 2.3, 0.35, smooth(0.45, 1, p))
      v.rackPos.copy(face).addScaledVector(r.normal, dist)
      // Oblique, slightly high angle so the avatar is seen being pulled in rather than blocking the lens.
      v.rackPos.z += 1.5 * (1 - smooth(0.45, 1, p))
      v.rackPos.y = MathUtils.lerp(2.05, RACK_H * 0.55, smooth(0.45, 1, p))
      const w = smooth(0, 0.45, p)
      v.pos.lerpVectors(v.aislePos, v.rackPos, w)
      v.look.lerpVectors(v.aisleLook, face, w)
      camera.position.lerp(v.pos, 1 - Math.exp(-14 * dt))
      v.curLook.lerp(v.look, 1 - Math.exp(-14 * dt))
    } else {
      camera.position.lerp(v.aislePos, 1 - Math.exp(-5 * dt))
      v.curLook.lerp(v.aisleLook, 1 - Math.exp(-6 * dt))
    }
    camera.lookAt(v.curLook)
  })

  return null
}
