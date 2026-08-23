import type { Point } from '../geometry'
import { MATH_FONT } from '../lib/fonts'
import { PALETTE, type PaletteKey } from '../lib/palette'

interface CircleProps {
  center: Point
  radius: number
  color?: PaletteKey
  strokeWidth?: number
  dashed?: boolean
  /** Render the centre as a small filled anchor dot with an "O" label. */
  showCenter?: boolean
  centerLabel?: string
}

/** The base geometry circle -- stroked only, minimum 3px so it survives
 * 720p video compression. */
export default function Circle({
  center,
  radius,
  color = 'chalk',
  strokeWidth = 3,
  dashed = false,
  showCenter = true,
  centerLabel = 'O',
}: CircleProps) {
  return (
    <g>
      <circle
        cx={center.x}
        cy={center.y}
        r={Math.max(radius, 0)}
        fill="none"
        stroke={PALETTE[color]}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? '6 6' : undefined}
      />
      {showCenter && (
        <g>
          <circle cx={center.x} cy={center.y} r={4} fill={PALETTE.anchor} />
          <text
            x={center.x + 10}
            y={center.y - 8}
            fontFamily={MATH_FONT}
            fontSize={20}
            fill={PALETTE.anchor}
          >
            {centerLabel}
          </text>
        </g>
      )}
    </g>
  )
}
