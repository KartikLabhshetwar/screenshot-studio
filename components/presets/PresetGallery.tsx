'use client';

import * as React from 'react';
import { useImageStore, useEditorStore } from '@/lib/store';
import { presets, type PresetConfig } from '@/lib/constants/presets';
import { getBackgroundCSS } from '@/lib/constants/backgrounds';
import { getCldImageUrl } from '@/lib/cloudinary';
import { cloudinaryPublicIds } from '@/lib/cloudinary-backgrounds';
import { aspectRatios } from '@/lib/constants/aspect-ratios';
import { getAspectRatioCSS } from '@/lib/aspect-ratio-utils';
import { cn } from '@/lib/utils';
interface PresetGalleryProps {
  onPresetSelect?: (preset: PresetConfig) => void;
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
    setAspectRatio(preset.aspectRatio);
    setBackgroundConfig(preset.backgroundConfig);
    setBackgroundType(preset.backgroundConfig.type);
    setBackgroundValue(preset.backgroundConfig.value);
    setBackgroundOpacity(preset.backgroundConfig.opacity ?? 1);
    setBorderRadius(preset.borderRadius);
    setBackgroundBorderRadius(preset.backgroundBorderRadius);
    setImageOpacity(preset.imageOpacity);
    setImageScale(preset.imageScale);
    setImageBorder(preset.imageBorder);
    setImageShadow(preset.imageShadow);
    // Reset blur and noise to 0 if not specified, otherwise use preset values
    setBackgroundBlur(preset.backgroundBlur ?? 0);
    setBackgroundNoise(preset.backgroundNoise ?? 0);
    // Reset 3D transform to defaults if not specified, otherwise use preset values
    setPerspective3D(preset.perspective3D ?? {
      perspective: 200,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      translateX: 0,
      translateY: 0,
      scale: 1,
    });
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
    onPresetSelect,
  ]);

  const getBackgroundImageUrl = (config: PresetConfig['backgroundConfig']): string | null => {
    if (config.type !== 'image') return null;
    const value = config.value as string;
    
    if (value.startsWith('blob:') || value.startsWith('http') || value.startsWith('data:')) {
      return value;
    }
    
    if (cloudinaryPublicIds.includes(value)) {
      return getCldImageUrl({
        src: value,
        width: 400,
        height: 300,
        quality: 'auto',
        format: 'auto',
        crop: 'fill',
        gravity: 'auto',
      });
    }
    
    return null;
  };

  // Maps preset aspectRatio id to CSS aspect-ratio string

  const getPresetAspectRatioCSS = (aspectRatioKey: string): string => {
    const aspectRatio = aspectRatios.find((ar) => ar.id === aspectRatioKey);
    if (!aspectRatio) return "16 / 9"; // Falls back to 16:9 if preset id is missing or invalid
    return getAspectRatioCSS(aspectRatio.width, aspectRatio.height);
  };

  // Computes the visual frame style for a preset preview.
  // Handles border padding, border radius, opacity, and optional 3D transforms

  const getImageFrameStyle = (preset: PresetConfig): React.CSSProperties => {
    const hasFrame = preset.imageBorder.enabled && preset.imageBorder.type !== 'none';
    const framePadding = hasFrame
    ? preset.imageBorder.padding ?? Math.max(4, preset.imageBorder.width * 2)
    : 0; // If a visual frame exists, we add internal padding so borders don't overlap the image
    const frameRadius = preset.imageBorder.borderRadius ?? preset.borderRadius;

    return {
    width: `${preset.imageScale}%`,
    aspectRatio: getPresetAspectRatioCSS(preset.aspectRatio),
    borderRadius: `${frameRadius}px`,
    opacity: preset.imageOpacity,
    padding: framePadding,
    boxSizing: 'border-box',
    transform: preset.perspective3D ? get3DTransform(preset.perspective3D) : undefined,
    transformStyle: preset.perspective3D ? 'preserve-3d' : undefined,
    };
  };

  // Converts preset 3D config into a single CSS transform string
  // Kept separate to avoid cluttering render logic

  const get3DTransform = (perspective3D: PresetConfig["perspective3D"]) => {
    if (!perspective3D) return undefined;
    const {
      perspective,
      rotateX,
      rotateY,
      rotateZ,
      translateX,
      translateY,
      scale,
    } = perspective3D;
    return `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`;
  };

  const getBorderStyle = (border: PresetConfig["imageBorder"]) => {
    if (!border.enabled || border.type === "none") return {};
    const baseStyle: React.CSSProperties = {
      borderWidth: `${border.width}px`,
      borderColor: border.color,
    };

    switch (border.type) {
      case "glassy":
        return {
          ...baseStyle,
          borderStyle: "solid",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        };
      case "solid":
        return {
          ...baseStyle,
          borderStyle: "solid",
        };
      case "dotted":
        return {
          ...baseStyle,
          borderStyle: "dotted",
        };
      default:
        return baseStyle; // For complex borders (infinite-mirror, window, etc.), use simplified CSS
    }
  };

  // Renders a procedural SVG noise overlay to simulate film grain.

  const getNoiseOverlay = (noise: number, borderRadius:number) => {
    if (!noise || noise === 0) return null;
    // Create a noise texture using CSS
    const noiseOpacity = noise / 100;
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, 
          opacity: noiseOpacity,
          mixBlendMode: "overlay",
          borderRadius: `${borderRadius}px`, 
          overflow: 'hidden', 
          position: 'absolute', 
          inset: 0
        }}
      />
    );
  };

  const previewImageUrl = uploadedImageUrl || (screenshot?.src ?? null);

  return (
    <div className="space-y-4">
      <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 -mr-1">
          {presets.map((preset) => {
            const bgImageUrl = getBackgroundImageUrl(preset.backgroundConfig);
            const isActive = isPresetActive(preset);
            const aspectRatioCSS = getPresetAspectRatioCSS(preset.aspectRatio);
            const imageFrameStyle = getImageFrameStyle(preset);
            const borderStyle = getBorderStyle(preset.imageBorder);

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
                <div
                  className="relative aspect-video w-full"
                  style={getBackgroundCSS(preset.backgroundConfig)}
                >
                  <div
                  className="relative w-full"
                  style={{
                    aspectRatio: aspectRatioCSS,
                    borderRadius: `${preset.backgroundBorderRadius}px`,
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={getBackgroundCSS(preset.backgroundConfig)}
                  >
                  {bgImageUrl && (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${bgImageUrl})`,
                        filter: preset.backgroundBlur ? `blur(${preset.backgroundBlur}px)` : undefined,
                        opacity: preset.backgroundConfig.opacity ?? 1,
                      }}
                    />
                  )}
                  </div>
                  {preset.backgroundBlur && preset.backgroundBlur > 0 && (
                    <div
                      className="absolute inset-0"
                      style={{
                      backdropFilter: `blur(${preset.backgroundBlur}px)`,
                      borderRadius: `${preset.borderRadius}px`,
                      overflow:'hidden'
                      }}
                    />
                  )}
                  {getNoiseOverlay(preset.backgroundNoise ?? 0, preset.borderRadius)}  

                  {previewImageUrl && (
                    <div
                      className="absolute inset-0 flex items-center justify-center p-4"
                    >
                      <div
                        className="relative overflow-hidden shadow-lg rounded-lg"
                        style={{
                          ...imageFrameStyle,
                          boxShadow: preset.imageShadow.enabled
                          ? `${preset.imageShadow.offsetX}px ${preset.imageShadow.offsetY}px ${preset.imageShadow.blur}px ${preset.imageShadow.spread}px ${preset.imageShadow.color}`
                          : undefined,
                          borderRadius:`${preset.borderRadius}px`,
                          ...borderStyle,
                        }}
                      >
                        
                      {/* infinite mirror effect: 
                      the Konva version draws several expanded rectangles. for the preview we approximate the same depth effect using a small stack, of scaled border rings with decreasing opacity */}
                       {preset.imageBorder.enabled && preset.imageBorder.type === 'infinite-mirror' && (
                        <div className="pointer-events-none absolute inset-0">
                          {[0, 1, 2].map((i) => (
                           <div
                             key={i}
                             className="absolute inset-0 rounded-[inherit]"
                             style={{
                              border: `${preset.imageBorder.width}px solid ${preset.imageBorder.color}`,
                              opacity: 0.3 - i * 0.07,
                              transform: `scale(${1 + i * 0.06})`,
                             }}
                           />
                         ))}
                        </div>
                        )}
                      <div 
                        className="w-full h-full overflow-hidden "
                        style={{ 
                          borderRadius: 'inherit'
                        }}
                      >
                        <img
                          src={previewImageUrl}
                          alt={preset.name}
                          className="w-full h-full object-contain"
                          style={{
                            borderRadius:'inherit',
                          }}
                        />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!previewImageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-xs text-muted-foreground/50">
                        {preset.name}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-3 bg-background/95 backdrop-blur-sm border-t border-border/50">
                  <div className="text-sm font-medium text-foreground">{preset.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{preset.description}</div>
                </div>
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
    </div>
  );
}