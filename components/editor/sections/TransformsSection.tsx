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

const PRESETS: TransformPreset[] = [
  { name: 'Default', values: { perspective: 200, rotateX: 0, rotateY: 0, rotateZ: 0, translateX: 0, translateY: 0, scale: 1 } },
  { name: 'Subtle Left', values: { perspective: 1000, rotateX: 3, rotateY: -8, rotateZ: 0, translateX: 0, translateY: 0, scale: 1 } },
  { name: 'Subtle Right', values: { perspective: 1000, rotateX: 3, rotateY: 8, rotateZ: 0, translateX: 0, translateY: 0, scale: 1 } },
  { name: 'Dramatic Left', values: { perspective: 800, rotateX: 10, rotateY: -20, rotateZ: 0, translateX: 0, translateY: 0, scale: 1 } },
  { name: 'Dramatic Right', values: { perspective: 800, rotateX: 10, rotateY: 20, rotateZ: 0, translateX: 0, translateY: 0, scale: 1 } },
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
    const { rotateX, rotateY, rotateZ, scale } = preset.values;
    return {
      transform: `scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
    };
  };

  const getPerspectiveStyle = (preset: TransformPreset) => ({
    perspective: `${preset.values.perspective}px`,
  });

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
                'flex-shrink-0 flex items-center justify-center bg-surface-2/60 w-16 h-16 rounded-xl overflow-hidden transition-all cursor-pointer',
                'hover:bg-surface-3/60',
                isSelected && 'ring-2 ring-surface-5'
              )}
              style={getPerspectiveStyle(preset)}
              title={preset.name}
            >
              <div
                className="w-9 h-9 bg-primary shadow-lg rounded-lg"
                style={getTransformStyle(preset)}
              />
            </button>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
