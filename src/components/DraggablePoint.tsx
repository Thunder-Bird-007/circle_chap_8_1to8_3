import { useRef, useState } from 'react'
import type { Point } from '../geometry'
import { MATH_FONT } from '../lib/fonts'
import { PALETTE, type PaletteKey } from '../lib/palette'
import { eventToSvgPoint } from '../lib/pointer'

interface DraggablePointProps {
  point: Point
  onDrag: (p: Point) => void
  /** Optional projection applied to every dragged position -- e.g. snap
   * onto a circle, or clamp to a half-plane. Keeps constraint logic in the
   * module (which knows the geometry) rather than this generic primitive. */
  constrain?: (p: Point) => Point
  color?: PaletteKey
  label?: string
  labelDx?: number
  labelDy?: number
  radius?: number
  /**
   * Touch/pen/mouse hit target radius, in SVG user-space units -- NOT
   * real screen pixels. The figure's 900x720 viewBox is scaled down to
   * fit the actual figure region (letterboxed by `preserveAspectRatio`),
   * so a value of exactly 28 here would render to well under 28 real
   * px at the target 1280x720 layout (~0.88x scale there). The default
   * below is picked up with margin so the real on-screen hit target
   * clears the spec's 28px-radius minimum.
   */
  hitRadius?: number
  disabled?: boolean
  onDragStart?: () => void
  onDragEnd?: () => void
}

/** A draggable circle vertex. Pointer Events only (pen/touch/mouse unified),
 * with a large invisible hit target sized for a touch smartboard, and a
 * visibly bigger dot while actively dragging so the teacher's finger never
 * loses track of which point is "live". */
export default function DraggablePoint({
  point,
  onDrag,
  constrain,
  color = 'chalk',
  label,
  labelDx = 12,
  labelDy = -12,
  radius = 7,
  hitRadius = 34,
  disabled = false,
  onDragStart,
  onDragEnd,
}: DraggablePointProps) {
  const [dragging, setDragging] = useState(false)
  const pointerId = useRef<number | null>(null)

  function handlePointerDown(e: React.PointerEvent<SVGCircleElement>) {
    if (disabled) return
    e.preventDefault()
    e.stopPropagation()
    const svg = e.currentTarget.ownerSVGElement
    if (!svg) return
    e.currentTarget.setPointerCapture(e.pointerId)
    pointerId.current = e.pointerId
    setDragging(true)
    onDragStart?.()
  }

  function handlePointerMove(e: React.PointerEvent<SVGCircleElement>) {
    if (disabled || pointerId.current !== e.pointerId) return
    const svg = e.currentTarget.ownerSVGElement
    if (!svg) return
    const raw = eventToSvgPoint(svg, e.clientX, e.clientY)
    const next = constrain ? constrain(raw) : raw
    onDrag(next)
  }

  function handlePointerUp(e: React.PointerEvent<SVGCircleElement>) {
    if (pointerId.current !== e.pointerId) return
    e.currentTarget.releasePointerCapture(e.pointerId)
    pointerId.current = null
    setDragging(false)
    onDragEnd?.()
  }

  const dotRadius = dragging ? radius + 2 : radius
  const fill = PALETTE[color]

  return (
    <g>
      {/* invisible large hit target -- spec: 28px minimum radius on a touch smartboard */}
      <circle
        cx={point.x}
        cy={point.y}
        r={hitRadius}
        fill="transparent"
        stroke="none"
        style={{ cursor: disabled ? 'default' : 'grab', touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
      {dragging && (
        <circle cx={point.x} cy={point.y} r={hitRadius} fill={fill} opacity={0.12} />
      )}
      <circle
        cx={point.x}
        cy={point.y}
        r={dotRadius}
        fill={fill}
        stroke={PALETTE.ink}
        strokeWidth={2}
        pointerEvents="none"
      />
      {label && (
        <text
          x={point.x + labelDx}
          y={point.y + labelDy}
          fontFamily={MATH_FONT}
          fontSize={26}
          fontStyle="italic"
          fill={fill}
          pointerEvents="none"
        >
          {label}
        </text>
      )}
    </g>
  )
}
