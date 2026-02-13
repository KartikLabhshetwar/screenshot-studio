"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScaleSlider, FormatSelector, QualityPresetSelector } from "@/components/export";
import type { ExportFormat, QualityPreset } from "@/lib/export/types";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: () => Promise<void>;
  scale: number;
  format: ExportFormat;
  qualityPreset: QualityPreset;
  isExporting: boolean;
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-foreground">Export Canvas</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 sm:space-y-5">
          <FormatSelector format={format} onFormatChange={onFormatChange} />
          <QualityPresetSelector
            qualityPreset={qualityPreset}
            format={format}
            onQualityPresetChange={onQualityPresetChange}
          />
          <ScaleSlider scale={scale} onScaleChange={onScaleChange} />

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">
              {error}
            </div>
          )}

          <Button
            onClick={handleExport}
            disabled={isExporting}
            variant="integration"
            showArrow={false}
            className="w-full"
          >
            {isExporting ? "Exporting..." : `Export as ${formatLabel}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

