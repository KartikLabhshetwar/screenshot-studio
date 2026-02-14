'use client';

import * as React from 'react';
import { useImageStore, useEditorStore } from '@/lib/store';
import { presets, type PresetConfig } from '@/lib/constants/presets';
import { aspectRatios, type AspectRatioKey } from '@/lib/constants/aspect-ratios';
import { getR2ImageUrl } from '@/lib/r2';
import { cn } from '@/lib/utils';

interface PresetGalleryProps {
  onPresetSelect?: (preset: PresetConfig) => void;
}

// Convert aspect ratio ID to CSS aspect-ratio value
function getAspectRatioValue(aspectRatioId: AspectRatioKey): string {
  const ar = aspectRatios.find((a) => a.id === aspectRatioId);
  if (!ar) return '16 / 9'; // fallback
  return `${ar.width} / ${ar.height}`;
}

// Get background style for preview - directly handles R2 URLs
function getPreviewBackgroundStyle(config: PresetConfig['backgroundConfig']): React.CSSProperties {
  const { type, value, opacity = 1 } = config;

  if (type === 'image' && typeof value === 'string') {
    // For image backgrounds, always try to get R2 URL
    const isR2Path = !value.startsWith('blob:') &&
                     !value.startsWith('http') &&
                     !value.startsWith('data:');

    const imageUrl = isR2Path ? getR2ImageUrl({ src: value }) : value;

    return {
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      opacity,
    };
  }

  if (type === 'solid') {
    return {
      backgroundColor: value as string,
      opacity,
    };
  }

  // Gradient or fallback
  return {
    background: value as string,
    opacity,
  };
}

export function PresetGallery({ onPresetSelect }: PresetGalleryProps) {
  const {
    uploadedImageUrl,
    selectedAspectRatio,
    backgroundConfig,
    backgroundBorderRadius,
    backgroundBlur,
    backgroundNoise,
    borderRadius,
    imageOpacity,
    imageScale,
    imageBorder,
    imageShadow,
    imageOverlays,
    setAspectRatio,
    setBackgroundConfig,
    setBackgroundType,
    setBackgroundValue,
    setBackgroundOpacity,
    setBorderRadius,
    setBackgroundBorderRadius,
    setBackgroundBlur,
    setBackgroundNoise,
    setImageOpacity,
    setImageScale,
    setImageBorder,
    setImageShadow,
    setPerspective3D,
    addImageOverlay,
    removeImageOverlay,
  } = useImageStore();

  const { screenshot } = useEditorStore();

  const isPresetActive = React.useCallback((preset: PresetConfig) => {
    return (
      preset.aspectRatio === selectedAspectRatio &&
      preset.backgroundConfig.type === backgroundConfig.type &&
      preset.backgroundConfig.value === backgroundConfig.value &&
      preset.backgroundBorderRadius === backgroundBorderRadius &&
      preset.borderRadius === borderRadius &&
      preset.imageOpacity === imageOpacity &&
      preset.imageScale === imageScale &&
      preset.imageBorder.enabled === imageBorder.enabled &&
      preset.imageShadow.enabled === imageShadow.enabled &&
      (preset.backgroundBlur ?? 0) === backgroundBlur &&
      (preset.backgroundNoise ?? 0) === backgroundNoise
    );
  }, [
    selectedAspectRatio,
    backgroundConfig,
    backgroundBorderRadius,
    backgroundBlur,
    backgroundNoise,
    borderRadius,
    imageOpacity,
    imageScale,
    imageBorder.enabled,
    imageShadow.enabled,
  ]);

  const applyPreset = React.useCallback((preset: PresetConfig) => {
    setBackgroundConfig(preset.backgroundConfig);
    setBackgroundType(preset.backgroundConfig.type);
    setBackgroundValue(preset.backgroundConfig.value);
    setBackgroundOpacity(preset.backgroundConfig.opacity ?? 1);
    setAspectRatio(preset.aspectRatio);
    setBorderRadius(preset.borderRadius);
    setBackgroundBorderRadius(preset.backgroundBorderRadius);
    setImageOpacity(preset.imageOpacity);
    setImageScale(preset.imageScale);
    setImageBorder(preset.imageBorder);
    setImageShadow(preset.imageShadow);
    setBackgroundBlur(preset.backgroundBlur ?? 0);
    setBackgroundNoise(preset.backgroundNoise ?? 0);
    setPerspective3D(preset.perspective3D ?? {
      perspective: 200,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      translateX: 0,
      translateY: 0,
      scale: 1,
    });

    // Handle shadow overlays
    // First remove any existing shadow overlays
    imageOverlays.forEach((overlay) => {
      if (typeof overlay.src === 'string' && overlay.src.includes('overlay-shadow')) {
        removeImageOverlay(overlay.id);
      }
    });

    // Add preset's shadow overlay if it has one
    if (preset.shadowOverlay) {
      addImageOverlay({
        src: preset.shadowOverlay.src,
        position: { x: 0, y: 0 }, // Position doesn't matter, shadows use inset: 0
        size: 100, // Size doesn't matter for shadows
        rotation: 0,
        opacity: preset.shadowOverlay.opacity,
        flipX: false,
        flipY: false,
        isVisible: true,
      });
    }

    onPresetSelect?.(preset);
  }, [
    setAspectRatio,
    setBackgroundConfig,
    setBackgroundType,
    setBackgroundValue,
    setBackgroundOpacity,
    setBorderRadius,
    setBackgroundBorderRadius,
    setBackgroundBlur,
    setBackgroundNoise,
    setImageOpacity,
    setImageScale,
    setImageBorder,
    setImageShadow,
    setPerspective3D,
    imageOverlays,
    addImageOverlay,
    removeImageOverlay,
    onPresetSelect,
  ]);

  const previewImageUrl = uploadedImageUrl || (screenshot?.src ?? null);

  return (
    <div className="space-y-3">
      {presets.map((preset) => {
          const isActive = isPresetActive(preset);
          const bgStyle = getPreviewBackgroundStyle(preset.backgroundConfig);

          return (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={cn(
                'w-full rounded-lg border-2 transition-all overflow-hidden',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                isActive
                  ? 'border-primary shadow-lg shadow-primary/20'
                  : 'border-border hover:border-border/80 hover:shadow-md'
              )}
            >
              {/* Preview container with shadow and centered content */}
              <div
                className="shadow-lg my-2 rounded-md select-none"
                style={{
                  padding: '1rem',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  aspectRatio: getAspectRatioValue(preset.aspectRatio),
                  overflow: 'hidden',
                  borderRadius: `${preset.backgroundBorderRadius}px`,
                }}
              >
                {/* Cover background layer with scale for edge bleeding */}
                <div
                  className="cover-no-repeat"
                  style={{
                    position: 'absolute',
                    aspectRatio: 'auto',
                    inset: 0,
                    ...bgStyle,
                    filter: `brightness(1) contrast(${1 + (preset.backgroundBlur ?? 0) * 0.01}) blur(${preset.backgroundBlur ?? 0}px)`,
                    transform: 'scale(1.1)',
                  }}
                />

                {/* Shadow overlay - rendered BEFORE image, low z-index */}
                {preset.shadowOverlay && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ zIndex: 5 }}
                  >
                    <img
                      src={preset.shadowOverlay.src}
                      alt=""
                      className="w-full h-full object-cover"
                      style={{ opacity: preset.shadowOverlay.opacity }}
                    />
                  </div>
                )}

                {/* Image container with 3D perspective */}
                {previewImageUrl && (
                  <div className="scale-75" style={{ zIndex: 10 }}>
                    <div
                      className="grid"
                      style={{
                        borderRadius: `${preset.borderRadius}px`,
                        boxShadow: preset.imageShadow.enabled
                          ? `rgba(0, 0, 0, 0.5) 12px 12px 25px -16px, rgba(0, 0, 0, 0.5) 16px 16px 50px -25px, rgba(0, 0, 0, 0.5) 25px 25px 33px`
                          : undefined,
                        transform: preset.perspective3D
                          ? `perspective(${preset.perspective3D.perspective}px) rotateY(${preset.perspective3D.rotateY}deg) rotateX(${preset.perspective3D.rotateX}deg)`
                          : 'perspective(500px) rotateY(0deg) rotateX(0deg)',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: '0.25s',
                        opacity: preset.imageOpacity,
                      }}
                    >
                      <img
                        src={previewImageUrl}
                        alt={preset.name}
                        className="max-w-full max-h-full object-contain"
                        style={{
                          borderRadius: `${preset.borderRadius}px`,
                          display: 'block',
                          transform: `scale(${preset.imageScale / 100})`,
                        }}
                      />
                      {/* Border overlay */}
                      {preset.imageBorder.enabled && preset.imageBorder.type !== 'none' && (
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            borderRadius: `${preset.borderRadius}px`,
                            border: `${preset.imageBorder.width}px solid ${preset.imageBorder.color}`,
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}

                {!previewImageUrl && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 10 }}>
                    <div className="text-xs text-muted-foreground/50">
                      {preset.name}
                    </div>
                  </div>
                )}
              </div>

              {/* Preset info */}
              <div className="p-3 bg-background/95 backdrop-blur-sm border-t border-border/50">
                <div className="text-sm font-medium text-foreground">{preset.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{preset.description}</div>
              </div>
            </button>
          );
        })}

      {!uploadedImageUrl && !screenshot?.src && (
        <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
          <p className="text-xs text-muted-foreground">
            Upload an image to see preset previews
          </p>
        </div>
      )}
    </div>
  );
}
