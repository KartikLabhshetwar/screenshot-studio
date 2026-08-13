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
    <div className="flex flex-col items-center py-6 space-y-5">
      <style>{`
        .bounce-loader {
          height: 60px;
          aspect-ratio: 2;
          border-bottom: 3px solid color-mix(in srgb, var(--foreground) 12%, transparent);
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

      <span className="text-2xl font-bold text-foreground tabular-nums">{progress}%</span>

      <div className="w-full">
        <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        {statusMessage}
      </p>

      <div className="px-3 py-1 rounded-md bg-foreground/[0.04] border border-foreground/10">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
          Exporting as {formatLabel}
        </span>
      </div>
    </div>
  );
}
