import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { MathUtils, MeshBasicMaterial, type PointLight } from 'three'
import { AISLE_HALF, RACK_D, RACK_H, RACK_W, sectionRacks, type RackSlot } from './layout'
import { labelTexture } from './textures'
import { useStore } from '../lib/store'
import { navigate } from '../lib/route'
import { isTouch } from '../lib/device'

const FRAME = 0.025

function SectionRack({ r }: { r: RackSlot }) {
  const nearest = useStore((s) => s.nearest === r.id)
  const phase = useStore((s) => s.phase)
  const active = useStore((s) => s.active === r.id)
  const [hover, setHover] = useState(false)
  const frameMat = useMemo(() => new MeshBasicMaterial({ toneMapped: false }), [])
  const glow = useRef(0)

  const label = useMemo(
    () =>
      labelTexture([
        { text: r.rack, size: 30, color: '#6fd3ea' },
        { text: r.label.toUpperCase(), size: 52, color: '#eafaff', weight: 700 },
      ]),
    [r],
  )

  const lit = nearest || hover || active
  useFrame((state, dt) => {
    glow.current = MathUtils.damp(glow.current, lit ? 1 : 0, 8, dt)
    const pulse = 0.85 + Math.sin(state.clock.elapsedTime * 3) * 0.15
    const k = (0.5 + glow.current * 2.2) * (lit ? pulse : 1)
    frameMat.color.setRGB(0.22 * k, 0.88 * k, 1.0 * k)
  })

  // Rack-local frame: +X points out of the face into the aisle.
  const faceX = RACK_D / 2 + 0.01
  const rotY = r.side === -1 ? 0 : Math.PI
  const touch = isTouch()

  return (
    <>
    {/* Hanging sign facing the approaching player, angled slightly toward the aisle centre */}
    <group position={[r.side * (AISLE_HALF - 0.05), 2.72, r.center.z]} rotation-y={-r.side * 0.45}>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[0.01, 0.3, 0.01]} />
        <meshBasicMaterial color="#1b2a35" />
      </mesh>
      <mesh>
        <planeGeometry args={[1.0, 0.25]} />
        <meshBasicMaterial map={label} toneMapped={false} side={2} />
      </mesh>
    </group>
    <group position={[r.side * (AISLE_HALF + RACK_D / 2), 0, r.center.z]} rotation-y={rotY}>
      <mesh position={[0, RACK_H / 2, 0]}>
        <boxGeometry args={[RACK_D, RACK_H, RACK_W - 0.04]} />
        <meshStandardMaterial color="#0e151c" metalness={0.65} roughness={0.42} />
      </mesh>

      {/* Glowing door frame */}
      <group position={[faceX, RACK_H / 2, 0]}>
        {[
          [0, RACK_H / 2 - FRAME / 2, 0, FRAME, RACK_W - 0.04],
          [0, -RACK_H / 2 + FRAME / 2, 0, FRAME, RACK_W - 0.04],
          [0, 0, RACK_W / 2 - 0.02 - FRAME / 2, RACK_H, FRAME],
          [0, 0, -(RACK_W / 2 - 0.02 - FRAME / 2), RACK_H, FRAME],
        ].map(([x, y, z, h, w], i) => (
          <mesh key={i} position={[x, y, z]} material={frameMat}>
            <boxGeometry args={[0.02, h, w]} />
          </mesh>
        ))}
      </group>

      {/* Smoked glass door */}
      <mesh position={[faceX + 0.005, RACK_H / 2, 0]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[RACK_W - 0.08, RACK_H - 0.06]} />
        <meshStandardMaterial color="#38e1ff" transparent opacity={0.07} metalness={1} roughness={0.1} depthWrite={false} />
      </mesh>

      {/* Click / tap target covering the rack face */}
      <mesh
        position={[faceX + 0.02, RACK_H / 2, 0]}
        rotation-y={Math.PI / 2}
        onClick={(e) => {
          e.stopPropagation()
          if (useStore.getState().phase === 'aisle') navigate(r.id)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHover(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHover(false)
          document.body.style.cursor = ''
        }}
      >
        <planeGeometry args={[RACK_W, RACK_H + 0.5]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {nearest && phase === 'aisle' && (
        <Html position={[faceX + 0.25, 1.25, 0]} center zIndexRange={[20, 0]} pointerEvents="none">
          <div className="rack-hint">
            <span className="rack-hint-title">{r.label}</span>
            <span>
              {touch ? 'Tap rack to open' : (
                <>
                  Press <kbd>Enter</kbd> to open
                </>
              )}
            </span>
          </div>
        </Html>
      )}
    </group>
    </>
  )
}

/** Single light that follows whichever rack is nearest, so only one extra light is ever active. */
function NearestLight() {
  const light = useRef<PointLight>(null!)
  useFrame((_, dt) => {
    const { nearest, active } = useStore.getState()
    const id = active ?? nearest
    const r = sectionRacks.find((x) => x.id === id)
    const target = r ? 6 : 0
    light.current.intensity = MathUtils.damp(light.current.intensity, target, 6, dt)
    if (r) light.current.position.set(r.side * (AISLE_HALF - 0.6), 1.3, r.center.z)
  })
  return <pointLight ref={light} color="#38e1ff" distance={3.2} decay={1.4} intensity={0} />
}

export default function SectionRacks() {
  return (
    <group>
      {sectionRacks.map((r) => (
        <SectionRack key={r.id} r={r} />
      ))}
      <NearestLight />
    </group>
  )
}
