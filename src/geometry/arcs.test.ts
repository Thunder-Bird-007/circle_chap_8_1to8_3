import { describe, expect, it } from 'vitest'
import { describeArcPath, describeWedgeBetweenPoints, describeWedgePath } from './arcs'
import type { Point } from './types'

describe('describeArcPath', () => {
  it('produces an empty path for a non-positive radius (degenerate)', () => {
    expect(describeArcPath({ x: 0, y: 0 }, 0, 0, 90)).toBe('')
  })

  it('produces a well-formed SVG path string for a normal arc', () => {
    const d = describeArcPath({ x: 0, y: 0 }, 10, 0, 90)
    expect(d.startsWith('M')).toBe(true)
    expect(d).toContain('A 10 10 0')
  })
})

describe('describeWedgePath', () => {
  it('degenerates to a single point path for non-positive radius, never NaN', () => {
    const d = describeWedgePath({ x: 5, y: 5 }, -1, 0, 90)
    expect(d).not.toContain('NaN')
  })

  it('never contains NaN for a normal wedge', () => {
    const d = describeWedgePath({ x: 0, y: 0 }, 40, 10, 100)
    expect(d).not.toContain('NaN')
    expect(d.startsWith('M 0 0')).toBe(true)
  })
})

function largeArcFlag(d: string): number {
  const m = d.match(/A [\d.\-]+ [\d.\-]+ 0 (\d) 1/)
  if (!m) throw new Error(`no arc command found in path: ${d}`)
  return Number(m[1])
}

describe('describeWedgeBetweenPoints', () => {
  const vertex: Point = { x: 0, y: 0 }

  it('builds a wedge with no NaN for a right angle', () => {
    const d = describeWedgeBetweenPoints(vertex, { x: 10, y: 0 }, { x: 0, y: 10 }, 20)
    expect(d).not.toContain('NaN')
  })

  it('builds a reflex wedge with no NaN', () => {
    const d = describeWedgeBetweenPoints(vertex, { x: 10, y: 0 }, { x: 0, y: 10 }, 20, true)
    expect(d).not.toContain('NaN')
  })

  it('handles coincident direction points without NaN (degenerate)', () => {
    const d = describeWedgeBetweenPoints(vertex, { x: 10, y: 0 }, { x: 10, y: 0 }, 20)
    expect(d).not.toContain('NaN')
  })

  it('always draws the short (small-angle) way, even when a->b directly sweeps the long way round', () => {
    // regression: a at 120 deg, b at 105 deg -- going a -> b in the
    // increasing-angle (clockwise) direction sweeps 345 degrees, but the
    // actual angle between the rays is only 15 degrees, the other way.
    const a: Point = { x: 10 * Math.cos((120 * Math.PI) / 180), y: 10 * Math.sin((120 * Math.PI) / 180) }
    const b: Point = { x: 10 * Math.cos((105 * Math.PI) / 180), y: 10 * Math.sin((105 * Math.PI) / 180) }
    const d = describeWedgeBetweenPoints(vertex, a, b, 20)
    expect(largeArcFlag(d)).toBe(0)
  })

  it('a straightforward short sweep (<=180) is drawn as the small arc', () => {
    const d = describeWedgeBetweenPoints(vertex, { x: 10, y: 0 }, { x: 0, y: 10 }, 20)
    expect(largeArcFlag(d)).toBe(0)
  })

  it('reflex mode draws the long way even when a->b is already the short way', () => {
    const d = describeWedgeBetweenPoints(vertex, { x: 10, y: 0 }, { x: 0, y: 10 }, 20, true)
    expect(largeArcFlag(d)).toBe(1)
  })

  it('reflex mode still draws the long way when a->b already sweeps the long way', () => {
    const a: Point = { x: 10 * Math.cos((120 * Math.PI) / 180), y: 10 * Math.sin((120 * Math.PI) / 180) }
    const b: Point = { x: 10 * Math.cos((105 * Math.PI) / 180), y: 10 * Math.sin((105 * Math.PI) / 180) }
    const d = describeWedgeBetweenPoints(vertex, a, b, 20, true)
    expect(largeArcFlag(d)).toBe(1)
  })
})
