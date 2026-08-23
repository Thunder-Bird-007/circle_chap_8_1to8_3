import type { CircleDef, Point } from './types'
import { distance, EPSILON } from './core'

/**
 * The unique circle through three points, or null if they are collinear
 * (or coincident) within EPSILON — a genuinely degenerate configuration
 * that has no unique circumcircle, so callers must handle null explicitly
 * rather than receive a NaN center/radius.
 */
export function circleThroughThreePoints(a: Point, b: Point, c: Point): CircleDef | null {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y))
  if (Math.abs(d) < EPSILON) return null

  const aSq = a.x * a.x + a.y * a.y
  const bSq = b.x * b.x + b.y * b.y
  const cSq = c.x * c.x + c.y * c.y

  const ux = (aSq * (b.y - c.y) + bSq * (c.y - a.y) + cSq * (a.y - b.y)) / d
  const uy = (aSq * (c.x - b.x) + bSq * (a.x - c.x) + cSq * (b.x - a.x)) / d

  const center = { x: ux, y: uy }
  return { center, radius: distance(center, a) }
}
