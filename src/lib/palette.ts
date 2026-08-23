/** Single source of truth for the pinned palette, mirrored in tailwind.config.js.
 * SVG attributes (stroke/fill) take raw hex directly rather than Tailwind
 * classes, since `currentColor` plumbing through nested SVG primitives adds
 * indirection for no benefit here. */
export const PALETTE = {
  ink: '#070C18',
  panel: '#101A2E',
  chalk: '#F2F5FF',
  live: '#35E6E0',
  anchor: '#F5A524',
  proof: '#8BF08B',
  warn: '#FF6B6B',
} as const

export type PaletteKey = keyof typeof PALETTE
