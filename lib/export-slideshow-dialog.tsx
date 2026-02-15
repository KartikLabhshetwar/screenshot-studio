"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useImageStore } from "@/lib/store";
import {
  exportSlideshowVideo,
  exportAnimationVideo,
  type VideoExportOptions,
} from "@/lib/export-slideshow-video";
import { useExportProgress } from "@/hooks/useExportProgress";
import { isMp4Supported, type VideoFormat, type VideoQuality } from "@/lib/export/video-encoder";

type ExportMode = "slideshow" | "animation";

const FORMAT_OPTIONS: { value: VideoFormat; label: string; description: string }[] = [
  { value: "mp4", label: "MP4 (H.264)", description: "Best compatibility, smaller file size" },
  { value: "webm", label: "WebM (VP8)", description: "Open format, web-optimized" },
];

const QUALITY_OPTIONS: { value: VideoQuality; label: string; bitrate: string }[] = [
  { value: "high", label: "High", bitrate: "25 Mbps" },
  { value: "medium", label: "Medium", bitrate: "10 Mbps" },
  { value: "low", label: "Low", bitrate: "5 Mbps" },
];

export function ExportSlideshowDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { slideshow, setSlideshow, timeline, slides } = useImageStore();
  const { active: exporting, progress } = useExportProgress();
  const [format, setFormat] = useState<VideoFormat>("mp4");
  const [quality, setQuality] = useState<VideoQuality>("high");
  const [mp4Supported, setMp4Supported] = useState(true);

  // Determine export mode based on what's available
  const hasAnimation = timeline.tracks.length > 0;
  const hasSlides = slides.length >= 1; // At least one slide
  const [exportMode, setExportMode] = useState<ExportMode>(hasAnimation ? "animation" : "slideshow");

  useEffect(() => {
    setMp4Supported(isMp4Supported());
  }, []);

  // Update export mode when content changes
  useEffect(() => {
    if (hasAnimation && !hasSlides) {
      setExportMode("animation");
    } else if (hasSlides && !hasAnimation) {
      setExportMode("slideshow");
    }
  }, [hasAnimation, hasSlides]);

  const handleExport = async () => {
    try {
      let result;
      if (exportMode === "animation") {
        result = await exportAnimationVideo({ format, quality });
      } else {
        result = await exportSlideshowVideo({ format, quality });
      }
      if (result.format !== format) {
        console.info(`Exported as ${result.format} (${format} not supported)`);
      }
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Video</DialogTitle>
          <DialogDescription>
            Configure your video export settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Export Mode Selection - only show if both options available */}
          {hasAnimation && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">Export Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setExportMode("animation")}
                  className={`
                    relative p-3 rounded-lg border text-left transition-all
                    ${exportMode === "animation"
                      ? "border-white/30 bg-white/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                    }
                  `}
                >
                  <div className="font-medium text-sm text-white/90">Animation</div>
                  <div className="text-xs text-white/50 mt-0.5">
                    {(timeline.duration / 1000).toFixed(1)}s video
                  </div>
                </button>
                <button
                  onClick={() => setExportMode("slideshow")}
                  className={`
                    relative p-3 rounded-lg border text-left transition-all
                    ${exportMode === "slideshow"
                      ? "border-white/30 bg-white/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                    }
                  `}
                >
                  <div className="font-medium text-sm text-white/90">Slideshow</div>
                  <div className="text-xs text-white/50 mt-0.5">
                    {slides.length > 0 ? `${slides.length} slide${slides.length > 1 ? 's' : ''}` : 'Single image'}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Format Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Format</label>
            <div className="grid grid-cols-2 gap-2">
              {FORMAT_OPTIONS.map((opt) => {
                const isDisabled = opt.value === "mp4" && !mp4Supported;
                return (
                  <button
                    key={opt.value}
                    onClick={() => !isDisabled && setFormat(opt.value)}
                    disabled={isDisabled}
                    className={`
                      relative p-3 rounded-lg border text-left transition-all
                      ${format === opt.value
                        ? "border-white/30 bg-white/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                      }
                      ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    `}
                  >
                    <div className="font-medium text-sm text-white/90">{opt.label}</div>
                    <div className="text-xs text-white/50 mt-0.5">{opt.description}</div>
                    {isDisabled && (
                      <div className="text-xs text-amber-400 mt-1">Browser not supported</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quality Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Quality</label>
            <div className="flex gap-2">
              {QUALITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setQuality(opt.value)}
                  className={`
                    flex-1 py-2 px-3 rounded-lg border text-center transition-all
                    ${quality === opt.value
                      ? "border-white/30 bg-white/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                    }
                  `}
                >
                  <div className="font-medium text-sm text-white/90">{opt.label}</div>
                  <div className="text-xs text-white/40">{opt.bitrate}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Slide Duration - only for slideshow mode */}
          {exportMode === "slideshow" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">
                Slide Duration
              </label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min={0.5}
                  max={30}
                  step={0.5}
                  value={slideshow.defaultDuration}
                  onChange={(e) =>
                    setSlideshow({ defaultDuration: Number(e.target.value) || 3 })
                  }
                  className="flex-1"
                />
                <span className="text-sm text-white/50">seconds per slide</span>
              </div>
            </div>
          )}

          {/* Animation Duration Info - only for animation mode */}
          {exportMode === "animation" && (
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Animation Duration</span>
                <span className="text-sm font-medium text-white/90">
                  {(timeline.duration / 1000).toFixed(1)} seconds
                </span>
              </div>
              <p className="text-xs text-white/40 mt-1">
                Adjust duration in the timeline controls
              </p>
            </div>
          )}

          {/* Progress Bar */}
          {exporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Encoding video...</span>
                <span className="text-white/50">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Export Button */}
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="w-full"
            size="lg"
          >
            {exporting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Exporting...
              </span>
            ) : (
              `Export as ${format.toUpperCase()}`
            )}
          </Button>

          {/* Info */}
          {!mp4Supported && format === "webm" && (
            <p className="text-xs text-white/40 text-center">
              MP4 export requires a browser with WebCodecs support (Chrome 94+, Edge 94+)
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
