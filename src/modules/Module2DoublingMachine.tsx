import { useEffect, useRef, useState } from 'react'
import {
  angleAt,
  arcSpan,
  centralAngle,
  classifyCenterCase,
  normalizeDeg,
  pointOnCircle,
  reflexAngle,
  round1,
  type AngleCase,
  type Point,
} from '../geometry'
import AngleArc from '../components/AngleArc'
import Chord from '../components/Chord'
import Circle from '../components/Circle'
import ControlButton from '../components/ControlButton'
import DraggablePoint from '../components/DraggablePoint'
import FigureCanvas from '../components/FigureCanvas'
import ModuleLayout from '../components/ModuleLayout'
import ValueReadout from '../components/ValueReadout'
import { formatDeg, HIDDEN_GLYPH } from '../lib/format'
import { DISPLAY_FONT, MATH_FONT } from '../lib/fonts'
import { PALETTE } from '../lib/palette'
import { useAppState } from '../state/AppState'

const O: Point = { x: 450, y: 360 }
const R = 240
const GHOST_STEP_DEG = 6
const MAX_GHOSTS = 12

const DEFAULT_ANGLE_M = 240
const DEFAULT_ANGLE_N = 300

function insideAngle(angleM: number, angleN: number): number {
  const { majorStart, majorSpan } = arcSpan(angleM, angleN)
  return normalizeDeg(majorStart + majorSpan / 2)
}
function onArmAngle(angleM: number): number {
  return normalizeDeg(angleM + 180)
}
function outsideAngle(angleM: number, angleN: number): number {
  const { majorStart } = arcSpan(angleM, angleN)
  return normalizeDeg(majorStart + 20)
}

/** Keeps L off the minor arc MN -- it must stay on the major arc, per spec. */
function constrainLAngle(rawAngle: number, angleM: number, angleN: number): number {
  const { minorStart, minorSpan } = arcSpan(angleM, angleN)
  const rel = normalizeDeg(rawAngle - minorStart)
  if (rel > 0 && rel < minorSpan) {
    return rel < minorSpan / 2
      ? normalizeDeg(minorStart + 0.05)
      : normalizeDeg(minorStart + minorSpan - 0.05)
  }
  return rawAngle
}

function angularDistance(a: number, b: number): number {
  const d = Math.abs(normalizeDeg(a - b))
  return d > 180 ? 360 - d : d
}

/**
 * Renders the split of angle m-vertex-n by the ray vertex->pivot, in
 * whichever form the construction actually is: additive when `pivot`
 * (the diameter's far end) falls between the two rays -- the common
 * "inside" and degenerate "on arm" cases -- or subtractive when `pivot`
 * falls outside them, which is exactly the "centre outside the angle"
 * case. Rendering the wrong form here is the one thing this component
 * must never do: a subtraction drawn as two adjacent filled wedges reads
 * as "these add up", which is precisely the wrong idea for that case.
 */
function DecomposedWedge({
  vertex,
  m,
  n,
  pivot,
  radius,
  caseLabel,
}: {
  vertex: Point
  m: Point
  n: Point
  pivot: Point
  radius: number
  caseLabel: AngleCase
}) {
  if (caseLabel === 'outside') {
    const mSide = angleAt(vertex, m, pivot)
    const nSide = angleAt(vertex, n, pivot)
    const mIsBigger = mSide >= nSide
    const bigPoint = mIsBigger ? m : n
    const bigColor = mIsBigger ? 'live' : 'anchor'
    const smallPoint = mIsBigger ? n : m
    const smallColor = mIsBigger ? 'anchor' : 'live'
    return (
      <g>
        {/* the larger exterior angle, outlined only */}
        <AngleArc vertex={vertex} a={bigPoint} b={pivot} radius={radius} color={bigColor} filled={false} />
        {/* the smaller one subtracted out of it, filled so the remainder reads clearly */}
        <AngleArc vertex={vertex} a={smallPoint} b={pivot} radius={radius} color={smallColor} fillOpacity={0.45} />
      </g>
    )
  }
  // 'inside' (general case) and 'onArm' (one piece degenerates to ~0):
  // two adjacent wedges that tile m-vertex-n exactly -- addition.
  return (
    <g>
      <AngleArc vertex={vertex} a={m} b={pivot} radius={radius} color="live" fillOpacity={0.3} />
      <AngleArc vertex={vertex} a={pivot} b={n} radius={radius} color="anchor" fillOpacity={0.3} />
    </g>
  )
}

function TickMark({ a, b, color }: { a: Point; b: Point; color: keyof typeof PALETTE }) {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const px = (-dy / len) * 6
  const py = (dx / len) * 6
  return (
    <line
      x1={mx - px}
      y1={my - py}
      x2={mx + px}
      y2={my + py}
      stroke={PALETTE[color]}
      strokeWidth={3}
    />
  )
}

export default function Module2DoublingMachine() {
  const { t, hidden, frozen } = useAppState()

  const [chordVersion, setChordVersion] = useState(0) // bumped by x-preset to reset trail cleanly
  const [angleMState, setAngleMState] = useState(DEFAULT_ANGLE_M)
  const [angleNState, setAngleNState] = useState(DEFAULT_ANGLE_N)
  const [angleL, setAngleL] = useState(() => insideAngle(DEFAULT_ANGLE_M, DEFAULT_ANGLE_N))
  const [trail, setTrail] = useState<number[]>([])
  const [showConstruction, setShowConstruction] = useState(false)
  const [reflexMode, setReflexMode] = useState(false)

  const lastGhostAngle = useRef(angleL)

  useEffect(() => {
    const dist = angularDistance(angleL, lastGhostAngle.current)
    if (dist > GHOST_STEP_DEG) {
      setTrail((tr) => [...tr, lastGhostAngle.current].slice(-MAX_GHOSTS))
      lastGhostAngle.current = angleL
    }
  }, [angleL])

  // reset trail whenever the chord itself changes (x-preset)
  useEffect(() => {
    setTrail([])
    lastGhostAngle.current = angleL
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chordVersion])

  const M = pointOnCircle(O, R, angleMState)
  const N = pointOnCircle(O, R, angleNState)
  const L = pointOnCircle(O, R, angleL)

  const inscribed = angleAt(L, M, N)
  const central = centralAngle(O, M, N)
  const reflex = reflexAngle(O, M, N)
  const caseLabel: AngleCase = classifyCenterCase(L, M, N, O)
  const isXCase = Math.abs(reflex - 4 * inscribed) < 0.5

  function dragL(p: Point) {
    const raw = (Math.atan2(p.y - O.y, p.x - O.x) * 180) / Math.PI
    setAngleL(constrainLAngle(raw, angleMState, angleNState))
  }

  function setCase(kind: AngleCase) {
    const next =
      kind === 'inside'
        ? insideAngle(angleMState, angleNState)
        : kind === 'onArm'
          ? onArmAngle(angleMState)
          : outsideAngle(angleMState, angleNState)
    setAngleL(next)
  }

  function applyXPreset() {
    setAngleMState(210)
    setAngleNState(330)
    setAngleL(insideAngle(210, 330))
    setChordVersion((v) => v + 1)
  }

  const Lp = pointOnCircle(O, R, normalizeDeg(angleL + 180))

  return (
    <ModuleLayout
      figure={
        <FigureCanvas>
          <Circle center={O} radius={R} showCenter />

          {/* ghost trail: faded previous vertex positions + faint wedges */}
          {trail.map((ghostAngle, i) => {
            const gL = pointOnCircle(O, R, ghostAngle)
            const opacity = 0.05 + (0.3 * (i + 1)) / trail.length
            return (
              <g key={i} opacity={opacity}>
                <AngleArc vertex={gL} a={M} b={N} radius={30} color="live" fillOpacity={0.5} />
                <circle cx={gL.x} cy={gL.y} r={5} fill={PALETTE.chalk} />
              </g>
            )
          })}

          {showConstruction && (
            <g>
              <Chord a={L} b={Lp} color="chalk" strokeWidth={3} dashed />
              <Chord a={O} b={M} color="anchor" strokeWidth={3} />
              <Chord a={O} b={L} color="anchor" strokeWidth={3} />
              <Chord a={O} b={N} color="anchor" strokeWidth={3} />
              <TickMark a={O} b={M} color="anchor" />
              <TickMark a={O} b={L} color="anchor" />
              <TickMark a={O} b={N} color="anchor" />
              <DecomposedWedge vertex={L} m={M} n={N} pivot={Lp} radius={22} caseLabel={caseLabel} />
              <AngleArc vertex={M} a={O} b={L} radius={22} color="live" fillOpacity={0.3} />
              <AngleArc vertex={N} a={O} b={L} radius={22} color="anchor" fillOpacity={0.3} />
            </g>
          )}

          <Chord a={M} b={N} color="anchor" strokeWidth={4} />
          <Chord a={L} b={M} color="live" strokeWidth={4} />
          <Chord a={L} b={N} color="live" strokeWidth={4} />

          <AngleArc
            vertex={L}
            a={M}
            b={N}
            radius={40}
            color="live"
            label={hidden ? undefined : formatDeg(inscribed)}
          />
          {!showConstruction && (
            <AngleArc
              vertex={O}
              a={M}
              b={N}
              radius={90}
              color="proof"
              reflex={reflexMode}
              fillOpacity={0.35}
              label={hidden ? undefined : formatDeg(reflexMode ? reflex : central)}
            />
          )}
          {showConstruction && (
            <g>
              {/* the central angle decomposed into its two exterior-angle
                  pieces, drawn on top so the split reads clearly */}
              <DecomposedWedge vertex={O} m={M} n={N} pivot={Lp} radius={90} caseLabel={caseLabel} />
            </g>
          )}

          {/* fixed chord endpoints -- not draggable */}
          <g>
            <circle cx={M.x} cy={M.y} r={7} fill={PALETTE.anchor} stroke={PALETTE.ink} strokeWidth={3} />
            <text x={M.x - 30} y={M.y - 4} fontFamily={MATH_FONT} fontStyle="italic" fontSize={26} fill={PALETTE.anchor}>
              M
            </text>
            <circle cx={N.x} cy={N.y} r={7} fill={PALETTE.anchor} stroke={PALETTE.ink} strokeWidth={3} />
            <text x={N.x + 12} y={N.y - 4} fontFamily={MATH_FONT} fontStyle="italic" fontSize={26} fill={PALETTE.anchor}>
              N
            </text>
          </g>

          <DraggablePoint point={L} onDrag={dragL} color="live" label="L" disabled={frozen} />

          {trail.length >= 3 && (
            <text
              x={O.x}
              y={680}
              textAnchor="middle"
              fontFamily={DISPLAY_FONT}
              fontSize={18}
              fill={PALETTE.chalk}
              opacity={0.6}
            >
              {t('d2GhostHint')}
            </text>
          )}
        </FigureCanvas>
      }
      rail={
        <>
          <div className="flex flex-col items-center gap-1">
            <ValueReadout label="∠MLN" value={formatDeg(inscribed)} color="live" hidden={hidden} />
            <span className="font-display font-black text-xl text-chalk/60 leading-none">× 2</span>
            <ValueReadout label="∠MON" value={formatDeg(central)} color="proof" hidden={hidden} />
          </div>

          <div className="flex flex-col gap-1.5 border-t border-white/10 pt-2">
            <span className="text-[11px] uppercase tracking-[0.15em] text-chalk/60 font-display font-bold">
              case: {caseLabel === 'inside' ? t('d2CaseInside') : caseLabel === 'onArm' ? t('d2CaseOn') : t('d2CaseOutside')}
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <ControlButton active={caseLabel === 'inside'} onClick={() => setCase('inside')}>
                {t('d2CaseInside')}
              </ControlButton>
              <ControlButton active={caseLabel === 'onArm'} onClick={() => setCase('onArm')}>
                {t('d2CaseOn')}
              </ControlButton>
              <ControlButton active={caseLabel === 'outside'} onClick={() => setCase('outside')}>
                {t('d2CaseOutside')}
              </ControlButton>
            </div>
            {caseLabel === 'outside' && (
              <p className="text-xs text-warn font-display leading-snug">{t('d2SubtractionCaption')}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <ControlButton active={showConstruction} onClick={() => setShowConstruction((s) => !s)}>
              {t('d2ShowConstruction')}
            </ControlButton>
            {showConstruction && (
              <p className="font-math text-xs text-chalk/70 leading-snug" style={{ fontFamily: MATH_FONT }}>
                {caseLabel === 'inside'
                  ? t('d2FormulaAddition')
                  : caseLabel === 'onArm'
                    ? t('d2FormulaDirect')
                    : t('d2FormulaSubtraction')}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5 border-t border-white/10 pt-2">
            <ControlButton active={reflexMode} onClick={() => setReflexMode((r) => !r)}>
              {t('d2ReflexToggle')}
            </ControlButton>
            {reflexMode && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] uppercase tracking-[0.12em] text-chalk/60 font-display font-bold">
                    reflex ∠MON
                  </span>
                  <span className="tabular-nums font-display font-black text-[30px] text-anchor leading-none">
                    {hidden ? HIDDEN_GLYPH : formatDeg(reflex)}
                  </span>
                </div>
                <span
                  className="font-math text-base tabular-nums text-chalk/70"
                  style={{ fontFamily: MATH_FONT }}
                >
                  {formatDeg(reflex)} + {formatDeg(central)} = {formatDeg(reflex + central)}
                </span>
                <ControlButton onClick={applyXPreset}>{t('d2SolvePreset')}</ControlButton>
                {isXCase && (
                  <p className="text-xs text-proof font-display leading-snug">
                    4x = 360 − 2x → x = {round1(inscribed).toFixed(1)}°
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      }
    />
  )
}
