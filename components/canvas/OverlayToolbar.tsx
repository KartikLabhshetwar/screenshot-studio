'use client';

import * as React from 'react';
import {
  Delete02Icon,
  Copy01Icon,
  RotateRight01Icon,
  RotateLeft01Icon,
  PlusSignIcon,
  MinusSignIcon,
} from 'hugeicons-react';
import { cn } from '@/lib/utils';
import type { ImageOverlay } from '@/lib/store';

interface OverlayToolbarProps {
  position: { x: number; y: number };
  overlay: ImageOverlay;
  onDelete: () => void;
  onDuplicate: () => void;
  onUpdate: (updates: Partial<ImageOverlay>) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const toolBtn =
  'flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-foreground/[0.06] hover:text-foreground';

export function OverlayToolbar({
  position,
  overlay,
  onDelete,
  onDuplicate,
  onUpdate,
  containerRef,
}: OverlayToolbarProps) {
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = React.useState(position);

  // Normalize rotation to -180 to 180 range
  const normalizeRotation = (rotation: number): number => {
    let normalized = rotation % 360;
    if (normalized > 180) normalized -= 360;
    if (normalized < -180) normalized += 360;
    return normalized;
  };

  const handleRotate = (degrees: number) => {
    const newRotation = normalizeRotation(overlay.rotation + degrees);
    onUpdate({ rotation: newRotation });
  };

  const handleResize = (delta: number) => {
    const newSize = Math.max(20, Math.min(800, overlay.size + delta));
    onUpdate({ size: newSize });
  };

  React.useEffect(() => {
    if (!toolbarRef.current || !containerRef.current) return;

    const toolbar = toolbarRef.current;
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const toolbarWidth = toolbar.offsetWidth;

    // Calculate position relative to container
    let x = position.x - toolbarWidth / 2;
    let y = position.y - 50; // Position above the overlay

    // Keep toolbar within container bounds
    const minX = 8;
    const maxX = containerRect.width - toolbarWidth - 8;
    const minY = 8;

    x = Math.max(minX, Math.min(x, maxX));
    y = Math.max(minY, y);

    setAdjustedPosition({ x, y });
  }, [position, containerRef]);

  return (
    <div
      ref={toolbarRef}
      className={cn(
        'absolute z-50 flex h-8 items-center gap-0.5 rounded-md px-1',
        'bg-card border border-foreground/10',
        'shadow-lg',
        'animate-in fade-in-0 zoom-in-95 duration-150'
      )}
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        pointerEvents: 'auto',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleRotate(-45);
        }}
        className={toolBtn}
        title="Rotate -45°"
      >
        <RotateLeft01Icon size={14} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleRotate(45);
        }}
        className={toolBtn}
        title="Rotate +45°"
      >
        <RotateRight01Icon size={14} />
      </button>

      <div className="mx-0.5 h-3.5 w-px bg-foreground/10" aria-hidden />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleResize(-20);
        }}
        className={toolBtn}
        title="Decrease size"
      >
        <MinusSignIcon size={14} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleResize(20);
        }}
        className={toolBtn}
        title="Increase size"
      >
        <PlusSignIcon size={14} />
      </button>

      <div className="mx-0.5 h-3.5 w-px bg-foreground/10" aria-hidden />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate();
        }}
        className={toolBtn}
        title="Duplicate"
      >
        <Copy01Icon size={14} />
      </button>

      <div className="mx-0.5 h-3.5 w-px bg-foreground/10" aria-hidden />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-destructive/15 hover:text-destructive"
        title="Delete"
      >
        <Delete02Icon size={14} />
      </button>
    </div>
  );
}
