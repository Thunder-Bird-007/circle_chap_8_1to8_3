import { useState } from 'react'
import { distance, perpendicularFoot, pointOnCircle, round1, type Point } from '../geometry'
import Chord from '../components/Chord'
import Circle from '../components/Circle'
import ControlButton from '../components/ControlButton'
import DraggablePoint from '../components/DraggablePoint'
import FigureCanvas from '../components/FigureCanvas'
import LengthLabel from '../components/LengthLabel'
import ModuleLayout from '../components/ModuleLayout'
import RightAngleMark from '../components/RightAngleMark'
import ValueReadout from '../components/ValueReadout'
import { formatLen } from '../lib/format'
import { MATH_FONT } from '../lib/fonts'
import { PALETTE } from '../lib/palette'
import { toUnits } from '../lib/scale'
import { useAppState } from '../state/AppState'

const O: Point = { x: 430, y: 360 }
const DEFAULT_RADIUS = 220

interface ChordState {
  angleA: number
  angleB: number
}

function chordMetrics(o: Point, radius: number, chord: ChordState) {
  const a = pointOnCircle(o, radius, chord.angleA)
  const b = pointOnCircle(o, radius, chord.angleB)
  const foot = perpendicularFoot(o, a, b)
  const d = distance(o, foot)
  const length = distance(a, b)
  const halfChord = length / 2
  const r = distance(o, a)
  return { a, b, foot, d, length, halfChord, r }
}

function ChordFigure({
  o,
  radius,
  chord,
  setChord,
  labelA,
  labelB,
  color,
  frozen,
  hidden,
}: {
  o: Point
  radius: number
  chord: ChordState
  setChord: (c: ChordState) => void
  labelA: string
  labelB: string
  color: 'live' | 'anchor'
  frozen: boolean
  hidden: boolean
}) {
  const m = chordMetrics(o, radius, chord)
  const constrainToCircle = (p: Point): Point => {
    const angle = (Math.atan2(p.y - o.y, p.x - o.x) * 180) / Math.PI
    return pointOnCircle(o, radius, angle)
  }

  return (
    <g>
      <Chord a={m.a} b={m.b} color={color} strokeWidth={4} />
      {/* perpendicular from O to the chord */}
      <Chord a={o} b={m.foot} color="proof" strokeWidth={3} dashed />
      {m.d > 14 && <RightAngleMark vertex={m.foot} legA={o} legB={m.a} color="proof" />}
      {!hidden && (
        <LengthLabel
          a={m.a}
          b={m.b}
          text={formatLen(toUnits(m.length))}
          color={color}
          offset={-20}
        />
      )}
      <DraggablePoint
        point={m.a}
        onDrag={(p) => setChord({ ...chord, angleA: (Math.atan2(p.y - o.y, p.x - o.x) * 180) / Math.PI })}
        constrain={constrainToCircle}
        color={color}
        label={labelA}
        disabled={frozen}
      />
      <DraggablePoint
        point={m.b}
        onDrag={(p) => setChord({ ...chord, angleB: (Math.atan2(p.y - o.y, p.x - o.x) * 180) / Math.PI })}
        constrain={constrainToCircle}
        color={color}
        label={labelB}
        disabled={frozen}
      />
    </g>
  )
}

export default function Module1ChordLab() {
  const { t, hidden, frozen } = useAppState()
  const [radius, setRadius] = useState(DEFAULT_RADIUS)
  const [chordAB, setChordAB] = useState<ChordState>({ angleA: 200, angleB: 330 })
  const [chordCD, setChordCD] = useState<ChordState>({ angleA: 40, angleB: 100 })
  const [showSecond, setShowSecond] = useState(false)

  const mAB = chordMetrics(O, radius, chordAB)
  const mCD = chordMetrics(O, radius, chordCD)

  const dU = round1(toUnits(mAB.d))
  const halfU = round1(toUnits(mAB.halfChord))
  const rU = round1(toUnits(mAB.r))
  const identityLhs = round1(rU * rU)
  const identityRhs = round1(dU * dU + halfU * halfU)

  function applyPreset() {
    // chord 24, distance 5 -> radius reads exactly 13
    const newRadius = 130
    setRadius(newRadius)
    // place AB so its perpendicular distance from O is exactly 50px (5.0u)
    // and half-chord is 120px (12.0u): central half-angle = asin(120/130)
    const halfAngleDeg = (Math.asin(120 / 130) * 180) / Math.PI
    const baseAngle = 270 // chord horizontal, opening downward, symmetric about vertical
    setChordAB({ angleA: baseAngle - halfAngleDeg, angleB: baseAngle + halfAngleDeg })
  }

  const lenAB = round1(toUnits(mAB.length))
  const lenCD = round1(toUnits(mCD.length))
  const lengthsEqual = Math.abs(lenAB - lenCD) < 0.05

  let relationBadge: { text: string; color: 'proof' } | null = null
  if (showSecond) {
    relationBadge = lengthsEqual
      ? { text: t('c1RelEqual'), color: 'proof' }
      : { text: `${lenAB > lenCD ? 'AB' : 'CD'} ${t('c1RelNearer')}`, color: 'proof' }
  }

  return (
    <ModuleLayout
      figure={
        <FigureCanvas>
          <Circle center={O} radius={radius} showCenter />
          <ChordFigure
            o={O}
            radius={radius}
            chord={chordAB}
            setChord={setChordAB}
            labelA="A"
            labelB="B"
            color="live"
            frozen={frozen}
            hidden={hidden}
          />
          {showSecond && (
            <ChordFigure
              o={O}
              radius={radius}
              chord={chordCD}
              setChord={setChordCD}
              labelA="C"
              labelB="D"
              color="anchor"
              frozen={frozen}
              hidden={hidden}
            />
          )}
        </FigureCanvas>
      }
      rail={
        <>
          <div className="flex flex-col gap-2">
            <ControlButton active={showSecond} onClick={() => setShowSecond((s) => !s)}>
              {t('c1SecondChordToggle')}
            </ControlButton>
            <ControlButton onClick={applyPreset}>{t('c1PresetBtn')}</ControlButton>
          </div>

          <div className="flex flex-col gap-5">
            <ValueReadout label={t('c1Distance')} value={formatLen(dU)} color="proof" hidden={hidden} />
            <ValueReadout label={t('c1HalfChord')} value={formatLen(halfU)} color="live" hidden={hidden} />
            <ValueReadout label={t('c1Radius')} value={formatLen(rU)} color="anchor" hidden={hidden} />
          </div>

          <div className="flex flex-col gap-1 border-t border-white/10 pt-4">
            <span className="text-xs uppercase tracking-[0.18em] text-chalk/60 font-display font-bold">
              {t('c1Identity')}
            </span>
            <span className="font-math text-[22px] text-chalk tabular-nums" style={{ fontFamily: MATH_FONT }}>
              {rU.toFixed(1)}² = {dU.toFixed(1)}² + {halfU.toFixed(1)}²
            </span>
            <span className="font-math text-[20px] tabular-nums" style={{ color: PALETTE.proof }}>
              {identityLhs.toFixed(1)} ≈ {identityRhs.toFixed(1)}
            </span>
          </div>

          {showSecond && relationBadge && (
            <div
              className={`rounded-md px-3 py-2 font-display font-bold text-sm border ${
                relationBadge.color === 'proof'
                  ? 'bg-proof/15 border-proof text-proof'
                  : 'bg-live/15 border-live text-live'
              }`}
            >
              {relationBadge.text}
            </div>
          )}

          <p className="text-sm text-chalk/40 font-display mt-auto">{t('c1DiameterHint')}</p>
        </>
      }
    />
  )
}
