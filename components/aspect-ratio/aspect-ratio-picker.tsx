'use client';

import * as React from 'react';
import { aspectRatios } from '@/lib/constants/aspect-ratios';
import { useImageStore } from '@/lib/store';
import { getStandardDimensions } from '@/lib/aspect-ratio-utils';
import { cn } from '@/lib/utils';
import {
  InstagramIcon,
  NewTwitterIcon,
  YoutubeIcon,
  PinterestIcon,
  DribbbleIcon,
  AppStoreIcon,
} from 'hugeicons-react';

interface AspectRatioPickerProps {
  onSelect?: () => void;
}

const standardRatioIds = ['16_9', '3_2', '4_3', '5_4', '1_1', '4_5', '3_4', '2_3', '9_16'];

const socialSections = [
  {
    name: 'Instagram',
    icon: InstagramIcon,
    presets: [
      { label: 'Post', ratio: '1:1', id: '1_1' },
      { label: 'Portrait', ratio: '4:5', id: '4_5' },
      { label: 'Story', ratio: '9:16', id: '9_16' },
    ],
  },
  {
    name: 'Twitter',
    icon: NewTwitterIcon,
    presets: [
      { label: 'Tweet', ratio: '16:9', id: '16_9' },
      { label: 'Cover', ratio: '3:1', id: 'twitter_banner' },
    ],
  },
  {
    name: 'YouTube',
    icon: YoutubeIcon,
    presets: [
      { label: 'Banner', ratio: '16:9', id: 'youtube_banner' },
      { label: 'Thumbnail', ratio: '16:9', id: 'youtube_thumbnail' },
      { label: 'Video', ratio: '16:9', id: 'youtube_video' },
    ],
  },
  {
    name: 'Pinterest',
    icon: PinterestIcon,
    presets: [
      { label: 'Long', ratio: '10:21', id: 'pinterest_long' },
      { label: 'Optimal', ratio: '2:3', id: '2_3' },
      { label: 'Square', ratio: '1:1', id: '1_1' },
    ],
  },
  {
    name: 'Dribbble',
    icon: DribbbleIcon,
    presets: [
      { label: 'Shot', ratio: '4:3', id: '4_3' },
    ],
  },
  {
    name: 'App Store',
    icon: AppStoreIcon,
    presets: [
      { label: 'iPhone 6.5"', ratio: '1284:2778', id: 'appstore_iphone65' },
      { label: 'iPhone 5.5"', ratio: '1242:2208', id: 'appstore_iphone55' },
      { label: 'iPad Pro 12.9"', ratio: '2048:2732', id: 'appstore_ipad' },
      { label: 'iPhone 6.5" L', ratio: '2778:1284', id: 'appstore_iphone65_landscape' },
      { label: 'iPhone 5.5" L', ratio: '2208:1242', id: 'appstore_iphone55_landscape' },
      { label: 'iPad Pro L', ratio: '2732:2048', id: 'appstore_ipad_landscape' },
      { label: 'Mac', ratio: '16:10', id: '16_10' },
    ],
  },
];

function getShapeDimensions(widthRatio: number, heightRatio: number, maxSize: number = 36) {
  const ratio = widthRatio / heightRatio;
  let w: number, h: number;
  if (ratio >= 1) {
    w = maxSize;
    h = maxSize / ratio;
  } else {
    h = maxSize;
    w = maxSize * ratio;
  }
  return { w: Math.max(w, 10), h: Math.max(h, 10) };
}

function parseRatio(ratioStr: string) {
  const [w, h] = ratioStr.split(':').map(Number);
  return { w, h };
}

export const AspectRatioPicker = ({ onSelect }: AspectRatioPickerProps = {} as AspectRatioPickerProps) => {
  const { selectedAspectRatio, setAspectRatio, customDimensions, setCustomDimensions } = useImageStore();

  const currentAR = aspectRatios.find((ar) => ar.id === selectedAspectRatio);
  const currentDimensions = selectedAspectRatio === 'custom' && customDimensions
    ? customDimensions
    : currentAR
      ? getStandardDimensions(currentAR.width, currentAR.height)
      : { width: 1920, height: 1080 };

  const [customW, setCustomW] = React.useState(currentDimensions.width.toString());
  const [customH, setCustomH] = React.useState(currentDimensions.height.toString());

  React.useEffect(() => {
    if (selectedAspectRatio === 'custom' && customDimensions) {
      setCustomW(customDimensions.width.toString());
      setCustomH(customDimensions.height.toString());
    } else if (currentAR) {
      const dims = getStandardDimensions(currentAR.width, currentAR.height);
      setCustomW(dims.width.toString());
      setCustomH(dims.height.toString());
    }
  }, [selectedAspectRatio, currentAR, customDimensions]);

  const handleSelect = (id: string) => {
    setAspectRatio(id);
    onSelect?.();
  };

  const isCustomChanged =
    customW !== currentDimensions.width.toString() ||
    customH !== currentDimensions.height.toString();

  const handleSetCustom = () => {
    const w = parseInt(customW);
    const h = parseInt(customH);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return;
    setCustomDimensions(w, h);
    onSelect?.();
  };

  return (
    <div className="p-3 max-h-[70vh] overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1.5 flex-1">
          <label className="text-xs text-muted-foreground font-medium shrink-0">W</label>
          <input
            type="number"
            value={customW}
            onChange={(e) => setCustomW(e.target.value)}
            className="w-full h-8 bg-foreground/[0.04] border border-foreground/10 rounded-md px-2 text-xs text-foreground focus:outline-none focus:border-foreground/25 focus:ring-1 focus:ring-foreground/15 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <span className="text-xs text-muted-foreground">×</span>
        <div className="flex items-center gap-1.5 flex-1">
          <label className="text-xs text-muted-foreground font-medium shrink-0">H</label>
          <input
            type="number"
            value={customH}
            onChange={(e) => setCustomH(e.target.value)}
            className="w-full h-8 bg-foreground/[0.04] border border-foreground/10 rounded-md px-2 text-xs text-foreground focus:outline-none focus:border-foreground/25 focus:ring-1 focus:ring-foreground/15 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <button
          onClick={handleSetCustom}
          disabled={!isCustomChanged}
          className={cn(
            'h-8 px-3 rounded-md text-xs font-medium transition-colors shrink-0',
            isCustomChanged
              ? 'bg-primary text-primary-foreground hover:bg-foreground/90'
              : 'bg-foreground/[0.04] text-muted-foreground border border-foreground/10 cursor-not-allowed'
          )}
        >
          Set
        </button>
      </div>

      <div className="mb-3">
        <h4 className="text-xs font-medium text-muted-foreground mb-2">Standard</h4>
        <div className="grid grid-cols-3 gap-2">
          {standardRatioIds.map((id) => {
            const ar = aspectRatios.find((a) => a.id === id);
            if (!ar) return null;
            const isSelected = selectedAspectRatio === id;
            const { w, h } = getShapeDimensions(ar.width, ar.height);
            return (
              <button
                key={id}
                onClick={() => handleSelect(id)}
                className={cn(
                  'flex flex-col items-center justify-between rounded-md p-2 cursor-pointer transition-all border',
                  isSelected
                    ? 'bg-foreground/[0.08] border-foreground/30 ring-1 ring-foreground/20'
                    : 'border-transparent hover:bg-foreground/[0.04] hover:border-foreground/10'
                )}
              >
                <div className="flex items-center justify-center h-[40px]">
                  <div
                    className={cn(
                      'rounded-sm border transition-colors',
                      isSelected ? 'border-foreground/50 bg-foreground/[0.06]' : 'border-foreground/20'
                    )}
                    style={{ width: `${w}px`, height: `${h}px` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground mt-1">
                  {ar.width}:{ar.height}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {socialSections.map((section) => {
        const Icon = section.icon;
        return (
          <div key={section.name} className="mb-3">
            <div className="h-px bg-foreground/10 mb-3" />
            <div className="flex items-center gap-1.5 mb-2">
              <Icon size={14} className="text-muted-foreground" />
              <h4 className="text-xs font-medium text-muted-foreground">{section.name}</h4>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {section.presets.map((preset) => {
                const isSelected = selectedAspectRatio === preset.id;
                const { w: rW, h: rH } = parseRatio(preset.ratio);
                const { w, h } = getShapeDimensions(rW, rH);
                const iconSize = Math.min(w, h) * 0.45;
                return (
                  <button
                    key={`${section.name}-${preset.label}`}
                    onClick={() => handleSelect(preset.id)}
                    className={cn(
                      'flex flex-col items-center justify-between rounded-md p-2 cursor-pointer transition-all border',
                      isSelected
                        ? 'bg-foreground/[0.08] border-foreground/30 ring-1 ring-foreground/20'
                        : 'border-transparent hover:bg-foreground/[0.04] hover:border-foreground/10'
                    )}
                  >
                    <div className="flex items-center justify-center h-[40px]">
                      <div
                        className={cn(
                          'rounded-sm border transition-colors flex items-center justify-center',
                          isSelected ? 'border-foreground/50 bg-foreground/[0.06]' : 'border-foreground/20'
                        )}
                        style={{ width: `${w}px`, height: `${h}px` }}
                      >
                        {iconSize >= 8 && (
                          <Icon
                            size={iconSize}
                            className={cn(
                              'transition-colors',
                              isSelected ? 'text-foreground' : 'text-muted-foreground/40'
                            )}
                          />
                        )}
                      </div>
                    </div>
                    <div className="text-center mt-1">
                      <span className="text-[10px] text-muted-foreground block leading-tight">
                        {preset.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60 block leading-tight">
                        {preset.ratio}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
