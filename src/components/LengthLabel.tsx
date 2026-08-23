import type { Point } from '../geometry'
import { DISPLAY_FONT } from '../lib/fonts'
import { PALETTE, type PaletteKey } from '../lib/palette'

interface LengthLabelProps {
  a: Point
  b: Point
  text: string
  color?: PaletteKey
  /** Perpendicular offset from the segment's midpoint, in px. */
  offset?: number
  fontSize?: number
}

/** A length readout set along a segment, offset perpendicular to it so it
 * never overlaps the stroke it's labelling. */
export default function LengthLabel({
  a,
  b,
  text,
  color = 'chalk',
  offset = 18,
  fontSize = 20,
}: LengthLabelProps) {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  // perpendicular unit vector
  const px = -dy / len
  const py = dx / len

  return (
    <text
      x={mx + px * offset}
      y={my + py * offset}
      fontFamily={DISPLAY_FONT}
      fontWeight={700}
      fontSize={fontSize}
      fill={PALETTE[color]}
      textAnchor="middle"
      dominantBaseline="middle"
      className="tabular-nums"
    >
      {text}
    </text>
  )
}
