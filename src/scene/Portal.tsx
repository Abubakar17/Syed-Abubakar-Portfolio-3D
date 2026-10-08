import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BufferAttribute, BufferGeometry, ShaderMaterial, Vector3, type Points } from 'three'
import { useStore } from '../lib/store'
import { AISLE_HALF, RACK_H, rackById } from './layout'
import { avatar, transition } from './runtime'

const COUNT = 700

const vertex = /* glsl */ `
  attribute float aT;
  attribute float aAngle;
  attribute float aRadius;
  uniform vec3 uStart;
  uniform vec3 uEnd;
  uniform float uTime;
  uniform float uStrength;
  uniform float uPixel;
  varying float vAlpha;
  void main() {
    float t = fract(aT + uTime * (0.55 + aRadius * 0.8));
    vec3 d = normalize(uEnd - uStart);
    vec3 u = normalize(cross(d, vec3(0.0, 1.0, 0.0)) + vec3(1e-4));
    vec3 v = cross(u, d);
    float a = aAngle + uTime * 4.0 + t * 9.0;
    float r = aRadius * (1.0 - t) * (0.4 + 0.6 * sin(t * 3.14159));
    vec3 p = mix(uStart, uEnd, t * t) + (u * cos(a) + v * sin(a)) * r;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uPixel * (2.0 + 6.0 * (1.0 - t)) * uStrength / -mv.z;
    vAlpha = uStrength * smoothstep(0.0, 0.08, t) * (1.0 - smoothstep(0.85, 1.0, t));
  }
`

const fragment = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float g = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vec3(0.35, 1.6, 2.4) * g, g * vAlpha);
  }
`

/** Stream of light particles from the avatar into the rack during the enter/exit transition. */
export default function Portal() {
  const ref = useRef<Points>(null!)
  const { geometry, material } = useMemo(() => {
    const g = new BufferGeometry()
    const t = new Float32Array(COUNT)
    const ang = new Float32Array(COUNT)
    const rad = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      t[i] = Math.random()
      ang[i] = Math.random() * Math.PI * 2
      rad[i] = 0.05 + Math.random() * 0.45
    }
    g.setAttribute('position', new BufferAttribute(new Float32Array(COUNT * 3), 3))
    g.setAttribute('aT', new BufferAttribute(t, 1))
    g.setAttribute('aAngle', new BufferAttribute(ang, 1))
    g.setAttribute('aRadius', new BufferAttribute(rad, 1))
    const m = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uStart: { value: new Vector3() },
        uEnd: { value: new Vector3() },
        uTime: { value: 0 },
        uStrength: { value: 0 },
        uPixel: { value: 60 },
      },
    })
    return { geometry: g, material: m }
  }, [])

  useFrame((state, dt) => {
    const { active } = useStore.getState()
    const p = transition.p
    const u = material.uniforms
    const s = p <= 0 || p >= 1 || !active ? 0 : Math.min(1, p / 0.2) * (1 - Math.max(0, (p - 0.9) / 0.1))
    u.uStrength.value = s
    ref.current.visible = s > 0.001
    if (!ref.current.visible || !active) return
    const r = rackById[active]
    u.uTime.value += dt
    u.uPixel.value = state.size.height * 0.08
    ;(u.uStart.value as Vector3).set(avatar.pos.x, 0.75, avatar.pos.z)
    ;(u.uEnd.value as Vector3).set(r.side * (AISLE_HALF + 0.05), RACK_H * 0.55, r.center.z)
  })

  return <points ref={ref} geometry={geometry} material={material} frustumCulled={false} />
}
