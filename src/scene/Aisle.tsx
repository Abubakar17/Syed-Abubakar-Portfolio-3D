import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  Color,
  InstancedMesh,
  MeshBasicMaterial,
  Object3D,
  type WebGLProgramParametersWithUniforms,
} from 'three'
import { AISLE_HALF, RACK_D, RACK_H, RACK_W, ROW_SLOTS, ROW_START, fillerSlots, slotZ } from './layout'
import { floorTexture, labelTexture } from './textures'
import { profile } from '../content/cv'

const LEN = ROW_SLOTS * RACK_W
const BACK_Z = ROW_START + 3
const MID_Z = (BACK_Z + slotZ(ROW_SLOTS - 1) - 1) / 2
const FLOOR_LEN = BACK_Z - (slotZ(ROW_SLOTS - 1) - 1)
const END_Z = slotZ(ROW_SLOTS - 1) - RACK_W / 2 - 0.6
const CEIL = 3.3

/** Deterministic pseudo-random so the layout is identical on every load. */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

/** Builds server-unit and LED transforms for every rack slot (both rows). */
function useRackFaces() {
  return useMemo(() => {
    const units: { x: number; y: number; z: number; h: number; tint: number }[] = []
    const leds: { x: number; y: number; z: number; color: Color }[] = []
    const palette = [new Color('#3dffa8'), new Color('#38e1ff'), new Color('#38e1ff'), new Color('#4f8cff'), new Color('#ffb547')]
    let n = 0
    for (const side of [-1, 1] as const) {
      for (let slot = 0; slot < ROW_SLOTS; slot++) {
        const z = slotZ(slot)
        let y = 0.12
        while (y < RACK_H - 0.25) {
          const h = rand(++n) > 0.7 ? 0.26 : 0.12
          if (y + h > RACK_H - 0.18) break
          if (rand(++n) > 0.12) {
            units.push({ x: side * (AISLE_HALF - 0.005), y: y + h / 2, z, h: h - 0.02, tint: rand(++n) })
            const count = 1 + Math.floor(rand(++n) * 3)
            for (let i = 0; i < count; i++) {
              leds.push({
                x: side * (AISLE_HALF - 0.026),
                y: y + h / 2,
                z: z + side * (0.26 - i * 0.045),
                color: palette[Math.floor(rand(++n) * palette.length)].clone().multiplyScalar(2.2),
              })
            }
          }
          y += h + 0.012
        }
      }
    }
    return { units, leds }
  }, [])
}

/** LED material: per-instance colour, blinking driven by gl_InstanceID hash + time. */
function useBlinkMaterial() {
  return useMemo(() => {
    const mat = new MeshBasicMaterial({ toneMapped: false })
    const uniforms = { uTime: { value: 0 } }
    mat.onBeforeCompile = (shader: WebGLProgramParametersWithUniforms) => {
      shader.uniforms.uTime = uniforms.uTime
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying float vBlink;\nuniform float uTime;')
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
          float id = float(gl_InstanceID);
          float h = fract(sin(id * 12.9898) * 43758.5453);
          float rate = 0.6 + h * 5.0;
          float tick = floor(uTime * rate + h * 10.0);
          float r = fract(sin((tick + id) * 78.233) * 43758.5453);
          vBlink = h < 0.35 ? 1.0 : (r > 0.35 ? 1.0 : 0.12);`,
        )
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying float vBlink;')
        .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb *= vBlink;')
    }
    return { mat, uniforms }
  }, [])
}

function RackRows() {
  const bodies = useRef<InstancedMesh>(null!)
  const units = useRef<InstancedMesh>(null!)
  const leds = useRef<InstancedMesh>(null!)
  const faces = useRackFaces()
  const blink = useBlinkMaterial()

  useLayoutEffect(() => {
    const o = new Object3D()
    // Filler rack bodies (section racks render their own, highlighted body).
    fillerSlots.forEach(({ side, slot }, i) => {
      o.position.set(side * (AISLE_HALF + RACK_D / 2), RACK_H / 2, slotZ(slot))
      o.scale.set(1, 1, 1)
      o.updateMatrix()
      bodies.current.setMatrixAt(i, o.matrix)
    })
    bodies.current.instanceMatrix.needsUpdate = true

    const c = new Color()
    faces.units.forEach((u, i) => {
      o.position.set(u.x, u.y, u.z)
      o.scale.set(1, u.h, 1)
      o.updateMatrix()
      units.current.setMatrixAt(i, o.matrix)
      units.current.setColorAt(i, c.setHSL(0.58, 0.18, 0.07 + u.tint * 0.05))
    })
    units.current.instanceMatrix.needsUpdate = true
    if (units.current.instanceColor) units.current.instanceColor.needsUpdate = true

    faces.leds.forEach((l, i) => {
      o.position.set(l.x, l.y, l.z)
      o.scale.set(1, 1, 1)
      o.updateMatrix()
      leds.current.setMatrixAt(i, o.matrix)
      leds.current.setColorAt(i, l.color)
    })
    leds.current.instanceMatrix.needsUpdate = true
    if (leds.current.instanceColor) leds.current.instanceColor.needsUpdate = true
  }, [faces])

  useFrame((_, dt) => {
    blink.uniforms.uTime.value += dt
  })

  return (
    <group>
      <instancedMesh ref={bodies} args={[undefined, undefined, fillerSlots.length]} frustumCulled={false}>
        <boxGeometry args={[RACK_D, RACK_H, RACK_W - 0.04]} />
        <meshStandardMaterial color="#0c1117" metalness={0.6} roughness={0.5} />
      </instancedMesh>
      <instancedMesh ref={units} args={[undefined, undefined, faces.units.length]} frustumCulled={false}>
        <boxGeometry args={[0.03, 1, RACK_W - 0.16]} />
        <meshStandardMaterial metalness={0.5} roughness={0.55} />
      </instancedMesh>
      <instancedMesh ref={leds} args={[undefined, blink.mat, faces.leds.length]} frustumCulled={false}>
        <boxGeometry args={[0.012, 0.022, 0.022]} />
      </instancedMesh>
    </group>
  )
}

function Shell() {
  const floor = useMemo(() => {
    const t = floorTexture()
    t.repeat.set(8 / 0.6, FLOOR_LEN / 0.6)
    return t
  }, [])
  const sign = useMemo(
    () =>
      labelTexture(
        [
          { text: 'DC-01 · COLD AISLE', size: 34, color: '#7fdcf0' },
          { text: profile.name.toUpperCase(), size: 44, color: '#e8f7ff', weight: 700 },
        ],
        1024,
        160,
      ),
    [],
  )
  const lights = useMemo(() => Array.from({ length: 9 }, (_, i) => ROW_START - 1 - i * 2.4), [])

  return (
    <group>
      {/* Raised floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, MID_Z]}>
        <planeGeometry args={[8, FLOOR_LEN]} />
        <meshStandardMaterial map={floor} metalness={0.55} roughness={0.38} />
      </mesh>
      {/* Aisle guide strips */}
      {[-1, 1].map((s) => (
        <mesh key={s} rotation-x={-Math.PI / 2} position={[s * 1.25, 0.004, MID_Z]}>
          <planeGeometry args={[0.025, LEN]} />
          <meshBasicMaterial color={[0.2, 1.6, 2.2]} toneMapped={false} />
        </mesh>
      ))}
      {/* Ceiling */}
      <mesh rotation-x={Math.PI / 2} position={[0, CEIL, MID_Z]}>
        <planeGeometry args={[8, FLOOR_LEN]} />
        <meshStandardMaterial color="#05080c" />
      </mesh>
      {/* Cable trays over each row */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (AISLE_HALF + 0.5), 2.62, MID_Z]}>
          <boxGeometry args={[0.6, 0.08, LEN]} />
          <meshStandardMaterial color="#131b23" metalness={0.8} roughness={0.35} />
        </mesh>
      ))}
      {/* Light fixtures (emissive) */}
      {lights.map((z) => (
        <mesh key={z} position={[0, CEIL - 0.04, z]}>
          <boxGeometry args={[0.12, 0.03, 1.2]} />
          <meshBasicMaterial color={[1.2, 2.4, 3]} toneMapped={false} />
        </mesh>
      ))}
      {/* End wall + sign */}
      <mesh position={[0, CEIL / 2, END_Z]}>
        <planeGeometry args={[8, CEIL]} />
        <meshStandardMaterial color="#070b11" />
      </mesh>
      <mesh position={[0, 2.35, END_Z + 0.02]}>
        <planeGeometry args={[2.6, 0.41]} />
        <meshBasicMaterial map={sign} toneMapped={false} />
      </mesh>
      {/* Back wall behind spawn */}
      <mesh position={[0, CEIL / 2, BACK_Z]} rotation-y={Math.PI}>
        <planeGeometry args={[8, CEIL]} />
        <meshStandardMaterial color="#070b11" />
      </mesh>
    </group>
  )
}

function Lighting() {
  return (
    <>
      <color attach="background" args={['#03060a']} />
      <fog attach="fog" args={['#03060a', 7, 22]} />
      <hemisphereLight args={['#2a6c8a', '#05070a', 0.55]} />
      <ambientLight intensity={0.12} />
      {[1.5, -4, -9.5, -15].map((z, i) => (
        <pointLight key={z} position={[0, 2.9, z]} color={i % 2 ? '#3d7dff' : '#38e1ff'} intensity={9} distance={7.5} decay={1.6} />
      ))}
    </>
  )
}

export default function Aisle() {
  return (
    <group>
      <Lighting />
      <Shell />
      <RackRows />
    </group>
  )
}
