'use client';

import * as React from 'react';
import { useImageStore } from '@/lib/store';
import { useDropzone } from 'react-dropzone';
import { useResponsiveCanvasDimensions } from '@/hooks/useAspectRatioDimensions';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/constants';
import { getR2ImageUrl } from '@/lib/r2';
import {
  backgroundCategories,
  getBackgroundThumbnailUrl,
} from '@/lib/r2-backgrounds';
import { gradientColors, type GradientKey } from '@/lib/constants/gradient-colors';
import { solidColors, type SolidColorKey } from '@/lib/constants/solid-colors';
import { meshGradients, magicGradients, type MeshGradientKey, type MagicGradientKey } from '@/lib/constants/mesh-gradients';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import { SectionWrapper } from './SectionWrapper';
import { Cancel01Icon, Image01Icon, ShuffleIcon } from 'hugeicons-react';
import { cn } from '@/lib/utils';
import { CachedImage } from '@/components/ui/cached-image';

// Arrow URLs
const ARROW_URLS = Array.from({ length: 10 }, (_, i) => `/arrow/arrow-${i + 1}.svg`);

// Shadow overlay IDs
const OVERLAY_SHADOW_IDS = [
  '023', '001', '002', '007', '017', '019', '031', '037', '041', '050',
  '053', '057', '063', '064', '082', '083', '088', '097', '099'
];
const OVERLAY_SHADOW_URLS = OVERLAY_SHADOW_IDS.map((id) => `/overlay-shadow/${id}.webp`);

// Category display names (ordered)
const CATEGORY_ORDER = ['assets', 'mac', 'radiant', 'mesh', 'silk', 'raycast', 'paper', 'pattern'] as const;
const CATEGORY_LABELS: Record<string, string> = {
  assets: 'Abstract',
  mac: 'macOS',
  radiant: 'Radiant',
  mesh: 'Mesh',
  silk: 'Silk',
  raycast: 'Raycast',
  paper: 'Paper',
  pattern: 'Pattern',
};

export function BackgroundSection() {
  const {
    backgroundConfig,
    imageOverlays,
    setBackgroundType,
    setBackgroundValue,
    addImageOverlay,
    removeImageOverlay,
  } = useImageStore();

  const responsiveDimensions = useResponsiveCanvasDimensions();
  const [bgUploadError, setBgUploadError] = React.useState<string | null>(null);
  const [customColor, setCustomColor] = React.useState('#7dd4ad');

  // Track which custom bg option is active
  const customBgType = React.useMemo(() => {
    if (backgroundConfig.type === 'solid' && backgroundConfig.value === 'transparent') {
      return 'transparent';
    }
    if (backgroundConfig.type === 'solid' && backgroundConfig.value?.startsWith('#')) {
      return 'color';
    }
    if (backgroundConfig.type === 'solid' && backgroundConfig.value?.startsWith('rgba')) {
      return 'color';
    }
    if (backgroundConfig.type === 'image' && backgroundConfig.value?.startsWith('blob:')) {
      return 'image';
    }
    return null;
  }, [backgroundConfig]);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return `File type not supported. Please use: PNG, JPG, WEBP`;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return `File size too large. Maximum size is ${MAX_IMAGE_SIZE / 1024 / 1024}MB`;
    }
    return null;
  };

  const onBgDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const validationError = validateFile(file);
        if (validationError) {
          setBgUploadError(validationError);
          return;
        }
        setBgUploadError(null);
        const blobUrl = URL.createObjectURL(file);
        setBackgroundValue(blobUrl);
        setBackgroundType('image');
      }
    },
    [setBackgroundValue, setBackgroundType]
  );

  const {
    getRootProps: getBgRootProps,
    getInputProps: getBgInputProps,
    isDragActive: isBgDragActive,
  } = useDropzone({
    onDrop: onBgDrop,
    accept: { 'image/*': ALLOWED_IMAGE_TYPES.map((type) => type.split('/')[1]) },
    maxSize: MAX_IMAGE_SIZE,
    multiple: false,
  });

  // Overlay helpers
  const getFullCanvasOverlay = () => {
    const canvasWidth = responsiveDimensions.width || 1920;
    const canvasHeight = responsiveDimensions.height || 1080;
    return {
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      size: Math.max(canvasWidth, canvasHeight),
    };
  };

  const getDefaultPosition = () => {
    const canvasWidth = responsiveDimensions.width || 1920;
    const overlaySize = 100;
    return {
      x: Math.max(20, (canvasWidth / 2) - (overlaySize / 2)),
      y: 50,
    };
  };

  const handleAddShadow = (shadowUrl: string) => {
    // Remove any existing shadows first (only one shadow at a time)
    imageOverlays.forEach((overlay) => {
      if (typeof overlay.src === 'string' && overlay.src.includes('overlay-shadow')) {
        removeImageOverlay(overlay.id);
      }
    });

    // Add the new shadow
    const { x, y, size } = getFullCanvasOverlay();
    addImageOverlay({
      src: shadowUrl,
      position: { x, y },
      size,
      rotation: 0,
      opacity: 0.5,
      flipX: false,
      flipY: false,
      isVisible: true,
    });
  };

  const handleRemoveShadows = () => {
    imageOverlays.forEach((overlay) => {
      if (typeof overlay.src === 'string' && overlay.src.includes('overlay-shadow')) {
        removeImageOverlay(overlay.id);
      }
    });
  };

  // Get current active shadow
  const currentShadow = imageOverlays.find(
    (overlay) => typeof overlay.src === 'string' && overlay.src.includes('overlay-shadow')
  );

  const handleAddArrow = (arrowUrl: string) => {
    const pos = getDefaultPosition();
    addImageOverlay({
      src: arrowUrl,
      position: { x: pos.x, y: pos.y },
      size: 80,
      rotation: 45,
      opacity: 0.9,
      flipX: false,
      flipY: false,
      isVisible: true,
    });
  };

  const shuffleMagicGradient = () => {
    const keys = Object.keys(magicGradients) as MagicGradientKey[];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    setBackgroundType('gradient');
    setBackgroundValue(`magic:${randomKey}`);
  };

  const availableCategories = CATEGORY_ORDER.filter(
    (cat) => backgroundCategories[cat]?.length > 0
  );

  return (
    <>
      {/* Shadow Overlays */}
      <SectionWrapper title="Shadows" defaultOpen={true}>
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-1.5">
            <button
              onClick={handleRemoveShadows}
              className={cn(
                'aspect-[16/9] flex items-center justify-center text-[10px] rounded-lg border-2 transition-all',
                !currentShadow
                  ? 'border-primary text-foreground bg-surface-2/50'
                  : 'border-dashed border-border/50 text-text-tertiary hover:border-border hover:bg-surface-2/30'
              )}
            >
              None
            </button>
            {OVERLAY_SHADOW_URLS.slice(0, 9).map((shadowUrl, index) => (
              <button
                key={index}
                onClick={() => handleAddShadow(shadowUrl)}
                className={cn(
                  'aspect-[16/9] rounded-lg overflow-hidden border-2 transition-all bg-neutral-300 dark:bg-neutral-700',
                  currentShadow?.src === shadowUrl
                    ? 'border-primary ring-1 ring-primary/30 scale-105'
                    : 'border-border/40 hover:border-primary/60 hover:scale-105'
                )}
              >
                <img
                  src={shadowUrl}
                  alt={`Shadow ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Arrows */}
      <SectionWrapper title="Arrows" defaultOpen={false}>
        <div className="grid grid-cols-5 gap-2">
          {ARROW_URLS.map((arrowUrl, index) => (
            <button
              key={index}
              onClick={() => handleAddArrow(arrowUrl)}
              className="aspect-square flex items-center justify-center rounded-lg border border-border/40 bg-white dark:bg-surface-3 hover:border-primary/60 hover:scale-105 transition-all p-2"
            >
              <img
                src={arrowUrl}
                alt={`Arrow ${index + 1}`}
                className="w-full h-full object-contain dark:invert"
              />
            </button>
          ))}
        </div>
      </SectionWrapper>

      {/* Custom BG */}
      <SectionWrapper title="Custom BG" defaultOpen={true}>
        <div className="grid grid-cols-3 gap-2">
          {/* Image Upload */}
          <div
            {...getBgRootProps()}
            className={cn(
              'flex flex-col items-center justify-center gap-1.5 py-3 rounded-lg border cursor-pointer transition-all',
              customBgType === 'image'
                ? 'border-primary bg-primary/5'
                : 'border-border/50 bg-surface-2 hover:bg-surface-3'
            )}
          >
            <input {...getBgInputProps()} />
            <Image01Icon size={20} className="text-text-secondary" />
            <span className="text-xs text-text-secondary">Image</span>
          </div>

          {/* Color Picker */}
          <ColorPicker
            color={customColor}
            onChange={(newColor) => {
              setCustomColor(newColor);
              setBackgroundType('solid');
              setBackgroundValue(newColor);
            }}
            className={cn(
              'flex flex-col items-center justify-center gap-1.5 py-3 h-auto',
              customBgType === 'color'
                ? 'border-primary bg-primary/5'
                : ''
            )}
          />

          {/* Transparent */}
          <button
            onClick={() => {
              setBackgroundType('solid');
              setBackgroundValue('transparent');
            }}
            className={cn(
              'flex flex-col items-center justify-center gap-1.5 py-3 rounded-lg border transition-all',
              customBgType === 'transparent'
                ? 'border-primary bg-primary/5'
                : 'border-border/50 bg-surface-2 hover:bg-surface-3'
            )}
          >
            {/* Checkerboard pattern for transparent */}
            <div
              className="w-5 h-5 rounded-full border border-border/50"
              style={{
                background: 'repeating-conic-gradient(#808080 0% 25%, #fff 0% 50%) 50% / 8px 8px',
              }}
            />
            <span className="text-xs text-text-secondary">Transparent</span>
          </button>
        </div>
        {bgUploadError && <p className="text-xs text-destructive mt-2">{bgUploadError}</p>}

        {/* Current Image Preview */}
        {backgroundConfig.type === 'image' && backgroundConfig.value?.startsWith('blob:') && (
          <div className="relative rounded-lg overflow-hidden border border-border/40 aspect-video bg-surface-1/50 mt-3">
            <img
              src={backgroundConfig.value}
              alt="Background"
              className="w-full h-full object-cover"
            />
            <button
              className="absolute top-2 right-2 p-1 rounded-md bg-black/50 text-white hover:bg-destructive transition-colors"
              onClick={() => {
                setBackgroundType('gradient');
                setBackgroundValue('vibrant_orange_pink');
                URL.revokeObjectURL(backgroundConfig.value);
              }}
            >
              <Cancel01Icon size={14} />
            </button>
          </div>
        )}
      </SectionWrapper>

      {/* Background Images - Each category shown separately */}
      {availableCategories.map((category) => (
        <SectionWrapper
          key={category}
          title={CATEGORY_LABELS[category] || category}
          defaultOpen={category === 'assets'}
        >
          <div className="grid grid-cols-5 gap-2">
            {(backgroundCategories[category] || []).map((imagePath: string, idx: number) => (
              <button
                key={`${category}-${idx}`}
                onClick={() => {
                  setBackgroundValue(imagePath);
                  setBackgroundType('image');
                }}
                className={cn(
                  'aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-105',
                  backgroundConfig.value === imagePath
                    ? 'border-primary ring-1 ring-primary/30'
                    : 'border-transparent hover:border-border/50'
                )}
              >
                <CachedImage
                  src={getBackgroundThumbnailUrl(imagePath)}
                  alt={`${category} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </SectionWrapper>
      ))}

      {/* Magic Gradients */}
      <SectionWrapper
        title="Magic Gradients"
        defaultOpen={false}
        action={
          <button
            onClick={(e) => {
              e.stopPropagation();
              shuffleMagicGradient();
            }}
            className="py-0.5 bg-surface-1 hover:bg-surface-2 cursor-pointer border border-border/20 rounded-md transition-colors flex text-[10px] text-text-tertiary space-x-1 px-2 items-center"
          >
            <span>SHUFFLE</span>
            <ShuffleIcon size={12} />
          </button>
        }
      >
        <div className="overflow-x-auto scrollbar-hide">
          <div
            className="grid grid-flow-col auto-cols-min gap-2 w-max"
            style={{ gridTemplateRows: 'repeat(4, 1fr)', gridAutoFlow: 'column' }}
          >
            {(Object.keys(magicGradients) as MagicGradientKey[]).map((key, idx) => (
              <button
                key={`magic-${key}`}
                onClick={() => {
                  setBackgroundType('gradient');
                  setBackgroundValue(`magic:${key}`);
                }}
                className={cn(
                  'block h-8 w-8 shrink-0 cursor-pointer transition-all duration-200 border border-border/20 hover:scale-105',
                  backgroundConfig.value === `magic:${key}`
                    ? 'rounded-full scale-110'
                    : 'rounded-lg'
                )}
                style={{
                  background: magicGradients[key],
                  gridArea: `${(idx % 4) + 1} / ${Math.floor(idx / 4) + 1}`,
                }}
              />
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Gradients */}
      <SectionWrapper title="Gradients" defaultOpen={false}>
        <div className="overflow-x-auto scrollbar-hide">
          <div
            className="grid grid-flow-col auto-cols-min gap-2 w-max"
            style={{ gridTemplateRows: 'repeat(2, 1fr)', gridAutoFlow: 'column' }}
          >
            {/* Classic Gradients */}
            {(Object.keys(gradientColors) as GradientKey[]).map((key, idx) => (
              <button
                key={`classic-${key}`}
                onClick={() => {
                  setBackgroundType('gradient');
                  setBackgroundValue(key);
                }}
                className={cn(
                  'block h-8 w-8 shrink-0 cursor-pointer transition-all duration-200 border border-border/20 hover:scale-105',
                  backgroundConfig.value === key
                    ? 'rounded-full scale-110'
                    : 'rounded-lg'
                )}
                style={{
                  background: gradientColors[key],
                  gridArea: `${(idx % 2) + 1} / ${Math.floor(idx / 2) + 1}`,
                }}
              />
            ))}
            {/* Mesh Gradients */}
            {(Object.keys(meshGradients) as MeshGradientKey[]).map((key, idx) => {
              const classicCount = Object.keys(gradientColors).length;
              const colOffset = Math.ceil(classicCount / 2);
              return (
                <button
                  key={`mesh-${key}`}
                  onClick={() => {
                    setBackgroundType('gradient');
                    setBackgroundValue(`mesh:${key}`);
                  }}
                  className={cn(
                    'block h-8 w-8 shrink-0 cursor-pointer transition-all duration-200 border border-border/20 hover:scale-105',
                    backgroundConfig.value === `mesh:${key}`
                      ? 'rounded-full scale-110'
                      : 'rounded-lg'
                  )}
                  style={{
                    background: meshGradients[key],
                    gridArea: `${(idx % 2) + 1} / ${Math.floor(idx / 2) + 1 + colOffset}`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </SectionWrapper>

    </>
  );
}
