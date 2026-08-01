"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageExportProgressView } from "./ImageProgressView";
import type { ExportFormat } from "@/lib/export/types";
import type { BatchProgress } from "@/hooks/useBatchExport";

interface BatchExportProgressDialogProps {
  open: boolean;
  batchProgress: BatchProgress;
  format: ExportFormat;
}

export function BatchExportProgressDialog({ open, batchProgress, format }: BatchExportProgressDialogProps) {
  const progress = batchProgress.total > 0
    ? Math.round((batchProgress.current / batchProgress.total) * 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[420px] max-h-[90vh] overflow-y-auto p-0">
        <div className="p-6 pb-4">
          <DialogHeader className="pb-1">
            <DialogTitle className="text-xl font-semibold text-foreground">
              Exporting All Slides
            </DialogTitle>
            <p className="text-sm text-muted-foreground pt-1">
              Rendering each slide with your current style
            </p>
          </DialogHeader>
        </div>
        <div className="px-6 pb-6">
          <ImageExportProgressView
            progress={progress}
            format={format}
            slideIndex={batchProgress.current}
            slideTotal={batchProgress.total}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
