import type { Point } from './types'
import { normalizeDeg, subtract, vectorAngleDeg } from './core'

/** Splits a circle into the minor and major arc between two angular
 * positions (degrees), each described as { start, span } with span in
 * degrees, walking in the increasing-angle direction from `start`. */
export function arcSpan(angleA: number, angleB: number) {
  const sweep = normalizeDeg(angleB - angleA)
  if (sweep <= 180) {
    return { minorStart: angleA, minorSpan: sweep, majorStart: angleB, majorSpan: 360 - sweep }
  }
  return { minorStart: angleB, minorSpan: 360 - sweep, majorStart: angleA, majorSpan: sweep }
}

export type AngleCase = 'inside' | 'onArm' | 'outside'

/**
 * Classifies where `center` sits relative to angle a-vertex-b: inside the
 * angle's own (non-reflex) sweep, on one of its two arms (vertex-a or
 * vertex-b passes through center — i.e. that chord is a diameter), or
 * outside the sweep entirely. This is the "three cases of the inscribed
 * angle theorem proof" classification, computed live from real coordinates
 * rather than picked from a fixed preset list.
 */
export function classifyCenterCase(
  vertex: Point,
  a: Point,
  b: Point,
  center: Point,
  epsDeg = 1.5,
): AngleCase {
  const thA = vectorAngleDeg(subtract(a, vertex))
  const thB = vectorAngleDeg(subtract(b, vertex))
  const thC = vectorAngleDeg(subtract(center, vertex))
  const sweep = normalizeDeg(thB - thA)
  const start = sweep <= 180 ? thA : thB
  const span = sweep <= 180 ? sweep : 360 - sweep
  const rel = normalizeDeg(thC - start)
  const nearZero = rel < epsDeg || rel > 360 - epsDeg
  const nearSpan = Math.abs(rel - span) < epsDeg
  if (nearZero || nearSpan) return 'onArm'
  if (rel > 0 && rel < span) return 'inside'
  return 'outside'
}
