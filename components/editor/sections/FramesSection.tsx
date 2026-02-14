'use client';

import * as React from 'react';
import { useImageStore, type ImageBorder } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { SectionWrapper } from './SectionWrapper';
import { cn } from '@/lib/utils';

const frameOptions = [
  { value: 'none', label: 'None', image: 'https://assets.picyard.in/images/none.webp' },
  { value: 'arc-light', label: 'Arc Light', image: 'https://assets.picyard.in/images/arc-light.webp' },
  { value: 'arc-dark', label: 'Arc Dark', image: 'https://assets.picyard.in/images/arc-dark.webp' },
  { value: 'macos-dark', label: 'macOS Dark', image: 'https://assets.picyard.in/images/macos-black.webp' },
  { value: 'macos-light', label: 'macOS Light', image: 'https://assets.picyard.in/images/macos-white.webp' },
  { value: 'windows-dark', label: 'Windows Dark', image: 'https://assets.picyard.in/images/macos-black.webp' },
  { value: 'windows-light', label: 'Windows Light', image: 'https://assets.picyard.in/images/macos-white.webp' },
  { value: 'photograph', label: 'Polaroid', image: 'https://assets.picyard.in/images/photograph.webp' },
] as const;

type FrameType = (typeof frameOptions)[number]['value'];

export function FramesSection() {
  const { imageBorder, setImageBorder } = useImageStore();

  const handleSelect = (value: FrameType) => {
    const next: Partial<ImageBorder> = {
      type: value,
      enabled: value !== 'none',
    };
    // Set default border width for arc frames
    if (value === 'arc-light' || value === 'arc-dark') {
      next.width = 6;
    }
    // Set default title for macOS/Windows frames
    if (value === 'macos-light' || value === 'macos-dark') {
      next.title = imageBorder.title || 'file';
    }
    setImageBorder(next);
  };

  const isSelected = (value: FrameType) => imageBorder.type === value;
  const showThicknessControl = ['arc-light', 'arc-dark'].includes(imageBorder.type);
  const showTitleInput = ['macos-light', 'macos-dark', 'windows-light', 'windows-dark'].includes(imageBorder.type);

  return (
    <SectionWrapper title="Frames" defaultOpen={true}>
      {/* Scrollable horizontal frame selector */}
      <div className="flex overflow-x-auto gap-3 pb-1 scrollbar-hide select-none">
        {frameOptions.map(({ value, label, image }) => (
          <button
            key={value}
            type="button"
            onClick={() => handleSelect(value)}
            className="flex flex-col items-center gap-2 shrink-0"
          >
            <div
              className={cn(
                'flex h-14 w-16 items-center justify-center rounded-lg border-2 bg-surface-1/50 transition-all p-1',
                isSelected(value)
                  ? 'border-surface-5 bg-surface-2/50'
                  : 'border-border/40 hover:border-surface-4 hover:bg-surface-2/30'
              )}
            >
              <img
                src={image}
                alt={label}
                className="h-auto max-h-12 w-auto object-contain"
                loading="lazy"
              />
            </div>
            <span className={cn(
              'text-[10px] whitespace-nowrap',
              isSelected(value) ? 'text-text-primary' : 'text-text-tertiary'
            )}>
              {label}
            </span>
          </button>
        ))}
      </div>

      {showThicknessControl && (
        <div className="flex items-center gap-4 pt-2">
          <span className="text-sm text-text-secondary w-14 shrink-0">Size</span>
          <Slider
            value={[imageBorder.width]}
            onValueChange={(value) => setImageBorder({ width: value[0], enabled: true })}
            min={4}
            max={40}
            step={1}
            className="flex-1"
          />
          <span className="text-sm text-text-tertiary w-10 text-right tabular-nums">{imageBorder.width}px</span>
        </div>
      )}

      {showTitleInput && (
        <div className="pt-2">
          <Input
            type="text"
            value={imageBorder.title || ''}
            onChange={(e) => setImageBorder({ title: e.target.value, enabled: true })}
            placeholder="Window title"
            className="h-9 text-sm bg-surface-1/50 border-border/60 text-foreground placeholder:text-text-muted"
          />
        </div>
      )}
    </SectionWrapper>
  );
}
