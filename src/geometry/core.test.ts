import { describe, expect, it } from 'vitest'
import { distance, normalizeDeg, pointOnCircle, round1, safeNumber } from './core'

describe('distance', () => {
  it('computes a 3-4-5 triangle', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBeCloseTo(5, 6)
  })
})

describe('pointOnCircle', () => {
  it('places a point at radius r, angle 0 to the east of center', () => {
    const p = pointOnCircle({ x: 10, y: 10 }, 5, 0)
    expect(p.x).toBeCloseTo(15, 6)
    expect(p.y).toBeCloseTo(10, 6)
  })
})

describe('normalizeDeg', () => {
  it('wraps negative angles into [0, 360)', () => {
    expect(normalizeDeg(-30)).toBeCloseTo(330, 6)
  })
  it('wraps angles over 360 back down', () => {
    expect(normalizeDeg(370)).toBeCloseTo(10, 6)
  })
})

describe('safeNumber / round1', () => {
  it('never lets NaN through', () => {
    expect(safeNumber(NaN)).toBe(0)
    expect(round1(NaN)).toBe(0)
  })
  it('never lets a tiny negative float through as -0.0', () => {
    expect(Object.is(round1(-0.00001), -0)).toBe(false)
  })
  it('rounds to one decimal place', () => {
    expect(round1(34.06)).toBeCloseTo(34.1, 6)
  })
})
