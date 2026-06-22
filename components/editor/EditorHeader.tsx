'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NewTwitterIcon } from 'hugeicons-react';
import { Button } from '@/components/ui/button';
import {
  Download04Icon,
  Copy01Icon,
  AspectRatioIcon,
  Add01Icon,
  Video01Icon,
  Delete02Icon,
  ArrowTurnBackwardIcon,
  ArrowTurnForwardIcon,
  ArrowDown01Icon,
  Download01Icon,
  RefreshIcon,
  MagicWand01Icon,
  GridIcon,
  RulerIcon,
} from 'hugeicons-react';
import { useEditorStore, useImageStore } from '@/lib/store';
import { useExport } from '@/hooks/useExport';
import { aspectRatios } from '@/lib/constants/aspect-ratios';
import { AspectRatioPicker } from '@/components/aspect-ratio/aspect-ratio-picker';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { CopyProgressDialog } from '@/components/canvas/dialogs/CopyProgressDialog';
import { ExportSlideshowDialog } from '@/lib/export-slideshow-dialog';
import { ImageExportProgressView } from '@/components/canvas/dialogs/ImageProgressView';
import { FormatSelector, QualityPresetSelector, ScaleSlider } from '@/components/export';
import { cn } from '@/lib/utils';
import { GitHubStarButton } from '@/components/ui/github-star-button';
import { FeedbackWidget } from '@/components/FeedbackWidget';

export function EditorHeader() {
  const { screenshot } = useEditorStore();
  const { selectedAspectRatio, slides, uploadedImageUrl, clearImage, timeline, animationClips, resetCanvasSettings, setShowTemplates, showRulers, showGrid, rulerInterval, toggleRulers, toggleGrid, setRulerInterval } = useImageStore();
  const [aspectRatioOpen, setAspectRatioOpen] = React.useState(false);
  const [exportOpen, setExportOpen] = React.useState(false);
  const [exportSlideshowOpen, setExportSlideshowOpen] = React.useState(false);
  const [exportError, setExportError] = React.useState<string | null>(null);

  const currentAspectRatio = aspectRatios.find((ar) => ar.id === selectedAspectRatio);
  const hasImage = !!screenshot.src;

  // Undo/redo state
  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);

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

  const showVideoExport = slides.length > 0 || timeline.tracks.length > 0 || animationClips.length > 0;

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

  const handleExport = async () => {
    setExportError(null);
    try {
      await exportImage();
      setExportOpen(false);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Export failed. Please try again.');
    }
  };

  const formatLabel = exportSettings.format === 'jpeg' ? 'JPEG' : exportSettings.format === 'webp' ? 'WebP' : 'PNG';

  return (
    <>
      <header className="h-14 bg-card border-b border-border/40 flex items-center justify-between px-4 shrink-0">
        {/* Left - Logo + Undo/Redo */}
        <div className="flex items-center gap-3">
          <Link href="/landing" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <Image
              src="/favicon.svg"
              alt="Screenshot Studio"
              width={48}
              height={48}
              className="h-12 w-12"
            />
          </Link>

          <button
            onClick={() => setShowTemplates(true)}
            className="flex items-center gap-2 px-2.5 h-8 rounded-lg bg-muted/80 dark:bg-muted/50 border border-border/20 hover:bg-accent transition-colors duration-150 group"
          >
            <div className="flex items-center justify-center w-5 h-5 rounded bg-primary/10 text-primary">
              <MagicWand01Icon size={12} />
            </div>
            <span className="text-xs font-medium text-foreground">Templates</span>
          </button>

          {uploadedImageUrl && (
            <button
              onClick={resetCanvasSettings}
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-lg',
                'text-muted-foreground transition-all duration-150',
                'hover:bg-accent hover:text-foreground active:scale-95'
              )}
              title="Reset to defaults"
            >
              <RefreshIcon size={16} />
            </button>
          )}

          {hasImage && (
            <div className="flex items-center gap-1 ml-1">
              <button
                onClick={handleUndo}
                disabled={!canUndo}
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-lg',
                  'text-muted-foreground transition-all duration-150',
                  canUndo
                    ? 'hover:bg-accent hover:text-foreground active:scale-95'
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
                  'flex items-center justify-center w-8 h-8 rounded-lg',
                  'text-muted-foreground transition-all duration-150',
                  canRedo
                    ? 'hover:bg-accent hover:text-foreground active:scale-95'
                    : 'opacity-40 cursor-not-allowed'
                )}
                title="Redo (Cmd+Shift+Z)"
              >
                <ArrowTurnForwardIcon size={16} />
              </button>

              <div className="w-px h-4 bg-border/60 mx-0.5" />

              <button
                onClick={toggleRulers}
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 active:scale-95',
                  showRulers
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
                title="Toggle rulers"
              >
                <RulerIcon size={15} />
              </button>
              {showRulers && (
                <select
                  value={rulerInterval}
                  onChange={(e) => setRulerInterval(Number(e.target.value))}
                  className="h-7 px-1.5 text-[11px] rounded-md bg-accent text-foreground border-0 outline-none cursor-pointer"
                  title="Ruler interval"
                >
                  <option value={25}>25px</option>
                  <option value={50}>50px</option>
                  <option value={100}>100px</option>
                  <option value={200}>200px</option>
                </select>
              )}
              <button
                onClick={toggleGrid}
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 active:scale-95',
                  showGrid
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
                title="Toggle grid"
              >
                <GridIcon size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Right - All actions */}
        <div className="flex items-center gap-1.5">
          {/* Canvas controls */}
          <Popover open={aspectRatioOpen} onOpenChange={setAspectRatioOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 rounded-lg text-muted-foreground hover:text-foreground px-2.5"
              >
                <AspectRatioIcon size={15} />
                <span className="text-xs">{currentAspectRatio ? `${currentAspectRatio.width}:${currentAspectRatio.height}` : 'Auto'}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[420px]" align="end" sideOffset={8} collisionPadding={16}>
              <AspectRatioPicker onSelect={() => setAspectRatioOpen(false)} />
            </PopoverContent>
          </Popover>

          {/* Slide controls */}
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
              <span className="h-8 inline-flex items-center justify-center gap-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent text-xs transition-all font-medium px-2.5">
                <Add01Icon size={14} />
                <span>Add Slide</span>
              </span>
            </label>
          )}

          {showVideoExport && (
            <Button
              onClick={() => setExportSlideshowOpen(true)}
              size="sm"
              className="h-8 gap-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium px-3"
            >
              <Video01Icon size={14} />
              <span>Export Video</span>
            </Button>
          )}

          {/* Separator */}
          {hasImage && <div className="w-px h-5 bg-border/60 mx-1" />}

          {/* Export actions */}
          <Button
            onClick={() => copyImage()}
            disabled={!hasImage || isExporting || isCopying}
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 rounded-lg text-muted-foreground hover:text-foreground px-2.5 text-xs"
          >
            <Copy01Icon size={15} />
            <span>Copy</span>
          </Button>

          <Popover open={exportOpen} onOpenChange={isExporting ? undefined : setExportOpen}>
            <PopoverTrigger asChild>
              <Button
                disabled={!hasImage}
                size="sm"
                className="h-8 gap-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium px-3"
              >
                <Download04Icon size={15} />
                <span>Save</span>
                <ArrowDown01Icon size={12} className="ml-0.5 opacity-70" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[340px] p-0"
              align="end"
              sideOffset={8}
              collisionPadding={16}
              onPointerDownOutside={isExporting ? (e) => e.preventDefault() : undefined}
            >
              {isExporting ? (
                <div className="p-5">
                  <p className="text-sm font-medium text-foreground mb-1">Exporting...</p>
                  <p className="text-xs text-muted-foreground mb-4">Rendering your creation</p>
                  <ImageExportProgressView progress={progress} format={exportSettings.format} />
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  <FormatSelector format={exportSettings.format} onFormatChange={updateFormat} />
                  <QualityPresetSelector
                    qualityPreset={exportSettings.qualityPreset}
                    format={exportSettings.format}
                    onQualityPresetChange={updateQualityPreset}
                  />
                  <ScaleSlider scale={exportSettings.scale} onScaleChange={updateScale} />

                  {exportError && (
                    <div className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-lg border border-destructive/20">
                      {exportError}
                    </div>
                  )}

                  <Button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="w-full h-10 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all"
                  >
                    <Download01Icon size={16} className="mr-2" />
                    Export as {formatLabel}
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* Separator */}
          {hasImage && <div className="w-px h-5 bg-border/60 mx-1" />}

          {hasImage && (
            <Button
              onClick={clearImage}
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-destructive"
            >
              <Delete02Icon size={14} />
              <span>Remove</span>
            </Button>
          )}

          <div className="flex items-center gap-1 ml-1">
            <FeedbackWidget />
            <GitHubStarButton compact />
            <a
              href="https://x.com/code_kartik"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            >
              <NewTwitterIcon className="h-4 w-4" />
            </a>
          </div>

          <div className="hidden sm:flex items-center gap-3 ml-2 pl-2 border-l border-border/40">
            <Link href="/about" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/privacy-policy" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </header>

      <CopyProgressDialog open={isCopying} progress={copyProgress} />

      <ExportSlideshowDialog
        open={exportSlideshowOpen}
        onOpenChange={setExportSlideshowOpen}
      />
    </>
  );
}
