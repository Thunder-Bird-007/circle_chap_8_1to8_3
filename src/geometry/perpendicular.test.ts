import { describe, expect, it } from 'vitest'
import { perpendicularFoot } from './perpendicular'
import { distance, dot, subtract } from './core'
import type { Point } from './types'

describe('perpendicularFoot', () => {
  it('finds the foot on a horizontal line', () => {
    const a: Point = { x: 0, y: 0 }
    const b: Point = { x: 10, y: 0 }
    const p: Point = { x: 4, y: 7 }
    const foot = perpendicularFoot(p, a, b)
    expect(foot.x).toBeCloseTo(4, 6)
    expect(foot.y).toBeCloseTo(0, 6)
  })

  it('finds the foot on an arbitrary diagonal line', () => {
    const a: Point = { x: 0, y: 0 }
    const b: Point = { x: 10, y: 10 }
    const p: Point = { x: 0, y: 10 }
    const foot = perpendicularFoot(p, a, b)
    expect(foot.x).toBeCloseTo(5, 6)
    expect(foot.y).toBeCloseTo(5, 6)
  })

  it('the segment from p to the foot is perpendicular to ab', () => {
    const a: Point = { x: 2, y: -3 }
    const b: Point = { x: 17, y: 9 }
    const p: Point = { x: 5, y: 20 }
    const foot = perpendicularFoot(p, a, b)
    const ab = subtract(b, a)
    const pf = subtract(foot, p)
    expect(dot(ab, pf)).toBeCloseTo(0, 4)
  })

  it('returns the shared point (not NaN) when a and b coincide (degenerate)', () => {
    const a: Point = { x: 6, y: 6 }
    const b: Point = { x: 6, y: 6 }
    const p: Point = { x: 20, y: 1 }
    const foot = perpendicularFoot(p, a, b)
    expect(Number.isFinite(foot.x)).toBe(true)
    expect(Number.isFinite(foot.y)).toBe(true)
    expect(distance(foot, a)).toBeCloseTo(0, 6)
  })

  it('the distance from O to a chord matches the r/d/half-chord identity r^2 = d^2 + (c/2)^2', () => {
    const o: Point = { x: 0, y: 0 }
    const r = 13
    const a: Point = { x: -12, y: 5 } // distance from O is 13
    const b: Point = { x: 12, y: 5 }
    const foot = perpendicularFoot(o, a, b)
    const d = distance(o, foot)
    const halfChord = distance(a, b) / 2
    expect(d * d + halfChord * halfChord).toBeCloseTo(r * r, 4)
  })
})
