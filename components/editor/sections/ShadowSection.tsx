'use client';

import * as React from 'react';
import { useImageStore, type ShadowPreset } from '@/lib/store';
import { SectionWrapper } from './SectionWrapper';
import { cn } from '@/lib/utils';

const shadowPresets: { value: ShadowPreset; label: string; shadow: string }[] = [
  { value: 'none', label: 'None', shadow: 'none' },
  { value: 'hug', label: 'Hug', shadow: 'rgba(0,0,0,0.2) 0px 2px 12px 0px, rgba(0,0,0,0.14) 0px 1px 4px 0px' },
  { value: 'soft', label: 'Soft', shadow: 'rgba(0,0,0,0.28) 0px 12px 48px 0px, rgba(0,0,0,0.18) 0px 4px 12px 0px' },
  { value: 'strong', label: 'Strong', shadow: 'rgba(0,0,0,0.45) 0px 24px 80px 0px, rgba(0,0,0,0.3) 0px 8px 24px 0px' },
];

function ShadowPreview({ shadow }: { shadow: string }) {
  return (
    <div
      className="relative w-full aspect-square rounded-md overflow-hidden"
      style={{ backgroundColor: 'rgb(210, 210, 214)' }}
    >
      <div
        className="absolute bg-primary rounded-[10px]"
        style={{
          top: '26%',
          left: '26%',
          width: '95%',
          height: '95%',
          boxShadow: shadow,
        }}
      />
    </div>
  );
}

export function ShadowSection() {
  const { shadowPreset, setShadowPreset } = useImageStore();

  return (
    <SectionWrapper title="Shadow" defaultOpen={true}>
      <div className="grid grid-cols-2 gap-2 p-1">
        {shadowPresets.map(({ value, label, shadow }) => {
          const isSelected = shadowPreset === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setShadowPreset(value)}
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
                <ShadowPreview shadow={shadow} />
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
    </SectionWrapper>
  );
}
