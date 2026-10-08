/**
 * Movement input shared between keyboard, on-screen joystick and the avatar.
 * Plain mutable object — read every frame, never triggers React renders.
 */
export const input = {
  keys: new Set<string>(),
  joy: { x: 0, y: 0 },
  /** Returns the desired move direction in the aisle plane: x = strafe, z = forward(-)/back(+). */
  vector() {
    const k = this.keys
    let x = this.joy.x
    let z = this.joy.y
    if (k.has('ArrowLeft') || k.has('KeyA')) x -= 1
    if (k.has('ArrowRight') || k.has('KeyD')) x += 1
    if (k.has('ArrowUp') || k.has('KeyW')) z -= 1
    if (k.has('ArrowDown') || k.has('KeyS')) z += 1
    const len = Math.hypot(x, z)
    if (len > 1) {
      x /= len
      z /= len
    }
    return { x, z }
  },
}

export const MOVE_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyA', 'KeyD', 'KeyW', 'KeyS'])
