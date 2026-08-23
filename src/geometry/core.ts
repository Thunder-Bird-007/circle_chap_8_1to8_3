import type { Point } from './types'

/** Coordinates closer than this are treated as coincident (degenerate). */
export const EPSILON = 1e-6

export const DEG = 180 / Math.PI
export const RAD = Math.PI / 180

export function subtract(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y }
}

export function add(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y }
}

export function scale(a: Point, k: number): Point {
  return { x: a.x * k, y: a.y * k }
}

export function dot(a: Point, b: Point): number {
  return a.x * b.x + a.y * b.y
}

export function magnitude(a: Point): number {
  return Math.hypot(a.x, a.y)
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function lerp(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}

export function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

/** True if a and b are within EPSILON of each other. */
export function coincident(a: Point, b: Point): boolean {
  return distance(a, b) < EPSILON
}

/** Angle (degrees) of vector `p` from the positive x-axis, in (-180, 180]. */
export function vectorAngleDeg(p: Point): number {
  return Math.atan2(p.y, p.x) * DEG
}

/** Normalize a degree value into [0, 360). */
export function normalizeDeg(deg: number): number {
  const m = deg % 360
  return m < 0 ? m + 360 : m
}

/** Point on a circle at the given angle (degrees, standard math convention, y-down SVG). */
export function pointOnCircle(center: Point, radius: number, angleDeg: number): Point {
  const a = angleDeg * RAD
  return { x: center.x + radius * Math.cos(a), y: center.y + radius * Math.sin(a) }
}

/** Clamp a numeric readout so it is never negative or NaN. */
export function safeNumber(n: number, fallback = 0): number {
  if (!Number.isFinite(n)) return fallback
  return n < 0 && n > -EPSILON ? 0 : n
}

export function round1(n: number): number {
  const safe = safeNumber(n)
  const r = Math.round(safe * 10) / 10
  // avoid "-0.0"
  return r === 0 ? 0 : r
}
