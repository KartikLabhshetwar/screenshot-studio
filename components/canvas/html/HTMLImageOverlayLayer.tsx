'use client';

import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import type { ImageOverlay } from '@/lib/store';

interface HTMLImageOverlayLayerProps {
  imageOverlays: ImageOverlay[];
  loadedOverlayImages: Record<string, HTMLImageElement>;
  selectedOverlayId: string | null;
  setSelectedOverlayId: (id: string | null) => void;
  setIsMainImageSelected: (selected: boolean) => void;
  setSelectedTextId: (id: string | null) => void;
  updateImageOverlay: (id: string, updates: Partial<ImageOverlay>) => void;
}

interface DraggableImageProps {
  overlay: ImageOverlay;
  overlayImg: HTMLImageElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<ImageOverlay>) => void;
}

function DraggableImage({
  overlay,
  overlayImg,
  isSelected,
  onSelect,
  onUpdate,
}: DraggableImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });

  // Check if it's an arrow overlay (needs inversion)
  const isArrow = useMemo(() =>
    typeof overlay.src === 'string' && overlay.src.startsWith('/arrow/'),
    [overlay.src]
  );

  // Check if it's a shadow overlay (decorative, non-interactive)
  const isShadow = useMemo(() =>
    typeof overlay.src === 'string' && overlay.src.includes('overlay-shadow'),
    [overlay.src]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPos({ x: overlay.position.x, y: overlay.position.y });
    onSelect();
  }, [overlay.position.x, overlay.position.y, onSelect]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      const newX = initialPos.x + deltaX;
      const newY = initialPos.y + deltaY;

      onUpdate({ position: { x: newX, y: newY } });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, initialPos, onUpdate]);

  if (!overlay.isVisible) return null;

  // Build transform string
  const transform = [
    `rotate(${overlay.rotation}deg)`,
    overlay.flipX ? 'scaleX(-1)' : '',
    overlay.flipY ? 'scaleY(-1)' : '',
  ].filter(Boolean).join(' ');

  // Shadows are decorative and should cover the entire canvas
  if (isShadow) {
    return (
      <div
        ref={ref}
        data-image-overlay-id={overlay.id}
        style={{
          position: 'absolute',
          inset: 0, // Fill entire canvas
          opacity: overlay.opacity,
          userSelect: 'none',
          zIndex: 5, // Low z-index for shadows (above background, below image)
          pointerEvents: 'none', // Shadows don't block interactions
        }}
      >
        <img
          src={overlayImg.src}
          alt="Shadow overlay"
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // Cover entire canvas, may crop but ensures full coverage
            display: 'block',
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-image-overlay-id={overlay.id}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: `${overlay.position.x}px`,
        top: `${overlay.position.y}px`,
        width: `${overlay.size}px`,
        height: `${overlay.size}px`,
        transform: `translate(-50%, -50%) ${transform}`,
        transformOrigin: 'center center',
        opacity: overlay.opacity,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        outline: isSelected ? '2px solid rgba(59, 130, 246, 0.5)' : 'none',
        outlineOffset: '2px',
        zIndex: 200, // Higher z-index for interactive overlays
        pointerEvents: 'auto',
      }}
    >
      <img
        src={overlayImg.src}
        alt="Overlay"
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          // Apply inversion for arrow overlays
          filter: isArrow ? 'brightness(0) invert(1)' : undefined,
        }}
      />
    </div>
  );
}

/**
 * HTML/CSS-based image overlay layer that replaces Konva ImageOverlayLayer.
 * Renders image overlays with drag support.
 */
export function HTMLImageOverlayLayer({
  imageOverlays,
  loadedOverlayImages,
  selectedOverlayId,
  setSelectedOverlayId,
  setIsMainImageSelected,
  setSelectedTextId,
  updateImageOverlay,
}: HTMLImageOverlayLayerProps) {
  const handleSelect = useCallback((id: string) => {
    setSelectedOverlayId(id);
    setIsMainImageSelected(false);
    setSelectedTextId(null);
  }, [setSelectedOverlayId, setIsMainImageSelected, setSelectedTextId]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 200,
      }}
    >
      {imageOverlays.map((overlay) => {
        if (!overlay.isVisible) return null;

        const overlayImg = loadedOverlayImages[overlay.id];
        if (!overlayImg) return null;

        return (
          <DraggableImage
            key={overlay.id}
            overlay={overlay}
            overlayImg={overlayImg}
            isSelected={selectedOverlayId === overlay.id}
            onSelect={() => handleSelect(overlay.id)}
            onUpdate={(updates) => updateImageOverlay(overlay.id, updates)}
          />
        );
      })}
    </div>
  );
}
