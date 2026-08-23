import { describe, expect, it } from 'vitest'
import { circleThroughThreePoints } from './circle'
import { distance } from './core'
import type { Point } from './types'

describe('circleThroughThreePoints', () => {
  it('finds the unit circle through three points on it', () => {
    const a: Point = { x: 1, y: 0 }
    const b: Point = { x: 0, y: 1 }
    const c: Point = { x: -1, y: 0 }
    const circ = circleThroughThreePoints(a, b, c)
    expect(circ).not.toBeNull()
    expect(circ!.center.x).toBeCloseTo(0, 6)
    expect(circ!.center.y).toBeCloseTo(0, 6)
    expect(circ!.radius).toBeCloseTo(1, 6)
  })

  it('finds an off-origin circle correctly', () => {
    const center: Point = { x: 40, y: -25 }
    const radius = 17
    const pts = [10, 130, 260].map((deg) => {
      const rad = (deg * Math.PI) / 180
      return { x: center.x + radius * Math.cos(rad), y: center.y + radius * Math.sin(rad) }
    })
    const circ = circleThroughThreePoints(pts[0], pts[1], pts[2])
    expect(circ).not.toBeNull()
    expect(circ!.center.x).toBeCloseTo(center.x, 4)
    expect(circ!.center.y).toBeCloseTo(center.y, 4)
    expect(circ!.radius).toBeCloseTo(radius, 4)
    for (const p of pts) {
      expect(distance(circ!.center, p)).toBeCloseTo(radius, 4)
    }
  })

  it('returns null for three collinear points (degenerate)', () => {
    const a: Point = { x: 0, y: 0 }
    const b: Point = { x: 5, y: 5 }
    const c: Point = { x: 10, y: 10 }
    expect(circleThroughThreePoints(a, b, c)).toBeNull()
  })

  it('returns null for three coincident points (degenerate)', () => {
    const a: Point = { x: 3, y: 3 }
    expect(circleThroughThreePoints(a, { ...a }, { ...a })).toBeNull()
  })

  it('never returns NaN center/radius when it does succeed', () => {
    const a: Point = { x: 0, y: 0 }
    const b: Point = { x: 4, y: 1 }
    const c: Point = { x: 2, y: 6 }
    const circ = circleThroughThreePoints(a, b, c)
    expect(circ).not.toBeNull()
    expect(Number.isFinite(circ!.center.x)).toBe(true)
    expect(Number.isFinite(circ!.center.y)).toBe(true)
    expect(Number.isFinite(circ!.radius)).toBe(true)
  })
})
