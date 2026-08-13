'use client';

import * as React from 'react';
import { useImageStore } from '@/lib/store';
import { useDropzone } from 'react-dropzone';
import { useResponsiveCanvasDimensions } from '@/hooks/useAspectRatioDimensions';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/constants';
import {
  backgroundCategories,
  getBackgroundThumbnailUrl,
} from '@/lib/r2-backgrounds';
import { gradientColors, type GradientKey } from '@/lib/constants/gradient-colors';
import { meshGradients, magicGradients, type MeshGradientKey, type MagicGradientKey } from '@/lib/constants/mesh-gradients';
import { ColorPicker } from '@/components/ui/color-picker';
import { SectionWrapper } from './SectionWrapper';
import { Cancel01Icon, Image01Icon, ShuffleIcon } from 'hugeicons-react';
import { cn } from '@/lib/utils';
import { CachedImage } from '@/components/ui/cached-image';

// Shadow overlay IDs
const OVERLAY_SHADOW_IDS = [
  '023', '001', '002', '007', '017', '019', '031', '037', '041', '050',
  '053', '057', '063', '064', '082', '083', '088', '097', '099'
];
const OVERLAY_SHADOW_URLS = OVERLAY_SHADOW_IDS.map((id) => `/overlay-shadow/${id}.webp`);

// Category display names (ordered)
const CATEGORY_ORDER = ['assets', 'mac', 'radiant', 'mesh', 'raycast', 'paper', 'pattern'] as const;
const CATEGORY_LABELS: Record<string, string> = {
  assets: 'Abstract',
  mac: 'macOS',
  radiant: 'Radiant',
  mesh: 'Mesh',
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
      <SectionWrapper title="Light & Shadow" defaultOpen={true}>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 p-1">
            <button
              onClick={handleRemoveShadows}
              className={cn(
                'aspect-[16/9] flex items-center justify-center text-xs font-medium rounded-md border transition-all',
                !currentShadow
                  ? 'border-foreground/30 text-foreground bg-foreground/[0.08]'
                  : 'border-dashed border-foreground/15 text-muted-foreground hover:border-foreground/25 hover:bg-foreground/[0.04]'
              )}
            >
              None
            </button>
            {OVERLAY_SHADOW_URLS.slice(0, 11).map((shadowUrl, index) => (
              <button
                key={index}
                onClick={() => handleAddShadow(shadowUrl)}
                className={cn(
                  'aspect-[16/9] rounded-md overflow-hidden border transition-all bg-card',
                  currentShadow?.src === shadowUrl
                    ? 'border-foreground/30 ring-1 ring-foreground/20'
                    : 'border-foreground/10 hover:border-foreground/20'
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

      <SectionWrapper title="Custom Background" defaultOpen={true}>
        <div className="grid grid-cols-3 gap-2 p-1">
          <div
            {...getBgRootProps()}
            className={cn(
              'flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-md border cursor-pointer transition-all',
              customBgType === 'image'
                ? 'border-foreground/30 bg-foreground/[0.08] ring-1 ring-foreground/15'
                : 'border-foreground/10 bg-foreground/[0.04] hover:bg-foreground/[0.06] hover:border-foreground/20'
            )}
          >
            <input {...getBgInputProps()} />
            <div className={cn(
              "w-7 h-7 rounded-md flex items-center justify-center",
              customBgType === 'image' ? "bg-foreground/[0.1]" : "bg-foreground/[0.06]"
            )}>
              <Image01Icon size={14} className={customBgType === 'image' ? "text-foreground" : "text-muted-foreground"} />
            </div>
            <span className={cn("text-[10px] font-medium", customBgType === 'image' ? "text-foreground" : "text-muted-foreground")}>Image</span>
          </div>

          <ColorPicker
            color={customColor}
            onChange={(newColor) => {
              setCustomColor(newColor);
              setBackgroundType('solid');
              setBackgroundValue(newColor);
            }}
            className={cn(
              'flex flex-col items-center justify-center gap-1.5 py-2.5 h-auto rounded-md',
              customBgType === 'color'
                ? 'border-foreground/30 bg-foreground/[0.08] ring-1 ring-foreground/15'
                : 'border-foreground/10 bg-foreground/[0.04] hover:bg-foreground/[0.06] hover:border-foreground/20'
            )}
          />

          <button
            onClick={() => {
              setBackgroundType('solid');
              setBackgroundValue('transparent');
            }}
            className={cn(
              'flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-md border transition-all',
              customBgType === 'transparent'
                ? 'border-foreground/30 bg-foreground/[0.08] ring-1 ring-foreground/15'
                : 'border-foreground/10 bg-foreground/[0.04] hover:bg-foreground/[0.06] hover:border-foreground/20'
            )}
          >
            <div className={cn(
              "w-7 h-7 rounded-md flex items-center justify-center",
              customBgType === 'transparent' ? "bg-foreground/[0.1]" : "bg-foreground/[0.06]"
            )}>
              <div
                className="w-3.5 h-3.5 rounded-full border border-foreground/20"
                style={{
                  background: 'repeating-conic-gradient(#808080 0% 25%, #fff 0% 50%) 50% / 6px 6px',
                }}
              />
            </div>
            <span className={cn("text-[10px] font-medium", customBgType === 'transparent' ? "text-foreground" : "text-muted-foreground")}>Transparent</span>
          </button>
        </div>
        {bgUploadError && <p className="text-xs text-destructive mt-2">{bgUploadError}</p>}

        {backgroundConfig.type === 'image' && backgroundConfig.value?.startsWith('blob:') && (
          <div className="relative rounded-md overflow-hidden border border-foreground/10 aspect-video bg-foreground/[0.04] mt-3">
            <img
              src={backgroundConfig.value}
              alt="Background"
              className="w-full h-full object-cover"
            />
            <button
              className="absolute top-2 right-2 p-1 rounded-md bg-background/80 text-foreground hover:bg-foreground/10 transition-colors"
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

      {availableCategories.map((category) => (
        <SectionWrapper
          key={category}
          title={CATEGORY_LABELS[category] || category}
          defaultOpen={true}
        >
          <div className="grid grid-cols-4 gap-2 p-1">
            {(backgroundCategories[category] || []).map((imagePath: string, idx: number) => (
              <button
                key={`${category}-${idx}`}
                onClick={() => {
                  setBackgroundValue(imagePath);
                  setBackgroundType('image');
                }}
                className={cn(
                  'aspect-square rounded-md overflow-hidden border transition-all hover:scale-105 relative',
                  backgroundConfig.value === imagePath
                    ? 'border-foreground/30 ring-1 ring-foreground/20'
                    : 'border-foreground/10 hover:border-foreground/20'
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

      <SectionWrapper
        title="Magic Gradients"
        defaultOpen={true}
        action={
          <button
            onClick={(e) => {
              e.stopPropagation();
              shuffleMagicGradient();
            }}
            className="py-0.5 bg-foreground/[0.04] hover:bg-foreground/[0.08] cursor-pointer border border-foreground/10 rounded-md transition-colors flex text-[10px] text-muted-foreground space-x-1 px-2 items-center"
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
                  'block h-8 w-8 shrink-0 cursor-pointer transition-all duration-200 border border-foreground/10 hover:scale-105',
                  backgroundConfig.value === `magic:${key}`
                    ? 'rounded-full scale-110 ring-1 ring-foreground/40'
                    : 'rounded-md'
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

      <SectionWrapper title="Gradients" defaultOpen={true}>
        <div className="overflow-x-auto scrollbar-hide">
          <div
            className="grid grid-flow-col auto-cols-min gap-2 w-max"
            style={{ gridTemplateRows: 'repeat(2, 1fr)', gridAutoFlow: 'column' }}
          >
            {(Object.keys(gradientColors) as GradientKey[]).map((key, idx) => (
              <button
                key={`classic-${key}`}
                onClick={() => {
                  setBackgroundType('gradient');
                  setBackgroundValue(key);
                }}
                className={cn(
                  'block h-8 w-8 shrink-0 cursor-pointer transition-all duration-200 border border-foreground/10 hover:scale-105',
                  backgroundConfig.value === key
                    ? 'rounded-full scale-110 ring-1 ring-foreground/40'
                    : 'rounded-md'
                )}
                style={{
                  background: gradientColors[key],
                  gridArea: `${(idx % 2) + 1} / ${Math.floor(idx / 2) + 1}`,
                }}
              />
            ))}
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
                    'block h-8 w-8 shrink-0 cursor-pointer transition-all duration-200 border border-foreground/10 hover:scale-105',
                    backgroundConfig.value === `mesh:${key}`
                      ? 'rounded-full scale-110 ring-1 ring-foreground/40'
                      : 'rounded-md'
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
