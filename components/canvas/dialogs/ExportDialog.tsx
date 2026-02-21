"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScaleSlider, FormatSelector, QualityPresetSelector } from "@/components/export";
import { Download01Icon } from "hugeicons-react";
import type { ExportFormat, QualityPreset } from "@/lib/export/types";

function getStatusMessage(progress: number): string {
  if (progress < 15) return "Preparing your canvas...";
  if (progress < 35) return "Capturing every pixel...";
  if (progress < 55) return "Applying the finishing touches...";
  if (progress < 80) return "Almost there, hang tight...";
  return "Polishing your masterpiece...";
}

function ImageExportProgressView({ progress, format }: { progress: number; format: ExportFormat }) {
  const statusMessage = useMemo(() => getStatusMessage(progress), [progress]);
  const formatLabel = format === "jpeg" ? "JPEG" : "PNG";

  return (
    <div className="flex flex-col items-center py-8 space-y-6">
      {/* Bouncing ball loader */}
      <style>{`
        .bounce-loader {
          height: 60px;
          aspect-ratio: 2;
          border-bottom: 3px solid hsl(var(--muted-foreground) / 0.3);
          position: relative;
          overflow: hidden;
        }
        .bounce-loader::before {
          content: "";
          position: absolute;
          inset: auto 42.5% 0;
          aspect-ratio: 1;
          border-radius: 50%;
          background: var(--brand);
          animation:
            bounce-y 0.5s cubic-bezier(0, 900, 1, 900) infinite,
            bounce-x 2s linear infinite alternate;
        }
        @keyframes bounce-y {
          0%, 2% { bottom: 0% }
          98%, to { bottom: 0.1% }
        }
        @keyframes bounce-x {
          0% { translate: -500% }
          to { translate: 500% }
        }
      `}</style>
      <div className="bounce-loader" />

      {/* Percentage */}
      <span className="text-2xl font-bold text-brand tabular-nums">{progress}%</span>

      {/* Progress bar */}
      <div className="w-full">
        <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status message */}
      <p className="text-sm text-muted-foreground">
        {statusMessage}
      </p>

      {/* Format tag */}
      <div className="px-3 py-1 rounded-full bg-surface-3 border border-border/50">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
          Exporting as {formatLabel}
        </span>
      </div>
    </div>
  );
}

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: () => Promise<void>;
  scale: number;
  format: ExportFormat;
  qualityPreset: QualityPreset;
  isExporting: boolean;
  progress: number;
  onScaleChange: (scale: number) => void;
  onFormatChange: (format: ExportFormat) => void;
  onQualityPresetChange: (preset: QualityPreset) => void;
}

export function ExportDialog({
  open,
  onOpenChange,
  onExport,
  scale,
  format,
  qualityPreset,
  isExporting,
  progress,
  onScaleChange,
  onFormatChange,
  onQualityPresetChange,
}: ExportDialogProps) {
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setError(null);
    try {
      await onExport();
      onOpenChange(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to export image. Please try again.";
      setError(errorMessage);
    }
  };

  const formatLabel = format === 'jpeg' ? 'JPEG' : 'PNG';

  return (
    <Dialog open={open} onOpenChange={isExporting ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-[420px] max-h-[90vh] overflow-y-auto p-0">
        <div className="p-6 pb-4">
          <DialogHeader className="pb-1">
            <DialogTitle className="text-xl font-semibold text-foreground">
              {isExporting ? "Exporting Image" : "Export Canvas"}
            </DialogTitle>
            {isExporting && (
              <p className="text-sm text-muted-foreground pt-1">
                Sit back while we render your creation
              </p>
            )}
          </DialogHeader>
        </div>

        {isExporting ? (
          <div className="px-6 pb-6">
            <ImageExportProgressView progress={progress} format={format} />
          </div>
        ) : (
          <div className="px-6 pb-6 space-y-6">
            <FormatSelector format={format} onFormatChange={onFormatChange} />

            <QualityPresetSelector
              qualityPreset={qualityPreset}
              format={format}
              onQualityPresetChange={onQualityPresetChange}
            />

            <ScaleSlider scale={scale} onScaleChange={onScaleChange} />

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                {error}
              </div>
            )}

            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all"
            >
              <span className="flex items-center gap-2">
                <Download01Icon size={18} />
                Export as {formatLabel}
              </span>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
