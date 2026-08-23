import { describe, expect, it } from 'vitest'
import { angleAt, centralAngle, reflexAngle } from './angles'
import type { Point } from './types'

describe('angleAt', () => {
  it('reports 90 for a right angle', () => {
    const v: Point = { x: 0, y: 0 }
    const a: Point = { x: 1, y: 0 }
    const b: Point = { x: 0, y: 1 }
    expect(angleAt(v, a, b)).toBeCloseTo(90, 6)
  })

  it('reports 180 for a straight angle', () => {
    const v: Point = { x: 0, y: 0 }
    const a: Point = { x: -1, y: 0 }
    const b: Point = { x: 1, y: 0 }
    expect(angleAt(v, a, b)).toBeCloseTo(180, 6)
  })

  it('reports 0 when the two rays coincide', () => {
    const v: Point = { x: 0, y: 0 }
    const a: Point = { x: 1, y: 0 }
    expect(angleAt(v, a, a)).toBeCloseTo(0, 6)
  })

  it('is symmetric in its two ray arguments', () => {
    const v: Point = { x: 5, y: 5 }
    const a: Point = { x: 20, y: 5 }
    const b: Point = { x: 5, y: 40 }
    expect(angleAt(v, a, b)).toBeCloseTo(angleAt(v, b, a), 6)
  })

  it('is always in [0, 180] and never NaN even for a degenerate ray', () => {
    const v: Point = { x: 3, y: 3 }
    // vertex coincides with one of the ray endpoints -> zero-length ray
    const result = angleAt(v, v, { x: 10, y: 3 })
    expect(Number.isFinite(result)).toBe(true)
    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThanOrEqual(180)
  })

  it('measures an arbitrary known angle correctly (30-60-90 setup)', () => {
    const v: Point = { x: 0, y: 0 }
    const a: Point = { x: 1, y: 0 }
    const b: Point = { x: Math.cos(Math.PI / 6), y: Math.sin(Math.PI / 6) }
    expect(angleAt(v, a, b)).toBeCloseTo(30, 6)
  })
})

describe('centralAngle', () => {
  it('matches angleAt at the given center', () => {
    const o: Point = { x: 0, y: 0 }
    const m: Point = { x: 10, y: 0 }
    const n: Point = { x: 0, y: 10 }
    expect(centralAngle(o, m, n)).toBeCloseTo(90, 6)
    expect(centralAngle(o, m, n)).toBeCloseTo(angleAt(o, m, n), 10)
  })
})

describe('reflexAngle', () => {
  it('sums with centralAngle to exactly 360', () => {
    const o: Point = { x: 0, y: 0 }
    const m: Point = { x: 10, y: 0 }
    const n: Point = { x: 0, y: 10 }
    expect(reflexAngle(o, m, n) + centralAngle(o, m, n)).toBeCloseTo(360, 6)
  })

  it('is 270 when the central angle is 90', () => {
    const o: Point = { x: 0, y: 0 }
    const m: Point = { x: 10, y: 0 }
    const n: Point = { x: 0, y: 10 }
    expect(reflexAngle(o, m, n)).toBeCloseTo(270, 6)
  })

  it('is always >= 180 and never NaN', () => {
    const o: Point = { x: 0, y: 0 }
    const m: Point = { x: 10, y: 0 }
    const n: Point = { x: -10, y: 0.0001 }
    const r = reflexAngle(o, m, n)
    expect(Number.isFinite(r)).toBe(true)
    expect(r).toBeGreaterThanOrEqual(180)
  })
})

describe('the doubling-machine identity', () => {
  it('central angle is exactly twice the inscribed angle for any point on the major arc', () => {
    const o: Point = { x: 0, y: 0 }
    const radius = 50
    const m: Point = { x: radius, y: 0 }
    const n: Point = { x: 0, y: radius }
    // sample several vertex positions on the major arc (the arc not containing the MN minor arc)
    const angles = [100, 140, 180, 220, 260]
    for (const deg of angles) {
      const rad = (deg * Math.PI) / 180
      const l: Point = { x: o.x + radius * Math.cos(rad), y: o.y + radius * Math.sin(rad) }
      const inscribed = angleAt(l, m, n)
      const central = centralAngle(o, m, n)
      expect(central).toBeCloseTo(2 * inscribed, 4)
    }
  })
})
