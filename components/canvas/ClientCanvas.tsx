'use client'

import { useEffect, useRef, useState } from 'react'
import { useEditorStore } from '@/lib/store'
import { useImageStore } from '@/lib/store'
import { useResponsiveCanvasDimensions } from '@/hooks/useAspectRatioDimensions'
import { TextOverlayRenderer } from '@/components/image-render/text-overlay-renderer'
import { BackgroundCanvas } from './BackgroundCanvas'
import { UserImageCanvas, getUserImageKonvaStage } from './UserImageCanvas'

// Global ref to store the Konva stage for export (for backward compatibility)
let globalKonvaStage: any = null;

function CanvasRenderer({ image }: { image: HTMLImageElement }) {
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    screenshot,
    canvas,
  } = useEditorStore()

  const { backgroundBorderRadius, perspective3D } = useImageStore()
  const responsiveDimensions = useResponsiveCanvasDimensions()
  
  // Track viewport size for responsive canvas sizing
  const [viewportSize, setViewportSize] = useState({ width: 1920, height: 1080 })
  
  // Get container dimensions
  const containerWidth = responsiveDimensions.width
  const containerHeight = responsiveDimensions.height
  
  // Store stage globally for export (sync with UserImageCanvas)
  useEffect(() => {
    const updateStage = () => {
      const stage = getUserImageKonvaStage()
      if (stage) {
        globalKonvaStage = stage
      }
    }
    
    updateStage()
    const interval = setInterval(updateStage, 100)
    
    return () => {
      clearInterval(interval)
    }
  }, [])
  
  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    
    updateViewportSize()
    window.addEventListener('resize', updateViewportSize)
    return () => window.removeEventListener('resize', updateViewportSize)
  }, [])

  /* ─────────────────── layout helpers ─────────────────── */
  const imageAspect = image.naturalWidth / image.naturalHeight
  
  // Calculate canvas aspect ratio from selected aspect ratio using responsive dimensions
  const canvasAspect = containerWidth / containerHeight

  // Calculate content area (image area without padding)
  // Use viewport-aware dimensions, respecting the selected aspect ratio
  const availableWidth = Math.min(viewportSize.width * 0.8, containerWidth)
  const availableHeight = Math.min(viewportSize.height * 0.7, containerHeight)
  
  // Calculate canvas dimensions that maintain the selected aspect ratio
  let canvasW, canvasH
  if (availableWidth / availableHeight > canvasAspect) {
    // Height is the limiting factor
    canvasH = availableHeight - canvas.padding * 2
    canvasW = canvasH * canvasAspect
  } else {
    // Width is the limiting factor
    canvasW = availableWidth - canvas.padding * 2
    canvasH = canvasW / canvasAspect
  }

  // Ensure reasonable dimensions
  const minContentSize = 300
  canvasW = Math.max(canvasW, minContentSize)
  canvasH = Math.max(canvasH, minContentSize)

  // Content dimensions (without padding)
  const contentW = canvasW - canvas.padding * 2
  const contentH = canvasH - canvas.padding * 2

  // Calculate image dimensions for 3D overlay positioning
  let imageScaledW, imageScaledH
  if (contentW / contentH > imageAspect) {
    imageScaledH = contentH * screenshot.scale
    imageScaledW = imageScaledH * imageAspect
  } else {
    imageScaledW = contentW * screenshot.scale
    imageScaledH = imageScaledW / imageAspect
  }

  /* ─────────────────── frame helpers ─────────────────── */
  const showFrame = useEditorStore.getState().frame.enabled && useEditorStore.getState().frame.type !== 'none'
  const frameOffset =
    showFrame && useEditorStore.getState().frame.type === 'solid'
      ? useEditorStore.getState().frame.width
      : showFrame && useEditorStore.getState().frame.type === 'ruler'
      ? useEditorStore.getState().frame.width + 2
      : 0
  const windowPadding = showFrame && useEditorStore.getState().frame.type === 'window' ? (useEditorStore.getState().frame.padding || 20) : 0
  const windowHeader = showFrame && useEditorStore.getState().frame.type === 'window' ? 40 : 0

  // Build CSS 3D transform string for image only
  // Include screenshot.rotation to match Konva Group rotation
  const perspective3DTransform = `
    translate(${perspective3D.translateX}%, ${perspective3D.translateY}%) 
    scale(${perspective3D.scale}) 
    rotateX(${perspective3D.rotateX}deg) 
    rotateY(${perspective3D.rotateY}deg) 
    rotateZ(${perspective3D.rotateZ + screenshot.rotation}deg)
  `.replace(/\s+/g, ' ').trim()

  // Check if 3D transforms are active (any non-default value)
  const has3DTransform = 
    perspective3D.rotateX !== 0 ||
    perspective3D.rotateY !== 0 ||
    perspective3D.rotateZ !== 0 ||
    perspective3D.translateX !== 0 ||
    perspective3D.translateY !== 0 ||
    perspective3D.scale !== 1

  // Calculate image position relative to canvas - always centered
  // Account for Group position and offset
  const groupCenterX = canvasW / 2 + screenshot.offsetX
  const groupCenterY = canvasH / 2 + screenshot.offsetY
  const imageX = groupCenterX + frameOffset + windowPadding - imageScaledW / 2
  const imageY = groupCenterY + frameOffset + windowPadding + windowHeader - imageScaledH / 2

  /* ─────────────────── render ─────────────────── */
  return (
    <div
      ref={containerRef}
      id="image-render-card"
      className="flex items-center justify-center relative overflow-hidden"
      style={{
        width: '100%',
        maxWidth: `${containerWidth}px`,
        aspectRatio: responsiveDimensions.aspectRatio,
        maxHeight: '90vh',
        backgroundColor: 'transparent',
        padding: '24px',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: `${canvasW}px`,
          height: `${canvasH}px`,
          minWidth: `${canvasW}px`,
          minHeight: `${canvasH}px`,
          overflow: 'hidden',
        }}
      >
        {/* Background Canvas - Separate layer for background only */}
        <BackgroundCanvas
          width={canvasW}
          height={canvasH}
          borderRadius={backgroundBorderRadius}
        />
        
        {/* User Image Canvas - Separate layer for user image, always centered */}
        <UserImageCanvas
          image={image}
          canvasWidth={canvasW}
          canvasHeight={canvasH}
        />
        
        {/* Text overlays */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 20,
            overflow: 'hidden',
          }}
        >
          <TextOverlayRenderer />
        </div>

        {/* 3D Transformed Image Overlay - Only when 3D transforms are active */}
        {has3DTransform && (
          <div
            data-3d-overlay="true"
            style={{
              position: 'absolute',
              left: `${imageX}px`,
              top: `${imageY}px`,
              width: `${imageScaledW}px`,
              height: `${imageScaledH}px`,
              perspective: `${perspective3D.perspective}px`,
              transformStyle: 'preserve-3d',
              zIndex: 15,
              pointerEvents: 'none',
            }}
          >
            <img
              src={image.src}
              alt="3D transformed"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: useImageStore.getState().imageOpacity,
                borderRadius: showFrame && useEditorStore.getState().frame.type === 'window'
                  ? '0 0 12px 12px'
                  : showFrame && useEditorStore.getState().frame.type === 'ruler'
                  ? `${screenshot.radius * 0.8}px`
                  : `${screenshot.radius}px`,
                transform: perspective3DTransform,
                transformOrigin: 'center center',
                willChange: 'transform',
                transition: 'transform 0.125s linear',
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Export function to get the Konva stage
export function getKonvaStage(): any {
  return globalKonvaStage;
}

export default function ClientCanvas() {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const { screenshot, setScreenshot } = useEditorStore()

  useEffect(() => {
    if (!screenshot.src) {
      setImage(null)
      return
    }

    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setImage(img)
    img.onerror = () => setScreenshot({ src: null })
    img.src = screenshot.src
  }, [screenshot.src, setScreenshot])

  if (!image) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <CanvasRenderer image={image} />
}

