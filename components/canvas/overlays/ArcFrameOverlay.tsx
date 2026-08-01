'use client';

import { type ShadowConfig } from '../utils/shadow-utils';
import { type ImageFilters } from '@/lib/store';

export interface FrameConfig {
  enabled: boolean;
  type: 'none' | 'arc-light' | 'arc-dark' | 'macos-light' | 'macos-dark' | 'windows-light' | 'windows-dark' | 'photograph' | 'glass-light' | 'glass-dark' | 'outline-light' | 'border-light' | 'border-dark';
  width: number;
  color: string;
  padding?: number;
  title?: string;
  opacity?: number;
}

interface ArcFrameOverlayProps {
  screenshot: {
    offsetX: number;
    offsetY: number;
    rotation: number;
    radius: number;
    scale: number;
  };
  shadow: ShadowConfig;
  frame: FrameConfig;
  imageScaledW: number;
  imageScaledH: number;
  canvasW: number;
  canvasH: number;
  image: HTMLImageElement;
  imageOpacity: number;
  imageFilters?: ImageFilters;
}

/**
 * Builds CSS box-shadow string from shadow config.
 * Matches the same shadow intensity as the original Konva image shadow.
 */
function buildBoxShadow(shadow: ShadowConfig): string {
  if (!shadow.enabled) return 'none';

  const { elevation, softness, color, intensity, offsetX, offsetY } = shadow;

  // Parse shadow color
  let r = 0, g = 0, b = 0;
  const colorMatch = color.match(/rgba?\(([^)]+)\)/);

  if (colorMatch) {
    const parts = colorMatch[1].split(',').map(s => s.trim());
    r = parseInt(parts[0]) || 0;
    g = parseInt(parts[1]) || 0;
    b = parseInt(parts[2]) || 0;
  } else if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    r = parseInt(hex.slice(0, 2), 16) || 0;
    g = parseInt(hex.slice(2, 4), 16) || 0;
    b = parseInt(hex.slice(4, 6), 16) || 0;
  }

  // Darken color for shadow (same as shadow-utils.ts)
  const shadowR = Math.floor(r * 0.3);
  const shadowG = Math.floor(g * 0.3);
  const shadowB = Math.floor(b * 0.3);

  // Calculate offsets (same logic as getShadowProps in shadow-utils.ts)
  const diag = elevation * 0.707;
  const x = offsetX ?? diag;
  const y = offsetY ?? diag;

  // Use same blur and intensity as Konva shadow
  const effectiveBlur = Math.max(softness, 12);
  const effectiveIntensity = Math.min(1, Math.max(0.4, intensity * 1.5));

  // Create multi-layer shadow matching Konva intensity
  const shadows = [
    // Primary shadow - matches Konva shadowBlur/offset
    `rgba(${shadowR}, ${shadowG}, ${shadowB}, ${effectiveIntensity}) ${x}px ${y}px ${effectiveBlur}px`,
    // Secondary ambient shadow for depth
    `rgba(${shadowR}, ${shadowG}, ${shadowB}, ${effectiveIntensity * 0.5}) ${x * 1.5}px ${y * 1.5}px ${effectiveBlur * 2}px`,
  ];

  return shadows.join(', ');
}

/**
 * Builds CSS filter string from imageFilters
 */
function buildImageFilter(imageFilters?: ImageFilters): string | undefined {
  if (!imageFilters) return undefined;

  const filters: string[] = [];

  if (imageFilters.brightness !== 100) {
    filters.push(`brightness(${imageFilters.brightness / 100})`);
  }
  if (imageFilters.contrast !== 100) {
    filters.push(`contrast(${imageFilters.contrast / 100})`);
  }
  if (imageFilters.saturate !== 100) {
    filters.push(`saturate(${imageFilters.saturate / 100})`);
  }
  if (imageFilters.grayscale > 0) {
    filters.push(`grayscale(${imageFilters.grayscale / 100})`);
  }
  if (imageFilters.sepia > 0) {
    filters.push(`sepia(${imageFilters.sepia / 100})`);
  }
  if (imageFilters.hueRotate !== 0) {
    filters.push(`hue-rotate(${imageFilters.hueRotate}deg)`);
  }
  if (imageFilters.blur > 0) {
    filters.push(`blur(${imageFilters.blur}px)`);
  }
  if (imageFilters.invert > 0) {
    filters.push(`invert(${imageFilters.invert / 100})`);
  }

  return filters.length > 0 ? filters.join(' ') : undefined;
}

/**
 * HTML/CSS-based overlay for arc frames.
 * Uses CSS box-shadow which properly respects border-radius and renders
 * shadow behind the entire container (image + border).
 */
export function ArcFrameOverlay({
  screenshot,
  shadow,
  frame,
  imageScaledW,
  imageScaledH,
  canvasW,
  canvasH,
  image,
  imageOpacity,
  imageFilters,
}: ArcFrameOverlayProps) {
  // Only render for arc frames
  if (!frame.enabled || (frame.type !== 'arc-light' && frame.type !== 'arc-dark')) {
    return null;
  }

  // Arc frames use configurable semi-transparent border
  const borderWidth = frame.width || 8;
  const defaultOpacity = frame.type === 'arc-light' ? 0.5 : 0.7;
  const borderOpacity = frame.opacity ?? defaultOpacity;
  const borderColor = frame.type === 'arc-light'
    ? `rgba(255, 255, 255, ${borderOpacity})`
    : `rgba(0, 0, 0, ${borderOpacity})`;

  const boxShadow = buildBoxShadow(shadow);
  const imageFilter = buildImageFilter(imageFilters);

  // Container dimensions (image + border)
  const containerW = imageScaledW;
  const containerH = imageScaledH;

  // Position in center of canvas with offsets
  const centerX = canvasW / 2 + screenshot.offsetX;
  const centerY = canvasH / 2 + screenshot.offsetY;

  return (
    <div
      data-arc-overlay="true"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: `${canvasW}px`,
        height: `${canvasH}px`,
        zIndex: 10,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: `${centerX - containerW / 2}px`,
          top: `${centerY - containerH / 2}px`,
          width: `${containerW}px`,
          height: `${containerH}px`,
          transform: `rotate(${screenshot.rotation}deg) scale(${screenshot.scale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Container with border and shadow - shadow is applied to outer container */}
        <div
          style={{
            display: 'grid',
            width: '100%',
            height: '100%',
            borderRadius: `${screenshot.radius}px`,
            border: `${borderWidth}px solid ${borderColor}`,
            boxShadow: boxShadow,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Image inside container */}
          <img
            src={image.src}
            alt="Arc framed"
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: imageOpacity,
              filter: imageFilter,
              display: 'block',
            }}
          />
        </div>
      </div>
    </div>
  );
}
