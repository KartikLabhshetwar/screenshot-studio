'use client';

import * as React from 'react';
import { useImageStore } from '@/lib/store';
import { useDropzone } from 'react-dropzone';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/constants';
import { getCldImageUrl } from '@/lib/cloudinary';
import {
  backgroundCategories,
  getAvailableCategories,
  cloudinaryPublicIds,
} from '@/lib/cloudinary-backgrounds';
import { gradientColors, type GradientKey } from '@/lib/constants/gradient-colors';
import { solidColors, type SolidColorKey } from '@/lib/constants/solid-colors';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { SectionWrapper } from './SectionWrapper';
import { BackgroundEffects } from '@/components/controls/BackgroundEffects';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BackgroundSection() {
  const {
    backgroundConfig,
    backgroundBorderRadius,
    setBackgroundType,
    setBackgroundValue,
    setBackgroundOpacity,
    setBackgroundBorderRadius,
  } = useImageStore();

  const [bgUploadError, setBgUploadError] = React.useState<string | null>(null);
  const [showPresets, setShowPresets] = React.useState(false);

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

  return (
    <SectionWrapper title="Background" defaultOpen={true}>
      {/* Background Type Selector */}
      <div className="flex gap-2">
        {(['gradient', 'solid', 'image'] as const).map((type) => (
          <Button
            key={type}
            variant="outline"
            size="sm"
            onClick={() => {
              setBackgroundType(type);
              if (type === 'gradient' && !gradientColors[backgroundConfig.value as GradientKey]) {
                setBackgroundValue('vibrant_orange_pink');
              }
              if (type === 'solid' && !solidColors[backgroundConfig.value as SolidColorKey]) {
                setBackgroundValue('white');
              }
            }}
            className={cn(
              'flex-1 h-9 text-xs font-medium rounded-lg transition-all',
              backgroundConfig.type === type
                ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                : 'bg-transparent text-text-secondary border-border/60 hover:text-foreground/90 hover:border-surface-4 hover:bg-surface-2/40'
            )}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>

      {/* Gradient Selector */}
      {backgroundConfig.type === 'gradient' && (
        <div className="grid grid-cols-6 gap-2 max-h-36 overflow-y-auto scrollbar-hide">
          {(Object.keys(gradientColors) as GradientKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setBackgroundValue(key)}
              className={cn(
                'h-9 rounded-lg border-2 transition-all',
                backgroundConfig.value === key
                  ? 'border-surface-5'
                  : 'border-border/40 hover:border-surface-4'
              )}
              style={{ background: gradientColors[key] }}
              title={key.replace(/_/g, ' ')}
            />
          ))}
        </div>
      )}

      {/* Solid Color Selector */}
      {backgroundConfig.type === 'solid' && (
        <div className="grid grid-cols-6 gap-2">
          {(Object.keys(solidColors) as SolidColorKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setBackgroundValue(key)}
              className={cn(
                'h-9 rounded-lg border-2 transition-all',
                backgroundConfig.value === key
                  ? 'border-surface-5'
                  : 'border-border/40 hover:border-surface-4'
              )}
              style={{ backgroundColor: solidColors[key] }}
              title={key.replace(/_/g, ' ')}
            />
          ))}
        </div>
      )}

      {/* Image Background */}
      {backgroundConfig.type === 'image' && (
        <div className="space-y-3">
          {backgroundConfig.value &&
            (backgroundConfig.value.startsWith('blob:') ||
              backgroundConfig.value.startsWith('http') ||
              backgroundConfig.value.startsWith('data:') ||
              cloudinaryPublicIds.includes(backgroundConfig.value)) && (
              <div className="relative rounded-xl overflow-hidden border border-border/40 aspect-video bg-surface-1/50">
                <img
                  src={
                    cloudinaryPublicIds.includes(backgroundConfig.value)
                      ? getCldImageUrl({ src: backgroundConfig.value, width: 400, height: 225, quality: 'auto', format: 'auto', crop: 'fill', gravity: 'auto' })
                      : backgroundConfig.value
                  }
                  alt="Background"
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-background/70 text-foreground/80 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={() => {
                    setBackgroundType('gradient');
                    setBackgroundValue('vibrant_orange_pink');
                    if (backgroundConfig.value.startsWith('blob:')) URL.revokeObjectURL(backgroundConfig.value);
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

          <div
            {...getBgRootProps()}
            className={cn(
              'border-2 border-dashed rounded-xl p-5 cursor-pointer transition-all',
              'flex flex-col items-center justify-center text-center',
              isBgDragActive
                ? 'border-surface-5 bg-surface-2/30'
                : 'border-border/50 hover:border-surface-4 hover:bg-surface-2/20'
            )}
          >
            <input {...getBgInputProps()} />
            <Upload className="w-6 h-6 text-text-tertiary mb-2" />
            <p className="text-xs text-text-tertiary">
              {isBgDragActive ? 'Drop image here' : 'Upload background image'}
            </p>
          </div>

          {bgUploadError && <p className="text-xs text-destructive">{bgUploadError}</p>}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPresets(!showPresets)}
            className="w-full h-8 text-xs text-text-tertiary hover:text-foreground/80 hover:bg-surface-2/40"
          >
            {showPresets ? 'Hide' : 'Show'} Preset Backgrounds
          </Button>

          {showPresets && backgroundCategories && (
            <div className="space-y-3 max-h-44 overflow-y-auto scrollbar-hide">
              {getAvailableCategories()
                .filter((cat: string) => cat !== 'demo' && cat !== 'nature')
                .map((category: string) => {
                  const bgs = backgroundCategories[category];
                  if (!bgs || bgs.length === 0) return null;
                  return (
                    <div key={category} className="space-y-2">
                      <span className="text-[10px] uppercase tracking-wider text-text-muted">{category}</span>
                      <div className="grid grid-cols-3 gap-2">
                        {bgs.slice(0, 6).map((publicId: string, idx: number) => (
                          <button
                            key={`${category}-${idx}`}
                            onClick={() => { setBackgroundValue(publicId); setBackgroundType('image'); }}
                            className={cn(
                              'aspect-video rounded-lg overflow-hidden border-2 transition-all',
                              backgroundConfig.value === publicId ? 'border-surface-5' : 'border-border/40 hover:border-surface-4'
                            )}
                          >
                            <img
                              src={getCldImageUrl({ src: publicId, width: 150, height: 84, quality: 'auto', format: 'auto', crop: 'fill', gravity: 'auto' })}
                              alt={`${category} ${idx + 1}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* Opacity */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-text-secondary w-14 shrink-0">Opacity</span>
        <Slider
          value={[backgroundConfig.opacity ?? 1]}
          onValueChange={(value) => setBackgroundOpacity(value[0])}
          min={0}
          max={1}
          step={0.01}
          className="flex-1"
        />
        <span className="text-sm text-text-tertiary w-10 text-right tabular-nums">
          {Math.round((backgroundConfig.opacity ?? 1) * 100)}%
        </span>
      </div>

      {/* Border Radius */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-text-secondary w-14 shrink-0">Corners</span>
        <Slider
          value={[backgroundBorderRadius]}
          onValueChange={(value) => setBackgroundBorderRadius(value[0])}
          min={0}
          max={100}
          step={1}
          className="flex-1"
        />
        <span className="text-sm text-text-tertiary w-10 text-right tabular-nums">{backgroundBorderRadius}px</span>
      </div>

      <BackgroundEffects />
    </SectionWrapper>
  );
}
