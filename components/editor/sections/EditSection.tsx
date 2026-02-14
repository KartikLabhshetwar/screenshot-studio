'use client';

import * as React from 'react';
import { useImageStore } from '@/lib/store';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { SectionWrapper } from './SectionWrapper';
import { cn } from '@/lib/utils';

export function EditSection() {
  const {
    borderRadius,
    imageScale,
    perspective3D,
    setBorderRadius,
    setImageScale,
    setPerspective3D,
  } = useImageStore();

  const isTiltEnabled = perspective3D.rotateX !== 0 || perspective3D.rotateY !== 0;

  const toggleTilt = () => {
    if (isTiltEnabled) {
      setPerspective3D({ rotateX: 0, rotateY: 0, perspective: 200 });
    } else {
      setPerspective3D({ rotateX: 5, rotateY: -8, perspective: 1000 });
    }
  };

  return (
    <SectionWrapper title="Edit" defaultOpen={true}>
      {/* Round Control */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-text-secondary w-14 shrink-0">Round</span>
        <div className="flex-1">
          <Slider
            value={[borderRadius]}
            onValueChange={(value) => setBorderRadius(value[0])}
            min={0}
            max={50}
            step={1}
            className="w-full"
          />
        </div>
        <span className="text-sm text-text-tertiary w-10 text-right tabular-nums">{borderRadius}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTilt}
          className={cn(
            'h-8 px-4 text-xs font-medium rounded-lg transition-all',
            isTiltEnabled
              ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
              : 'bg-transparent text-text-secondary border-border hover:text-foreground/90 hover:border-surface-4 hover:bg-surface-2/40'
          )}
        >
          Tilt
        </Button>
      </div>

      {/* Scale Control */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-text-secondary w-14 shrink-0">Scale</span>
        <div className="flex-1">
          <Slider
            value={[imageScale / 100]}
            onValueChange={(value) => setImageScale(Math.round(value[0] * 100))}
            min={0.1}
            max={2}
            step={0.01}
            className="w-full"
          />
        </div>
        <span className="text-sm text-text-tertiary w-10 text-right tabular-nums">{(imageScale / 100).toFixed(1)}</span>
      </div>
    </SectionWrapper>
  );
}
