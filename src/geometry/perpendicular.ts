import type { Point } from './types'
import { coincident, dot, subtract } from './core'

/**
 * The foot of the perpendicular from `p` onto the infinite line through
 * `a` and `b`. If `a` and `b` coincide (zero-length segment, no line is
 * defined), the segment's single point is returned rather than NaN.
 */
export function perpendicularFoot(p: Point, a: Point, b: Point): Point {
  if (coincident(a, b)) return a
  const ab = subtract(b, a)
  const ap = subtract(p, a)
  const t = dot(ap, ab) / dot(ab, ab)
  return { x: a.x + t * ab.x, y: a.y + t * ab.y }
}
