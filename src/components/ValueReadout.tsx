import type { ReactNode } from 'react'
import { HIDDEN_GLYPH } from '../lib/format'

interface ValueReadoutProps {
  label: string
  value: string
  color?: 'live' | 'anchor' | 'proof' | 'warn' | 'chalk'
  size?: 'lg' | 'md'
  hidden?: boolean
  sublabel?: ReactNode
}

const COLOR_CLASS: Record<NonNullable<ValueReadoutProps['color']>, string> = {
  live: 'text-live',
  anchor: 'text-anchor',
  proof: 'text-proof',
  warn: 'text-warn',
  chalk: 'text-chalk',
}

/** The fixed right-rail numeric readout. Minimum 30px numerals per spec,
 * tabular figures so a dragging value never shifts sideways. */
export default function ValueReadout({
  label,
  value,
  color = 'chalk',
  size = 'lg',
  hidden = false,
  sublabel,
}: ValueReadoutProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-[0.18em] text-chalk/60 font-display font-bold">
        {label}
      </span>
      <span
        className={`tabular-nums font-display font-black leading-none tracking-wide ${COLOR_CLASS[color]} ${
          size === 'lg' ? 'text-[38px]' : 'text-[30px]'
        }`}
      >
        {hidden ? HIDDEN_GLYPH : value}
      </span>
      {sublabel && <span className="text-sm text-chalk/50 font-display">{sublabel}</span>}
    </div>
  )
}
