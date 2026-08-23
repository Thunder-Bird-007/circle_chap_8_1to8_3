import type { ReactNode } from 'react'

interface ControlButtonProps {
  active?: boolean
  onClick: () => void
  children: ReactNode
  variant?: 'default' | 'warn'
}

/** A touch-sized sub-toggle / preset button for the rail control zone.
 * Generous hit area for a touch smartboard, not just a mouse target. */
export default function ControlButton({
  active = false,
  onClick,
  children,
  variant = 'default',
}: ControlButtonProps) {
  const activeClasses =
    variant === 'warn'
      ? 'bg-warn/20 border-warn text-warn'
      : 'bg-live/20 border-live text-live'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[40px] px-3 py-1.5 rounded-md border text-left font-display font-bold text-[14px] leading-tight tracking-wide transition-colors ${
        active
          ? activeClasses
          : 'bg-transparent border-white/15 text-chalk/80 hover:border-white/30'
      }`}
    >
      {children}
    </button>
  )
}
