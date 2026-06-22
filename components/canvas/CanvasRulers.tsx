'use client'

import { memo } from 'react'

const RULER_SIZE = 20
const TICK_COLOR = 'rgba(128,128,128,0.6)'
const LABEL_COLOR = 'rgba(128,128,128,0.8)'
const FONT = '9px/1 ui-monospace, monospace'

interface RulerProps {
  length: number
  orientation: 'horizontal' | 'vertical'
  majorEvery: number
}

function Ruler({ length, orientation, majorEvery }: RulerProps) {
  const isHorizontal = orientation === 'horizontal'
  const width = isHorizontal ? length : RULER_SIZE
  const height = isHorizontal ? RULER_SIZE : length
  const minorEvery = majorEvery / 2

  const ticks: React.ReactNode[] = []

  for (let pos = 0; pos <= length; pos += minorEvery) {
    const isMajor = pos % majorEvery === 0
    const tickLen = isMajor ? 10 : 5

    if (isHorizontal) {
      ticks.push(
        <line
          key={pos}
          x1={pos}
          y1={RULER_SIZE - tickLen}
          x2={pos}
          y2={RULER_SIZE}
          stroke={TICK_COLOR}
          strokeWidth={1}
        />
      )
      if (isMajor && pos > 0) {
        ticks.push(
          <text
            key={`l${pos}`}
            x={pos + 2}
            y={RULER_SIZE - 4}
            fill={LABEL_COLOR}
            style={{ font: FONT }}
          >
            {pos}
          </text>
        )
      }
    } else {
      ticks.push(
        <line
          key={pos}
          x1={RULER_SIZE - tickLen}
          y1={pos}
          x2={RULER_SIZE}
          y2={pos}
          stroke={TICK_COLOR}
          strokeWidth={1}
        />
      )
      if (isMajor && pos > 0) {
        ticks.push(
          <text
            key={`l${pos}`}
            x={RULER_SIZE - 2}
            y={pos + 2}
            fill={LABEL_COLOR}
            style={{ font: FONT }}
            textAnchor="end"
          >
            {pos}
          </text>
        )
      }
    }
  }

  return (
    <svg
      width={width}
      height={height}
      style={{
        position: 'absolute',
        ...(isHorizontal
          ? { top: -RULER_SIZE, left: 0 }
          : { left: -RULER_SIZE, top: 0 }),
        display: 'block',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {/* Ruler background */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="var(--card)"
        opacity={0.92}
      />
      {/* Border on the canvas-facing edge */}
      {isHorizontal ? (
        <line x1={0} y1={RULER_SIZE} x2={width} y2={RULER_SIZE} stroke={TICK_COLOR} strokeWidth={0.5} />
      ) : (
        <line x1={RULER_SIZE} y1={0} x2={RULER_SIZE} y2={height} stroke={TICK_COLOR} strokeWidth={0.5} />
      )}
      {ticks}
    </svg>
  )
}

interface CanvasRulersProps {
  canvasW: number
  canvasH: number
  majorEvery?: number
}

export const CanvasRulers = memo(function CanvasRulers({ canvasW, canvasH, majorEvery = 100 }: CanvasRulersProps) {
  return (
    <>
      {/* Corner block */}
      <div
        style={{
          position: 'absolute',
          top: -RULER_SIZE,
          left: -RULER_SIZE,
          width: RULER_SIZE,
          height: RULER_SIZE,
          background: 'var(--card)',
          opacity: 0.92,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <Ruler length={canvasW} orientation="horizontal" majorEvery={majorEvery} />
      <Ruler length={canvasH} orientation="vertical" majorEvery={majorEvery} />
    </>
  )
})
