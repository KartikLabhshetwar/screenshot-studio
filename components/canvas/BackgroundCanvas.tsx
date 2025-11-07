'use client'

import { useEffect, useState } from 'react'
import { useImageStore } from '@/lib/store'
import { getBackgroundCSS } from '@/lib/constants/backgrounds'

interface BackgroundCanvasProps {
  width: number
  height: number
  borderRadius: number
}

/**
 * Separate canvas component for rendering only the background
 * This ensures clean separation between background and user image
 */
export function BackgroundCanvas({ width, height, borderRadius }: BackgroundCanvasProps) {
  const { backgroundConfig } = useImageStore()
  const backgroundStyle = getBackgroundCSS(backgroundConfig)
  
  // Load background image if type is 'image'
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null)
  
  useEffect(() => {
    if (backgroundConfig.type === 'image' && backgroundConfig.value) {
      const imageValue = backgroundConfig.value as string
      
      // Check if it's a valid image URL/blob/data URI or Cloudinary public ID
      const isValidImageValue = 
        imageValue.startsWith('http') || 
        imageValue.startsWith('blob:') || 
        imageValue.startsWith('data:') ||
        (typeof imageValue === 'string' && !imageValue.includes('_gradient'))
      
      if (!isValidImageValue) {
        setBgImage(null)
        return
      }
      
      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => setBgImage(img)
      img.onerror = () => {
        console.error('Failed to load background image:', backgroundConfig.value)
        setBgImage(null)
      }
      
      // Check if it's a Cloudinary public ID or URL
      let imageUrl = imageValue
      if (typeof imageUrl === 'string' && !imageUrl.startsWith('http') && !imageUrl.startsWith('blob:') && !imageUrl.startsWith('data:')) {
        const { getCldImageUrl } = require('@/lib/cloudinary')
        const { cloudinaryPublicIds } = require('@/lib/cloudinary-backgrounds')
        if (cloudinaryPublicIds.includes(imageUrl)) {
          imageUrl = getCldImageUrl({
            src: imageUrl,
            width: Math.max(width, 1920),
            height: Math.max(height, 1080),
            quality: 'auto',
            format: 'auto',
            crop: 'fill',
            gravity: 'auto',
          })
        } else {
          setBgImage(null)
          return
        }
      }
      
      img.src = imageUrl
    } else {
      setBgImage(null)
    }
  }, [backgroundConfig, width, height])

  // If background is an image, render it
  if (backgroundConfig.type === 'image' && bgImage) {
    return (
      <div
        id="canvas-background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${width}px`,
          height: `${height}px`,
          zIndex: 0,
          borderRadius: `${borderRadius}px`,
          overflow: 'hidden',
        }}
      >
        <img
          src={bgImage.src}
          alt="Background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: backgroundConfig.opacity ?? 1,
          }}
        />
      </div>
    )
  }

  // Otherwise render CSS background
  return (
    <div
      id="canvas-background"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: 0,
        borderRadius: `${borderRadius}px`,
        ...backgroundStyle,
      }}
    />
  )
}

