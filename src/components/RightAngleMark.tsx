import type { Point } from '../geometry'
import { PALETTE, type PaletteKey } from '../lib/palette'

interface RightAngleMarkProps {
  vertex: Point
  /** A point lying along the first leg (only direction matters). */
  legA: Point
  /** A point lying along the second leg (only direction matters). */
  legB: Point
  size?: number
  color?: PaletteKey
}

/** The small square tick that marks a proven/given 90° angle at `vertex`. */
export default function RightAngleMark({
  vertex,
  legA,
  legB,
  size = 16,
  color = 'proof',
}: RightAngleMarkProps) {
  const d1 = { x: legA.x - vertex.x, y: legA.y - vertex.y }
  const d2 = { x: legB.x - vertex.x, y: legB.y - vertex.y }
  const len1 = Math.hypot(d1.x, d1.y) || 1
  const len2 = Math.hypot(d2.x, d2.y) || 1
  const u1 = { x: (d1.x / len1) * size, y: (d1.y / len1) * size }
  const u2 = { x: (d2.x / len2) * size, y: (d2.y / len2) * size }

  const p1 = { x: vertex.x + u1.x, y: vertex.y + u1.y }
  const p2 = { x: vertex.x + u1.x + u2.x, y: vertex.y + u1.y + u2.y }
  const p3 = { x: vertex.x + u2.x, y: vertex.y + u2.y }

  return (
    <polyline
      points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
      fill="none"
      stroke={PALETTE[color]}
      strokeWidth={3}
      strokeLinejoin="round"
    />
  )
}
