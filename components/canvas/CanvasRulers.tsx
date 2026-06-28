'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'

const RULER_SIZE = 20
const TICK_COLOR = 'rgba(128,128,128,0.6)'
const LABEL_COLOR = 'rgba(128,128,128,0.8)'
const FONT = '9px/1 ui-monospace, monospace'
const HIGHLIGHT_FILL = 'var(--primary)'

/** Bounding box of the selected element, in canvas pixels. */
interface RulerHighlight {
  x: number
  y: number
  width: number
  height: number
}

/** Resolved geometry of the ruler relative to the center viewport. */
interface Geometry {
  /** Viewport (center section) box in screen coords. */
  vpLeft: number
  vpTop: number
  vpWidth: number
  vpHeight: number
  /** Canvas origin (value 0) measured from the viewport's top-left, in screen px. */
  originX: number
  originY: number
  /** Screen px per canvas px (1 unless the canvas is CSS-scaled). */
  scale: number
  /** Axis-aligned box (canvas px) of the selected element, or null. */
  highlight: RulerHighlight | null
}

function sameGeometry(a: Geometry | null, b: Geometry): boolean {
  return (
    a != null &&
    a.vpLeft === b.vpLeft &&
    a.vpTop === b.vpTop &&
    a.vpWidth === b.vpWidth &&
    a.vpHeight === b.vpHeight &&
    a.originX === b.originX &&
    a.originY === b.originY &&
    a.scale === b.scale &&
    a.highlight?.x === b.highlight?.x &&
    a.highlight?.y === b.highlight?.y &&
    a.highlight?.width === b.highlight?.width &&
    a.highlight?.height === b.highlight?.height
  )
}

const FLOAT_EPS = 1e-6

function isMajorValue(value: number, majorEvery: number): boolean {
  const m = Math.abs(value % majorEvery)
  return m < FLOAT_EPS || Math.abs(m - majorEvery) < FLOAT_EPS
}

interface RulerBarProps {
  orientation: 'horizontal' | 'vertical'
  /** Full length of the bar (viewport width or height) in screen px. */
  length: number
  /** Canvas origin offset along this axis, from the viewport edge, in screen px. */
  origin: number
  scale: number
  majorEvery: number
  /** Selected element extent along this axis, in canvas px (or null). */
  highlightStart: number | null
  highlightEnd: number | null
}

function RulerBar({ orientation, length, origin, scale, majorEvery, highlightStart, highlightEnd }: RulerBarProps) {
  const isHorizontal = orientation === 'horizontal'
  const width = isHorizontal ? length : RULER_SIZE
  const height = isHorizontal ? RULER_SIZE : length

  const safeMajor = Number.isFinite(majorEvery) && majorEvery > 0 ? majorEvery : 100
  const minorEvery = safeMajor / 2

  // Selection band mapped to screen px along this axis.
  const hasHighlight = highlightStart != null && highlightEnd != null
  const bandA = hasHighlight ? origin + highlightStart * scale : 0
  const bandB = hasHighlight ? origin + highlightEnd * scale : 0
  const bandMin = Math.min(bandA, bandB)
  const bandSize = Math.abs(bandB - bandA)

  const ticks: React.ReactNode[] = []

  // Range of canvas-pixel values that fall within the visible viewport span.
  const startValue = Math.floor(-origin / scale / minorEvery) * minorEvery
  const endValue = Math.ceil((length - origin) / scale / minorEvery) * minorEvery

  for (let value = startValue; value <= endValue + FLOAT_EPS; value += minorEvery) {
    const pos = origin + value * scale
    if (pos < -1 || pos > length + 1) continue

    const isMajor = isMajorValue(value, safeMajor)
    const tickLen = isMajor ? 10 : 5

    if (isHorizontal) {
      ticks.push(
        <line
          key={`t${value}`}
          x1={pos}
          y1={RULER_SIZE - tickLen}
          x2={pos}
          y2={RULER_SIZE}
          stroke={TICK_COLOR}
          strokeWidth={1}
        />,
      )
      if (isMajor) {
        ticks.push(
          <text key={`l${value}`} x={pos + 2} y={RULER_SIZE - 4} fill={LABEL_COLOR} style={{ font: FONT }}>
            {Math.round(value)}
          </text>,
        )
      }
    } else {
      ticks.push(
        <line
          key={`t${value}`}
          x1={RULER_SIZE - tickLen}
          y1={pos}
          x2={RULER_SIZE}
          y2={pos}
          stroke={TICK_COLOR}
          strokeWidth={1}
        />,
      )
      if (isMajor) {
        ticks.push(
          <text
            key={`l${value}`}
            x={RULER_SIZE - 2}
            y={pos + 2}
            fill={LABEL_COLOR}
            style={{ font: FONT }}
            textAnchor="end"
          >
            {Math.round(value)}
          </text>,
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
        top: 0,
        left: 0,
        display: 'block',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {/* Ruler background */}
      <rect x={0} y={0} width={width} height={height} fill="var(--card)" opacity={0.92} />
      {/* Selection band — highlights where the selected element fits */}
      {hasHighlight &&
        (isHorizontal ? (
          <>
            <rect x={bandMin} y={0} width={bandSize} height={RULER_SIZE} fill={HIGHLIGHT_FILL} opacity={0.25} />
            <line x1={bandMin} y1={0} x2={bandMin} y2={RULER_SIZE} stroke={HIGHLIGHT_FILL} strokeWidth={1} />
            <line
              x1={bandMin + bandSize}
              y1={0}
              x2={bandMin + bandSize}
              y2={RULER_SIZE}
              stroke={HIGHLIGHT_FILL}
              strokeWidth={1}
            />
          </>
        ) : (
          <>
            <rect x={0} y={bandMin} width={RULER_SIZE} height={bandSize} fill={HIGHLIGHT_FILL} opacity={0.25} />
            <line x1={0} y1={bandMin} x2={RULER_SIZE} y2={bandMin} stroke={HIGHLIGHT_FILL} strokeWidth={1} />
            <line
              x1={0}
              y1={bandMin + bandSize}
              x2={RULER_SIZE}
              y2={bandMin + bandSize}
              stroke={HIGHLIGHT_FILL}
              strokeWidth={1}
            />
          </>
        ))}
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
  canvasRef: RefObject<HTMLDivElement | null>
  canvasW: number
  majorEvery?: number
  /**
   * CSS selector for the currently selected element. Its rendered bounding box
   * (after rotation/scale/flip) is measured and highlighted on the rulers.
   */
  selectedSelector?: string | null
}

export function CanvasRulers({
  canvasRef,
  canvasW,
  majorEvery = 100,
  selectedSelector = null,
}: CanvasRulersProps) {
  const [geo, setGeo] = useState<Geometry | null>(null)
  const rafRef = useRef<number | null>(null)

  const measure = useCallback(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return

    const viewportEl = canvasEl.closest('[data-canvas-viewport]') as HTMLElement | null
    if (!viewportEl) return

    const vp = viewportEl.getBoundingClientRect()
    const cv = canvasEl.getBoundingClientRect()
    const scale = canvasW > 0 && cv.width > 0 ? cv.width / canvasW : 1

    let highlight: RulerHighlight | null = null
    if (selectedSelector) {
      const el = viewportEl.querySelector(selectedSelector)
      if (el) {
        const r = el.getBoundingClientRect()
        highlight = {
          x: (r.left - cv.left) / scale,
          y: (r.top - cv.top) / scale,
          width: r.width / scale,
          height: r.height / scale,
        }
      }
    }

    const next: Geometry = {
      vpLeft: vp.left,
      vpTop: vp.top,
      vpWidth: vp.width,
      vpHeight: vp.height,
      originX: cv.left - vp.left,
      originY: cv.top - vp.top,
      scale,
      highlight,
    }
    setGeo((prev) => (sameGeometry(prev, next) ? prev : next))
  }, [canvasRef, canvasW, selectedSelector])

  const scheduleMeasure = useCallback(() => {
    if (rafRef.current != null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      measure()
    })
  }, [measure])

  useLayoutEffect(() => {
    measure()
    if (!selectedSelector) return
    let raf = 0
    const tick = () => {
      measure()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [measure, selectedSelector])

  useEffect(() => {
    const canvasEl = canvasRef.current
    const viewportEl = canvasEl?.closest('[data-canvas-viewport]') as HTMLElement | null

    const ro = new ResizeObserver(scheduleMeasure)
    if (viewportEl) ro.observe(viewportEl)

    window.addEventListener('resize', scheduleMeasure)
    window.addEventListener('scroll', scheduleMeasure, true)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', scheduleMeasure)
      window.removeEventListener('scroll', scheduleMeasure, true)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [canvasRef, scheduleMeasure])

  if (!geo) return null

  return (
    <div
      style={{
        position: 'fixed',
        left: geo.vpLeft,
        top: geo.vpTop,
        width: geo.vpWidth,
        height: geo.vpHeight,
        pointerEvents: 'none',
        zIndex: 30,
        overflow: 'hidden',
      }}
    >
      {/* Horizontal ruler — full viewport width along the top edge */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: geo.vpWidth, height: RULER_SIZE }}>
        <RulerBar
          orientation="horizontal"
          length={geo.vpWidth}
          origin={geo.originX}
          scale={geo.scale}
          majorEvery={majorEvery}
          highlightStart={geo.highlight ? geo.highlight.x : null}
          highlightEnd={geo.highlight ? geo.highlight.x + geo.highlight.width : null}
        />
      </div>

      {/* Vertical ruler — full viewport height along the left edge */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: RULER_SIZE, height: geo.vpHeight }}>
        <RulerBar
          orientation="vertical"
          length={geo.vpHeight}
          origin={geo.originY}
          scale={geo.scale}
          majorEvery={majorEvery}
          highlightStart={geo.highlight ? geo.highlight.y : null}
          highlightEnd={geo.highlight ? geo.highlight.y + geo.highlight.height : null}
        />
      </div>

      {/* Corner block */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: RULER_SIZE,
          height: RULER_SIZE,
          background: 'var(--card)',
          opacity: 0.92,
        }}
      />
    </div>
  )
}
