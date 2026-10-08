import { useRef, useState } from 'react'
import { input } from '../lib/input'
import { useStore } from '../lib/store'

const R = 46

/** Optional on-screen joystick for touch devices. Writes straight into the shared input vector. */
export default function Joystick() {
  const phase = useStore((s) => s.phase)
  const base = useRef<HTMLDivElement>(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const pointer = useRef<number | null>(null)

  if (phase !== 'aisle') return null

  const move = (e: React.PointerEvent) => {
    if (pointer.current !== e.pointerId || !base.current) return
    const b = base.current.getBoundingClientRect()
    let dx = e.clientX - (b.left + b.width / 2)
    let dy = e.clientY - (b.top + b.height / 2)
    const len = Math.hypot(dx, dy)
    if (len > R) {
      dx = (dx / len) * R
      dy = (dy / len) * R
    }
    setKnob({ x: dx, y: dy })
    input.joy.x = dx / R
    input.joy.y = dy / R
  }
  const end = () => {
    pointer.current = null
    setKnob({ x: 0, y: 0 })
    input.joy.x = input.joy.y = 0
  }

  return (
    <div
      ref={base}
      className="joystick"
      aria-hidden
      onPointerDown={(e) => {
        pointer.current = e.pointerId
        e.currentTarget.setPointerCapture(e.pointerId)
        move(e)
      }}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <span className="joystick-knob" style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }} />
    </div>
  )
}
