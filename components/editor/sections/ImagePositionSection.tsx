'use client';

import * as React from 'react';
import { useImageStore } from '@/lib/store';
import { useEditorStore } from '@/lib/store';
import { SectionWrapper } from './SectionWrapper';
import { cn } from '@/lib/utils';

type PositionKey = 'tl' | 'tc' | 'tr' | 'ml' | 'mc' | 'mr' | 'bl' | 'bc' | 'br';

const positions: { key: PositionKey; label: string; x: number; y: number }[] = [
  { key: 'tl', label: 'Top Left', x: -1, y: -1 },
  { key: 'tc', label: 'Top', x: 0, y: -1 },
  { key: 'tr', label: 'Top Right', x: 1, y: -1 },
  { key: 'ml', label: 'Left', x: -1, y: 0 },
  { key: 'mc', label: 'Center', x: 0, y: 0 },
  { key: 'mr', label: 'Right', x: 1, y: 0 },
  { key: 'bl', label: 'Bottom Left', x: -1, y: 1 },
  { key: 'bc', label: 'Bottom', x: 0, y: 1 },
  { key: 'br', label: 'Bottom Right', x: 1, y: 1 },
];

function PositionIcon({ x, y }: { x: number; y: number }) {
  const rectW = 10;
  const rectH = 7;
  const pad = 1.5;
  const cx = 9 + x * (9 - rectW / 2 - pad);
  const cy = 9 + y * (9 - rectH / 2 - pad);

  return (
    <svg width="18" height="18" viewBox="0 0 18 18" className="block">
      <rect
        x="0.5"
        y="0.5"
        width="17"
        height="17"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity={0.3}
      />
      <rect
        x={cx - rectW / 2}
        y={cy - rectH / 2}
        width={rectW}
        height={rectH}
        rx="1"
        fill="currentColor"
        opacity={0.7}
      />
    </svg>
  );
}

export function ImagePositionSection() {
  const { canvasDimensions } = useImageStore();
  const { screenshot, setScreenshot } = useEditorStore();

  const [activePosition, setActivePosition] =
    React.useState<PositionKey | null>('mc');

  const handlePosition = (pos: (typeof positions)[number]) => {
    if (!canvasDimensions) return;

    const { canvasW, canvasH, framedW, framedH } = canvasDimensions;
    const maxX = Math.max(0, (canvasW - framedW) / 2);
    const maxY = Math.max(0, (canvasH - framedH) / 2);

    setScreenshot({
      offsetX: Math.round(pos.x * maxX),
      offsetY: Math.round(pos.y * maxY),
    });
    setActivePosition(pos.key);
  };

  const handleAuto = (): void => {
    handlePosition(positions.find((p) => p.key === 'mc')!);
  };

  React.useEffect(() => {
    if (!canvasDimensions) return;
    const { canvasW, canvasH, framedW, framedH } = canvasDimensions;
    const maxX = Math.max(0, (canvasW - framedW) / 2);
    const maxY = Math.max(0, (canvasH - framedH) / 2);

    const match = positions.find((p) => {
      const px = Math.round(p.x * maxX);
      const py = Math.round(p.y * maxY);
      return (
        Math.abs(screenshot.offsetX - px) < 2 &&
        Math.abs(screenshot.offsetY - py) < 2
      );
    });

    setActivePosition(match?.key ?? null);
  }, [screenshot.offsetX, screenshot.offsetY, canvasDimensions]);

  return (
    <SectionWrapper title="Position" defaultOpen={true}>
      <div className="space-y-2">
        <button
          type="button"
          onClick={handleAuto}
          className="flex h-9 w-full items-center justify-center rounded-md bg-foreground/[0.04] text-[11px] font-semibold tracking-wide text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
        >
          Auto
        </button>

        <div className="mx-auto grid w-full max-w-[220px] grid-cols-3 gap-1.5">
          {positions.map((pos) => (
            <button
              key={pos.key}
              type="button"
              title={pos.label}
              aria-label={pos.label}
              aria-pressed={activePosition === pos.key}
              onClick={() => handlePosition(pos)}
              className={cn(
                'flex aspect-square items-center justify-center rounded-md transition-all',
                activePosition === pos.key
                  ? 'bg-foreground/[0.1] text-foreground ring-1 ring-foreground/20'
                  : 'bg-foreground/[0.04] text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground',
              )}
            >
              <PositionIcon x={pos.x} y={pos.y} />
            </button>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
