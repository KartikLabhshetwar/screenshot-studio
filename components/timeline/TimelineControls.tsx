'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  PlayIcon,
  PauseIcon,
  RepeatIcon,
  RepeatOffIcon,
  NextIcon,
  PreviousIcon,
} from 'hugeicons-react';
import { useImageStore } from '@/lib/store';
import { cn } from '@/lib/utils';

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${seconds}.${centiseconds.toString().padStart(2, '0')}`;
}

export function TimelineControls() {
  const {
    timeline,
    togglePlayback,
    setPlayhead,
    setTimeline,
    setTimelineDuration,
  } = useImageStore();

  const { isPlaying, isLooping, playhead, duration } = timeline;

  const handleSkipToStart = () => {
    setPlayhead(0);
  };

  const handleSkipToEnd = () => {
    setPlayhead(duration);
  };

  const handleToggleLoop = () => {
    setTimeline({ isLooping: !isLooping });
  };

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-[#1e1e1e] border-b border-white/10">
      {/* Playback controls */}
      <div className="flex items-center gap-1">
        <button
          className="h-7 w-7 flex items-center justify-center rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          onClick={handleSkipToStart}
        >
          <PreviousIcon size={14} />
        </button>

        <button
          className={cn(
            'h-9 w-9 flex items-center justify-center rounded-full transition-all',
            isPlaying
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white/10 text-white hover:bg-white/20'
          )}
          onClick={togglePlayback}
        >
          {isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
        </button>

        <button
          className="h-7 w-7 flex items-center justify-center rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          onClick={handleSkipToEnd}
        >
          <NextIcon size={14} />
        </button>
      </div>

      {/* Time display */}
      <div className="flex items-center gap-1.5 min-w-[100px] px-3 py-1.5 bg-black/30 rounded">
        <span className="text-xs font-mono text-white/90">
          {formatTime(playhead)}
        </span>
        <span className="text-xs text-white/30">/</span>
        <span className="text-xs font-mono text-white/50">
          {formatTime(duration)}
        </span>
      </div>

      {/* Duration control */}
      <div className="flex items-center gap-3 flex-1 max-w-[250px]">
        <span className="text-[10px] text-white/40 uppercase tracking-wider font-medium">
          Duration
        </span>
        <Slider
          value={[duration / 1000]}
          min={1}
          max={30}
          step={1}
          onValueChange={([val]) => setTimelineDuration(val * 1000)}
          className="flex-1 [&_[role=slider]]:bg-white [&_[role=slider]]:border-0 [&_.relative]:bg-white/20 [&_[data-orientation=horizontal]>.bg-primary]:bg-brand"
        />
        <span className="text-xs font-mono text-white/60 min-w-[28px] text-right">
          {Math.floor(duration / 1000)}s
        </span>
      </div>

      {/* Loop toggle */}
      <button
        className={cn(
          'h-7 w-7 flex items-center justify-center rounded transition-colors',
          isLooping
            ? 'bg-brand/20 text-brand'
            : 'hover:bg-white/10 text-white/40 hover:text-white/60'
        )}
        onClick={handleToggleLoop}
        title={isLooping ? 'Loop enabled' : 'Loop disabled'}
      >
        {isLooping ? <RepeatIcon size={14} /> : <RepeatOffIcon size={14} />}
      </button>
    </div>
  );
}
