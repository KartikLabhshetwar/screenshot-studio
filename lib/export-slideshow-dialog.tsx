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
  preloadFFmpeg,
  type VideoExportOptions,
} from "@/lib/export-slideshow-video";
import { isFFmpegLoaded } from "@/lib/export/ffmpeg-encoder";
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

const EXPORT_MESSAGES = [
  "Capturing frames...",
  "Assembling your masterpiece...",
  "Encoding pixels with care...",
  "Almost there, hang tight...",
  "Polishing the final cut...",
];

function ExportProgressView({ progress, format }: { progress: number; format: string }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (progress < 20) setMessageIndex(0);
    else if (progress < 40) setMessageIndex(1);
    else if (progress < 60) setMessageIndex(2);
    else if (progress < 85) setMessageIndex(3);
    else setMessageIndex(4);
  }, [progress]);

  const roundedProgress = Math.round(progress);

  return (
    <div className="flex flex-col items-center py-8 space-y-6">
      {/* Film reel loader */}
      <style>{`
        .film-loader {
          width: 80px;
          height: 70px;
          border: 5px solid var(--brand);
          padding: 0 8px;
          box-sizing: border-box;
          background:
            linear-gradient(var(--brand) 0 0) 0 0/8px 20px,
            linear-gradient(var(--brand) 0 0) 100% 0/8px 20px,
            radial-gradient(farthest-side, var(--brand) 90%, #0000) 0 5px/8px 8px content-box,
            var(--surface-3);
          background-repeat: no-repeat;
          animation: filmLoad 2s infinite linear;
        }
        @keyframes filmLoad {
          25% { background-position: 0 0, 100% 100%, 100% calc(100% - 5px); }
          50% { background-position: 0 100%, 100% 100%, 0 calc(100% - 5px); }
          75% { background-position: 0 100%, 100% 0, 100% 5px; }
        }
      `}</style>
      <div className="film-loader" />

      {/* Percentage */}
      <span className="text-2xl font-bold text-brand tabular-nums">{roundedProgress}%</span>

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
        {EXPORT_MESSAGES[messageIndex]}
      </p>

      {/* Format tag */}
      <div className="px-3 py-1 rounded-full bg-surface-3 border border-border/50">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
          Exporting as {format.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

export function ExportSlideshowDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { slideshow, setSlideshow, timeline, slides, animationClips } = useImageStore();
  const { active: exporting, progress } = useExportProgress();
  const [format, setFormat] = useState<VideoFormat>("mp4");
  const [quality, setQuality] = useState<VideoQuality>("high");
  const [mp4Supported, setMp4Supported] = useState(true);

  const hasAnimation = timeline.tracks.length > 0 || animationClips.length > 0;
  const hasSlides = slides.length > 1;
  const [exportMode, setExportMode] = useState<ExportMode>("animation");

  useEffect(() => {
    setMp4Supported(isMp4Supported());
  }, []);

  // Preload FFmpeg WASM when dialog opens (hides 2-5s load behind UI interaction)
  useEffect(() => {
    if (open && !isFFmpegLoaded()) {
      preloadFFmpeg().catch(() => {});
    }
  }, [open]);

  // Sync export mode when dialog opens
  useEffect(() => {
    if (open) {
      if (hasAnimation) {
        setExportMode("animation");
      } else {
        setExportMode("slideshow");
      }
    }
  }, [open, hasAnimation]);

  const handleExport = async () => {
    try {
      const options: VideoExportOptions = { format, quality };
      let result;
      if (exportMode === "animation") {
        result = await exportAnimationVideo(options);
      } else {
        result = await exportSlideshowVideo(options);
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
        {exporting ? (
          /* ---- Fun export progress view ---- */
          <div>
            <DialogHeader>
              <DialogTitle>Exporting Video</DialogTitle>
              <DialogDescription>
                Sit back while we render your creation
              </DialogDescription>
            </DialogHeader>
            <ExportProgressView progress={progress} format={format} />
          </div>
        ) : (
          /* ---- Settings view ---- */
          <>
            <DialogHeader>
              <DialogTitle>Export Video</DialogTitle>
              <DialogDescription>
                Configure your video export settings
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 pt-2">
              {/* Export Mode Selection */}
              {(hasAnimation || hasSlides) && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/90">Export Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setExportMode("animation")}
                      className={`
                        relative p-3 rounded-lg border text-left transition-all
                        ${exportMode === "animation"
                          ? "border-brand/50 bg-brand/10"
                          : "border-border bg-surface-2 hover:border-border/80"
                        }
                      `}
                    >
                      <div className="font-medium text-sm text-foreground/90">Animation</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {(timeline.duration / 1000).toFixed(1)}s video
                      </div>
                    </button>
                    <button
                      onClick={() => setExportMode("slideshow")}
                      className={`
                        relative p-3 rounded-lg border text-left transition-all
                        ${exportMode === "slideshow"
                          ? "border-brand/50 bg-brand/10"
                          : "border-border bg-surface-2 hover:border-border/80"
                        }
                      `}
                    >
                      <div className="font-medium text-sm text-foreground/90">Slideshow</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {slides.length > 0 ? `${slides.length} slide${slides.length > 1 ? 's' : ''}` : 'Single image'}
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Format Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/90">Format</label>
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
                            ? "border-brand/50 bg-brand/10"
                            : "border-border bg-surface-2 hover:border-border/80"
                          }
                          ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        `}
                      >
                        <div className="font-medium text-sm text-foreground/90">{opt.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{opt.description}</div>
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
                <label className="text-sm font-medium text-foreground/90">Quality</label>
                <div className="flex gap-2">
                  {QUALITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setQuality(opt.value)}
                      className={`
                        flex-1 py-2 px-3 rounded-lg border text-center transition-all
                        ${quality === opt.value
                          ? "border-brand/50 bg-brand/10"
                          : "border-border bg-surface-2 hover:border-border/80"
                        }
                      `}
                    >
                      <div className="font-medium text-sm text-foreground/90">{opt.label}</div>
                      <div className="text-xs text-muted-foreground">{opt.bitrate}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slide Duration */}
              {exportMode === "slideshow" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/90">
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
                    <span className="text-sm text-muted-foreground">seconds per slide</span>
                  </div>
                </div>
              )}

              {/* Animation Duration Info */}
              {exportMode === "animation" && (
                <div className="p-3 rounded-lg bg-surface-2 border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/70">Animation Duration</span>
                    <span className="text-sm font-medium text-foreground/90">
                      {(timeline.duration / 1000).toFixed(1)} seconds
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Adjust duration in the timeline controls
                  </p>
                </div>
              )}

              {/* Export Button */}
              <Button
                onClick={handleExport}
                className="w-full bg-brand hover:bg-brand-hover text-brand-foreground font-medium"
                size="lg"
              >
                Export as {format.toUpperCase()}
              </Button>

              {/* Info */}
              {!mp4Supported && format === "webm" && (
                <p className="text-xs text-muted-foreground text-center">
                  MP4 export requires a browser with WebCodecs support (Chrome 94+, Edge 94+)
                </p>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
