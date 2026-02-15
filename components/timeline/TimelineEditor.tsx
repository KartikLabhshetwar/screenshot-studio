'use client';

import * as React from 'react';
import { useImageStore } from '@/lib/store';
import { TimelineControls } from './TimelineControls';
import { useTimelinePlayback } from './hooks/useTimelinePlayback';
import { cn } from '@/lib/utils';
import { ANIMATION_PRESETS } from '@/lib/animation/presets';
import { Delete02Icon, ViewIcon, VideoReplayIcon, Image01Icon, Cancel01Icon, Add01Icon } from 'hugeicons-react';
import type { AnimationClip } from '@/types/animation';

const TIMELINE_HEIGHT = 180;
const TRACK_LABEL_WIDTH = 100;
const PIXELS_PER_SECOND = 125;

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  return `0:${seconds.toString().padStart(2, '0')}`;
}

// Time ruler component - clickable to seek
function TimeRuler({ duration, width }: { duration: number; width: number }) {
  const { setPlayhead, stopPlayback } = useImageStore();
  const durationSeconds = Math.ceil(duration / 1000);
  const ticks: { time: number; label: string }[] = [];

  for (let i = 0; i <= durationSeconds; i++) {
    ticks.push({ time: i * 1000, label: formatTime(i * 1000) });
  }

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / width));
    stopPlayback();
    setPlayhead(percentage * duration);
  };

  return (
    <div
      className="relative h-6 bg-[#1a1a1a] border-b border-white/10 cursor-pointer hover:bg-[#222]"
      style={{ width }}
      onClick={handleClick}
    >
      {ticks.map(({ time, label }) => {
        const left = (time / duration) * width;
        return (
          <div
            key={time}
            className="absolute top-0 flex flex-col items-center pointer-events-none"
            style={{ left }}
          >
            <span className="text-[10px] text-white/50 font-mono mt-0.5">{label}</span>
            <div className="w-px h-2 bg-white/30 mt-0.5" />
          </div>
        );
      })}
    </div>
  );
}

// Playhead component - simple vertical red line
function Playhead({ position, height }: { position: number; height: number }) {
  const { setPlayhead, timeline, stopPlayback } = useImageStore();
  const [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const track = document.querySelector('.timeline-track-area');
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      stopPlayback();
      setPlayhead(percentage * timeline.duration);
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, setPlayhead, timeline.duration, stopPlayback]);

  return (
    <div
      className="absolute top-0 z-30 cursor-ew-resize pointer-events-auto"
      style={{ left: position, height: height + 24, transform: 'translateX(-50%)' }}
      onMouseDown={() => setIsDragging(true)}
    >
      {/* Wider clickable area (12px) containing the visible 2px red line */}
      <div className="w-3 h-full flex items-center justify-center hover:bg-red-500/10 transition-colors">
        <div className="w-[2px] h-full bg-red-500" />
      </div>
    </div>
  );
}

// Resizable animation clip
function ResizableAnimationClip({
  clip,
  timelineWidth,
  duration,
  isSelected,
  onSelect,
}: {
  clip: AnimationClip;
  timelineWidth: number;
  duration: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { updateAnimationClip, removeAnimationClip } = useImageStore();
  const [isDragging, setIsDragging] = React.useState<'move' | 'left' | 'right' | null>(null);
  const dragStartRef = React.useRef({ x: 0, startTime: 0, clipDuration: 0 });

  const leftPercent = (clip.startTime / duration) * 100;
  const widthPercent = (clip.duration / duration) * 100;

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaTime = (deltaX / timelineWidth) * duration;

      if (isDragging === 'move') {
        const newStart = Math.max(0, Math.min(duration - clip.duration, dragStartRef.current.startTime + deltaTime));
        updateAnimationClip(clip.id, { startTime: newStart });
      } else if (isDragging === 'left') {
        const newStart = Math.max(0, Math.min(clip.startTime + clip.duration - 200, dragStartRef.current.startTime + deltaTime));
        const newDuration = dragStartRef.current.clipDuration - (newStart - dragStartRef.current.startTime);
        updateAnimationClip(clip.id, { startTime: newStart, duration: Math.max(200, newDuration) });
      } else if (isDragging === 'right') {
        const newDuration = Math.max(200, Math.min(duration - clip.startTime, dragStartRef.current.clipDuration + deltaTime));
        updateAnimationClip(clip.id, { duration: newDuration });
      }
    };

    const handleMouseUp = () => setIsDragging(null);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, clip, duration, timelineWidth, updateAnimationClip]);

  const startDrag = (type: 'move' | 'left' | 'right', e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(type);
    dragStartRef.current = { x: e.clientX, startTime: clip.startTime, clipDuration: clip.duration };
  };

  return (
    <div
      className={cn(
        'absolute top-1 bottom-1 rounded cursor-grab transition-shadow',
        'bg-gradient-to-r from-brand/90 to-emerald-500/90',
        isSelected ? 'ring-2 ring-white shadow-lg' : 'hover:ring-1 hover:ring-white/50'
      )}
      style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
      onMouseDown={(e) => startDrag('move', e)}
    >
      {/* Left resize handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/20 rounded-l"
        onMouseDown={(e) => startDrag('left', e)}
      />

      {/* Right resize handle */}
      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/20 rounded-r"
        onMouseDown={(e) => startDrag('right', e)}
      />

      {/* Content */}
      <div className="flex items-center gap-1.5 px-3 h-full overflow-hidden pointer-events-none">
        <VideoReplayIcon size={14} className="text-white/80 shrink-0" />
        <span className="text-[11px] text-white font-medium truncate">{clip.name}</span>
      </div>

      {/* Delete button - visible when selected, positioned inside the clip */}
      {isSelected && (
        <button
          className="absolute top-1 right-1 w-5 h-5 bg-red-500/90 rounded flex items-center justify-center hover:bg-red-600 shadow-lg z-10 pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation();
            removeAnimationClip(clip.id);
          }}
        >
          <Delete02Icon size={12} className="text-white" />
        </button>
      )}
    </div>
  );
}

// Media track with slides
function MediaTrack({ width }: { width: number }) {
  const { slides, uploadedImageUrl, imageName, timeline, removeSlide, setActiveSlide, activeSlideId, setPlayhead, stopPlayback } = useImageStore();
  const durationSeconds = timeline.duration / 1000;

  const mediaItems = slides.length > 0 ? slides : uploadedImageUrl ? [{
    id: 'main',
    src: uploadedImageUrl,
    name: imageName || 'Image',
    duration: durationSeconds, // Already in seconds for display
  }] : [];

  // For visual display, each media item gets equal portion of the timeline
  // Individual slide durations are used for video export, not visual display
  const itemDurationMs = timeline.duration / Math.max(1, mediaItems.length);

  return (
    <div className="flex h-14 border-b border-white/10">
      <div
        className="shrink-0 flex items-center gap-2 px-3 bg-[#1e1e1e] border-r border-white/10"
        style={{ width: TRACK_LABEL_WIDTH }}
      >
        <Image01Icon size={14} className="text-white/60" />
        <span className="text-[10px] text-white/70 font-medium">Media</span>
      </div>

      <div
        className="relative flex-1 bg-[#252525] timeline-track-area overflow-hidden"
        style={{ width: width - TRACK_LABEL_WIDTH }}
      >
        <div className="absolute inset-1 flex gap-0.5 rounded overflow-hidden">
          {mediaItems.map((item, index) => {
            // Each item gets equal width in the timeline
            const itemWidthPercent = 100 / mediaItems.length;
            const itemDurationSeconds = itemDurationMs / 1000;
            return (
              <div
                key={item.id}
                className={cn(
                  'relative h-full bg-cover bg-center border border-white/20 rounded cursor-pointer transition-all',
                  activeSlideId === item.id && 'ring-2 ring-brand'
                )}
                style={{
                  width: `${itemWidthPercent}%`,
                  backgroundImage: `url(${item.src})`,
                }}
                onClick={() => item.id !== 'main' && setActiveSlide(item.id)}
              >
                {/* Remove button */}
                {slides.length > 1 && item.id !== 'main' && (
                  <button
                    className="absolute -top-1 -right-1 w-4 h-4 bg-black/80 rounded-full flex items-center justify-center hover:bg-red-500 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSlide(item.id);
                    }}
                  >
                    <Cancel01Icon size={10} className="text-white" />
                  </button>
                )}

                {/* Info overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="flex items-center gap-1 p-1.5 text-white/80">
                    <ViewIcon size={10} />
                    <span className="text-[8px]">{itemDurationSeconds.toFixed(1)}s</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Slide count label */}
        <div className="absolute top-1 right-2 px-1.5 py-0.5 bg-black/50 rounded text-[9px] text-white/70">
          {mediaItems.length > 1 ? `${mediaItems.length} slides` : imageName || 'Image'} · {durationSeconds.toFixed(1)}s
        </div>
      </div>
    </div>
  );
}

// Animation track with add button on hover
function AnimationTrack({ width, onAddAnimation }: { width: number; onAddAnimation?: () => void }) {
  const { timeline, animationClips } = useImageStore();
  const [selectedClipId, setSelectedClipId] = React.useState<string | null>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div className="flex h-10 border-b border-white/10">
      <div
        className="shrink-0 flex items-center gap-2 px-3 bg-[#1e1e1e] border-r border-white/10"
        style={{ width: TRACK_LABEL_WIDTH }}
      >
        <VideoReplayIcon size={14} className="text-brand" />
        <span className="text-[10px] text-white/70 font-medium">Animation</span>
      </div>

      <div
        className="relative flex-1 bg-[#1a1a1a] timeline-track-area"
        style={{ width: width - TRACK_LABEL_WIDTH }}
        onClick={() => setSelectedClipId(null)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {animationClips.map((clip) => (
          <ResizableAnimationClip
            key={clip.id}
            clip={clip}
            timelineWidth={width - TRACK_LABEL_WIDTH}
            duration={timeline.duration}
            isSelected={selectedClipId === clip.id}
            onSelect={() => setSelectedClipId(clip.id)}
          />
        ))}

        {/* Add animation button - shows on hover when no clips or when hovering empty space */}
        {animationClips.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            {isHovered ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddAnimation?.();
                }}
                className="flex items-center justify-center w-12 h-7 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Add01Icon size={18} className="text-white/70" />
              </button>
            ) : (
              <span className="text-[10px] text-white/30 italic">
                Hover here to add Animation
              </span>
            )}
          </div>
        ) : (
          /* Show add button at the end of clips when hovering */
          isHovered && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddAnimation?.();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-6 rounded bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Add01Icon size={14} className="text-white/60" />
            </button>
          )
        )}
      </div>
    </div>
  );
}

export function TimelineEditor() {
  const { timeline, uploadedImageUrl, slides, showTimeline, setActiveRightPanelTab } = useImageStore();
  const [timelineWidth, setTimelineWidth] = React.useState(800);

  useTimelinePlayback();

  React.useEffect(() => {
    const durationSeconds = timeline.duration / 1000;
    setTimelineWidth(Math.max(600, durationSeconds * PIXELS_PER_SECOND + TRACK_LABEL_WIDTH));
  }, [timeline.duration]);

  if (!showTimeline || (!uploadedImageUrl && slides.length === 0)) {
    return null;
  }

  const trackContentWidth = timelineWidth - TRACK_LABEL_WIDTH;
  const playheadPosition = (timeline.playhead / timeline.duration) * trackContentWidth + TRACK_LABEL_WIDTH;
  const trackHeight = 64 + 40; // media + animation

  const handleAddAnimation = () => {
    // Switch to the Animate tab in the right panel
    setActiveRightPanelTab('animate');
  };

  return (
    <div className="bg-[#141414] border-t border-white/10 flex flex-col" style={{ height: TIMELINE_HEIGHT }}>
      <TimelineControls />

      <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
        <div style={{ width: timelineWidth }}>
          {/* Time ruler */}
          <div className="flex">
            <div className="shrink-0 bg-[#1e1e1e] border-r border-white/10" style={{ width: TRACK_LABEL_WIDTH }} />
            <TimeRuler duration={timeline.duration} width={trackContentWidth} />
          </div>

          {/* Tracks with playhead */}
          <div className="relative">
            <MediaTrack width={timelineWidth} />
            <AnimationTrack width={timelineWidth} onAddAnimation={handleAddAnimation} />
            <Playhead position={playheadPosition} height={trackHeight} />
          </div>
        </div>
      </div>
    </div>
  );
}
