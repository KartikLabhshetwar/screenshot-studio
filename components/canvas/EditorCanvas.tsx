"use client";

import dynamic from "next/dynamic";
import { useEditorStore } from "@/lib/store";
import { useImageStore } from "@/lib/store";
import { CleanUploadState } from "@/components/controls/CleanUploadState";
import { useState } from "react";
import React from "react";
import { ExportSlideshowDialog } from "@/lib/export-slideshow-dialog";
import { aspectRatios } from "@/lib/constants/aspect-ratios";

const ClientCanvas = dynamic(() => import("@/components/canvas/ClientCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
});

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
    selectedAspectRatio,
  } = useImageStore();

  // Check both stores - imageStore is the source of truth (tracked by undo/redo)
  const hasImage = !!uploadedImageUrl && !!screenshot.src;
  const [exportOpen, setExportOpen] = useState(false);

  React.useEffect(() => {
    if (!isPreviewing) return;
    if (slides.length === 0) {
      stopPreview();
      return;
    }

    if (previewIndex >= slides.length) {
      stopPreview();
      return;
    }

    const slide = slides[previewIndex];
    setActiveSlide(slide.id);

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
    }, slide.duration * 1000);

    return () => clearTimeout(timer);
  }, [isPreviewing, previewIndex, slides.length]);

  // Show upload state if no image in either store
  if (!hasImage) {
    const currentRatio = aspectRatios.find((ar) => ar.id === selectedAspectRatio);
    const ratioValue = currentRatio ? currentRatio.width / currentRatio.height : 16 / 9;

    return (
      <div className="flex-1 flex flex-col h-full w-full">
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div
            className="relative rounded-lg overflow-hidden transition-all duration-300"
            style={{
              aspectRatio: `${ratioValue}`,
              width: `min(100%, min(48rem, calc(70vh * ${ratioValue})))`,
            }}
          >
            <CleanUploadState />
          </div>
        </div>
      </div>
    );
  }

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
          <ClientCanvas />
        </div>

        {/* Bottom filmstrip — only shown when timeline is NOT visible */}
        {slides.length > 1 && !showTimeline && (
          <div className="border-t border-border/30 bg-card p-2 shrink-0 overflow-x-auto">
            <div className="flex gap-2 overflow-x-auto">
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className={`relative w-28 shrink-0 h-16 rounded-lg overflow-hidden border cursor-pointer transition-all duration-200 ${
                    slide.id === activeSlideId
                      ? "ring-2 ring-foreground/50 border-foreground/30"
                      : "border-border/30 hover:border-border"
                  }`}
                >
                  <button
                    onClick={() => setActiveSlide(slide.id)}
                    className="h-full w-full"
                  >
                    <img
                      src={slide.src}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSlide(slide.id);
                    }}
                    className="absolute top-1 right-1 z-10 rounded bg-background/70 text-foreground hover:text-destructive-foreground cursor-pointer hover:bg-destructive transition h-5 w-5 flex items-center justify-center text-xs"
                    title="Delete slide"
                  >
                    ✕
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
