'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { Keyframe } from '@/types/animation';

interface KeyframeMarkerProps {
  keyframe: Keyframe;
  position: number; // x position in pixels
  isSelected: boolean;
  trackType: 'transform' | 'opacity';
  onSelect: () => void;
  onDrag: (newTime: number) => void;
  onDelete: () => void;
  timelineWidth: number;
  duration: number;
}

export function KeyframeMarker({
  keyframe,
  position,
  isSelected,
  trackType,
  onSelect,
  onDrag,
  onDelete,
  timelineWidth,
  duration,
}: KeyframeMarkerProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const markerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      onDelete();
    }
  };

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const timeline = markerRef.current?.parentElement?.parentElement;
      if (!timeline) return;

      const rect = timeline.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newTime = Math.max(0, Math.min(duration, (x / timelineWidth) * duration));
      onDrag(Math.round(newTime));
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
  }, [isDragging, duration, timelineWidth, onDrag]);

  const markerColor = trackType === 'transform' ? 'bg-blue-500' : 'bg-amber-500';

  return (
    <div
      ref={markerRef}
      tabIndex={0}
      className={cn(
        'absolute top-1/2 -translate-y-1/2 -translate-x-1/2',
        'w-3 h-3 rotate-45 rounded-[2px] cursor-pointer',
        'transition-all duration-100',
        'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1',
        markerColor,
        isSelected && 'ring-2 ring-white shadow-lg scale-110',
        isDragging && 'cursor-grabbing scale-125'
      )}
      style={{ left: position }}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
    >
      {/* Inner indicator */}
      <div
        className={cn(
          'absolute inset-[3px] rounded-[1px]',
          isSelected ? 'bg-white' : 'bg-white/60'
        )}
      />
    </div>
  );
}
