'use client';

import * as React from 'react';
import { useImageStore } from '@/lib/store';
import { SectionWrapper } from './SectionWrapper';
import { cn } from '@/lib/utils';

interface TransformPreset {
  name: string;
  values: {
    perspective: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    translateX: number;
    translateY: number;
    scale: number;
  };
}

// Perspective in px (150em ≈ 2400px at 16px base)
const PRESETS: TransformPreset[] = [
  { name: 'Default', values: { perspective: 2400, rotateX: 0, rotateY: 0, rotateZ: 0, translateX: 0, translateY: 0, scale: 1 } },
  { name: 'Tilted', values: { perspective: 2400, rotateX: 0, rotateY: 0, rotateZ: -8, translateX: 0, translateY: 0, scale: 0.95 } },
  { name: 'Dramatic Left', values: { perspective: 2400, rotateX: 10, rotateY: -20, rotateZ: 8, translateX: -4, translateY: -2, scale: 0.95 } },
  { name: 'Dramatic Right', values: { perspective: 2400, rotateX: 10, rotateY: 20, rotateZ: -8, translateX: 4, translateY: -2, scale: 0.95 } },
  { name: 'Top Down', values: { perspective: 2400, rotateX: 40, rotateY: 0, rotateZ: 0, translateX: 0, translateY: -5, scale: 0.95 } },
];

export function TransformsSection() {
  const { perspective3D, setPerspective3D } = useImageStore();
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    const idx = PRESETS.findIndex((preset) => {
      const v = preset.values;
      return (
        Math.abs(v.rotateX - perspective3D.rotateX) < 2 &&
        Math.abs(v.rotateY - perspective3D.rotateY) < 2 &&
        Math.abs(v.rotateZ - perspective3D.rotateZ) < 2
      );
    });
    setSelectedIndex(idx >= 0 ? idx : null);
  }, [perspective3D]);

  const applyPreset = (preset: TransformPreset, index: number) => {
    setPerspective3D(preset.values);
    setSelectedIndex(index);
  };

  const getTransformStyle = (preset: TransformPreset) => {
    const { perspective, rotateX, rotateY, rotateZ, translateX, translateY, scale } = preset.values;
    return {
      transform: `perspective(${perspective}px) translate(${translateX}%, ${translateY}%) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
    };
  };

  return (
    <SectionWrapper title="Transforms" defaultOpen={true}>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {PRESETS.map((preset, index) => {
          const isSelected = selectedIndex === index;
          return (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset, index)}
              className={cn(
                'flex-shrink-0 flex items-center justify-center bg-foreground/[0.04] w-16 h-16 rounded-md overflow-hidden transition-all cursor-pointer border',
                isSelected
                  ? 'border-primary ring-1 ring-foreground/20'
                  : 'border-foreground/10 hover:border-foreground/20 hover:bg-foreground/[0.06]'
              )}
              title={preset.name}
            >
              <div
                className="w-9 h-9 bg-foreground/20 rounded-md"
                style={getTransformStyle(preset)}
              />
            </button>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
