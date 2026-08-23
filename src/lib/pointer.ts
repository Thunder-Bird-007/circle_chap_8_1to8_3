import type { Point } from '../geometry'

/** Convert a pointer event's client coordinates into the SVG user-space
 * coordinates of its nearest ancestor <svg>, using the CTM so it stays
 * correct under any viewBox scaling (we render at a fixed internal
 * coordinate system and let the SVG scale to fit the viewport). */
export function eventToSvgPoint(svg: SVGSVGElement, clientX: number, clientY: number): Point {
  const ctm = svg.getScreenCTM()
  if (!ctm) return { x: clientX, y: clientY }
  const pt = svg.createSVGPoint()
  pt.x = clientX
  pt.y = clientY
  const transformed = pt.matrixTransform(ctm.inverse())
  return { x: transformed.x, y: transformed.y }
}
