import { useState } from 'react'
import { angleAt, keepAngleClear, normalizeDeg, pointOnCircle, type Point } from '../geometry'
import Chord from '../components/Chord'
import Circle from '../components/Circle'
import ControlButton from '../components/ControlButton'
import DraggablePoint from '../components/DraggablePoint'
import FigureCanvas from '../components/FigureCanvas'
import ModuleLayout from '../components/ModuleLayout'
import RightAngleMark from '../components/RightAngleMark'
import ValueReadout from '../components/ValueReadout'
import { formatDeg } from '../lib/format'
import { PALETTE } from '../lib/palette'
import { useAppState } from '../state/AppState'

const O: Point = { x: 450, y: 360 }
const R = 240
const DIAMETER_TOLERANCE_DEG = 0.3

function angleToPoint(o: Point, p: Point): number {
  return (Math.atan2(p.y - o.y, p.x - o.x) * 180) / Math.PI
}

export default function Module3Semicircle() {
  const { t, hidden, frozen } = useAppState()
  const [reverseMode, setReverseMode] = useState(false)
  const [angleA, setAngleA] = useState(200)
  const [angleBFree, setAngleBFree] = useState(20)
  const [angleC, setAngleC] = useState(90)

  const angleB = reverseMode ? angleBFree : normalizeDeg(angleA + 180)

  const A = pointOnCircle(O, R, angleA)
  const B = pointOnCircle(O, R, angleB)
  const C = pointOnCircle(O, R, angleC)

  const angleACB = angleAt(C, A, B)
  const isDiameterNow = reverseMode && Math.abs(angleACB - 90) < DIAMETER_TOLERANCE_DEG
  const showRightAngle = !reverseMode || isDiameterNow

  function constrainToCircle(p: Point): Point {
    const angle = angleToPoint(O, p)
    return pointOnCircle(O, R, angle)
  }

  const chordColor = isDiameterNow ? 'proof' : 'chalk'
  const acbColor = reverseMode ? (isDiameterNow ? 'proof' : 'live') : 'proof'

  return (
    <ModuleLayout
      figure={
        <FigureCanvas>
          <Circle center={O} radius={R} showCenter />

          <g style={{ transition: 'stroke 200ms ease' }}>
            <Chord a={A} b={B} color={chordColor} strokeWidth={isDiameterNow ? 5 : 4} />
          </g>
          <Chord a={C} b={A} color="live" strokeWidth={3} />
          <Chord a={C} b={B} color="live" strokeWidth={3} />

          {showRightAngle && <RightAngleMark vertex={C} legA={A} legB={B} color="proof" />}

          <DraggablePoint
            point={A}
            onDrag={(p) => {
              // A can never land on C (degenerate angle at C), and in
              // reverse mode never on the independently-draggable B either
              // -- in diameter mode B always trails 180deg behind A so it
              // can never coincide with A regardless.
              const forbidden = reverseMode ? [angleC, angleBFree] : [angleC]
              setAngleA(keepAngleClear(angleToPoint(O, p), forbidden))
            }}
            constrain={constrainToCircle}
            color="anchor"
            label="A"
            disabled={frozen}
          />
          <DraggablePoint
            point={B}
            onDrag={(p) => setAngleBFree(keepAngleClear(angleToPoint(O, p), [angleA, angleC]))}
            constrain={constrainToCircle}
            color="anchor"
            label="B"
            disabled={frozen || !reverseMode}
          />
          <DraggablePoint
            point={C}
            onDrag={(p) => setAngleC(keepAngleClear(angleToPoint(O, p), [angleA, angleB]))}
            constrain={constrainToCircle}
            color="live"
            label="C"
            disabled={frozen}
          />

          {isDiameterNow && (
            <text
              x={O.x}
              y={O.y + R + 46}
              textAnchor="middle"
              fontFamily="inherit"
              className="font-display font-bold"
              fontSize={22}
              fill={PALETTE.proof}
            >
              {t('s3DiameterFound')}
            </text>
          )}
        </FigureCanvas>
      }
      rail={
        <>
          <ValueReadout label={t('s3AngleAtC')} value={formatDeg(angleACB)} color={acbColor} hidden={hidden} />

          <ControlButton active={reverseMode} onClick={() => setReverseMode((r) => !r)}>
            {t('s3ReverseToggle')}
          </ControlButton>

          {reverseMode && (
            <p className="text-sm text-chalk/60 font-display">
              {isDiameterNow ? t('s3DiameterFound') : '…'}
            </p>
          )}
        </>
      }
    />
  )
}
