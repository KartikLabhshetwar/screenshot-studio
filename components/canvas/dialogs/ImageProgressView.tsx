"use client";

import { useMemo } from "react";
import type { ExportFormat } from "@/lib/export/types";

export function getStatusMessage(progress: number): string {
  if (progress < 15) return "Preparing your canvas...";
  if (progress < 35) return "Capturing every pixel...";
  if (progress < 55) return "Applying the finishing touches...";
  if (progress < 80) return "Almost there, hang tight...";
  return "Polishing your masterpiece...";
}

export function ImageExportProgressView({
  progress,
  format,
  slideIndex,
  slideTotal,
}: {
  progress: number;
  format: ExportFormat;
  slideIndex?: number;
  slideTotal?: number;
}) {
  const statusMessage = useMemo(() => {
    if (slideIndex !== undefined && slideTotal !== undefined) {
      return `Exporting slide ${slideIndex} of ${slideTotal}...`;
    }
    return getStatusMessage(progress);
  }, [progress, slideIndex, slideTotal]);
  const formatLabel = format === "jpeg" ? "JPEG" : format === "webp" ? "WebP" : "PNG";

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
          background: var(--primary);
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
      <span className="text-2xl font-bold text-primary tabular-nums">{progress}%</span>

      {/* Progress bar */}
      <div className="w-full">
        <div className="h-1.5 bg-accent rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status message */}
      <p className="text-sm text-muted-foreground">
        {statusMessage}
      </p>

      {/* Format tag */}
      <div className="px-3 py-1 rounded-full bg-accent border border-border/50">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
          Exporting as {formatLabel}
        </span>
      </div>
    </div>
  );
}
