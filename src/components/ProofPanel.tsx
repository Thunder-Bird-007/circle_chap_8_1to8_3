export interface ProofStep {
  text: string
  why?: string
}

interface ProofPanelProps {
  steps: ProofStep[]
  currentStep: number
  hidden?: boolean
}

/** Step-through proof caption stack: prior lines stay visible (dimmed), the
 * current line is bright, with its one-line "why this step" underneath.
 * Used by the Doubling Machine's construction mode, Concyclic Contradiction,
 * and Recap/Replay. */
export default function ProofPanel({ steps, currentStep, hidden = false }: ProofPanelProps) {
  if (hidden) {
    return (
      <div className="text-chalk/40 font-display text-sm italic">proof hidden — press H</div>
    )
  }
  const visible = steps.slice(0, currentStep + 1)
  return (
    <div className="flex flex-col gap-2 max-h-full overflow-hidden">
      {visible.map((step, i) => {
        const isCurrent = i === currentStep
        return (
          <div
            key={i}
            className={isCurrent ? 'opacity-100' : 'opacity-40'}
          >
            <p
              className={`font-math text-[20px] leading-snug ${
                isCurrent ? 'text-live' : 'text-chalk'
              }`}
            >
              {step.text}
            </p>
            {isCurrent && step.why && (
              <p className="text-sm text-chalk/60 font-display mt-0.5">{step.why}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
