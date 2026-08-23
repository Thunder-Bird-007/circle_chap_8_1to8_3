import { useAppState } from '../state/AppState'
import type { DictKey } from '../i18n/dict'

/** Placeholder for a module not yet built in this build phase. Keeps every
 * number key reachable and non-erroring even before all ten modules exist. */
export default function ComingSoon({ titleKey }: { titleKey: DictKey }) {
  const { t } = useAppState()
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      <span className="font-display font-black text-[40px] text-chalk/70 tracking-wide">
        {t(titleKey)}
      </span>
      <span className="font-display text-lg text-chalk/40 uppercase tracking-[0.2em]">
        {t('comingSoon')}
      </span>
    </div>
  )
}
