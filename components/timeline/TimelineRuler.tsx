'use client';

import * as React from 'react';
import { useImageStore } from '@/lib/store';

interface TimelineRulerProps {
  width: number;
}

export function TimelineRuler({ width }: TimelineRulerProps) {
  const { timeline } = useImageStore();
  const { duration, zoom } = timeline;

  // Calculate tick spacing based on duration and zoom
  const getTickSpacing = (): { major: number; minor: number } => {
    const durationSeconds = duration / 1000;
    if (durationSeconds <= 2) return { major: 500, minor: 100 };
    if (durationSeconds <= 5) return { major: 1000, minor: 250 };
    if (durationSeconds <= 10) return { major: 2000, minor: 500 };
    return { major: 5000, minor: 1000 };
  };

  const { major, minor } = getTickSpacing();
  const ticks: { time: number; isMajor: boolean }[] = [];

  for (let time = 0; time <= duration; time += minor) {
    ticks.push({
      time,
      isMajor: time % major === 0,
    });
  }

  const formatTickLabel = (ms: number): string => {
    const seconds = ms / 1000;
    if (seconds >= 1) {
      return `${seconds.toFixed(seconds % 1 === 0 ? 0 : 1)}s`;
    }
    return `${ms}ms`;
  };

  return (
    <div
      className="relative h-6 bg-surface-2 border-b border-border/30 select-none"
      style={{ width }}
    >
      {ticks.map(({ time, isMajor }) => {
        const left = (time / duration) * width;
        return (
          <div
            key={time}
            className="absolute top-0 flex flex-col items-center"
            style={{ left }}
          >
            <div
              className={`w-px ${
                isMajor ? 'h-3 bg-foreground/40' : 'h-2 bg-foreground/20'
              }`}
            />
            {isMajor && (
              <span className="text-[9px] text-foreground/50 mt-0.5 font-mono">
                {formatTickLabel(time)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
