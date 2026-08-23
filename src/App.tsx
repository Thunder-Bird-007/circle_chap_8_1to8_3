import { useEffect } from 'react'
import { AppStateProvider, MODULE_IDS, useAppState, type ModuleId } from './state/AppState'
import { getModule } from './modules/registry'
import ModuleErrorBoundary from './components/ModuleErrorBoundary'
import PresenterOverlay from './components/PresenterOverlay'

function KeyboardLayer() {
  const {
    setModule,
    fireStep,
    triggerReset,
    toggleHidden,
    toggleFrozen,
    toggleLang,
    overlayOpen,
    toggleOverlay,
    closeOverlay,
  } = useAppState()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.repeat) return
      const key = e.key
      if (key === 'Escape') {
        if (overlayOpen) closeOverlay()
        return
      }
      if (MODULE_IDS.includes(key as ModuleId)) {
        setModule(key as ModuleId)
        return
      }
      switch (key) {
        case ' ':
          e.preventDefault()
          fireStep()
          break
        case 'r':
        case 'R':
          triggerReset()
          break
        case 'h':
        case 'H':
          toggleHidden()
          break
        case 'f':
        case 'F':
          toggleFrozen()
          break
        case 'l':
        case 'L':
          toggleLang()
          break
        case '?':
          toggleOverlay()
          break
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [
    setModule,
    fireStep,
    triggerReset,
    toggleHidden,
    toggleFrozen,
    toggleLang,
    overlayOpen,
    toggleOverlay,
    closeOverlay,
  ])

  return null
}

function ModuleSwitcher() {
  const { module, setModule, t } = useAppState()
  return (
    <div className="flex items-center gap-1 h-14 shrink-0 border-b border-white/10 bg-panel px-4 overflow-hidden">
      <span className="font-display font-black text-lg tracking-[0.14em] text-chalk pr-4 shrink-0">
        {t('appTitle')}
      </span>
      <div className="flex items-stretch gap-1 flex-1 min-w-0">
        {MODULE_IDS.map((id) => {
          const entry = getModule(id)
          const active = module === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setModule(id)}
              className={`flex items-center gap-2 px-3 rounded-md font-display font-bold text-sm shrink-0 transition-colors ${
                active
                  ? 'bg-live/20 text-live border border-live'
                  : 'text-chalk/60 border border-transparent hover:text-chalk hover:border-white/15'
              }`}
            >
              <span className="tabular-nums text-base">{id}</span>
              <span className="hidden lg:inline">{t(entry.titleKey)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StatusStrip() {
  const { frozen, hidden, lang, t } = useAppState()
  return (
    <div className="flex items-center justify-between h-8 shrink-0 border-t border-white/10 bg-panel px-4 text-xs text-chalk/60 font-display tracking-wide">
      <div className="flex items-center gap-4">
        <span>{t('hintReset')}</span>
        <span>{t('hintHide')}</span>
        <span>{t('hintFreeze')}</span>
        <span>{t('hintLang')}</span>
        <span>{t('hintStep')}</span>
        <span>{t('hintOverlay')}</span>
      </div>
      <div className="flex items-center gap-3">
        {hidden && <span className="text-warn font-bold">{t('hiddenHint')}</span>}
        {frozen && <span className="text-anchor font-bold">{t('frozenBadge')}</span>}
        <span className="uppercase">{lang}</span>
      </div>
    </div>
  )
}

function ActiveModule() {
  const { module, resetCounter } = useAppState()
  const { Component } = getModule(module)
  const resetKey = `${module}-${resetCounter}`
  return (
    <ModuleErrorBoundary resetKey={resetKey}>
      <Component key={resetKey} />
    </ModuleErrorBoundary>
  )
}

function Shell() {
  return (
    <div className="relative h-full w-full flex flex-col bg-ink">
      <KeyboardLayer />
      <ModuleSwitcher />
      <ActiveModule />
      <StatusStrip />
      <PresenterOverlay />
    </div>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  )
}
