'use client';

import * as React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CachedImage } from '@/components/ui/cached-image';
import { cn } from '@/lib/utils';
import {
  GRADIENT_PRESETS,
  IMAGE_CATEGORIES,
  PATTERN_PRESETS,
  backgroundCategories,
  getImageBackgroundUrl,
  patternCss,
  resolveCodeBackground,
  type BackgroundSelection,
} from './code-backgrounds';
import type { CodeTheme } from './code-themes';

interface BackgroundPickerProps {
  theme: CodeTheme;
  dark: boolean;
  background: BackgroundSelection;
  onBackgroundChange: (background: BackgroundSelection) => void;
  disabled?: boolean;
}

function Swatch({
  selected,
  onClick,
  title,
  style,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  style: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={cn(
        'size-7 shrink-0 rounded-md border transition-transform hover:scale-105',
        selected ? 'border-transparent ring-2 ring-white/70' : 'border-white/10',
      )}
      style={style}
    />
  );
}

function ImageSwatch({
  path,
  selected,
  onClick,
}: {
  path: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={path}
      aria-label={path}
      className={cn(
        'relative size-7 shrink-0 overflow-hidden rounded-md border',
        selected ? 'border-transparent ring-2 ring-white/70' : 'border-white/10',
      )}
    >
      <CachedImage src={getImageBackgroundUrl(path)} alt="" className="object-cover" />
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-wide text-white/40">
      {children}
    </span>
  );
}

export function BackgroundPicker({
  theme,
  dark,
  background,
  onBackgroundChange,
  disabled,
}: BackgroundPickerProps) {
  const previewCss = React.useMemo(
    () => resolveCodeBackground(background, theme, dark),
    [background, theme, dark],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label="Choose background"
          className="size-6 shrink-0 rounded-md border border-white/15 disabled:opacity-40"
          style={{
            backgroundImage: previewCss.backgroundImage,
            backgroundColor: previewCss.backgroundColor,
            backgroundSize: previewCss.backgroundSize,
            backgroundPosition: previewCss.backgroundPosition,
          }}
        />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="max-h-[420px] w-80 overflow-y-auto border-white/10 bg-[#1f1f1f] p-3 text-white"
      >
        <div className="mb-3">
          <SectionLabel>Theme</SectionLabel>
          <Swatch
            title="Theme gradient"
            selected={background.kind === 'theme'}
            onClick={() => onBackgroundChange({ kind: 'theme', id: '' })}
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`,
            }}
          />
        </div>

        <div className="mb-3">
          <SectionLabel>Gradients</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(GRADIENT_PRESETS).map(([id, css]) => (
              <Swatch
                key={id}
                title={id}
                selected={background.kind === 'gradient' && background.id === id}
                onClick={() => onBackgroundChange({ kind: 'gradient', id })}
                style={{ backgroundImage: css }}
              />
            ))}
          </div>
        </div>

        <div className="mb-3">
          <SectionLabel>Images</SectionLabel>
          {IMAGE_CATEGORIES.map((category) => (
            <div key={category.id} className="mb-2 last:mb-0">
              <span className="mb-1 block text-[10px] text-white/40">{category.label}</span>
              <div className="flex flex-wrap gap-1.5">
                {(backgroundCategories[category.id] ?? []).map((path) => (
                  <ImageSwatch
                    key={path}
                    path={path}
                    selected={background.kind === 'image' && background.id === path}
                    onClick={() => onBackgroundChange({ kind: 'image', id: path })}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <SectionLabel>Patterns</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {PATTERN_PRESETS.map((pattern) => {
              const css = patternCss(pattern.id, dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)');
              return (
                <Swatch
                  key={pattern.id}
                  title={pattern.label}
                  selected={background.kind === 'pattern' && background.id === pattern.id}
                  onClick={() => onBackgroundChange({ kind: 'pattern', id: pattern.id })}
                  style={{
                    backgroundImage: css.backgroundImage,
                    backgroundSize: css.backgroundSize,
                    backgroundColor: dark ? '#111111' : '#f4f4f4',
                  }}
                />
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
