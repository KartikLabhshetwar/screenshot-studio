'use client';

import * as React from 'react';
import { useImageStore } from '@/lib/store';
import { Slider } from '@/components/ui/slider';
import { SectionWrapper } from './SectionWrapper';
import { cn } from '@/lib/utils';

// Position preset definitions (3x3 grid)
const positionPresets = [
  { name: 'Top Left', translateX: -5, translateY: -5 },
  { name: 'Top Center', translateX: 0, translateY: -5 },
  { name: 'Top Right', translateX: 5, translateY: -5 },
  { name: 'Middle Left', translateX: -5, translateY: 0 },
  { name: 'Center', translateX: 0, translateY: 0 },
  { name: 'Middle Right', translateX: 5, translateY: 0 },
  { name: 'Bottom Left', translateX: -5, translateY: 5 },
  { name: 'Bottom Center', translateX: 0, translateY: 5 },
  { name: 'Bottom Right', translateX: 5, translateY: 5 },
];

export function PositionSection() {
  const { perspective3D, setPerspective3D } = useImageStore();

  const handlePositionPreset = (preset: typeof positionPresets[0]) => {
    setPerspective3D({
      translateX: preset.translateX,
      translateY: preset.translateY,
    });
  };

  const getActivePosition = () => {
    return positionPresets.findIndex(
      (p) =>
        Math.abs(p.translateX - perspective3D.translateX) < 1 &&
        Math.abs(p.translateY - perspective3D.translateY) < 1
    );
  };

  const activePosition = getActivePosition();

  return (
    <SectionWrapper title="Position" defaultOpen={false}>
      <div className="flex flex-col items-center">
        <span className="text-xs text-muted-foreground mb-2">Quick Position</span>
        <div className="grid grid-cols-3 gap-1.5 w-24">
          {positionPresets.map((preset, index) => (
            <button
              key={preset.name}
              onClick={() => handlePositionPreset(preset)}
              title={preset.name}
              className={cn(
                'w-7 h-7 rounded-md border transition-all',
                activePosition === index
                  ? 'bg-foreground/[0.1] border-foreground/30'
                  : 'bg-foreground/[0.04] border-foreground/10 hover:border-foreground/20 hover:bg-foreground/[0.06]'
              )}
            >
              <div
                className={cn(
                  'w-1.5 h-1.5 rounded-full mx-auto',
                  activePosition === index ? 'bg-foreground' : 'bg-muted-foreground/50'
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Slider
          value={[perspective3D.translateX]}
          onValueChange={(value) => setPerspective3D({ translateX: value[0] })}
          min={-10}
          max={10}
          step={0.5}
          label="Horizontal"
          valueDisplay={`${perspective3D.translateX}%`}
        />
        <Slider
          value={[perspective3D.translateY]}
          onValueChange={(value) => setPerspective3D({ translateY: value[0] })}
          min={-10}
          max={10}
          step={0.5}
          label="Vertical"
          valueDisplay={`${perspective3D.translateY}%`}
        />
        <Slider
          value={[perspective3D.rotateZ]}
          onValueChange={(value) => setPerspective3D({ rotateZ: value[0] })}
          min={-45}
          max={45}
          step={1}
          label="Rotation"
          valueDisplay={`${perspective3D.rotateZ}°`}
        />
      </div>
    </SectionWrapper>
  );
}
