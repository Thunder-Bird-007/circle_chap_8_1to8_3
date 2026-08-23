/** Pixels per math "unit" for modules whose readouts should read as clean
 * textbook numbers (e.g. Chord Lab's 24 & 5 → 13 preset) rather than raw
 * SVG pixel counts. Every geometry computation still happens in pixel
 * coordinates; this only scales what's displayed. */
export const UNIT_PX = 10

export function toUnits(px: number): number {
  return px / UNIT_PX
}
