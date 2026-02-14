'use client';

import * as React from 'react';
import { useImageStore } from '@/lib/store';
import { Slider } from '@/components/ui/slider';
import { SectionWrapper } from './SectionWrapper';

export function ShadowSection() {
  const { imageShadow, setImageShadow } = useImageStore();

  const getColorHex = () => {
    const rgbMatch = imageShadow.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
    }
    if (imageShadow.color.startsWith('#')) return imageShadow.color;
    return '#000000';
  };

  const handleColorChange = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const alphaMatch = imageShadow.color.match(/rgba\([^)]+,\s*([\d.]+)\)/);
    const currentAlpha = alphaMatch ? alphaMatch[1] : '0.3';
    setImageShadow({ color: `rgba(${r}, ${g}, ${b}, ${currentAlpha})`, enabled: true });
  };

  const shadowIntensity = imageShadow.blur;

  return (
    <SectionWrapper title="Shadow" defaultOpen={true}>
      {/* Shadow Spread */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-text-secondary w-14 shrink-0">Spread</span>
        <Slider
          value={[shadowIntensity]}
          onValueChange={(value) => {
            const blur = value[0];
            setImageShadow({
              enabled: blur > 0,
              blur,
              offsetY: Math.round(blur * 0.3),
              spread: Math.round(blur * 0.1),
            });
          }}
          min={0}
          max={100}
          step={1}
          className="flex-1"
        />
        <span className="text-sm text-text-tertiary w-10 text-right tabular-nums">{shadowIntensity}</span>
      </div>

      {/* Shadow Color */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-text-secondary w-14 shrink-0">Color</span>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={getColorHex()}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-9 h-9 rounded-lg border border-border/60 cursor-pointer bg-transparent"
          />
          <span className="text-sm text-text-tertiary font-mono">{getColorHex()}</span>
        </div>
      </div>
    </SectionWrapper>
  );
}
