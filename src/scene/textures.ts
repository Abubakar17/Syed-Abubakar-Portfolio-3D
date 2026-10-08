import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three'

const MONO = '"JetBrains Mono", "Cascadia Code", Consolas, Menlo, monospace'

/** Text label rendered to a canvas — avoids shipping/fetching font files for 3D text. */
export function labelTexture(
  lines: { text: string; size: number; color: string; weight?: number }[],
  w = 512,
  h = 128,
  bg = 'rgba(4,10,16,0.92)',
) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')!
  g.fillStyle = bg
  g.fillRect(0, 0, w, h)
  g.strokeStyle = 'rgba(56,225,255,0.55)'
  g.lineWidth = 4
  g.strokeRect(2, 2, w - 4, h - 4)
  const total = lines.reduce((s, l) => s + l.size * 1.15, 0)
  let y = (h - total) / 2
  for (const l of lines) {
    g.font = `${l.weight ?? 600} ${l.size}px ${MONO}`
    g.fillStyle = l.color
    g.textAlign = 'center'
    g.textBaseline = 'top'
    g.fillText(l.text, w / 2, y + l.size * 0.08)
    y += l.size * 1.15
  }
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  t.anisotropy = 4
  return t
}

/** Raised-floor tile with perforations. */
export function floorTexture() {
  const s = 256
  const c = document.createElement('canvas')
  c.width = c.height = s
  const g = c.getContext('2d')!
  g.fillStyle = '#0b1016'
  g.fillRect(0, 0, s, s)
  g.fillStyle = '#111a22'
  g.fillRect(6, 6, s - 12, s - 12)
  g.fillStyle = '#070b10'
  for (let y = 40; y < s - 30; y += 22) for (let x = 40; x < s - 30; x += 22) g.fillRect(x, y, 8, 8)
  const t = new CanvasTexture(c)
  t.wrapS = t.wrapT = RepeatWrapping
  t.colorSpace = SRGBColorSpace
  t.anisotropy = 8
  return t
}
