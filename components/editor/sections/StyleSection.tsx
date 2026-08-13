'use client';

import * as React from 'react';
import { useImageStore, type ImageStylePreset } from '@/lib/store';
import { Slider } from '@/components/ui/slider';
import { SectionWrapper } from './SectionWrapper';
import { cn } from '@/lib/utils';

const stylePresets: { value: ImageStylePreset; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'glass-light', label: 'Glass Light' },
  { value: 'glass-dark', label: 'Glass Dark' },
  { value: 'outline', label: 'Outline' },
  { value: 'border-light', label: 'Border' },
  { value: 'border-dark', label: 'Border Dark' },
];

function StylePreview({ preset }: { preset: ImageStylePreset }) {
  const isDark = preset === 'glass-dark' || preset === 'border-dark';
  const outerBg = isDark ? 'rgb(160, 160, 165)' : 'rgb(210, 210, 214)';

  const getWrapperStyle = (): React.CSSProperties => {
    switch (preset) {
      case 'default':
        return {};
      case 'glass-light':
        return {
          background: 'rgba(255, 255, 255, 0.3)',
          padding: '3px',
          borderRadius: '7px',
        };
      case 'glass-dark':
        return {
          background: 'rgba(0, 0, 0, 0.35)',
          padding: '3px',
          borderRadius: '7px',
        };
      case 'outline':
        return {
          background: 'rgba(255, 255, 255, 0.4)',
          padding: '2px',
          borderRadius: '7px',
        };
      case 'border-light':
        return {
          background: 'rgb(255, 255, 255)',
          padding: '4px',
          borderRadius: '8px',
        };
      case 'border-dark':
        return {
          background: 'rgb(30, 30, 30)',
          padding: '4px',
          borderRadius: '8px',
        };
    }
  };

  const hasWrapper = preset !== 'default';

  return (
    <div
      className="relative w-full aspect-square rounded-md overflow-hidden"
      style={{ backgroundColor: outerBg }}
    >
      <div
        className="absolute"
        style={{ top: '19.5%', left: '19.5%', width: '95.5%', height: '95.5%' }}
      >
        {hasWrapper ? (
          <div className="w-full h-full" style={getWrapperStyle()}>
            <div className="w-full h-full bg-primary rounded-[5px]" />
          </div>
        ) : (
          <div className="w-full h-full bg-primary rounded-[8px]" />
        )}
      </div>
    </div>
  );
}

export function StyleSection() {
  const { imageStylePreset, setImageStylePreset, imageBorder, setImageBorder } = useImageStore();

  const isNonDefault = imageStylePreset !== 'default';
  const currentOpacity = imageBorder.opacity ?? 0.3;
  const currentPadding = imageBorder.padding ?? 2;

  return (
    <SectionWrapper title="Style" defaultOpen={true}>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2 p-1">
          {stylePresets.map(({ value, label }) => {
            const isSelected = imageStylePreset === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setImageStylePreset(value)}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div
                  className={cn(
                    'w-full rounded-[10px] p-1 border transition-all',
                    isSelected
                      ? 'bg-foreground/[0.1] border-foreground/25'
                      : 'border-transparent hover:bg-foreground/[0.04]'
                  )}
                >
                  <StylePreview preset={value} />
                </div>
                <span
                  className={cn(
                    'text-[10px] leading-tight transition-colors',
                    isSelected ? 'text-foreground font-medium' : 'text-muted-foreground group-hover:text-foreground/70',
                  )}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {isNonDefault && (
          <>
            <Slider
              value={[currentPadding]}
              onValueChange={(value) => setImageBorder({ padding: value[0] })}
              min={0}
              max={8}
              step={0.5}
              label="Padding"
              valueDisplay={currentPadding.toFixed(1)}
            />
            <Slider
              value={[Math.round(currentOpacity * 100)]}
              onValueChange={(value) => setImageBorder({ opacity: value[0] / 100 })}
              min={5}
              max={100}
              step={1}
              label="Opacity"
              valueDisplay={`${Math.round(currentOpacity * 100)}%`}
            />
          </>
        )}
      </div>
    </SectionWrapper>
  );
}
