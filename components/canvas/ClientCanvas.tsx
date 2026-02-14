"use client";

import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "@/lib/store";
import { useImageStore } from "@/lib/store";
import { generatePattern } from "@/lib/patterns";
import { useResponsiveCanvasDimensions } from "@/hooks/useAspectRatioDimensions";
import { generateNoiseTexture } from "@/lib/export/export-utils";
import { MockupRenderer } from "@/components/mockups/MockupRenderer";
import { calculateCanvasDimensions } from "./utils/canvas-dimensions";
import { Perspective3DOverlay } from "./overlays/Perspective3DOverlay";
import { useBackgroundImage, useOverlayImages } from "./hooks/useImageLoading";
import { OverlayToolbar } from "./OverlayToolbar";
import {
  HTMLCanvasRenderer,
  HTMLBackgroundLayer,
  HTMLPatternLayer,
  HTMLNoiseLayer,
  HTMLMainImageLayer,
  HTMLTextOverlayLayer,
  HTMLImageOverlayLayer,
} from "./html";

// Reference to the HTML canvas container for export
let globalCanvasContainer: HTMLDivElement | null = null;

function CanvasRenderer({ image }: { image: HTMLImageElement }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const {
    screenshot,
    setScreenshot,
    shadow,
    pattern: patternStyle,
    frame,
    canvas,
    noise,
  } = useEditorStore();

  const {
    backgroundConfig,
    backgroundBorderRadius,
    backgroundBlur,
    backgroundNoise,
    perspective3D,
    imageOpacity,
    imageFilters,
    textOverlays,
    imageOverlays,
    mockups,
    updateTextOverlay,
    updateImageOverlay,
    removeImageOverlay,
    addImageOverlay,
  } = useImageStore();

  const hasMockups = mockups.length > 0 && mockups.some((m) => m.isVisible);
  const responsiveDimensions = useResponsiveCanvasDimensions();

  const [viewportSize, setViewportSize] = useState({
    width: 1920,
    height: 1080,
  });

  const [patternImage, setPatternImage] = useState<HTMLCanvasElement | null>(
    null
  );
  const [noiseImage, setNoiseImage] = useState<HTMLImageElement | null>(null);
  const [noiseTexture, setNoiseTexture] = useState<HTMLCanvasElement | null>(
    null
  );

  const [selectedOverlayId, setSelectedOverlayId] = useState<string | null>(
    null
  );
  const [isMainImageSelected, setIsMainImageSelected] = useState(false);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  const containerWidth = responsiveDimensions.width;
  const containerHeight = responsiveDimensions.height;

  const bgImage = useBackgroundImage(
    backgroundConfig,
    containerWidth,
    containerHeight
  );
  const loadedOverlayImages = useOverlayImages(imageOverlays);

  // Update global reference for export
  useEffect(() => {
    if (canvasContainerRef.current) {
      globalCanvasContainer = canvasContainerRef.current;
    }
    return () => {
      globalCanvasContainer = null;
    };
  }, []);

  // Clear selection when clicking outside of canvas
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;

      const container = containerRef.current;
      if (!container) return;

      if (!container.contains(target)) {
        setSelectedOverlayId(null);
        setIsMainImageSelected(false);
        setSelectedTextId(null);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, []);

  // Keyboard shortcuts for delete and undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input, textarea, or contenteditable
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Delete overlay (only when not typing)
      if ((e.key === "Delete" || e.key === "Backspace") && !isTyping) {
        if (selectedOverlayId) {
          e.preventDefault();
          removeImageOverlay(selectedOverlayId);
          setSelectedOverlayId(null);
        }
      }

      // Undo/Redo (only when not typing)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z" && !isTyping) {
        e.preventDefault();
        const { undo, redo } = useImageStore.temporal.getState();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedOverlayId, removeImageOverlay]);

  // Get selected overlay for toolbar positioning
  const selectedOverlay = selectedOverlayId
    ? imageOverlays.find(o => o.id === selectedOverlayId)
    : null;

  // Handle duplicate overlay
  const handleDuplicateOverlay = () => {
    if (!selectedOverlay) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...overlayWithoutId } = selectedOverlay;
    addImageOverlay({
      ...overlayWithoutId,
      position: {
        x: selectedOverlay.position.x + 30,
        y: selectedOverlay.position.y + 30,
      },
    });
  };

  // Handle delete overlay
  const handleDeleteOverlay = () => {
    if (!selectedOverlayId) return;
    removeImageOverlay(selectedOverlayId);
    setSelectedOverlayId(null);
  };

  useEffect(() => {
    if (backgroundNoise > 0) {
      const intensity = backgroundNoise / 100;
      const noiseCanvas = generateNoiseTexture(200, 200, intensity);
      setNoiseTexture(noiseCanvas);
    } else {
      setNoiseTexture(null);
    }
  }, [backgroundNoise]);

  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);
    return () => window.removeEventListener("resize", updateViewportSize);
  }, []);

  useEffect(() => {
    if (!patternStyle.enabled) {
      setPatternImage(null);
      return;
    }

    const newPattern = generatePattern(
      patternStyle.type,
      patternStyle.scale,
      patternStyle.spacing,
      patternStyle.color,
      patternStyle.rotation,
      patternStyle.blur
    );
    setPatternImage(newPattern);
  }, [
    patternStyle.enabled,
    patternStyle.type,
    patternStyle.scale,
    patternStyle.spacing,
    patternStyle.color,
    patternStyle.rotation,
    patternStyle.blur,
  ]);

  useEffect(() => {
    if (!noise.enabled || noise.type === "none") {
      setNoiseImage(null);
      return;
    }

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setNoiseImage(img);
    img.onerror = () => setNoiseImage(null);
    img.src = `/${noise.type}.jpg`;
  }, [noise.enabled, noise.type]);

  const dimensions = calculateCanvasDimensions(
    image,
    containerWidth,
    containerHeight,
    viewportSize,
    canvas,
    screenshot,
    frame
  );

  const {
    canvasW,
    canvasH,
    imageScaledW,
    imageScaledH,
    framedW,
    framedH,
    frameOffset,
    windowPadding,
    windowHeader,
    eclipseBorder,
    groupCenterX,
    groupCenterY,
  } = dimensions;

  const showFrame = frame.enabled && frame.type !== "none";

  const has3DTransform =
    perspective3D.rotateX !== 0 ||
    perspective3D.rotateY !== 0 ||
    perspective3D.rotateZ !== 0 ||
    perspective3D.translateX !== 0 ||
    perspective3D.translateY !== 0 ||
    perspective3D.scale !== 1;

  // Handle canvas click to deselect
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if clicking on the canvas background (not on an overlay)
    if (e.target === e.currentTarget) {
      setSelectedOverlayId(null);
      setIsMainImageSelected(false);
      setSelectedTextId(null);
    }
  };

  return (
    <div
      ref={containerRef}
      id="image-render-card"
      className="flex items-center justify-center"
      style={{
        width: `${containerWidth}px`,
        maxWidth: `${containerWidth}px`,
        aspectRatio: responsiveDimensions.aspectRatio,
        maxHeight: "calc(100vh - 200px)",
        backgroundColor: "transparent",
        padding: "0px",
      }}
    >
      <HTMLCanvasRenderer
        ref={canvasContainerRef}
        width={canvasW}
        height={canvasH}
        borderRadius={backgroundBorderRadius}
        onClick={handleCanvasClick}
        style={{
          isolation: "isolate",
        }}
      >
        {/* Background Layer */}
        <HTMLBackgroundLayer
          backgroundConfig={backgroundConfig}
          backgroundBlur={backgroundBlur}
          backgroundBorderRadius={backgroundBorderRadius}
          width={canvasW}
          height={canvasH}
          noiseTexture={noiseTexture}
          backgroundNoise={backgroundNoise}
        />

        {/* Pattern Layer */}
        <HTMLPatternLayer
          patternImage={patternImage}
          width={canvasW}
          height={canvasH}
          patternOpacity={patternStyle.opacity}
        />

        {/* Noise Layer */}
        <HTMLNoiseLayer
          noiseImage={noiseImage}
          width={canvasW}
          height={canvasH}
          noiseOpacity={noise.opacity}
        />

        {/* 3D Transform Overlay - renders when 3D transforms are active */}
        <Perspective3DOverlay
          has3DTransform={has3DTransform}
          perspective3D={perspective3D}
          screenshot={screenshot}
          shadow={shadow}
          frame={frame}
          showFrame={showFrame}
          framedW={framedW}
          framedH={framedH}
          frameOffset={frameOffset}
          windowPadding={windowPadding}
          windowHeader={windowHeader}
          eclipseBorder={eclipseBorder}
          imageScaledW={imageScaledW}
          imageScaledH={imageScaledH}
          groupCenterX={groupCenterX}
          groupCenterY={groupCenterY}
          canvasW={canvasW}
          canvasH={canvasH}
          image={image}
          imageOpacity={imageOpacity}
          imageFilters={imageFilters}
        />

        {/* Main Image Layer - renders when no 3D transform and no mockups */}
        {!hasMockups && !has3DTransform && (
          <HTMLMainImageLayer
            image={image}
            canvasW={canvasW}
            canvasH={canvasH}
            framedW={framedW}
            framedH={framedH}
            frameOffset={frameOffset}
            windowPadding={windowPadding}
            windowHeader={windowHeader}
            imageScaledW={imageScaledW}
            imageScaledH={imageScaledH}
            screenshot={screenshot}
            frame={frame}
            shadow={shadow}
            showFrame={showFrame}
            imageOpacity={imageOpacity}
            imageFilters={imageFilters}
            isMainImageSelected={isMainImageSelected}
            setIsMainImageSelected={setIsMainImageSelected}
            setSelectedOverlayId={setSelectedOverlayId}
            setSelectedTextId={setSelectedTextId}
            setScreenshot={setScreenshot}
          />
        )}

        {/* Mockups Layer */}
        {mockups.map((mockup) => (
          <MockupRenderer
            key={mockup.id}
            mockup={mockup}
            canvasWidth={canvasW}
            canvasHeight={canvasH}
          />
        ))}

        {/* Text Overlay Layer */}
        <HTMLTextOverlayLayer
          textOverlays={textOverlays}
          canvasW={canvasW}
          canvasH={canvasH}
          selectedTextId={selectedTextId}
          setSelectedTextId={setSelectedTextId}
          setSelectedOverlayId={setSelectedOverlayId}
          setIsMainImageSelected={setIsMainImageSelected}
          updateTextOverlay={updateTextOverlay}
        />

        {/* Image Overlay Layer */}
        <HTMLImageOverlayLayer
          imageOverlays={imageOverlays}
          loadedOverlayImages={loadedOverlayImages}
          selectedOverlayId={selectedOverlayId}
          setSelectedOverlayId={setSelectedOverlayId}
          setIsMainImageSelected={setIsMainImageSelected}
          setSelectedTextId={setSelectedTextId}
          updateImageOverlay={updateImageOverlay}
        />

        {/* Floating toolbar for selected overlay */}
        {selectedOverlay && (
          <OverlayToolbar
            position={{
              x: selectedOverlay.position.x,
              y: selectedOverlay.position.y - selectedOverlay.size / 2,
            }}
            overlay={selectedOverlay}
            onDelete={handleDeleteOverlay}
            onDuplicate={handleDuplicateOverlay}
            onUpdate={(updates) => updateImageOverlay(selectedOverlay.id, updates)}
            containerRef={canvasContainerRef}
          />
        )}
      </HTMLCanvasRenderer>
    </div>
  );
}

export function getCanvasContainer(): HTMLDivElement | null {
  return globalCanvasContainer;
}

export default function ClientCanvas() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [loadError, setLoadError] = useState(false);
  const { screenshot, setScreenshot } = useEditorStore();
  const { uploadedImageUrl } = useImageStore();

  useEffect(() => {
    // Reset states when source changes
    setLoadError(false);

    // Check both stores for image presence
    if (!screenshot.src || !uploadedImageUrl) {
      setImage(null);
      return;
    }

    const img = new window.Image();
    img.crossOrigin = "anonymous";

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (!img.complete) {
        console.warn('Image load timeout');
        setLoadError(true);
        setScreenshot({ src: null });
      }
    }, 10000); // 10 second timeout

    img.onload = () => {
      clearTimeout(timeoutId);
      setImage(img);
    };

    img.onerror = () => {
      clearTimeout(timeoutId);
      console.warn('Image load error');
      setLoadError(true);
      setScreenshot({ src: null });
    };

    img.src = screenshot.src;

    return () => {
      clearTimeout(timeoutId);
    };
  }, [screenshot.src, uploadedImageUrl, setScreenshot]);

  // Show nothing if there's an error (let EditorCanvas show upload UI)
  if (loadError || !screenshot.src || !uploadedImageUrl) {
    return null;
  }

  if (!image) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <CanvasRenderer image={image} />;
}
