import type { ReactNode } from 'react'

interface ModuleLayoutProps {
  figure: ReactNode
  rail: ReactNode
}

/** Two-column module shell: figure fills the large left/centre area, the
 * right rail is a fixed-width column so its contents never shift position
 * between modules -- the teacher's eye always finds a given readout in the
 * same place on screen. */
export default function ModuleLayout({ figure, rail }: ModuleLayoutProps) {
  return (
    <div className="flex-1 flex min-h-0">
      <div className="flex-1 relative min-w-0">{figure}</div>
      <div
        id="module-rail"
        className="w-[320px] shrink-0 border-l border-white/10 bg-panel px-6 py-3 flex flex-col gap-3 overflow-hidden"
      >
        {rail}
      </div>
    </div>
  )
}
