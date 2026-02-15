'use client';

import * as React from 'react';
import { useImageStore } from '@/lib/store';
import { KeyframeMarker } from './KeyframeMarker';
import { Button } from '@/components/ui/button';
import { ViewIcon, ViewOffIcon, Delete02Icon, SquareLockPasswordIcon, SquareUnlock01Icon } from 'hugeicons-react';
import { cn } from '@/lib/utils';
import type { AnimationTrack, Keyframe } from '@/types/animation';

interface TimelineTrackProps {
  track: AnimationTrack;
  width: number;
  selectedKeyframeId: string | null;
  onSelectKeyframe: (keyframeId: string | null) => void;
}

export function TimelineTrack({
  track,
  width,
  selectedKeyframeId,
  onSelectKeyframe,
}: TimelineTrackProps) {
  const {
    timeline,
    updateTrack,
    removeTrack,
    updateKeyframe,
    removeKeyframe,
    addKeyframe,
    setPlayhead,
  } = useImageStore();

  const { duration } = timeline;
  const trackColor = track.type === 'transform' ? 'border-l-blue-500' : 'border-l-amber-500';

  const handleTrackClick = (e: React.MouseEvent) => {
    // Double-click to add keyframe
    if (e.detail === 2 && !track.isLocked) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const time = Math.round((x / width) * duration);

      // Add keyframe at clicked position
      addKeyframe(track.id, {
        time,
        properties: {},
        easing: 'ease-out',
      });
    } else {
      // Single click to move playhead
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const time = Math.round((x / width) * duration);
      setPlayhead(time);
    }
  };

  const handleKeyframeDrag = (keyframeId: string, newTime: number) => {
    updateKeyframe(track.id, keyframeId, { time: newTime });
  };

  const handleKeyframeDelete = (keyframeId: string) => {
    removeKeyframe(track.id, keyframeId);
    onSelectKeyframe(null);
  };

  return (
    <div className="flex">
      {/* Track label */}
      <div className="w-28 shrink-0 flex items-center gap-1 px-2 py-1 bg-surface-2 border-b border-r border-border/30">
        <span className="text-[10px] font-medium text-foreground/70 truncate flex-1">
          {track.name}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={() => updateTrack(track.id, { isVisible: !track.isVisible })}
        >
          {track.isVisible ? (
            <ViewIcon size={12} className="text-foreground/50" />
          ) : (
            <ViewOffIcon size={12} className="text-foreground/30" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={() => updateTrack(track.id, { isLocked: !track.isLocked })}
        >
          {track.isLocked ? (
            <SquareLockPasswordIcon size={12} className="text-foreground/50" />
          ) : (
            <SquareUnlock01Icon size={12} className="text-foreground/30" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 text-red-500/60 hover:text-red-500"
          onClick={() => removeTrack(track.id)}
        >
          <Delete02Icon size={12} />
        </Button>
      </div>

      {/* Track timeline area */}
      <div
        className={cn(
          'relative h-8 bg-surface-1/50 border-b border-border/30 border-l-2',
          trackColor,
          !track.isVisible && 'opacity-40'
        )}
        style={{ width }}
        onClick={handleTrackClick}
      >
        {/* Keyframes */}
        {track.keyframes.map((keyframe) => {
          const position = (keyframe.time / duration) * width;
          return (
            <KeyframeMarker
              key={keyframe.id}
              keyframe={keyframe}
              position={position}
              isSelected={selectedKeyframeId === keyframe.id}
              trackType={track.type}
              onSelect={() => onSelectKeyframe(keyframe.id)}
              onDrag={(newTime) => handleKeyframeDrag(keyframe.id, newTime)}
              onDelete={() => handleKeyframeDelete(keyframe.id)}
              timelineWidth={width}
              duration={duration}
            />
          );
        })}

        {/* Double-click hint */}
        {track.keyframes.length === 0 && !track.isLocked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[9px] text-foreground/30 italic">
              Double-click to add keyframe
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
