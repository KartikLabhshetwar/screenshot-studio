'use client';

import * as React from 'react';
import { useImageStore, useEditorStore } from '@/lib/store';
import { presets, type PresetConfig } from '@/lib/constants/presets';
import { aspectRatios, type AspectRatioKey } from '@/lib/constants/aspect-ratios';
import { getBackgroundCSS } from '@/lib/constants/backgrounds';
import { cn } from '@/lib/utils';
import { trackPresetApply } from '@/lib/analytics';
import { useCustomPresets } from '@/hooks/useCustomPresets';
import { Delete02Icon } from 'hugeicons-react';
import { Input } from '@/components/ui/input';

interface PresetGalleryProps {
  onPresetSelect?: (preset: PresetConfig) => void;
}

// Convert aspect ratio ID to CSS aspect-ratio value
function getAspectRatioValue(aspectRatioId: AspectRatioKey): string {
  const ar = aspectRatios.find((a) => a.id === aspectRatioId);
  if (!ar) return '16 / 9'; // fallback
  return `${ar.width} / ${ar.height}`;
}

// Get frame image style (matching Frame3DOverlay.tsx)
function getFrameImageStyle(
  borderConfig: PresetConfig['imageBorder'],
  borderRadius: number
): React.CSSProperties | null {
  if (!borderConfig.enabled || borderConfig.type === 'none') {
    return null;
  }

  const arcBorderWidth = borderConfig.width || 8;

  switch (borderConfig.type) {
    case 'arc-light': {
      const lightOpacity = borderConfig.opacity ?? 0.5;
      return {
        border: `${arcBorderWidth}px solid rgba(255, 255, 255, ${lightOpacity})`,
        borderRadius: `${borderRadius}px`,
        overflow: 'hidden',
        boxSizing: 'border-box' as const,
      };
    }

    case 'arc-dark': {
      const darkOpacity = borderConfig.opacity ?? 0.7;
      return {
        border: `${arcBorderWidth}px solid rgba(0, 0, 0, ${darkOpacity})`,
        borderRadius: `${borderRadius}px`,
        overflow: 'hidden',
        boxSizing: 'border-box' as const,
      };
    }

    case 'photograph':
      return {
        borderWidth: '8px 8px 24px 8px',
        borderStyle: 'solid' as const,
        borderColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxSizing: 'border-box' as const,
      };

    default:
      return {
        border: `${borderConfig.width}px solid ${borderConfig.color}`,
        borderRadius: `${borderRadius}px`,
        overflow: 'hidden',
        boxSizing: 'border-box' as const,
      };
  }
}

// Build shadow filter for 3D transforms (matching Perspective3DOverlay.tsx)
function buildShadowFilter(shadow: PresetConfig['imageShadow']): string {
  if (!shadow.enabled) {
    return '';
  }

  const baseBlur = shadow.blur || 25;
  const baseOffset = Math.max(shadow.offsetX || 0, shadow.offsetY || 0) || 15;

  // Parse shadow color
  let r = 0, g = 0, b = 0;
  const colorMatch = shadow.color.match(/rgba?\(([^)]+)\)/);

  if (colorMatch) {
    const parts = colorMatch[1].split(',').map((s) => s.trim());
    r = parseInt(parts[0]) || 0;
    g = parseInt(parts[1]) || 0;
    b = parseInt(parts[2]) || 0;
  } else if (shadow.color.startsWith('#')) {
    const hex = shadow.color.replace('#', '');
    r = parseInt(hex.slice(0, 2), 16) || 0;
    g = parseInt(hex.slice(2, 4), 16) || 0;
    b = parseInt(hex.slice(4, 6), 16) || 0;
  }

  const shadowR = Math.floor(r * 0.3);
  const shadowG = Math.floor(g * 0.3);
  const shadowB = Math.floor(b * 0.3);

  // Create layered shadows for depth
  const shadows = [
    `drop-shadow(${baseOffset * 0.5}px ${baseOffset * 0.6}px ${baseBlur * 0.5}px rgba(${shadowR}, ${shadowG}, ${shadowB}, 0.5))`,
    `drop-shadow(${baseOffset * 0.25}px ${baseOffset * 0.4}px ${baseBlur * 0.75}px rgba(${shadowR}, ${shadowG}, ${shadowB}, 0.35))`,
    `drop-shadow(${baseOffset * 0.1}px ${baseOffset * 0.2}px ${baseBlur}px rgba(0, 0, 0, 0.25))`,
  ];

  return shadows.join(' ');
}

// Check if preset has 3D transform active
function has3DTransform(perspective3D?: PresetConfig['perspective3D']): boolean {
  if (!perspective3D) return false;
  return (
    perspective3D.rotateX !== 0 ||
    perspective3D.rotateY !== 0 ||
    perspective3D.rotateZ !== 0 ||
    perspective3D.translateX !== 0 ||
    perspective3D.translateY !== 0 ||
    perspective3D.scale !== 1
  );
}

function PresetCard({
  preset,
  isActive,
  previewImageUrl,
  onApply,
}: {
  preset: PresetConfig;
  isActive: boolean;
  previewImageUrl: string | null;
  onApply: () => void;
}) {
  const bgStyle = getBackgroundCSS(preset.backgroundConfig);
  const frameStyle = getFrameImageStyle(preset.imageBorder, preset.borderRadius);
  const is3D = has3DTransform(preset.perspective3D);
  const shadowFilter = is3D ? buildShadowFilter(preset.imageShadow) : '';

  const transform3D = preset.perspective3D
    ? `translate(${preset.perspective3D.translateX}%, ${preset.perspective3D.translateY}%) scale(${preset.perspective3D.scale}) rotateX(${preset.perspective3D.rotateX}deg) rotateY(${preset.perspective3D.rotateY}deg) rotateZ(${preset.perspective3D.rotateZ}deg)`
    : 'translate(0%, 0%) scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg)';

  return (
    <button
      onClick={onApply}
      className={cn(
        'w-full rounded-lg border transition-all overflow-hidden text-left',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        isActive
          ? 'border-primary/50 ring-1 ring-primary/30'
          : 'border-border/50 hover:border-border'
      )}
    >
      <div
        style={{
          position: 'relative',
          aspectRatio: getAspectRatioValue(preset.aspectRatio),
          overflow: 'hidden',
          borderRadius: `${preset.backgroundBorderRadius}px`,
          isolation: 'isolate',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            ...bgStyle,
            filter: (preset.backgroundBlur ?? 0) > 0 ? `blur(${preset.backgroundBlur}px)` : undefined,
            transform: 'scale(1.1)',
            zIndex: 0,
          }}
        />

        {preset.shadowOverlay && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: preset.shadowOverlay.opacity,
              pointerEvents: 'none',
              zIndex: 5,
            }}
          >
            <img
              src={preset.shadowOverlay.src}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        )}

        {previewImageUrl && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              perspective: `${preset.perspective3D?.perspective || 2400}px`,
              transformStyle: 'preserve-3d',
              zIndex: 15,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: `${0.75 * (Number.isFinite(preset.imageScale) ? preset.imageScale : 100)}%`,
                transform: transform3D,
                transformOrigin: 'center center',
                willChange: 'transform',
                transition: 'transform 0.125s linear',
                filter: shadowFilter || undefined,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  borderRadius: `${preset.borderRadius}px`,
                  overflow: 'hidden',
                  ...frameStyle,
                  boxShadow: preset.imageShadow.enabled && !is3D
                    ? `${preset.imageShadow.offsetX}px ${preset.imageShadow.offsetY}px ${preset.imageShadow.blur}px ${preset.imageShadow.spread}px ${preset.imageShadow.color}`
                    : undefined,
                }}
              >
                <img
                  src={previewImageUrl}
                  alt={preset.name}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    opacity: preset.imageOpacity,
                    borderRadius: frameStyle ? undefined : `${preset.borderRadius}px`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {!previewImageUrl && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <div className="text-xs text-muted-foreground/50">{preset.name}</div>
          </div>
        )}
      </div>

      <div className={cn(
        "p-3 backdrop-blur-sm border-t",
        isActive
          ? "bg-primary/5 border-primary/20"
          : "bg-background/95 border-border/50"
      )}>
        <div className="flex items-center gap-2">
          {isActive && (
            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
          )}
          <div className="text-sm font-medium text-foreground">{preset.name}</div>
        </div>
        <div className={cn("text-xs text-muted-foreground mt-0.5", isActive && "ml-3.5")}>{preset.description}</div>
      </div>
    </button>
  );
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
    perspective3D,
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
  const { customPresets, savePreset, deletePreset } = useCustomPresets();
  const [showSaveForm, setShowSaveForm] = React.useState(false);
  const [presetName, setPresetName] = React.useState('');

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
    trackPresetApply(preset.id, preset.name);

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
      perspective: 2400,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      translateX: 0,
      translateY: 0,
      scale: 1,
    });

    imageOverlays.forEach((overlay) => {
      if (typeof overlay.src === 'string' && overlay.src.includes('overlay-shadow')) {
        removeImageOverlay(overlay.id);
      }
    });

    if (preset.shadowOverlay) {
      addImageOverlay({
        src: preset.shadowOverlay.src,
        position: { x: 0, y: 0 },
        size: 100,
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

  const handleSavePreset = React.useCallback(() => {
    if (!presetName.trim()) return;

    savePreset(presetName.trim(), {
      aspectRatio: selectedAspectRatio,
      backgroundConfig,
      borderRadius,
      backgroundBorderRadius,
      imageOpacity,
      imageScale,
      imageBorder,
      imageShadow,
      backgroundBlur,
      backgroundNoise,
      perspective3D,
    });

    setPresetName('');
    setShowSaveForm(false);
  }, [
    presetName,
    savePreset,
    selectedAspectRatio,
    backgroundConfig,
    borderRadius,
    backgroundBorderRadius,
    imageOpacity,
    imageScale,
    imageBorder,
    imageShadow,
    backgroundBlur,
    backgroundNoise,
    perspective3D,
  ]);

  const previewImageUrl = uploadedImageUrl || (screenshot?.src ?? null);

  return (
    <div className="space-y-3">
      {/* Save Current as Preset */}
      <div>
        {!showSaveForm ? (
          <button
            onClick={() => setShowSaveForm(true)}
            className="w-full rounded-lg border-2 border-dashed border-border/60 hover:border-border p-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            + Save Current as Preset
          </button>
        ) : (
          <div className="flex gap-2">
            <Input
              autoFocus
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSavePreset();
                if (e.key === 'Escape') { setShowSaveForm(false); setPresetName(''); }
              }}
              placeholder="Preset name"
              className="h-9 text-sm"
            />
            <button
              onClick={handleSavePreset}
              disabled={!presetName.trim()}
              className="shrink-0 h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* My Presets */}
      {customPresets.length > 0 && (
        <>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            My Presets
          </div>
          {customPresets.map((preset) => (
            <div key={preset.id} className="group relative">
              <PresetCard
                preset={preset}
                isActive={isPresetActive(preset)}
                previewImageUrl={previewImageUrl}
                onApply={() => applyPreset(preset)}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePreset(preset.id);
                }}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-md bg-background/80 backdrop-blur-sm border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
              >
                <Delete02Icon size={14} />
              </button>
            </div>
          ))}
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            Built-in Presets
          </div>
        </>
      )}

      {/* Built-in Presets */}
      {presets.map((preset) => (
        <PresetCard
          key={preset.id}
          preset={preset}
          isActive={isPresetActive(preset)}
          previewImageUrl={previewImageUrl}
          onApply={() => applyPreset(preset)}
        />
      ))}

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
