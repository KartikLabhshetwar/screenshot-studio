'use client';

import * as React from 'react';
import { useImageStore } from '@/lib/store';
import { TimelineControls } from './TimelineControls';
import { useTimelinePlayback } from './hooks/useTimelinePlayback';
import { cn } from '@/lib/utils';
import { VideoReplayIcon, Image01Icon, Cancel01Icon, Add01Icon } from 'hugeicons-react';
import type { AnimationClip } from '@/types/animation';

const TIMELINE_HEIGHT = 210;
const TRACK_LABEL_WIDTH = 120;
const PIXELS_PER_SECOND = 105;

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  return `0:${seconds.toString().padStart(2, '0')}`;
}

/* ─── Time Track ─────────────────────────────────────────────── */
function TimeTrack({ duration, width }: { duration: number; width: number }) {
  const { setPlayhead, stopPlayback } = useImageStore();
  const durationSeconds = Math.ceil(duration / 1000);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / width));
    stopPlayback();
    setPlayhead(percentage * duration);
  };

  return (
    <div
      className="relative h-6 cursor-pointer select-none"
      style={{ width }}
      onClick={handleClick}
    >
      {Array.from({ length: durationSeconds + 1 }, (_, i) => {
        const leftPercent = (i / durationSeconds) * 100;
        const tickWidth = 100 / durationSeconds;
        return (
          <div
            key={i}
            className="absolute top-0 h-full"
            style={{ left: `${leftPercent}%`, width: `${tickWidth}%` }}
          >
            <div className="flex flex-col items-start h-full">
              <span className="text-[9px] text-muted-foreground/60 font-mono leading-none ml-1 mt-1">
                {formatTime(i * 1000)}
              </span>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/30 ml-[1px] mt-auto mb-1" />
            </div>

            {i < durationSeconds && (
              <div
                className="absolute bottom-1 w-1 h-1 rounded-full bg-muted-foreground/15"
                style={{ left: '50%' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Playhead Ticker ────────────────────────────────────────── */
function PlayheadTicker({ position, height, timeLabel }: { position: number; height: number; timeLabel: string }) {
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
      style={{ left: position, height, transform: 'translateX(-50%)' }}
      onMouseDown={() => setIsDragging(true)}
    >
      <div className="relative flex flex-col items-center h-full">
        <div className="flex min-w-[32px] shrink-0 items-center justify-center rounded-md bg-primary px-1.5 py-0.5 text-primary-foreground shadow-md">
          <span className="text-[9px] font-semibold tabular-nums leading-none">{timeLabel}</span>
        </div>
        <div className="w-px flex-1 bg-primary" />
      </div>
    </div>
  );
}

/* ─── Resizable Animation Clip ───────────────────────────────── */
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
  const updateAnimationClip = useImageStore((s) => s.updateAnimationClip);
  const removeAnimationClip = useImageStore((s) => s.removeAnimationClip);
  const [isDragging, setIsDragging] = React.useState<'move' | 'left' | 'right' | null>(null);
  const [preview, setPreview] = React.useState<{
    startTime: number;
    duration: number;
  } | null>(null);
  const dragStartRef = React.useRef({ x: 0, startTime: 0, clipDuration: 0 });
  const dragModeRef = React.useRef<'move' | 'left' | 'right' | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const pendingRef = React.useRef<{ startTime: number; duration: number } | null>(null);

  const displayStart = preview?.startTime ?? clip.startTime;
  const displayDuration = preview?.duration ?? clip.duration;
  const leftPercent = (displayStart / duration) * 100;
  const widthPercent = (displayDuration / duration) * 100;

  const commitPreview = React.useCallback(
    (next: { startTime: number; duration: number }) => {
      pendingRef.current = next;
      setPreview(next);
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const pending = pendingRef.current;
        if (!pending) return;
        updateAnimationClip(clip.id, {
          startTime: pending.startTime,
          duration: pending.duration,
        });
      });
    },
    [clip.id, updateAnimationClip]
  );

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const mode = dragModeRef.current;
      if (!mode) return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaTime = (deltaX / timelineWidth) * duration;
      const { startTime, clipDuration } = dragStartRef.current;

      if (mode === 'move') {
        const newStart = Math.max(
          0,
          Math.min(duration - clipDuration, startTime + deltaTime)
        );
        commitPreview({ startTime: newStart, duration: clipDuration });
      } else if (mode === 'left') {
        const newStart = Math.max(
          0,
          Math.min(startTime + clipDuration - 200, startTime + deltaTime)
        );
        const newDuration = Math.max(200, clipDuration - (newStart - startTime));
        commitPreview({ startTime: newStart, duration: newDuration });
      } else {
        const newDuration = Math.max(
          200,
          Math.min(duration - startTime, clipDuration + deltaTime)
        );
        commitPreview({ startTime, duration: newDuration });
      }
    };

    const handleMouseUp = () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      const pending = pendingRef.current;
      if (pending) {
        updateAnimationClip(clip.id, {
          startTime: pending.startTime,
          duration: pending.duration,
        });
      }
      pendingRef.current = null;
      dragModeRef.current = null;
      setPreview(null);
      setIsDragging(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isDragging, timelineWidth, duration, clip.id, commitPreview, updateAnimationClip]);

  const startDrag = (type: 'move' | 'left' | 'right', e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    dragModeRef.current = type;
    dragStartRef.current = {
      x: e.clientX,
      startTime: clip.startTime,
      clipDuration: clip.duration,
    };
    setPreview({ startTime: clip.startTime, duration: clip.duration });
    setIsDragging(type);
  };

  return (
    <div
      className={cn(
        'absolute top-1 bottom-1 rounded-md cursor-grab group',
        'bg-foreground/[0.06] border border-foreground/10',
        isDragging ? 'cursor-grabbing z-10' : 'transition-shadow',
        isSelected
          ? 'ring-1 ring-foreground/40 shadow-md bg-foreground/[0.1]'
          : !isDragging && 'hover:bg-foreground/[0.08] hover:border-foreground/15'
      )}
      style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
      onMouseDown={(e) => startDrag('move', e)}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize rounded-l-md hover:bg-foreground/10"
        onMouseDown={(e) => startDrag('left', e)}
      />

      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize rounded-r-md hover:bg-foreground/10"
        onMouseDown={(e) => startDrag('right', e)}
      />

      <div className="flex h-full items-center gap-1.5 overflow-hidden px-3 pointer-events-none">
        <VideoReplayIcon size={12} className="shrink-0 text-foreground" />
        <span className="truncate text-[10px] font-medium text-foreground">{clip.name}</span>
      </div>

      <button
        type="button"
        className="absolute -top-1.5 -right-1.5 z-10 flex h-4 w-4 cursor-pointer items-center justify-center rounded-md bg-card border border-foreground/10 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-destructive hover:border-destructive pointer-events-auto"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          removeAnimationClip(clip.id);
        }}
      >
        <Cancel01Icon size={8} className="text-foreground" />
      </button>
    </div>
  );
}

/* ─── Animation Track ────────────────────────────────────────── */
function AnimationTrack({ width, onAddAnimation }: { width: number; onAddAnimation?: () => void }) {
  const { timeline, animationClips } = useImageStore();
  const [selectedClipId, setSelectedClipId] = React.useState<string | null>(null);
  const trackWidth = width - TRACK_LABEL_WIDTH;

  return (
    <div className="flex h-12 shrink-0">
      <div
        className="shrink-0 flex items-center gap-2.5 px-3 border-r border-foreground/10"
        style={{ width: TRACK_LABEL_WIDTH }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 text-muted-foreground shrink-0">
          <g fill="currentColor">
            <path d="M7.905 20.573a.616.616 0 0 1-1.23 0 .614.614 0 0 1 1.23 0m-.931-1.683a.617.617 0 0 1-.616.615.61.61 0 0 1-.611-.615c0-.335.269-.615.611-.615.335 0 .616.28.616.615m-.94-1.691a.61.61 0 0 1-.615.615.616.616 0 0 1-.612-.615c0-.335.281-.615.612-.615.342 0 .615.28.615.615m-.936-1.675a.62.62 0 0 1-.615.615.615.615 0 0 1 0-1.23c.334 0 .615.28.615.615m-.932-1.691a.62.62 0 0 1-.612.615.616.616 0 0 1-.615-.615c0-.335.273-.615.615-.615a.62.62 0 0 1 .612.615m-.94-1.683a.615.615 0 0 1-.611.615A.62.62 0 0 1 2 12.15c0-.335.28-.615.615-.615.339 0 .611.28.611.615m.94-1.683a.62.62 0 0 1-.612.615.616.616 0 0 1-.615-.615c0-.335.273-.615.615-.615a.62.62 0 0 1 .612.615m.932-1.691a.62.62 0 0 1-.615.615.615.615 0 0 1 0-1.23c.334 0 .615.28.615.615m.936-1.675a.616.616 0 0 1-.615.615.62.62 0 0 1-.612-.615c0-.343.281-.615.612-.615.342 0 .615.272.615.615m.94-1.691a.62.62 0 0 1-.615.615.613.613 0 0 1-.612-.615c0-.343.269-.615.612-.615.334 0 .615.272.615.615m.931-1.683a.614.614 0 1 1-1.232-.004.614.614 0 0 1 1.232.004" />
            <path d="M12.612 3.323l-4.89 8.489a.7.7 0 0 0-.109.338c0 .086.031.194.113.338l4.886 8.49c-.217.228-.437.326-.714.326-.465 0-.763-.265-1.156-.93l-4.135-7.168c-.228-.404-.341-.719-.341-1.056s.106-.652.337-1.056l4.139-7.169c.393-.664.691-.925 1.156-.925.276 0 .496.096.714.323" />
            <path d="M16.376 21.304c.457 0 .755-.265 1.148-.93l4.135-7.168c.231-.404.341-.719.341-1.056s-.11-.652-.341-1.056l-4.135-7.169C17.131 3.261 16.833 3 16.376 3c-.462 0-.764.261-1.153.925l-4.139 7.169c-.231.404-.34.719-.34 1.056s.113.652.344 1.056l4.135 7.168c.389.665.691.93 1.153.93m-.138-1.794-4.027-7.022c-.082-.144-.117-.237-.117-.338s.031-.194.109-.338l4.035-7.022a.149.149 0 0 1 .267 0l4.031 7.022c.082.144.117.237.117.338s-.035.194-.117.338l-4.031 7.022c-.061.114-.206.114-.267 0" />
          </g>
        </svg>
        <span className="text-[11px] text-muted-foreground font-medium">Animations</span>
      </div>

      <div
        className="group/anim-track relative shrink-0 timeline-track-area"
        style={{ width: trackWidth }}
        onClick={() => setSelectedClipId(null)}
      >
        {animationClips.map((clip) => (
          <ResizableAnimationClip
            key={clip.id}
            clip={clip}
            timelineWidth={trackWidth}
            duration={timeline.duration}
            isSelected={selectedClipId === clip.id}
            onSelect={() => setSelectedClipId(clip.id)}
          />
        ))}

        {animationClips.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddAnimation?.();
              }}
              className={cn(
                'inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-2.5',
                'text-xs font-medium text-muted-foreground',
                'transition-colors duration-150',
                'hover:bg-foreground/[0.06] hover:text-foreground',
                'active:scale-[0.98]'
              )}
            >
              <Add01Icon size={13} />
              <span>Add animation</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddAnimation?.();
            }}
            title="Add animation"
            className={cn(
              'absolute right-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md',
              'border border-foreground/10 bg-card text-muted-foreground',
              'opacity-0 transition-all duration-150',
              'hover:bg-foreground/[0.08] hover:text-foreground',
              'group-hover/anim-track:opacity-100 focus-visible:opacity-100'
            )}
          >
            <Add01Icon size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Video / Media Track ────────────────────────────────────── */
function VideoTrack({ width }: { width: number }) {
  const { slides, uploadedImageUrl, imageName, timeline, removeSlide, setActiveSlide, activeSlideId } = useImageStore();
  const durationSeconds = timeline.duration / 1000;
  const trackWidth = width - TRACK_LABEL_WIDTH;

  const mediaItems = slides.length > 0 ? slides : uploadedImageUrl ? [{
    id: 'main',
    src: uploadedImageUrl,
    name: imageName || 'Image',
    duration: durationSeconds,
  }] : [];

  return (
    <div className="flex h-14 shrink-0">
      <div
        className="shrink-0 flex items-center gap-2.5 px-3 border-r border-foreground/10"
        style={{ width: TRACK_LABEL_WIDTH }}
      >
        {mediaItems.length > 0 && mediaItems[0].src ? (
          <div className="w-5 h-5 rounded overflow-hidden shrink-0 border border-foreground/10">
            <img src={mediaItems[0].src} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <Image01Icon size={16} className="text-muted-foreground shrink-0" />
        )}
        <span className="text-[11px] text-muted-foreground font-medium truncate">
          {imageName || 'Screenshot'}
        </span>
      </div>

      <div
        className="relative shrink-0 overflow-hidden"
        style={{ width: trackWidth }}
      >
        <div className="absolute inset-0 flex">
          {mediaItems.map((item) => {
            const itemWidthPercent = 100 / mediaItems.length;
            return (
              <div
                key={item.id}
                className={cn(
                  'relative h-full border-r border-foreground/5 cursor-pointer transition-all group/clip',
                  activeSlideId === item.id && slides.length > 1 && 'ring-1 ring-inset ring-foreground/30'
                )}
                style={{ width: `${itemWidthPercent}%` }}
                onClick={() => item.id !== 'main' && setActiveSlide(item.id)}
              >
                <div className="absolute inset-1 overflow-hidden rounded-md border border-foreground/10 bg-foreground/[0.04]">
                  <div className="flex h-full items-center gap-2 px-2">
                    <div className="h-8 w-8 shrink-0 overflow-hidden rounded border border-foreground/10">
                      <img src={item.src} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-[10px] font-medium text-foreground/80">
                        {slides.length > 1 ? `Slide ${mediaItems.indexOf(item) + 1}` : 'Mockup'}
                      </span>
                      <span className="truncate text-[9px] text-muted-foreground">
                        {imageName || 'Screenshot'}
                      </span>
                    </div>
                  </div>
                </div>

                {slides.length > 1 && item.id !== 'main' && (
                  <button
                    type="button"
                    className="absolute top-0.5 right-0.5 z-10 flex h-4 w-4 cursor-pointer items-center justify-center rounded-md border border-foreground/10 bg-card opacity-0 transition-opacity group-hover/clip:opacity-100 hover:bg-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSlide(item.id);
                    }}
                  >
                    <Cancel01Icon size={8} className="text-foreground" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Slide Duration Handle ──────────────────────────────────── */
function SlideDurationHandle({ trackWidth }: { trackWidth: number }) {
  const setTimelineDuration = useImageStore((s) => s.setTimelineDuration);
  const [isDragging, setIsDragging] = React.useState(false);
  const [showHint, setShowHint] = React.useState(false);
  const trackLeftRef = React.useRef(0);

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - trackLeftRef.current;
      const seconds = Math.max(1, Math.min(30, Math.round(x / PIXELS_PER_SECOND)));
      setTimelineDuration(seconds * 1000);
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, setTimelineDuration]);

  return (
    <div
      className="absolute top-0 bottom-0 z-20 w-4 -translate-x-1/2 cursor-ew-resize"
      style={{ left: TRACK_LABEL_WIDTH + trackWidth }}
      onMouseDown={(e) => {
        e.preventDefault();
        const trackArea = document.querySelector('.timeline-track-area');
        if (!trackArea) return;
        trackLeftRef.current = trackArea.getBoundingClientRect().left;
        const x = e.clientX - trackLeftRef.current;
        const seconds = Math.max(1, Math.min(30, Math.round(x / PIXELS_PER_SECOND)));
        setTimelineDuration(seconds * 1000);
        setIsDragging(true);
      }}
      onMouseEnter={() => setShowHint(true)}
      onMouseLeave={() => !isDragging && setShowHint(false)}
    >
      <div
        className={cn(
          'absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 transition-colors duration-150',
          isDragging || showHint ? 'bg-foreground/70' : 'bg-foreground/25'
        )}
      />

      <div
        className={cn(
          'absolute top-1/2 left-1/2 flex h-6 w-3.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-0.5 rounded-md border bg-card transition-colors duration-150',
          isDragging || showHint
            ? 'border-foreground/25'
            : 'border-foreground/10'
        )}
      >
        <span className="h-2.5 w-px rounded-full bg-foreground/45" />
        <span className="h-2.5 w-px rounded-full bg-foreground/45" />
      </div>

      {(showHint || isDragging) && (
        <div className="pointer-events-none absolute top-1/2 left-5 z-50 -translate-y-1/2 whitespace-nowrap rounded-md border border-foreground/10 bg-card px-2 py-1 text-[10px] font-medium text-foreground shadow-lg">
          Drag to adjust duration
        </div>
      )}
    </div>
  );
}

/* ─── Main Timeline Editor ───────────────────────────────────── */
export function TimelineEditor() {
  const { timeline, uploadedImageUrl, slides, showTimeline, setActiveRightPanelTab, toggleTimeline } = useImageStore();
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
  const playheadTimeLabel = formatTime(timeline.playhead);
  const totalTrackHeight = 25 + 49 + 57; // time(h-6=24+1border) + animation(h-12=48+1border) + video(h-14=56+1border)

  const handleAddAnimation = () => {
    setActiveRightPanelTab('animate');
  };

  const handleClose = () => {
    toggleTimeline();
  };

  return (
    <div className="flex flex-col border-t border-foreground/10 bg-background" style={{ height: TIMELINE_HEIGHT }}>
      <TimelineControls onAddAnimation={handleAddAnimation} onClose={handleClose} />

      <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        <div
          className="relative min-w-full"
          style={{ width: timelineWidth + 48 }}
        >
          <div className="flex h-6 w-full border-b border-foreground/10">
            <div
              className="shrink-0 border-r border-foreground/10"
              style={{ width: TRACK_LABEL_WIDTH }}
            />
            <TimeTrack duration={timeline.duration} width={trackContentWidth} />
            <div className="min-w-0 flex-1" aria-hidden />
          </div>

          <div className="flex w-full border-b border-foreground/10">
            <AnimationTrack width={timelineWidth} onAddAnimation={handleAddAnimation} />
            <div className="min-w-0 flex-1" aria-hidden />
          </div>

          <div className="flex w-full border-b border-foreground/10">
            <VideoTrack width={timelineWidth} />
            <div className="min-w-0 flex-1" aria-hidden />
          </div>

          <PlayheadTicker
            position={playheadPosition}
            height={totalTrackHeight}
            timeLabel={playheadTimeLabel}
          />

          <SlideDurationHandle trackWidth={trackContentWidth} />
        </div>
      </div>
    </div>
  );
}
