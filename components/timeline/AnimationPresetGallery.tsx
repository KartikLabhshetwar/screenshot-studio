'use client';

import * as React from 'react';
import { useImageStore, useEditorStore } from '@/lib/store';
import { ANIMATION_PRESETS, CATEGORY_LABELS } from '@/lib/animation/presets';
import { cn } from '@/lib/utils';
import type { AnimationPreset } from '@/types/animation';
import { Button } from '@/components/ui/button';
import { Delete02Icon, Add01Icon } from 'hugeicons-react';

const PRESET_BY_CATEGORY = ANIMATION_PRESETS.reduce(
  (acc, preset) => {
    if (!acc[preset.category]) {
      acc[preset.category] = [];
    }
    acc[preset.category].push(preset);
    return acc;
  },
  {} as Record<string, AnimationPreset[]>
);

export function AnimationPresetGallery() {
  const {
    uploadedImageUrl,
    backgroundConfig,
    borderRadius,
    imageShadow,
    timeline,
    animationClips,
    addAnimationClip,
    clearAnimationClips,
    setShowTimeline,
    setTimelineDuration,
  } = useImageStore();

  const { screenshot } = useEditorStore();

  const previewImageUrl = uploadedImageUrl || screenshot?.src || null;

  const handlePresetClick = (preset: AnimationPreset) => {
    const lastClipEnd = animationClips.reduce((max, clip) => {
      return Math.max(max, clip.startTime + clip.duration);
    }, 0);

    const newEndTime = lastClipEnd + preset.duration;
    if (newEndTime > timeline.duration) {
      setTimelineDuration(newEndTime);
    }

    addAnimationClip(preset.id, lastClipEnd);
    setShowTimeline(true);
  };

  const handleClearAnimation = () => {
    clearAnimationClips();
  };

  const getBackgroundStyle = (): React.CSSProperties => {
    const { type, value, opacity = 1 } = backgroundConfig;

    if (type === 'image' && typeof value === 'string') {
      return {
        backgroundImage: `url(${value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity,
      };
    }

    if (type === 'solid') {
      return {
        backgroundColor: value as string,
        opacity,
      };
    }

    return {
      background: value as string,
      opacity,
    };
  };

  const hasAnimation = animationClips.length > 0;

  return (
    <div className="space-y-5">
      {hasAnimation && (
        <div className="flex items-center justify-between p-3 bg-foreground/[0.04] border border-foreground/10 rounded-md">
          <div>
            <span className="text-xs font-medium text-foreground">
              {animationClips.length} animation{animationClips.length > 1 ? 's' : ''} added
            </span>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Click presets to add more, or drag clips in timeline
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleClearAnimation}
          >
            <Delete02Icon size={14} className="mr-1" />
            Clear All
          </Button>
        </div>
      )}

      {Object.entries(PRESET_BY_CATEGORY).map(([category, presets]) => (
        <div key={category} className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category}
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {presets.map((preset) => {
              const isApplied = animationClips.some((c) => c.presetId === preset.id);
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className={cn(
                    'relative flex flex-col items-center gap-1.5 p-1.5 rounded-md transition-all group cursor-pointer',
                    'bg-foreground/[0.04] border',
                    isApplied
                      ? 'border-foreground/30 ring-1 ring-foreground/20'
                      : 'border-foreground/10 hover:border-foreground/20 hover:bg-foreground/[0.06]'
                  )}
                >
                  <div
                    className="relative w-full aspect-[4/3] rounded-md overflow-hidden"
                    style={getBackgroundStyle()}
                  >
                    <div className="absolute inset-0 flex items-center justify-center p-1">
                      {previewImageUrl ? (
                        <div className="w-3/4 h-3/4">
                          <img
                            src={previewImageUrl}
                            alt={preset.name}
                            className="w-full h-full object-contain rounded-sm"
                            style={{
                              borderRadius: `${Math.min(borderRadius, 4)}px`,
                              boxShadow: imageShadow.enabled
                                ? 'rgba(0, 0, 0, 0.3) 1px 1px 4px'
                                : undefined,
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-3/4 h-3/4 bg-foreground/[0.08] rounded-md border border-foreground/10" />
                      )}
                    </div>

                    <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-foreground/[0.12] border border-foreground/15 rounded-md p-2">
                        <Add01Icon size={16} className="text-foreground" />
                      </div>
                    </div>

                    <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-background/80 border border-foreground/10 rounded-md text-[8px] text-muted-foreground">
                      {(preset.duration / 1000).toFixed(1)}s
                    </div>

                    {isApplied ? (
                      <div className="absolute top-1 left-1 px-1 py-0.5 bg-card border border-foreground/20 rounded-md text-[7px] text-foreground font-medium">
                        Added
                      </div>
                    ) : null}
                  </div>

                  <span className="text-[9px] font-medium text-muted-foreground truncate w-full text-center">
                    {preset.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!previewImageUrl && (
        <div className="p-3 rounded-md bg-foreground/[0.04] border border-foreground/10 text-center">
          <p className="text-xs text-muted-foreground">
            Upload an image to see animation previews
          </p>
        </div>
      )}

      <div className="p-3 rounded-md bg-foreground/[0.04] border border-foreground/10 space-y-1">
        <p className="text-xs text-muted-foreground">
          Click any preset to add it to the timeline.
          You can add multiple animations and arrange them.
        </p>
        <p className="text-[10px] text-muted-foreground/70">
          Use the timeline at the bottom to resize and reorder clips.
        </p>
      </div>
    </div>
  );
}
