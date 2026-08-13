"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScaleSlider, FormatSelector, QualityPresetSelector } from "@/components/export";
import { Download01Icon } from "hugeicons-react";
import { ImageExportProgressView } from "./ImageProgressView";
import type { ExportFormat, QualityPreset } from "@/lib/export/types";

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

  const formatLabel = format === 'jpeg' ? 'JPEG' : format === 'webp' ? 'WebP' : 'PNG';

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
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full h-10 text-sm font-semibold rounded-md"
            >
              <span className="flex items-center gap-2">
                <Download01Icon size={16} />
                Export as {formatLabel}
              </span>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
