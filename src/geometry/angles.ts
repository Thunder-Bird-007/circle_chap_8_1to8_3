import type { Point } from './types'
import { DEG, subtract } from './core'

/**
 * The (non-reflex) angle ∠a-vertex-b in degrees, always in [0, 180].
 *
 * Uses an atan2-difference approach rather than acos(dot/|a||b|) so that a
 * degenerate ray (vertex coincides with a or b) resolves to 0 instead of NaN:
 * atan2(0, 0) is defined as 0 in JS/IEEE, so a zero-length ray contributes no
 * rotation rather than blowing up a division.
 */
export function angleAt(vertex: Point, a: Point, b: Point): number {
  const v1 = subtract(a, vertex)
  const v2 = subtract(b, vertex)
  const a1 = Math.atan2(v1.y, v1.x)
  const a2 = Math.atan2(v2.y, v2.x)
  let diff = a2 - a1
  // wrap into (-PI, PI]
  diff = Math.atan2(Math.sin(diff), Math.cos(diff))
  return Math.abs(diff) * DEG
}

/**
 * The central angle ∠a-center-b, in [0, 180]. Domain alias of angleAt kept
 * separate so call sites read as geometry, not generic vector math.
 */
export function centralAngle(center: Point, a: Point, b: Point): number {
  return angleAt(center, a, b)
}

/**
 * The reflex angle at `center` between a and b, in [180, 360].
 * reflexAngle + centralAngle === 360 always holds.
 */
export function reflexAngle(center: Point, a: Point, b: Point): number {
  return 360 - centralAngle(center, a, b)
}
