'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { getFontCSS } from '@/lib/constants/fonts';
import type { TextOverlay } from '@/lib/store';

interface HTMLTextOverlayLayerProps {
  textOverlays: TextOverlay[];
  canvasW: number;
  canvasH: number;
  selectedTextId: string | null;
  setSelectedTextId: (id: string | null) => void;
  setSelectedOverlayId: (id: string | null) => void;
  setIsMainImageSelected: (selected: boolean) => void;
  updateTextOverlay: (id: string, updates: Partial<TextOverlay>) => void;
}

interface DraggableTextProps {
  overlay: TextOverlay;
  canvasW: number;
  canvasH: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<TextOverlay>) => void;
}

function DraggableText({
  overlay,
  canvasW,
  canvasH,
  isSelected,
  onSelect,
  onUpdate,
}: DraggableTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });

  // Convert percentage position to pixels
  const textX = (overlay.position.x / 100) * canvasW;
  const textY = (overlay.position.y / 100) * canvasH;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPos({ x: textX, y: textY });
    onSelect();
  }, [textX, textY, onSelect]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: PointerEvent) => {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      const newX = initialPos.x + deltaX;
      const newY = initialPos.y + deltaY;

      // Convert back to percentage
      const newXPercent = (newX / canvasW) * 100;
      const newYPercent = (newY / canvasH) * 100;

      onUpdate({ position: { x: newXPercent, y: newYPercent } });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handleMouseMove);
    window.addEventListener('pointerup', handleMouseUp);

    return () => {
      window.removeEventListener('pointermove', handleMouseMove);
      window.removeEventListener('pointerup', handleMouseUp);
    };
  }, [isDragging, dragStart, initialPos, canvasW, canvasH, onUpdate]);

  // Build text shadow CSS
  const textShadow = overlay.textShadow?.enabled
    ? `${overlay.textShadow.offsetX}px ${overlay.textShadow.offsetY}px ${overlay.textShadow.blur}px ${overlay.textShadow.color}`
    : undefined;

  if (!overlay.isVisible) return null;

  return (
    <div
      ref={ref}
      data-text-overlay-id={overlay.id}
      data-export-clean-outline={isSelected ? 'true' : undefined}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: `${textX}px`,
        top: `${textY}px`,
        transform: 'translate(-50%, -50%)',
        fontSize: `${overlay.fontSize}px`,
        fontWeight: overlay.fontWeight.includes('bold') ? 'bold' : 'normal',
        fontStyle: overlay.fontWeight.includes('italic') ? 'italic' : 'normal',
        fontFamily: getFontCSS(overlay.fontFamily),
        color: overlay.color,
        opacity: overlay.opacity,
        textShadow,
        whiteSpace: 'nowrap',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        writingMode: overlay.orientation === 'vertical' ? 'vertical-rl' : 'horizontal-tb',
        outline: isSelected ? '2px solid rgba(59, 130, 246, 0.5)' : 'none',
        outlineOffset: '4px',
        zIndex: 100,
        pointerEvents: 'auto',
      }}
    >
      {overlay.text}
    </div>
  );
}

/**
 * HTML/CSS-based text overlay layer that replaces Konva TextOverlayLayer.
 * Renders text overlays with drag support.
 */
export function HTMLTextOverlayLayer({
  textOverlays,
  canvasW,
  canvasH,
  selectedTextId,
  setSelectedTextId,
  setSelectedOverlayId,
  setIsMainImageSelected,
  updateTextOverlay,
}: HTMLTextOverlayLayerProps) {
  const handleSelect = useCallback((id: string) => {
    setSelectedTextId(id);
    setSelectedOverlayId(null);
    setIsMainImageSelected(false);
  }, [setSelectedTextId, setSelectedOverlayId, setIsMainImageSelected]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: `${canvasW}px`,
        height: `${canvasH}px`,
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      {textOverlays.map((overlay) => (
        <DraggableText
          key={overlay.id}
          overlay={overlay}
          canvasW={canvasW}
          canvasH={canvasH}
          isSelected={selectedTextId === overlay.id}
          onSelect={() => handleSelect(overlay.id)}
          onUpdate={(updates) => updateTextOverlay(overlay.id, updates)}
        />
      ))}
    </div>
  );
}
