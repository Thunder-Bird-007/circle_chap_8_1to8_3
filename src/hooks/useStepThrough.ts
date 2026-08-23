import { useEffect, useState } from 'react'
import { useAppState } from '../state/AppState'

/** Registers the module's Space-key step handler and manages the current
 * step index, clamped to [0, stepCount - 1]. Unregisters on unmount so
 * switching modules (or resetting, which remounts) never leaves a stale
 * handler wired to the global Space key. */
export function useStepThrough(stepCount: number) {
  const { registerStepHandler } = useAppState()
  const [step, setStep] = useState(0)

  useEffect(() => {
    registerStepHandler(() => {
      setStep((s) => Math.min(s + 1, Math.max(stepCount - 1, 0)))
    })
    return () => registerStepHandler(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepCount])

  return { step, setStep }
}
