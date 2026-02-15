'use client';

import * as React from 'react';
import { useImageStore, useEditorStore } from '@/lib/store';
import { ANIMATION_PRESETS, CATEGORY_LABELS } from '@/lib/animation/presets';
import { cn } from '@/lib/utils';
import type { AnimationPreset } from '@/types/animation';
import { Button } from '@/components/ui/button';
import { Delete02Icon, Add01Icon } from 'hugeicons-react';

// Group presets by category
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
    // Calculate start time - add at end of existing clips or at 0
    const lastClipEnd = animationClips.reduce((max, clip) => {
      return Math.max(max, clip.startTime + clip.duration);
    }, 0);

    // Extend timeline if needed
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
      {/* Header with clear button */}
      {hasAnimation && (
        <div className="flex items-center justify-between p-3 bg-brand/10 border border-brand/20 rounded-lg">
          <div>
            <span className="text-xs font-medium text-foreground/80">
              {animationClips.length} animation{animationClips.length > 1 ? 's' : ''} added
            </span>
            <p className="text-[10px] text-foreground/50 mt-0.5">
              Click presets to add more, or drag clips in timeline
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-red-500/70 hover:text-red-500 hover:bg-red-500/10"
            onClick={handleClearAnimation}
          >
            <Delete02Icon size={14} className="mr-1" />
            Clear All
          </Button>
        </div>
      )}

      {/* Preset categories */}
      {Object.entries(PRESET_BY_CATEGORY).map(([category, presets]) => (
        <div key={category} className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category}
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {presets.map((preset) => {
              const isApplied = animationClips.some(c => c.presetId === preset.id);
              return (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset)}
                  className={cn(
                    'relative flex flex-col items-center gap-1.5 p-1.5 rounded-lg transition-all group',
                    'bg-surface-1/60 hover:bg-surface-2/80',
                    'border-2',
                    isApplied
                      ? 'border-brand/50'
                      : 'border-transparent hover:border-border/50'
                  )}
                >
                  {/* Preview container */}
                  <div
                    className="relative w-full aspect-[4/3] rounded-md overflow-hidden"
                    style={getBackgroundStyle()}
                  >
                    {/* Mini preview */}
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
                        <div className="w-3/4 h-3/4 bg-primary/80 rounded" />
                      )}
                    </div>

                    {/* Hover add indicator */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/20 rounded-full p-2">
                        <Add01Icon size={16} className="text-white" />
                      </div>
                    </div>

                    {/* Duration badge */}
                    <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/60 rounded text-[8px] text-white/80">
                      {(preset.duration / 1000).toFixed(1)}s
                    </div>

                    {/* Applied indicator */}
                    {isApplied && (
                      <div className="absolute top-1 left-1 px-1 py-0.5 bg-brand rounded text-[7px] text-brand-foreground font-medium">
                        Added
                      </div>
                    )}
                  </div>

                  {/* Preset name */}
                  <span className="text-[9px] font-medium text-foreground/70 truncate w-full text-center">
                    {preset.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Info text */}
      {!previewImageUrl && (
        <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
          <p className="text-xs text-muted-foreground">
            Upload an image to see animation previews
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="p-3 rounded-lg bg-surface-1/50 border border-border/30 space-y-1">
        <p className="text-xs text-foreground/60">
          Click any preset to add it to the timeline.
          You can add multiple animations and arrange them.
        </p>
        <p className="text-[10px] text-foreground/40">
          Use the timeline at the bottom to resize and reorder clips.
        </p>
      </div>
    </div>
  );
}
