import { normalizeDeg } from './core'

/**
 * Nudges `angleDeg` away from every angle in `forbidden` so it never lands
 * within `marginDeg` of one of them. Used to keep two independently
 * draggable points on the same circle from ever landing exactly on top of
 * each other (or on a fixed point), which would otherwise make the chord/
 * angle between them a true zero-length degenerate case.
 *
 * The nudge preserves which side of the forbidden angle the point was
 * approaching from, so dragging still feels continuous right up to the
 * margin rather than snapping unpredictably.
 */
export function keepAngleClear(angleDeg: number, forbidden: number[], marginDeg = 2): number {
  let result = normalizeDeg(angleDeg)
  for (const raw of forbidden) {
    const f = normalizeDeg(raw)
    let diff = normalizeDeg(result - f)
    if (diff > 180) diff -= 360 // signed distance from f to result, in (-180, 180]
    if (Math.abs(diff) < marginDeg) {
      result = normalizeDeg(f + (diff >= 0 ? marginDeg : -marginDeg))
    }
  }
  return result
}
