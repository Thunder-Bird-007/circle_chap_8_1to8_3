import { describe, expect, it } from 'vitest'
import { arcSpan, classifyCenterCase } from './inscribed'
import { pointOnCircle } from './core'
import type { Point } from './types'

describe('arcSpan', () => {
  it('picks the shorter direction as the minor arc', () => {
    const s = arcSpan(240, 300)
    expect(s.minorSpan).toBeCloseTo(60, 6)
    expect(s.majorSpan).toBeCloseTo(300, 6)
    expect(s.minorStart).toBeCloseTo(240, 6)
    expect(s.majorStart).toBeCloseTo(300, 6)
  })

  it('handles the reversed argument order the same way', () => {
    const s = arcSpan(300, 240)
    expect(s.minorSpan).toBeCloseTo(60, 6)
    expect(s.majorSpan).toBeCloseTo(300, 6)
  })

  it('minor + major always sum to 360', () => {
    const s = arcSpan(10, 350)
    expect(s.minorSpan + s.majorSpan).toBeCloseTo(360, 6)
  })
})

describe('classifyCenterCase', () => {
  const O: Point = { x: 0, y: 0 }
  const R = 100
  const angleM = 240
  const angleN = 300
  const M = pointOnCircle(O, R, angleM)
  const N = pointOnCircle(O, R, angleN)

  it('classifies the major-arc midpoint as "inside" (the general, most common case)', () => {
    const L = pointOnCircle(O, R, 90) // major arc midpoint for this M/N
    expect(classifyCenterCase(L, M, N, O)).toBe('inside')
  })

  it('classifies the point antipodal to M as "onArm" (LM is then a diameter)', () => {
    const L = pointOnCircle(O, R, angleM + 180)
    expect(classifyCenterCase(L, M, N, O)).toBe('onArm')
  })

  it('classifies the point antipodal to N as "onArm" (LN is then a diameter)', () => {
    const L = pointOnCircle(O, R, angleN + 180)
    expect(classifyCenterCase(L, M, N, O)).toBe('onArm')
  })

  it('classifies a vertex near the chord, past the onArm boundary, as "outside"', () => {
    const L = pointOnCircle(O, R, angleN + 20)
    expect(classifyCenterCase(L, M, N, O)).toBe('outside')
  })

  it('never throws or returns an unexpected label for a dense sweep of vertex positions', () => {
    for (let deg = 0; deg < 360; deg += 3) {
      if (Math.abs(deg - angleM) < 0.01 || Math.abs(deg - angleN) < 0.01) continue
      const L = pointOnCircle(O, R, deg)
      const result = classifyCenterCase(L, M, N, O)
      expect(['inside', 'onArm', 'outside']).toContain(result)
    }
  })
})
