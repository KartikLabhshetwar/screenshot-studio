'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useImageStore } from '@/lib/store';
import { getMockupDefinition } from '@/lib/constants/mockups';
import type { Mockup } from '@/types/mockup';

interface HTMLMockupRendererProps {
  mockup: Mockup;
  canvasWidth: number;
  canvasHeight: number;
}

export function HTMLMockupRenderer({ mockup, canvasWidth, canvasHeight }: HTMLMockupRendererProps) {
  const { uploadedImageUrl, updateMockup } = useImageStore();
  const definition = getMockupDefinition(mockup.definitionId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mockupSize, setMockupSize] = useState({ width: 0, height: 0 });
  const [mockupLoaded, setMockupLoaded] = useState(false);

  const handleMockupLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const mockupAspectRatio = img.naturalWidth / img.naturalHeight;
    const mw = mockup.size;
    const mh = mw / mockupAspectRatio;
    setMockupSize({ width: mw, height: mh });
    setMockupLoaded(true);
  }, [mockup.size]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - mockup.position.x,
      y: e.clientY - mockup.position.y,
    });
  }, [mockup.position.x, mockup.position.y]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      updateMockup(mockup.id, { position: { x: newX, y: newY } });
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
  }, [isDragging, dragStart, mockup.id, updateMockup]);

  if (!definition || !mockup.isVisible) return null;

  const screenAreaX = definition.screenArea.x * mockupSize.width;
  const screenAreaY = definition.screenArea.y * mockupSize.height;
  const screenAreaWidth = definition.screenArea.width * mockupSize.width;
  const screenAreaHeight = definition.screenArea.height * mockupSize.height;
  const borderRadius = (definition.screenArea.borderRadius || 0) * mockupSize.width;

  return (
    <div
      ref={containerRef}
      data-mockup-id={mockup.id}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: `${mockup.position.x}px`,
        top: `${mockup.position.y}px`,
        width: mockupLoaded ? `${mockupSize.width}px` : 'auto',
        height: mockupLoaded ? `${mockupSize.height}px` : 'auto',
        transform: `rotate(${mockup.rotation}deg)`,
        transformOrigin: 'center center',
        opacity: mockup.opacity,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 50,
        pointerEvents: 'auto',
      }}
    >
      <img
        src={definition.src}
        alt={definition.name}
        draggable={false}
        onLoad={handleMockupLoad}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          position: 'relative',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {uploadedImageUrl && mockupLoaded && (
        <div
          style={{
            position: 'absolute',
            left: `${screenAreaX}px`,
            top: `${screenAreaY}px`,
            width: `${screenAreaWidth}px`,
            height: `${screenAreaHeight}px`,
            borderRadius: `${borderRadius}px`,
            overflow: 'hidden',
            zIndex: 1,
          }}
        >
          <img
            src={uploadedImageUrl}
            alt="User content"
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: mockup.imageFit || 'cover',
              display: 'block',
            }}
          />
        </div>
      )}
    </div>
  );
}
