import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { dict, type DictKey, type Lang } from '../i18n/dict'

export type ModuleId = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0'

export const MODULE_IDS: ModuleId[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

interface AppStateValue {
  module: ModuleId
  setModule: (m: ModuleId) => void
  frozen: boolean
  toggleFrozen: () => void
  hidden: boolean
  toggleHidden: () => void
  lang: Lang
  toggleLang: () => void
  resetCounter: number
  triggerReset: () => void
  overlayOpen: boolean
  toggleOverlay: () => void
  closeOverlay: () => void
  t: (key: DictKey) => string
  /** Active module registers its Space-key "advance one step" handler here.
   * Modules without a step-through simply never register one. */
  registerStepHandler: (fn: (() => void) | null) => void
  fireStep: () => void
}

const AppStateContext = createContext<AppStateValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [module, setModule] = useState<ModuleId>('1')
  const [frozen, setFrozen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lang, setLang] = useState<Lang>('en')
  const [resetCounter, setResetCounter] = useState(0)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const stepHandlerRef = useRef<(() => void) | null>(null)

  const toggleFrozen = useCallback(() => setFrozen((f) => !f), [])
  const toggleHidden = useCallback(() => setHidden((h) => !h), [])
  const toggleLang = useCallback(() => setLang((l) => (l === 'en' ? 'bn' : 'en')), [])
  const triggerReset = useCallback(() => setResetCounter((c) => c + 1), [])
  const toggleOverlay = useCallback(() => setOverlayOpen((o) => !o), [])
  const closeOverlay = useCallback(() => setOverlayOpen(false), [])
  const t = useCallback((key: DictKey) => dict[key][lang], [lang])
  const registerStepHandler = useCallback((fn: (() => void) | null) => {
    stepHandlerRef.current = fn
  }, [])
  const fireStep = useCallback(() => stepHandlerRef.current?.(), [])

  const value = useMemo<AppStateValue>(
    () => ({
      module,
      setModule,
      frozen,
      toggleFrozen,
      hidden,
      toggleHidden,
      lang,
      toggleLang,
      resetCounter,
      triggerReset,
      overlayOpen,
      toggleOverlay,
      closeOverlay,
      t,
      registerStepHandler,
      fireStep,
    }),
    [
      module,
      frozen,
      toggleFrozen,
      hidden,
      toggleHidden,
      lang,
      toggleLang,
      resetCounter,
      triggerReset,
      overlayOpen,
      toggleOverlay,
      closeOverlay,
      t,
      registerStepHandler,
      fireStep,
    ],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
