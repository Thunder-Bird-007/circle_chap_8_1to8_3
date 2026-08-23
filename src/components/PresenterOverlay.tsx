import { useAppState } from '../state/AppState'

interface Row {
  keys: string
  labelKey:
    | 'overlayModules'
    | 'overlayStep'
    | 'overlayReset'
    | 'overlayHide'
    | 'overlayFreeze'
    | 'overlayLang'
    | 'overlayClose'
}

const ROWS: Row[] = [
  { keys: '1–9, 0', labelKey: 'overlayModules' },
  { keys: 'Space', labelKey: 'overlayStep' },
  { keys: 'R', labelKey: 'overlayReset' },
  { keys: 'H', labelKey: 'overlayHide' },
  { keys: 'F', labelKey: 'overlayFreeze' },
  { keys: 'L', labelKey: 'overlayLang' },
  { keys: '? / Esc', labelKey: 'overlayClose' },
]

/**
 * Presenter cheat-sheet, opened only by pressing "?" and never by itself.
 * Dismissed the same way (or Escape). Pure overlay -- doesn't touch any
 * module state, so opening/closing it is always safe mid-lecture.
 */
export default function PresenterOverlay() {
  const { overlayOpen, closeOverlay, t } = useAppState()
  if (!overlayOpen) return null

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-ink/80"
      onPointerDown={closeOverlay}
    >
      <div
        className="bg-panel border border-white/15 rounded-lg px-8 py-6 min-w-[380px] shadow-2xl"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <h2 className="font-display font-black text-2xl text-chalk tracking-[0.1em] mb-4">
          {t('overlayTitle')}
        </h2>
        <div className="flex flex-col gap-2.5">
          {ROWS.map((row) => (
            <div key={row.labelKey} className="flex items-center justify-between gap-8">
              <kbd className="font-display font-bold text-live text-base tabular-nums px-2 py-0.5 rounded border border-live/40 bg-live/10">
                {row.keys}
              </kbd>
              <span className="font-display text-chalk/90 text-base">{t(row.labelKey)}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-chalk/60 font-display mt-5 text-center">{t('overlayDismiss')}</p>
      </div>
    </div>
  )
}
