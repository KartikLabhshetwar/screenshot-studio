'use client';

import * as React from 'react';
import { useImageStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface TimelinePlayheadProps {
  width: number;
  height: number;
}

export function TimelinePlayhead({ width, height }: TimelinePlayheadProps) {
  const { timeline, setPlayhead } = useImageStore();
  const { playhead, duration, isPlaying } = timeline;
  const [isDragging, setIsDragging] = React.useState(false);
  const playheadRef = React.useRef<HTMLDivElement>(null);

  const position = (playhead / duration) * width;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = playheadRef.current?.parentElement;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newTime = Math.max(0, Math.min(duration, (x / width) * duration));
      setPlayhead(Math.round(newTime));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, duration, width, setPlayhead]);

  return (
    <div
      ref={playheadRef}
      className="absolute top-0 z-20 cursor-ew-resize"
      style={{ left: position, height, transform: 'translateX(-50%)' }}
      onMouseDown={handleMouseDown}
    >
      {/* Wider clickable area containing the triangle and line */}
      <div className="w-3 h-full flex flex-col items-center hover:bg-red-500/10 transition-colors">
        {/* Head triangle */}
        <div
          className={cn(
            'w-0 h-0 -mt-1',
            'border-l-[6px] border-r-[6px] border-t-[8px]',
            'border-l-transparent border-r-transparent',
            'border-t-red-500',
            isDragging && 'border-t-red-400'
          )}
        />

        {/* Vertical line */}
        <div
          className={cn(
            'w-[2px] flex-1',
            'bg-red-500',
            isPlaying && 'animate-pulse'
          )}
        />
      </div>
    </div>
  );
}
