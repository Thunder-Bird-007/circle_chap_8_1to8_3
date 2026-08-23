import { describe, expect, it } from 'vitest'
import { keepAngleClear } from './angleGuard'

describe('keepAngleClear', () => {
  it('leaves an angle untouched when it is already clear of every forbidden angle', () => {
    expect(keepAngleClear(90, [0, 180], 2)).toBeCloseTo(90, 6)
  })

  it('pushes an angle that lands exactly on a forbidden angle out to the margin', () => {
    const result = keepAngleClear(100, [100], 2)
    expect(Math.abs(result - 100)).toBeGreaterThanOrEqual(2 - 1e-6)
  })

  it('preserves the approach side: coming from above stays above the margin', () => {
    const result = keepAngleClear(101, [100], 2)
    expect(result).toBeCloseTo(102, 6)
  })

  it('preserves the approach side: coming from below stays below the margin', () => {
    const result = keepAngleClear(99, [100], 2)
    expect(result).toBeCloseTo(98, 6)
  })

  it('handles wraparound near 0/360 correctly', () => {
    const result = keepAngleClear(1, [0], 2)
    expect(result).toBeCloseTo(2, 6)
    const result2 = keepAngleClear(359, [0], 2)
    expect(result2).toBeCloseTo(358, 6)
  })

  it('resolves being simultaneously close to two forbidden angles without NaN', () => {
    const result = keepAngleClear(100, [99, 101], 2)
    expect(Number.isFinite(result)).toBe(true)
  })

  it('never returns NaN for an arbitrary sweep of inputs', () => {
    for (let deg = 0; deg < 360; deg += 7) {
      const result = keepAngleClear(deg, [45, 190, 300], 3)
      expect(Number.isFinite(result)).toBe(true)
    }
  })
})
