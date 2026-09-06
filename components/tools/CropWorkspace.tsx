"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  CropIcon,
  Download04Icon,
  Delete02Icon,
  Loading03Icon,
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { cn } from "@/lib/utils";
import {
  applyCropAspectRatio,
  buildOutputName,
  centeredCropForRatio,
  clampCropRect,
  downloadBlob,
  formatBytes,
  imageToolsWorker,
  readImageSize,
  resolveOutputFormat,
  DEFAULT_REENCODE_QUALITY,
  DEFAULT_TOOL_SETTINGS,
  type CropRect,
  type Dimensions,
  type ProcessResult,
} from "@/lib/image-tools";
import type { ToolDefinition } from "@/lib/seo/tools";
import { ToolDropzone } from "./ToolDropzone";
import { OptionGroup } from "./ToolOptions";

const RATIO_PRESETS: { id: string; label: string; ratio: number | null }[] = [
  { id: "free", label: "Free", ratio: null },
  { id: "1:1", label: "1:1", ratio: 1 },
  { id: "16:9", label: "16:9", ratio: 16 / 9 },
  { id: "4:3", label: "4:3", ratio: 4 / 3 },
  { id: "3:2", label: "3:2", ratio: 3 / 2 },
  { id: "9:16", label: "9:16", ratio: 9 / 16 },
];

/** Smallest crop we allow, in source pixels. */
const MIN_CROP = 16;

type Handle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";
type DragMode = Handle | "move";

interface DragState {
  mode: DragMode;
  pointerId: number;
  startX: number;
  startY: number;
  startRect: CropRect;
}

const HANDLE_POSITIONS: Record<Handle, string> = {
  nw: "left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize",
  n: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize",
  ne: "right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize",
  e: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-ew-resize",
  se: "right-0 bottom-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize",
  s: "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-ns-resize",
  sw: "left-0 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize",
  w: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize",
};

/**
 * Applies a drag to the crop rectangle in *source pixel* space, so the result
 * is independent of how large the preview happens to be rendered.
 */
function resizeRect(
  rect: CropRect,
  mode: Handle,
  dx: number,
  dy: number,
  source: Dimensions,
  ratio: number | null
): CropRect {
  let { x, y, width, height } = rect;

  if (mode.includes("w")) {
    const nextX = Math.min(x + dx, x + width - MIN_CROP);
    width += x - nextX;
    x = nextX;
  }
  if (mode.includes("e")) {
    width = Math.max(MIN_CROP, width + dx);
  }
  if (mode.includes("n")) {
    const nextY = Math.min(y + dy, y + height - MIN_CROP);
    height += y - nextY;
    y = nextY;
  }
  if (mode.includes("s")) {
    height = Math.max(MIN_CROP, height + dy);
  }

  if (ratio) {
    // Edge handles drive the axis they control; corners follow the width.
    if (mode === "n" || mode === "s") {
      width = height * ratio;
    } else {
      height = width / ratio;
    }
    // Keep the anchored edges pinned after the ratio correction.
    if (mode.includes("w")) x = rect.x + rect.width - width;
    if (mode.includes("n")) y = rect.y + rect.height - height;
  }

  return clampCropRect({ x, y, width, height }, source);
}

interface CropWorkspaceProps {
  tool: ToolDefinition;
}

export function CropWorkspace({ tool }: CropWorkspaceProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<Dimensions | null>(null);
  const [crop, setCrop] = React.useState<CropRect | null>(null);
  const [ratioId, setRatioId] = React.useState("free");
  const [isRunning, setIsRunning] = React.useState(false);
  const [result, setResult] = React.useState<ProcessResult | null>(null);

  const frameRef = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef<DragState | null>(null);
  const [displayWidth, setDisplayWidth] = React.useState(0);

  const ratio = RATIO_PRESETS.find((preset) => preset.id === ratioId)?.ratio ?? null;
  // Preview pixels per source pixel; every drag delta is divided by this.
  const scale = source && displayWidth ? displayWidth / source.width : 1;

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // The preview is laid out by the browser (max-height, max-width), so its
  // rendered width has to be observed rather than calculated.
  React.useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new ResizeObserver(([entry]) => {
      setDisplayWidth(entry.contentRect.width);
    });
    observer.observe(frame);
    setDisplayWidth(frame.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, [previewUrl]);

  const handleFiles = React.useCallback(
    async (files: File[]) => {
      const next = files[0];
      if (!next) return;

      try {
        const size = await readImageSize(next);
        setFile(next);
        setPreviewUrl((current) => {
          if (current) URL.revokeObjectURL(current);
          return URL.createObjectURL(next);
        });
        setSource(size);
        setCrop(centeredCropForRatio(size, size.width / size.height));
        setRatioId("free");
        setResult(null);
      } catch {
        toast.error("Could not read that image", {
          description: "Try a PNG, JPG, WebP, GIF, BMP, or AVIF file.",
        });
      }
    },
    []
  );

  const handleRatioChange = React.useCallback(
    (id: string) => {
      setRatioId(id);
      setResult(null);
      const preset = RATIO_PRESETS.find((entry) => entry.id === id);
      if (!preset?.ratio || !source || !crop) return;
      setCrop(applyCropAspectRatio(crop, source, preset.ratio));
    },
    [crop, source]
  );

  const beginDrag = React.useCallback(
    (mode: DragMode) => (event: React.PointerEvent) => {
      if (!crop) return;
      event.preventDefault();
      event.stopPropagation();
      (event.target as Element).setPointerCapture(event.pointerId);
      dragRef.current = {
        mode,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startRect: crop,
      };
      setResult(null);
    },
    [crop]
  );

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || !source || drag.pointerId !== event.pointerId) return;

      const dx = (event.clientX - drag.startX) / scale;
      const dy = (event.clientY - drag.startY) / scale;

      if (drag.mode === "move") {
        setCrop(
          clampCropRect(
            {
              ...drag.startRect,
              x: drag.startRect.x + dx,
              y: drag.startRect.y + dy,
            },
            source
          )
        );
        return;
      }

      setCrop(resizeRect(drag.startRect, drag.mode, dx, dy, source, ratio));
    },
    [ratio, scale, source]
  );

  const endDrag = React.useCallback((event: React.PointerEvent) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  }, []);

  const setCropField = (field: keyof CropRect, raw: string) => {
    if (!source || !crop) return;
    const value = Math.max(0, Number.parseInt(raw, 10) || 0);
    setCrop(clampCropRect({ ...crop, [field]: value }, source));
    setResult(null);
  };

  const handleCrop = React.useCallback(async () => {
    if (!file || !crop) return;

    setIsRunning(true);
    try {
      const format = resolveOutputFormat(
        DEFAULT_TOOL_SETTINGS.format,
        file.type
      );
      const processed = await imageToolsWorker.process(file, {
        crop,
        transform: null,
        resize: null,
        encode: {
          format,
          quality: DEFAULT_REENCODE_QUALITY,
          background: DEFAULT_TOOL_SETTINGS.background,
        },
      });
      setResult(processed);
    } catch {
      toast.error("Crop failed", {
        description: "The image may be too large for this browser to process.",
      });
    } finally {
      setIsRunning(false);
    }
  }, [crop, file]);

  const handleDownload = React.useCallback(() => {
    if (!result || !file) return;
    const format = resolveOutputFormat(DEFAULT_TOOL_SETTINGS.format, file.type);
    downloadBlob(result.blob, buildOutputName("crop", file.name, format));
  }, [file, result]);

  const reset = React.useCallback(() => {
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setFile(null);
    setSource(null);
    setCrop(null);
    setResult(null);
  }, []);

  if (!file || !previewUrl || !source || !crop) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <ToolDropzone
          onFiles={handleFiles}
          multiple={false}
          sourceLabel={tool.preset?.sourceLabel}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex justify-center rounded-xl border border-border bg-muted/20 p-4">
        <div
          ref={frameRef}
          className="relative inline-block touch-none select-none"
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <Image
            src={previewUrl}
            alt={file.name}
            width={source.width}
            height={source.height}
            unoptimized
            draggable={false}
            className="block h-auto max-h-[60vh] w-auto max-w-full rounded-md"
          />

          {/* Dimmed area outside the selection. */}
          <div
            className="pointer-events-none absolute inset-0 rounded-md bg-black/50"
            style={{
              clipPath: `polygon(0% 0%, 0% 100%, ${crop.x * scale}px 100%, ${
                crop.x * scale
              }px ${crop.y * scale}px, ${(crop.x + crop.width) * scale}px ${
                crop.y * scale
              }px, ${(crop.x + crop.width) * scale}px ${
                (crop.y + crop.height) * scale
              }px, ${crop.x * scale}px ${
                (crop.y + crop.height) * scale
              }px, ${crop.x * scale}px 100%, 100% 100%, 100% 0%)`,
            }}
            aria-hidden="true"
          />

          <div
            role="group"
            aria-label="Crop selection"
            onPointerDown={beginDrag("move")}
            className="absolute cursor-move border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
            style={{
              left: crop.x * scale,
              top: crop.y * scale,
              width: crop.width * scale,
              height: crop.height * scale,
            }}
          >
            {(Object.keys(HANDLE_POSITIONS) as Handle[]).map((handle) => (
              <span
                key={handle}
                onPointerDown={beginDrag(handle)}
                className={cn(
                  "absolute size-3 rounded-full border-2 border-white bg-foreground shadow",
                  HANDLE_POSITIONS[handle]
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <aside className="flex h-fit flex-col gap-5 rounded-xl border border-border bg-card p-5 lg:sticky lg:top-24">
        <OptionGroup label="Aspect ratio">
          <SegmentedControl
            options={RATIO_PRESETS.slice(0, 3).map((preset) => ({
              id: preset.id,
              label: preset.label,
            }))}
            value={RATIO_PRESETS.slice(0, 3).some((p) => p.id === ratioId) ? ratioId : "free"}
            onChange={handleRatioChange}
            ariaLabel="Aspect ratio"
            size="sm"
          />
          <SegmentedControl
            options={RATIO_PRESETS.slice(3).map((preset) => ({
              id: preset.id,
              label: preset.label,
            }))}
            value={RATIO_PRESETS.slice(3).some((p) => p.id === ratioId) ? ratioId : "free"}
            onChange={handleRatioChange}
            ariaLabel="More aspect ratios"
            size="sm"
          />
        </OptionGroup>

        <OptionGroup label="Selection" hint={`Source image: ${source.width} × ${source.height}`}>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ["width", "Width"],
                ["height", "Height"],
                ["x", "X offset"],
                ["y", "Y offset"],
              ] as const
            ).map(([field, label]) => (
              <div key={field} className="flex flex-col gap-1.5">
                <Label
                  htmlFor={`crop-${field}`}
                  className="text-xs text-muted-foreground"
                >
                  {label}
                </Label>
                <Input
                  id={`crop-${field}`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={crop[field]}
                  onChange={(event) => setCropField(field, event.target.value)}
                />
              </div>
            ))}
          </div>
        </OptionGroup>

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <Button onClick={() => void handleCrop()} disabled={isRunning} className="w-full">
            {isRunning ? (
              <Loading03Icon size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <CropIcon size={16} aria-hidden="true" />
            )}
            Crop to {crop.width} × {crop.height}
          </Button>

          {result ? (
            <Button variant="secondary" onClick={handleDownload} className="w-full">
              <Download04Icon size={16} aria-hidden="true" />
              Download ({formatBytes(result.bytes)})
            </Button>
          ) : null}

          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="w-full text-muted-foreground"
          >
            <Delete02Icon size={15} aria-hidden="true" />
            Choose another image
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Cropped at full resolution from the original file. The preview above is
          only scaled for display. Nothing is uploaded.
        </p>
      </aside>
    </div>
  );
}
