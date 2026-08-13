"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageExportProgressView } from "./ImageProgressView";

interface CopyProgressDialogProps {
  open: boolean;
  progress: number;
}

export function CopyProgressDialog({ open, progress }: CopyProgressDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-[420px] max-h-[90vh] overflow-y-auto p-0"
        showCloseButton={false}
      >
        <div className="p-6 pb-4">
          <DialogHeader className="pb-1">
            <DialogTitle className="text-xl font-semibold text-foreground">
              Copying Image
            </DialogTitle>
            <p className="text-sm text-muted-foreground pt-1">
              Preparing your image for the clipboard
            </p>
          </DialogHeader>
        </div>
        <div className="px-6 pb-6">
          <ImageExportProgressView progress={progress} format="png" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
