import type { ReactNode } from 'react'

interface FigureCanvasProps {
  children: ReactNode
  viewBox?: string
}

/** Shared SVG canvas every module figure renders into: fixed internal
 * coordinate system (so geometry math stays in nice round numbers) scaled
 * by the browser to fill the figure region, never causing page scroll. */
export default function FigureCanvas({ children, viewBox = '0 0 900 720' }: FigureCanvasProps) {
  return (
    <svg
      viewBox={viewBox}
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      style={{ touchAction: 'none' }}
    >
      {children}
    </svg>
  )
}
