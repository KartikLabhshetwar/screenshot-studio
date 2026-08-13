'use client';

import * as React from 'react';
import { useImageStore } from '@/lib/store';
import { Slider } from '@/components/ui/slider';
import { SectionWrapper } from './SectionWrapper';
import { cn } from '@/lib/utils';

type BrowserStyle = 'safari' | 'safari-dark' | 'chrome' | 'chrome-dark';

const browserStyles: { value: BrowserStyle; label: string; frameType: 'macos-light' | 'macos-dark' | 'windows-light' | 'windows-dark' }[] = [
  { value: 'safari', label: 'Safari', frameType: 'macos-light' },
  { value: 'safari-dark', label: 'Safari Dark', frameType: 'macos-dark' },
  { value: 'chrome', label: 'Chrome', frameType: 'windows-light' },
  { value: 'chrome-dark', label: 'Chrome Dark', frameType: 'windows-dark' },
];

const frameToStyle: Record<string, BrowserStyle> = {
  'macos-light': 'safari',
  'macos-dark': 'safari-dark',
  'windows-light': 'chrome',
  'windows-dark': 'chrome-dark',
};

function BrowserPreview({ style }: { style: BrowserStyle }) {
  const isDark = style === 'safari-dark' || style === 'chrome-dark';
  const isSafari = style === 'safari' || style === 'safari-dark';

  const titleBarBg = isDark
    ? (isSafari ? '#3A3A3C' : '#202124')
    : (isSafari ? '#F6F6F6' : '#DEE1E6');
  const activeBg = isDark ? '#292A2D' : '#FFFFFF';
  const contentBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const outerBg = isDark ? 'rgb(60, 60, 65)' : 'rgb(210, 210, 214)';

  return (
    <div
      className="relative w-full aspect-square rounded-md overflow-hidden"
      style={{ backgroundColor: outerBg }}
    >
      <div
        className="absolute overflow-hidden rounded-[5px]"
        style={{
          top: '19.5%', left: '19.5%', width: '95.5%', height: '95.5%',
          display: 'flex', flexDirection: 'column',
          boxShadow: isDark
            ? '0 2px 8px rgba(0,0,0,0.3), inset 0 0.5px 0 rgba(255,255,255,0.08)'
            : '0 2px 8px rgba(0,0,0,0.18)',
          border: isDark ? '1px solid rgba(255,255,255,0.06)' : undefined,
        }}
      >
        {isSafari ? (
          <>
            <div
              style={{
                background: titleBarBg,
                height: '16%',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                paddingLeft: '8%',
                flexShrink: 0,
              }}
            >
              <div style={{ width: '3.5px', height: '3.5px', borderRadius: '50%', backgroundColor: '#ff5f57' }} />
              <div style={{ width: '3.5px', height: '3.5px', borderRadius: '50%', backgroundColor: '#febc2e' }} />
              <div style={{ width: '3.5px', height: '3.5px', borderRadius: '50%', backgroundColor: '#28c840' }} />
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                background: titleBarBg,
                height: '11%',
                display: 'flex',
                alignItems: 'flex-end',
                flexShrink: 0,
                position: 'relative',
                paddingLeft: '8%',
              }}
            >
              <div style={{ display: 'flex', gap: '2px', position: 'absolute', top: '50%', left: '8%', transform: 'translateY(-50%)' }}>
                <div style={{ width: '3.5px', height: '3.5px', borderRadius: '50%', backgroundColor: '#ff5f57' }} />
                <div style={{ width: '3.5px', height: '3.5px', borderRadius: '50%', backgroundColor: '#febc2e' }} />
                <div style={{ width: '3.5px', height: '3.5px', borderRadius: '50%', backgroundColor: '#28c840' }} />
              </div>
              <div style={{ marginLeft: '25%', height: '70%', width: '35%', background: activeBg, borderRadius: '3px 3px 0 0' }} />
            </div>
            <div style={{ background: activeBg, height: '9%', flexShrink: 0 }} />
          </>
        )}
        <div style={{ background: contentBg, flexGrow: 1 }} />
      </div>
    </div>
  );
}

export function BrowserMockupSection() {
  const { imageBorder, setImageBorder, browserUrl, setBrowserUrl, browserHeaderSize, setBrowserHeaderSize } = useImageStore();

  const currentStyle = frameToStyle[imageBorder.type] || 'chrome-dark';

  const handleStyleChange = (style: BrowserStyle) => {
    const config = browserStyles.find(s => s.value === style);
    if (!config) return;
    setImageBorder({
      enabled: true,
      type: config.frameType,
      title: browserUrl,
    });
  };

  return (
    <>
      <SectionWrapper title="Style" defaultOpen={true}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 p-1">
            {browserStyles.map(({ value, label }) => {
              const isSelected = currentStyle === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleStyleChange(value)}
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
                    <BrowserPreview style={value} />
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
        </div>
      </SectionWrapper>

      <div className="mb-4">
        <label className="block text-xs font-medium text-muted-foreground mb-2">URL</label>
        <input
          type="text"
          value={browserUrl}
          onChange={(e) => setBrowserUrl(e.target.value)}
          placeholder="yourapp.com"
          className="w-full h-9 px-3 text-xs rounded-md bg-foreground/[0.04] border border-foreground/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/25 focus:ring-1 focus:ring-foreground/15 transition-colors"
        />
      </div>

      <Slider
        value={[browserHeaderSize]}
        onValueChange={(value) => setBrowserHeaderSize(value[0])}
        min={50}
        max={200}
        step={5}
        label="Header size"
        valueDisplay={`${browserHeaderSize}%`}
      />
    </>
  );
}
