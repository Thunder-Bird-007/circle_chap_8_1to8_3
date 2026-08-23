/** Mirrors tailwind.config.js fontFamily. Used directly on SVG <text> nodes,
 * where Tailwind's font-display / font-math utility classes don't apply
 * cleanly to presentation attributes across all renderers. */
export const MATH_FONT = '"Cambria Math", Cambria, STIXGeneral, Georgia, "Times New Roman", serif'
export const DISPLAY_FONT =
  '"Century Gothic", "Avenir Next", Avenir, "Segoe UI", system-ui, sans-serif'
