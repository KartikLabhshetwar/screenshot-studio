"use client";

import { useEditorStore } from "@/lib/store";
import { useImageStore } from "@/lib/store";
import { CleanUploadState } from "@/components/controls/CleanUploadState";
import { useLayoutEffect, useState } from "react";
import React from "react";
import { ExportSlideshowDialog } from "@/lib/export-slideshow-dialog";
import { CanvasStageShell } from "@/components/canvas/CanvasStageShell";
import { CanvasStageLoadingOverlay } from "@/components/canvas/CanvasStageLoadingOverlay";
import ClientCanvas from "@/components/canvas/ClientCanvas";
import { cn } from "@/lib/utils";
import { Cancel01Icon } from "hugeicons-react";
import {
  hasVisibleMockups,
  shouldRenderSourceImage,
} from "@/lib/device-mockups/layouts";

export function EditorCanvas() {
  const { screenshot } = useEditorStore();
  const {
    slides,
    setActiveSlide,
    activeSlideId,
    removeSlide,
    previewIndex,
    isPreviewing,
    stopPreview,
    uploadedImageUrl,
    showTimeline,
    editorMode,
    mockups,
  } = useImageStore();

  // Check both stores - imageStore is the source of truth (tracked by undo/redo)
  const hasImage = !!uploadedImageUrl
    && !!screenshot.src
    && shouldRenderSourceImage(editorMode, mockups);
  const hasDeviceScene = editorMode === "device" && hasVisibleMockups(mockups);
  const hasRenderableContent = hasImage || hasDeviceScene;
  const [exportOpen, setExportOpen] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const loadStartedAtRef = React.useRef<number | null>(null);
  const readyTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCanvasReady = React.useCallback(() => {
    const started = loadStartedAtRef.current ?? Date.now();
    const remaining = Math.max(0, 240 - (Date.now() - started));
    if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
    readyTimeoutRef.current = setTimeout(() => {
      setCanvasReady(true);
      readyTimeoutRef.current = null;
    }, remaining);
  }, []);

  useLayoutEffect(() => {
    if (readyTimeoutRef.current) {
      clearTimeout(readyTimeoutRef.current);
      readyTimeoutRef.current = null;
    }

    if (!hasRenderableContent) {
      setCanvasReady(false);
      loadStartedAtRef.current = null;
      return;
    }

    setCanvasReady(false);
    loadStartedAtRef.current = Date.now();
  }, [hasRenderableContent, screenshot.src, uploadedImageUrl]);

  React.useEffect(() => {
    return () => {
      if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
    };
  }, []);

  const previewSlide = slides[previewIndex];
  const previewSlideId = previewSlide?.id;
  const previewSlideDuration = previewSlide?.duration;

  React.useEffect(() => {
    if (!isPreviewing) return;
    if (!previewSlideId || previewSlideDuration === undefined) {
      stopPreview();
      return;
    }

    setActiveSlide(previewSlideId);

    const timer = setTimeout(() => {
      useImageStore.setState((state) => {
        if (state.previewIndex + 1 >= state.slides.length) {
          return {
            isPreviewing: false,
            previewIndex: 0,
          };
        }

        return {
          previewIndex: state.previewIndex + 1,
        };
      });
    }, previewSlideDuration * 1000);

    return () => clearTimeout(timer);
  }, [
    isPreviewing,
    previewSlideId,
    previewSlideDuration,
    setActiveSlide,
    stopPreview,
  ]);

  const showLoading = hasRenderableContent && !canvasReady;

  return (
    <>
      <div className="flex flex-col h-full w-full relative">
        <ExportSlideshowDialog
          open={exportOpen}
          onOpenChange={setExportOpen}
        />

        <div
          data-canvas-viewport
          className="relative flex-1 flex items-center justify-center overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6"
        >
          <CanvasStageShell
            id="image-render-card"
            breathe={!canvasReady}
            showBackground={!canvasReady}
            className="overflow-hidden"
          >
            {!hasRenderableContent ? (
              <CleanUploadState />
            ) : (
              <>
                <div
                  className={cn(
                    "absolute inset-0 transition-opacity duration-300 ease-out",
                    canvasReady ? "opacity-100" : "opacity-0"
                  )}
                >
                  <ClientCanvas
                    embedded
                    onReady={handleCanvasReady}
                  />
                </div>
                {showLoading ? <CanvasStageLoadingOverlay /> : null}
              </>
            )}
          </CanvasStageShell>
        </div>

        {slides.length > 1 && !showTimeline && (
          <div className="shrink-0 overflow-x-auto border-t border-foreground/10 bg-background p-2">
            <div className="flex gap-2">
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className={cn(
                    'relative h-16 w-28 shrink-0 overflow-hidden rounded-md border transition-all duration-150',
                    slide.id === activeSlideId
                      ? 'border-foreground/30 ring-1 ring-foreground/40'
                      : 'border-foreground/10 hover:border-foreground/20'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setActiveSlide(slide.id)}
                    className="h-full w-full cursor-pointer"
                  >
                    <img
                      src={slide.src}
                      alt=""
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSlide(slide.id);
                    }}
                    className="absolute top-1 right-1 z-10 flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border border-foreground/10 bg-card/90 text-muted-foreground transition-colors hover:bg-destructive hover:text-foreground hover:border-destructive"
                    title="Delete slide"
                  >
                    <Cancel01Icon size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
