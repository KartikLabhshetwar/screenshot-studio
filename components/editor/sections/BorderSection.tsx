'use client';

import { useImageStore } from '@/lib/store';
import { Slider } from '@/components/ui/slider';
import { SectionWrapper } from './SectionWrapper';
import { cn } from '@/lib/utils';

const borderPresets = [
  { value: 0, label: 'Sharp' },
  { value: 12, label: 'Curved' },
  { value: 20, label: 'Round' },
] as const;

function BorderPreview({ radius }: { radius: number }) {
  const previewRadius = radius === 0 ? '0px' : radius === 12 ? '6px' : '12px';

  return (
    <div
      className="relative w-full aspect-square rounded-md overflow-hidden"
      style={{ backgroundColor: 'rgb(210, 210, 214)' }}
    >
      <div
        className="absolute"
        style={{ top: '19.5%', left: '19.5%', width: '95.5%', height: '95.5%' }}
      >
        <div
          className="w-full h-full bg-primary"
          style={{ borderRadius: previewRadius }}
        />
      </div>
    </div>
  );
}

function ScaleSlider() {
  const imageScale = useImageStore((s) => s.imageScale);
  const setImageScale = useImageStore((s) => s.setImageScale);

  return (
    <Slider
      value={[imageScale / 100]}
      onValueChange={(value) => setImageScale(Math.round(value[0] * 100))}
      min={0.1}
      max={2}
      step={0.01}
      label="Scale"
      valueDisplay={(imageScale / 100).toFixed(1)}
    />
  );
}

export function BorderSection() {
  const borderRadius = useImageStore((s) => s.borderRadius);
  const setBorderRadius = useImageStore((s) => s.setBorderRadius);

  return (
    <SectionWrapper title="Border" defaultOpen={true}>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2 p-1">
          {borderPresets.map(({ value, label }) => {
            const isSelected = borderRadius === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setBorderRadius(value)}
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
                  <BorderPreview radius={value} />
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

        <Slider
          value={[borderRadius]}
          onValueChange={(value) => setBorderRadius(value[0])}
          min={0}
          max={50}
          step={1}
          label="Radius"
          valueDisplay={borderRadius}
        />
        <ScaleSlider />
      </div>
    </SectionWrapper>
  );
}
