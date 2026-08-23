import { round1 } from '../geometry'

/** Angles always to one decimal place, degree sign attached, never negative/NaN. */
export function formatDeg(n: number): string {
  return `${round1(n).toFixed(1)}°`
}

/** Lengths always to one decimal place, never negative/NaN. */
export function formatLen(n: number): string {
  return round1(n).toFixed(1)
}

export const HIDDEN_GLYPH = '—'
