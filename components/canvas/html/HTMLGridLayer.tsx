import { memo } from 'react'

interface HTMLGridLayerProps {
  canvasW: number
  canvasH: number
  gridSize?: number
}

export const HTMLGridLayer = memo(function HTMLGridLayer({
  canvasW,
  canvasH,
  gridSize = 50,
}: HTMLGridLayerProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: `${canvasW}px`,
        height: `${canvasH}px`,
        zIndex: 250,
        pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(to right, rgba(128,128,128,0.25) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(128,128,128,0.25) 1px, transparent 1px)
        `,
        backgroundSize: `${gridSize}px ${gridSize}px`,
      }}
    />
  )
})
