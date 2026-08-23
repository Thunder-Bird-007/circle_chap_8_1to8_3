import type { Point } from '../geometry'
import { PALETTE, type PaletteKey } from '../lib/palette'

interface ChordProps {
  a: Point
  b: Point
  color?: PaletteKey
  strokeWidth?: number
  dashed?: boolean
  /** Extend the drawn segment past both endpoints by this many px (for a
   * ray shown continuing, e.g. a chord dragged toward a tangent/diameter). */
  extendPx?: number
}

export default function Chord({
  a,
  b,
  color = 'chalk',
  strokeWidth = 3,
  dashed = false,
  extendPx = 0,
}: ChordProps) {
  let [x1, y1, x2, y2] = [a.x, a.y, b.x, b.y]
  if (extendPx > 0) {
    const dx = b.x - a.x
    const dy = b.y - a.y
    const len = Math.hypot(dx, dy) || 1
    const ux = dx / len
    const uy = dy / len
    x1 -= ux * extendPx
    y1 -= uy * extendPx
    x2 += ux * extendPx
    y2 += uy * extendPx
  }
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={PALETTE[color]}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDasharray={dashed ? '6 6' : undefined}
    />
  )
}
