import { describeWedgeBetweenPoints, type Point } from '../geometry'
import { DISPLAY_FONT } from '../lib/fonts'
import { PALETTE, type PaletteKey } from '../lib/palette'

interface AngleArcProps {
  vertex: Point
  a: Point
  b: Point
  radius?: number
  color?: PaletteKey
  reflex?: boolean
  filled?: boolean
  fillOpacity?: number
  label?: string
  labelRadius?: number
}

/** A filled angle wedge at `vertex` spanning the rays toward `a` and `b`,
 * drawn at a fixed on-screen radius so it stays legible regardless of how
 * far apart the actual points are. This is the primitive behind every
 * angle indication in the app, including the Doubling Machine's two
 * signature wedges. */
export default function AngleArc({
  vertex,
  a,
  b,
  radius = 34,
  color = 'live',
  reflex = false,
  filled = true,
  fillOpacity = 0.35,
  label,
  labelRadius,
}: AngleArcProps) {
  const d = describeWedgeBetweenPoints(vertex, a, b, radius, reflex)
  const c = PALETTE[color]

  // bisector direction for label placement
  const a1 = Math.atan2(a.y - vertex.y, a.x - vertex.x)
  let a2 = Math.atan2(b.y - vertex.y, b.x - vertex.x)
  let diff = a2 - a1
  diff = Math.atan2(Math.sin(diff), Math.cos(diff))
  let bisector = a1 + diff / 2
  if (reflex) bisector += Math.PI
  const lr = labelRadius ?? radius + 22
  const lx = vertex.x + lr * Math.cos(bisector)
  const ly = vertex.y + lr * Math.sin(bisector)

  return (
    <g>
      <path
        d={d}
        fill={filled ? c : 'none'}
        fillOpacity={filled ? fillOpacity : 0}
        stroke={c}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      {label && (
        <text
          x={lx}
          y={ly}
          fontFamily={DISPLAY_FONT}
          fontWeight={800}
          fontSize={20}
          fill={c}
          textAnchor="middle"
          dominantBaseline="middle"
          className="tabular-nums"
        >
          {label}
        </text>
      )}
    </g>
  )
}
