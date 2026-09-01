"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { NewTwitterIcon } from "hugeicons-react";
import { Button } from "@/components/ui/button";
import {
  Download04Icon,
  Copy01Icon,
  AspectRatioIcon,
  Add01Icon,
  Video01Icon,
  Delete02Icon,
  ArrowTurnBackwardIcon,
  ArrowTurnForwardIcon,
  Download01Icon,
  RefreshIcon,
  MagicWand01Icon,
  GridIcon,
  RulerIcon,
  FileZipIcon,
} from "hugeicons-react";
import { useEditorStore, useImageStore } from "@/lib/store";
import { useExport } from "@/hooks/useExport";
import { useBatchExport } from "@/hooks/useBatchExport";
import { aspectRatios } from "@/lib/constants/aspect-ratios";
import { AspectRatioPicker } from "@/components/aspect-ratio/aspect-ratio-picker";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CopyProgressDialog } from "@/components/canvas/dialogs/CopyProgressDialog";
import { BatchExportProgressDialog } from "@/components/canvas/dialogs/BatchExportProgressDialog";
import { ExportSlideshowDialog } from "@/lib/export-slideshow-dialog";
import { ImageExportProgressView } from "@/components/canvas/dialogs/ImageProgressView";
import {
  FormatSelector,
  QualityPresetSelector,
  ScaleSlider,
} from "@/components/export";
import { cn } from "@/lib/utils";
import { GitHubStarButton } from "@/components/ui/github-star-button";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  hasVisibleMockups,
  shouldRenderSourceImage,
} from "@/lib/device-mockups/layouts";

export function EditorHeader() {
  const isMobile = useIsMobile();
  const { screenshot } = useEditorStore();
  const {
    selectedAspectRatio,
    slides,
    uploadedImageUrl,
    editorMode,
    mockups,
    clearImage,
    timeline,
    animationClips,
    resetCanvasSettings,
    showTemplates,
    setShowTemplates,
    showRulers,
    showGrid,
    rulerInterval,
    toggleRulers,
    toggleGrid,
    setRulerInterval,
  } = useImageStore();
  const [aspectRatioOpen, setAspectRatioOpen] = React.useState(false);
  const [exportOpen, setExportOpen] = React.useState(false);
  const [exportSlideshowOpen, setExportSlideshowOpen] = React.useState(false);
  const [exportError, setExportError] = React.useState<string | null>(null);

  const currentAspectRatio = aspectRatios.find(
    (ar) => ar.id === selectedAspectRatio,
  );
  const hasImage = (
    !!screenshot.src && shouldRenderSourceImage(editorMode, mockups)
  ) || (
    editorMode === "device" && hasVisibleMockups(mockups)
  );

  // Undo/redo state
  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);
  const showHistoryControls = hasImage || canUndo || canRedo;

  React.useEffect(() => {
    const updateTemporalState = () => {
      const { pastStates, futureStates } = useImageStore.temporal.getState();
      setCanUndo(pastStates.length > 0);
      setCanRedo(futureStates.length > 0);
    };
    updateTemporalState();
    const unsubscribe = useImageStore.temporal.subscribe(updateTemporalState);
    return unsubscribe;
  }, []);

  const handleUndo = React.useCallback(() => {
    const { undo, pastStates } = useImageStore.temporal.getState();
    if (pastStates.length > 0) undo();
  }, []);

  const handleRedo = React.useCallback(() => {
    const { redo, futureStates } = useImageStore.temporal.getState();
    if (futureStates.length > 0) redo();
  }, []);

  const showVideoExport =
    slides.length > 0 ||
    timeline.tracks.length > 0 ||
    animationClips.length > 0;

  const {
    copyImage,
    isExporting,
    isCopying,
    progress,
    copyProgress,
    settings: exportSettings,
    exportImage,
    updateScale,
    updateFormat,
    updateQualityPreset,
  } = useExport(selectedAspectRatio);

  const { isBatchExporting, batchProgress, exportAllSlides } = useBatchExport(
    selectedAspectRatio,
    exportSettings,
  );

  const handleExport = async () => {
    setExportError(null);
    try {
      await exportImage();
      setExportOpen(false);
    } catch (err) {
      setExportError(
        err instanceof Error ? err.message : "Export failed. Please try again.",
      );
    }
  };

  const handleExportAll = async () => {
    setExportOpen(false);
    await exportAllSlides();
  };

  const formatLabel =
    exportSettings.format === "jpeg"
      ? "JPEG"
      : exportSettings.format === "webp"
        ? "WebP"
        : "PNG";

  return (
    <>
      <header
        className={cn(
          "h-16 bg-background border-b border-foreground/10 grid grid-cols-[1fr_auto_1fr] items-center shrink-0",
          isMobile ? "gap-1 px-2" : "gap-3 px-4"
        )}
      >
        <div className="flex items-center h-8 justify-self-start min-w-0">
          <Link
            href="/landing"
            className="flex items-center gap-2.5 h-8 hover:opacity-80 transition-opacity shrink-0"
          >
            <Image
              src="/logo-mark.png"
              alt="Screenshot Studio"
              width={32}
              height={32}
              className="h-8 w-8"
              priority
            />
            <span className="hidden sm:inline font-semibold text-foreground text-sm tracking-tight leading-none">
              Screenshot Studio
            </span>
          </Link>

          <div
            className={cn(
              "h-4 w-px bg-foreground/10 shrink-0",
              isMobile ? "mx-1.5" : "mx-2.5"
            )}
            aria-hidden
          />

          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            aria-expanded={showTemplates}
            aria-label="Templates"
            className={cn(
              "inline-flex items-center gap-1.5 h-8 px-2 rounded-md shrink-0 cursor-pointer",
              "text-sm font-medium leading-none transition-colors duration-150",
              showTemplates
                ? "text-foreground hover:text-foreground/70"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MagicWand01Icon size={14} className="shrink-0" />
            {!isMobile ? <span>Templates</span> : null}
          </button>
        </div>

        <div
          className={cn(
            "flex items-center justify-center justify-self-center",
            isMobile ? "gap-1" : "gap-2.5"
          )}
        >
          {showHistoryControls ? (
            <div className="flex items-center gap-1">
              <button
                onClick={handleUndo}
                disabled={!canUndo}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-md shrink-0 cursor-pointer",
                  "text-muted-foreground transition-all duration-150",
                  canUndo
                    ? "hover:text-foreground active:scale-95"
                    : "opacity-40 cursor-not-allowed",
                )}
                title="Undo (Cmd+Z)"
              >
                <ArrowTurnBackwardIcon size={16} />
              </button>
              <button
                onClick={handleRedo}
                disabled={!canRedo}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-md shrink-0 cursor-pointer",
                  "text-muted-foreground transition-all duration-150",
                  canRedo
                    ? "hover:text-foreground active:scale-95"
                    : "opacity-40 cursor-not-allowed",
                )}
                title="Redo (Cmd+Shift+Z)"
              >
                <ArrowTurnForwardIcon size={16} />
              </button>
            </div>
          ) : null}

          {hasImage && !isMobile ? (
            <div className="w-px h-4 bg-foreground/10 shrink-0" aria-hidden />
          ) : null}

          {hasImage && !isMobile ? (
            <div className="flex items-center gap-1">
              <button
                onClick={toggleRulers}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-md shrink-0 cursor-pointer transition-all duration-150 active:scale-95",
                  showRulers
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                title="Toggle rulers"
              >
                <RulerIcon size={15} />
              </button>
              {showRulers ? (
                <select
                  value={rulerInterval}
                  onChange={(e) => setRulerInterval(Number(e.target.value))}
                  className="h-8 px-1.5 text-[11px] rounded-md bg-muted text-foreground border-0 outline-none cursor-pointer shrink-0"
                  title="Ruler interval"
                >
                  <option value={25}>25px</option>
                  <option value={50}>50px</option>
                  <option value={100}>100px</option>
                  <option value={200}>200px</option>
                </select>
              ) : null}
              <button
                onClick={toggleGrid}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-md shrink-0 cursor-pointer transition-all duration-150 active:scale-95",
                  showGrid
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                title="Toggle grid"
              >
                <GridIcon size={15} />
              </button>
            </div>
          ) : null}

          {hasImage && !isMobile ? (
            <div className="w-px h-4 bg-foreground/10 shrink-0" aria-hidden />
          ) : null}

          <div className="flex items-center gap-1">
            <Popover open={aspectRatioOpen} onOpenChange={setAspectRatioOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 gap-1.5 rounded-md text-muted-foreground hover:text-foreground shrink-0",
                    isMobile ? "px-1.5" : "px-2.5"
                  )}
                >
                  <AspectRatioIcon size={15} />
                  <span className="text-xs leading-none">
                    {currentAspectRatio
                      ? `${currentAspectRatio.width}:${currentAspectRatio.height}`
                      : "Auto"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="p-0 w-[420px]"
                align="center"
                sideOffset={8}
                collisionPadding={16}
              >
                <AspectRatioPicker onSelect={() => setAspectRatioOpen(false)} />
              </PopoverContent>
            </Popover>

            {slides.length > 0 && !isMobile ? (
              <label className="cursor-pointer inline-flex shrink-0">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      useImageStore
                        .getState()
                        .addImages(Array.from(e.target.files));
                    }
                  }}
                />
                <span className="h-8 inline-flex items-center justify-center gap-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted text-xs leading-none transition-all font-medium px-2.5">
                  <Add01Icon size={14} />
                  <span>Add Slide</span>
                </span>
              </label>
            ) : null}
          </div>

          <div className="w-px h-4 bg-foreground/10 shrink-0" aria-hidden />

          <div className={cn("flex items-center", isMobile ? "gap-1" : "gap-1.5")}>
            <Button
              onClick={() => copyImage()}
              disabled={!hasImage || isExporting || isCopying}
              variant="ghost"
              size="sm"
              aria-label="Copy"
              className={cn(
                "h-8 gap-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-transparent dark:hover:bg-transparent text-xs leading-none shrink-0",
                isMobile ? "px-1.5" : "px-2.5"
              )}
            >
              <Copy01Icon size={15} />
              {!isMobile ? <span>Copy</span> : null}
            </Button>

            <Popover
              open={exportOpen}
              onOpenChange={isExporting ? undefined : setExportOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  disabled={!hasImage}
                  size="sm"
                  aria-label="Save"
                  className={cn(
                    "h-8 gap-1.5 rounded-md text-xs font-medium leading-none shrink-0",
                    isMobile ? "px-2" : "px-3"
                  )}
                >
                  <Download04Icon size={15} />
                  {!isMobile ? <span>Save</span> : null}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[340px] p-0"
                align="center"
                sideOffset={8}
                collisionPadding={16}
                onPointerDownOutside={
                  isExporting ? (e) => e.preventDefault() : undefined
                }
              >
                {isExporting ? (
                  <div className="p-5">
                    <p className="text-sm font-medium text-foreground mb-1">
                      Exporting...
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Rendering your creation
                    </p>
                    <ImageExportProgressView
                      progress={progress}
                      format={exportSettings.format}
                    />
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    <FormatSelector
                      format={exportSettings.format}
                      onFormatChange={updateFormat}
                    />
                    <QualityPresetSelector
                      qualityPreset={exportSettings.qualityPreset}
                      format={exportSettings.format}
                      onQualityPresetChange={updateQualityPreset}
                    />
                    <ScaleSlider
                      scale={exportSettings.scale}
                      onScaleChange={updateScale}
                    />

                    {exportError && (
                      <div className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-md border border-destructive/20">
                        {exportError}
                      </div>
                    )}

                    <Button
                      onClick={handleExport}
                      disabled={isExporting}
                      className="w-full h-10 text-sm font-semibold rounded-md transition-all"
                    >
                      <Download01Icon size={16} className="mr-2" />
                      Export as {formatLabel}
                    </Button>

                    {slides.length > 1 && (
                      <Button
                        onClick={handleExportAll}
                        disabled={isExporting || isBatchExporting}
                        variant="outline"
                        className="w-full h-10 text-sm font-semibold rounded-md transition-all"
                      >
                        <FileZipIcon size={16} className="mr-2" />
                        Export All ({slides.length})
                      </Button>
                    )}
                  </div>
                )}
              </PopoverContent>
            </Popover>

            {hasImage && showVideoExport && !isMobile ? (
              <Button
                onClick={() => setExportSlideshowOpen(true)}
                size="sm"
                className="h-8 gap-1.5 rounded-md text-xs font-medium leading-none px-3 shrink-0"
              >
                <Video01Icon size={14} />
                <span>Export Video</span>
              </Button>
            ) : null}
          </div>

          {(hasImage || uploadedImageUrl) && !isMobile ? (
            <>
              <div className="w-px h-4 bg-foreground/10 shrink-0" aria-hidden />
              <div className="flex items-center gap-1">
                {uploadedImageUrl ? (
                  <button
                    onClick={resetCanvasSettings}
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-md shrink-0 cursor-pointer",
                      "text-muted-foreground transition-all duration-150",
                      "hover:text-foreground active:scale-95",
                    )}
                    title="Reset to defaults"
                  >
                    <RefreshIcon size={16} />
                  </button>
                ) : null}
                {hasImage ? (
                  <Button
                    onClick={clearImage}
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 px-2.5 text-xs leading-none text-muted-foreground hover:text-destructive hover:bg-transparent dark:hover:bg-transparent shrink-0"
                  >
                    <Delete02Icon size={14} />
                    <span>Remove</span>
                  </Button>
                ) : null}
              </div>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-1 justify-self-end">
          {!isMobile ? <FeedbackWidget /> : null}
          {!isMobile ? <GitHubStarButton compact /> : null}
          <a
            href="https://x.com/code_kartik"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground transition-[color,filter] duration-150 hover:text-foreground "
          >
            <NewTwitterIcon className="h-[18px] w-[18px]" />
          </a>
        </div>
      </header>

      <CopyProgressDialog open={isCopying} progress={copyProgress} />

      <BatchExportProgressDialog
        open={isBatchExporting}
        batchProgress={batchProgress}
        format={exportSettings.format}
      />

      <ExportSlideshowDialog
        open={exportSlideshowOpen}
        onOpenChange={setExportSlideshowOpen}
      />
    </>
  );
}
