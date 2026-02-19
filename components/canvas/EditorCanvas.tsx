"use client";

import dynamic from "next/dynamic";
import { useEditorStore } from "@/lib/store";
import { useImageStore } from "@/lib/store";
import { CleanUploadState } from "@/components/controls/CleanUploadState";
import { Button } from "@/components/ui/button";
import {
  Delete02Icon,
  Add01Icon,
  Video01Icon,
  ArrowTurnBackwardIcon,
  ArrowTurnForwardIcon,
} from "hugeicons-react";
import { useState, useEffect, useCallback } from "react";
import React from "react";
import { cn } from "@/lib/utils";
import { ExportSlideshowDialog } from "@/lib/export-slideshow-dialog";

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
    clearImage,
    showTimeline,
    timeline,
    animationClips,
  } = useImageStore();

  // Check both stores - imageStore is the source of truth (tracked by undo/redo)
  const hasImage = !!uploadedImageUrl && !!screenshot.src;
  const [exportOpen, setExportOpen] = useState(false);

  // Track temporal state reactively for undo/redo
  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);

  useEffect(() => {
    const updateTemporalState = () => {
      const { pastStates, futureStates } = useImageStore.temporal.getState();
      setCanUndo(pastStates.length > 0);
      setCanRedo(futureStates.length > 0);
    };
    updateTemporalState();
    const unsubscribe = useImageStore.temporal.subscribe(updateTemporalState);
    return unsubscribe;
  }, []);

  const handleUndo = useCallback(() => {
    const { undo, pastStates } = useImageStore.temporal.getState();
    if (pastStates.length > 0) {
      undo();
    }
  }, []);

  const handleRedo = useCallback(() => {
    const { redo, futureStates } = useImageStore.temporal.getState();
    if (futureStates.length > 0) {
      redo();
    }
  }, []);

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
    return (
      <div className="flex-1 flex flex-col h-full w-full">
        {/* Canvas area with background */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
          <div className="relative w-full max-w-3xl aspect-video md:aspect-auto md:h-[70vh] rounded-lg overflow-hidden">
            <CleanUploadState />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full w-full relative">
        {/* Secondary toolbar for slides and image management */}
        {(slides.length > 0 || uploadedImageUrl) && (
          <div className="flex items-center justify-between gap-2 p-2 border-b border-border/30 bg-[#1e1e1e] shrink-0">
            {/* Left side - Undo/Redo controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleUndo}
                disabled={!canUndo}
                className={cn(
                  'flex items-center justify-center w-9 h-9 rounded-lg',
                  'bg-surface-3/60 border border-border/30',
                  'text-text-secondary transition-all duration-150',
                  canUndo
                    ? 'hover:bg-surface-4 hover:text-foreground active:scale-95'
                    : 'opacity-40 cursor-not-allowed'
                )}
                title="Undo (Cmd+Z)"
              >
                <ArrowTurnBackwardIcon size={16} />
              </button>

              <button
                onClick={handleRedo}
                disabled={!canRedo}
                className={cn(
                  'flex items-center justify-center w-9 h-9 rounded-lg',
                  'bg-surface-3/60 border border-border/30',
                  'text-text-secondary transition-all duration-150',
                  canRedo
                    ? 'hover:bg-surface-4 hover:text-foreground active:scale-95'
                    : 'opacity-40 cursor-not-allowed'
                )}
                title="Redo (Cmd+Shift+Z)"
              >
                <ArrowTurnForwardIcon size={16} />
              </button>
            </div>

            {/* Right side - Slide and export controls */}
            <div className="flex items-center gap-2">
              {slides.length > 0 && (
                <label className="cursor-pointer inline-flex">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.length) {
                        useImageStore.getState().addImages(Array.from(e.target.files));
                      }
                    }}
                  />
                  <span className="h-8 inline-flex items-center justify-center gap-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-sm transition-all font-medium border border-border px-3">
                    <Add01Icon size={14} />
                    <span>Add Slide</span>
                  </span>
                </label>
              )}

              {(slides.length > 0 || timeline.tracks.length > 0 || animationClips.length > 0) && (
                <Button
                  onClick={() => setExportOpen(true)}
                  size="sm"
                  className="h-8 justify-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all font-medium px-3"
                >
                  <Video01Icon size={14} />
                  <span>Export Video</span>
                </Button>
              )}

              <ExportSlideshowDialog
                open={exportOpen}
                onOpenChange={setExportOpen}
              />

              <Button
                onClick={clearImage}
                disabled={!uploadedImageUrl}
                variant="ghost"
                size="sm"
                className="h-8 justify-center gap-2 px-3 text-muted-foreground hover:text-destructive"
              >
                <Delete02Icon size={14} />
                <span>Remove</span>
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6">
          <ClientCanvas />
        </div>

        {/* Bottom filmstrip — only shown when timeline is NOT visible */}
        {slides.length > 1 && !showTimeline && (
          <div className="border-t border-border/30 bg-surface-2 p-2 shrink-0 overflow-x-auto">
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
                    className="absolute top-1 right-1 z-10 rounded bg-white/70 text-black hover:text-white cursor-pointer hover:bg-red-600 transition h-5 w-5 flex items-center justify-center text-xs"
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
