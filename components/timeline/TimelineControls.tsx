'use client';

import * as React from 'react';
import {
  PlayIcon,
  PauseIcon,
  RepeatIcon,
  RepeatOffIcon,
  Add01Icon,
  Cancel01Icon,
  ZoomInAreaIcon,
  Delete02Icon,
} from 'hugeicons-react';
import { useImageStore } from '@/lib/store';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

function formatTimeDisplay(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

interface TimelineControlsProps {
  onAddAnimation?: () => void;
  onClose?: () => void;
}

export function TimelineControls({ onAddAnimation, onClose }: TimelineControlsProps) {
  const {
    timeline,
    togglePlayback,
    setTimeline,
    setTimelineDuration,
    clearAnimationClips,
    animationClips,
  } = useImageStore();

  const { isPlaying, isLooping, playhead, duration } = timeline;

  const handleToggleLoop = () => setTimeline({ isLooping: !isLooping });
  const hasAnimations = animationClips.length > 0;
  const durationSeconds = duration / 1000;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-background border-b border-foreground/10 shrink-0">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onAddAnimation}
          className={cn(
            'inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2.5',
            'bg-foreground/[0.04] border border-foreground/10',
            'text-xs font-medium text-foreground',
            'transition-colors duration-150',
            'hover:bg-foreground/[0.08] hover:border-foreground/15',
            'active:scale-[0.98]'
          )}
        >
          <Add01Icon size={14} className="text-foreground" />
          <span>Add Animation</span>
        </button>

        <button
          type="button"
          className={cn(
            'flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors duration-150',
            isLooping
              ? 'bg-foreground/[0.1] text-foreground border border-foreground/15'
              : 'text-muted-foreground border border-transparent hover:bg-foreground/[0.06] hover:text-foreground'
          )}
          onClick={handleToggleLoop}
          title={isLooping ? 'Loop enabled' : 'Loop disabled'}
        >
          {isLooping ? <RepeatIcon size={15} /> : <RepeatOffIcon size={15} />}
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <button
          type="button"
          className={cn(
            'inline-flex h-8 min-w-[88px] cursor-pointer items-center justify-center rounded-md px-4',
            'bg-primary text-primary-foreground',
            'shadow-sm',
            'transition-all duration-150',
            'hover:bg-foreground/90 active:scale-[0.98]'
          )}
          onClick={togglePlayback}
        >
          {isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
        </button>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex items-center tabular-nums">
          <span className="text-xs font-medium text-foreground">
            {formatTimeDisplay(playhead)}
          </span>
          <span className="text-xs text-muted-foreground ml-1">
            / {formatTimeDisplay(duration)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Slider
            min={1}
            max={30}
            step={1}
            value={[durationSeconds]}
            onValueChange={(v) => setTimelineDuration((v[0] ?? 1) * 1000)}
            className="w-[100px] space-y-0"
            aria-label="Timeline duration"
          />
          <ZoomInAreaIcon size={14} className="text-muted-foreground shrink-0" />
        </div>

        {hasAnimations ? (
          <button
            type="button"
            onClick={clearAnimationClips}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-foreground/[0.06] hover:text-foreground"
            title="Turn off all Animations"
          >
            <Delete02Icon size={15} />
          </button>
        ) : null}

        <div className="h-4 w-px bg-foreground/10" aria-hidden />

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-foreground/[0.06] hover:text-foreground"
          title="Close timeline"
        >
          <Cancel01Icon size={15} />
        </button>
      </div>
    </div>
  );
}
