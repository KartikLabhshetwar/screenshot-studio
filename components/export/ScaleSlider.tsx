/**
 * Resolution scale selector with smooth expanding pill animation.
 * Selected tab expands to show full label (e.g. "1x FHD");
 * unselected tabs shrink to show just the scale with lock icon.
 */

'use client';

import { cn } from '@/lib/utils';
import { LockIcon } from 'hugeicons-react';

interface ScaleSliderProps {
  scale: number;
  onScaleChange: (scale: number) => void;
}

const RESOLUTION_PRESETS = [
  { scale: 1, label: '1x', sublabel: 'FHD', premium: false },
  { scale: 2, label: '2x', sublabel: '4K', premium: true },
  { scale: 3, label: '3x', sublabel: '6K', premium: true },
] as const;

export function ScaleSlider({ scale, onScaleChange }: ScaleSliderProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Resolution</label>
      <div className="flex gap-0.5 p-0.5 border border-foreground/10 bg-foreground/[0.04] rounded-md">
        {RESOLUTION_PRESETS.map((preset) => {
          const isSelected = preset.scale === scale;
          return (
            <button
              key={preset.scale}
              type="button"
              onClick={() => onScaleChange(preset.scale)}
              className={cn(
                'relative flex items-center justify-center py-2 rounded-[5px] text-sm font-medium',
                'transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
                'outline-none focus-visible:ring-2 focus-visible:ring-foreground/25',
                isSelected
                  ? 'bg-foreground/[0.1] text-foreground flex-[1.8] shadow-[var(--card-highlight-shadow)]'
                  : 'text-muted-foreground hover:text-foreground flex-1'
              )}
            >
              <span className="shrink-0">{preset.label}</span>
              <span
                className={cn(
                  'text-xs text-muted-foreground whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
                  isSelected
                    ? 'max-w-[40px] opacity-100 ml-1'
                    : 'max-w-0 opacity-0 ml-0'
                )}
              >
                {preset.sublabel}
              </span>
              {preset.premium ? (
                <span
                  className={cn(
                    'overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
                    !isSelected
                      ? 'max-w-[20px] opacity-50 ml-1'
                      : 'max-w-0 opacity-0 ml-0'
                  )}
                >
                  <LockIcon size={11} />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
