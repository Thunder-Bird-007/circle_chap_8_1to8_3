import type { Point } from './types'
import { normalizeDeg, pointOnCircle, RAD } from './core'

/**
 * SVG path `d` for a stroked arc of `radius` around `center`, sweeping
 * clockwise (SVG y-down convention) from `startDeg` to `endDeg`.
 */
export function describeArcPath(
  center: Point,
  radius: number,
  startDeg: number,
  endDeg: number,
): string {
  if (radius <= 0) return ''
  const start = pointOnCircle(center, radius, startDeg)
  const end = pointOnCircle(center, radius, endDeg)
  const sweep = normalizeDeg(endDeg - startDeg)
  const largeArc = sweep > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

/**
 * SVG path `d` for a filled pie-slice wedge at `center`, spanning from
 * `startDeg` to `endDeg` at `radius`. Used for the angle wedges (inscribed /
 * central) that are the core visual of the Doubling Machine and AngleArc.
 */
export function describeWedgePath(
  center: Point,
  radius: number,
  startDeg: number,
  endDeg: number,
): string {
  if (radius <= 0) return `M ${center.x} ${center.y} Z`
  const arc = describeArcPath(center, radius, startDeg, endDeg)
  return `M ${center.x} ${center.y} L ${arc.slice(2)} L ${center.x} ${center.y} Z`
}

/**
 * Wedge between two explicit points (not just angles), always drawn at a
 * fixed on-screen `radius` from `vertex` regardless of how far `a`/`b` are —
 * this is what keeps angle wedges a consistent, legible size on screen.
 */
export function describeWedgeBetweenPoints(
  vertex: Point,
  a: Point,
  b: Point,
  radius: number,
  reflex = false,
): string {
  const angA = (Math.atan2(a.y - vertex.y, a.x - vertex.x) * 180) / Math.PI
  const angB = (Math.atan2(b.y - vertex.y, b.x - vertex.x) * 180) / Math.PI
  // describeArcPath always sweeps clockwise (increasing angle) from its
  // first argument to its second, so which of (a, b) we pass as "start"
  // is what picks the short way vs. the long way around -- not any amount
  // of arithmetic on the angle values themselves (mod 360 makes shifting
  // an endpoint by +-360 a no-op on the resulting sweep).
  const sweepAtoB = normalizeDeg(angB - angA)
  const shortIsAtoB = sweepAtoB <= 180
  const wantShort = !reflex
  const useAtoB = wantShort === shortIsAtoB
  return useAtoB
    ? describeWedgePath(vertex, radius, angA, angB)
    : describeWedgePath(vertex, radius, angB, angA)
}

/** Unit direction vector at `angleDeg`, useful for placing labels/ticks. */
export function directionAt(angleDeg: number): Point {
  return { x: Math.cos(angleDeg * RAD), y: Math.sin(angleDeg * RAD) }
}
