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
        'absolute z-50 flex items-center gap-1 p-1.5',
        'bg-surface-2/95 backdrop-blur-sm rounded-xl',
        'border border-border/40 shadow-lg',
        'animate-in fade-in-0 zoom-in-95 duration-150'
      )}
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        pointerEvents: 'auto',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Rotate controls */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleRotate(-45);
        }}
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-lg',
          'text-text-secondary hover:text-foreground',
          'hover:bg-surface-3 transition-colors duration-150'
        )}
        title="Rotate -45°"
      >
        <RotateLeft01Icon size={16} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleRotate(45);
        }}
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-lg',
          'text-text-secondary hover:text-foreground',
          'hover:bg-surface-3 transition-colors duration-150'
        )}
        title="Rotate +45°"
      >
        <RotateRight01Icon size={16} />
      </button>

      <div className="w-px h-5 bg-border/40" />

      {/* Size controls */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleResize(-20);
        }}
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-lg',
          'text-text-secondary hover:text-foreground',
          'hover:bg-surface-3 transition-colors duration-150'
        )}
        title="Decrease size"
      >
        <MinusSignIcon size={16} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleResize(20);
        }}
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-lg',
          'text-text-secondary hover:text-foreground',
          'hover:bg-surface-3 transition-colors duration-150'
        )}
        title="Increase size"
      >
        <PlusSignIcon size={16} />
      </button>

      <div className="w-px h-5 bg-border/40" />

      {/* Duplicate */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate();
        }}
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-lg',
          'text-text-secondary hover:text-foreground',
          'hover:bg-surface-3 transition-colors duration-150'
        )}
        title="Duplicate"
      >
        <Copy01Icon size={16} />
      </button>

      <div className="w-px h-5 bg-border/40" />

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-lg',
          'text-text-secondary hover:text-red-500',
          'hover:bg-red-500/10 transition-colors duration-150'
        )}
        title="Delete"
      >
        <Delete02Icon size={16} />
      </button>
    </div>
  );
}
