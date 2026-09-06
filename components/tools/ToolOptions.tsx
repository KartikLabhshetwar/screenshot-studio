"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { cn } from "@/lib/utils";
import {
  FORMAT_LABELS,
  matchLockedAxis,
  supportsTransparency,
  type CompressionLevel,
  type Dimensions,
  type OutputFormatChoice,
  type RasterFormat,
  type ToolSettings,
} from "@/lib/image-tools";

export interface PanelProps {
  settings: ToolSettings;
  onChange: (updates: Partial<ToolSettings>) => void;
  /** Formats this browser can actually encode. */
  encodable: RasterFormat[];
  /** Intrinsic size of the first queued image, for the resize form's hints. */
  reference: Dimensions | null;
}

export function OptionGroup({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

/** Format picker shared by the compress and convert panels. */
function FormatPicker({
  value,
  onChange,
  encodable,
  includeAuto,
}: {
  value: OutputFormatChoice;
  onChange: (value: OutputFormatChoice) => void;
  encodable: RasterFormat[];
  includeAuto: boolean;
}) {
  const options = [
    ...(includeAuto ? [{ id: "auto", label: "Same" }] : []),
    ...encodable.map((format) => ({ id: format, label: FORMAT_LABELS[format] })),
  ];

  return (
    <SegmentedControl
      options={options}
      value={value}
      onChange={(next) => onChange(next as OutputFormatChoice)}
      ariaLabel="Output format"
      size="sm"
    />
  );
}

/** Only shown when the target format has no alpha channel to fall back on. */
function BackgroundPicker({
  format,
  value,
  onChange,
}: {
  format: RasterFormat;
  value: string;
  onChange: (value: string) => void;
}) {
  const inputId = React.useId();
  if (supportsTransparency(format)) return null;

  return (
    <OptionGroup
      label="Background behind transparency"
      hint={`${FORMAT_LABELS[format]} has no transparency, so transparent pixels are filled with this colour.`}
    >
      <div className="flex items-center gap-2">
        <input
          id={inputId}
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label="Background colour"
          className="h-9 w-12 cursor-pointer rounded-md border border-input bg-transparent p-1"
        />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label="Background colour hex value"
          className="font-mono"
        />
      </div>
    </OptionGroup>
  );
}

const COMPRESSION_LEVELS: { id: CompressionLevel; label: string; hint: string }[] = [
  { id: "low", label: "Light", hint: "Visually lossless, modest saving" },
  { id: "medium", label: "Balanced", hint: "The best trade-off for most images" },
  { id: "high", label: "Strong", hint: "Noticeably smaller, slight softening" },
  { id: "extreme", label: "Extreme", hint: "Smallest file, visible artefacts" },
];

export function CompressOptions({
  settings,
  onChange,
  encodable,
}: PanelProps) {
  const active = COMPRESSION_LEVELS.find((level) => level.id === settings.level);

  return (
    <div className="flex flex-col gap-5">
      <OptionGroup label="Compression level" hint={active?.hint}>
        <SegmentedControl
          options={COMPRESSION_LEVELS.map((level) => ({
            id: level.id,
            label: level.label,
          }))}
          value={settings.level}
          onChange={(next) => onChange({ level: next as CompressionLevel })}
          ariaLabel="Compression level"
          size="sm"
        />
      </OptionGroup>

      <OptionGroup
        label="Output format"
        hint={
          settings.format === "auto"
            ? "Keeping the original format. PNG is already lossless. To make a PNG meaningfully smaller, switch the output to WebP."
            : undefined
        }
      >
        <FormatPicker
          value={settings.format}
          onChange={(format) => onChange({ format })}
          encodable={encodable}
          includeAuto
        />
      </OptionGroup>

      {settings.format !== "auto" ? (
        <BackgroundPicker
          format={settings.format}
          value={settings.background}
          onChange={(background) => onChange({ background })}
        />
      ) : null}
    </div>
  );
}

export function ConvertOptions({
  settings,
  onChange,
  encodable,
}: PanelProps) {
  const lossyTarget =
    settings.format !== "auto" && settings.format !== "png";

  return (
    <div className="flex flex-col gap-5">
      <OptionGroup label="Convert to">
        <FormatPicker
          value={settings.format}
          onChange={(format) => onChange({ format })}
          encodable={encodable}
          includeAuto={false}
        />
      </OptionGroup>

      {lossyTarget ? (
        <OptionGroup label="Quality">
          <Slider
            value={[Math.round(settings.quality * 100)]}
            min={10}
            max={100}
            step={1}
            onValueChange={([next]) => onChange({ quality: next / 100 })}
            aria-label="Output quality"
            valueDisplay={`${Math.round(settings.quality * 100)}%`}
          />
        </OptionGroup>
      ) : null}

      {settings.format !== "auto" ? (
        <BackgroundPicker
          format={settings.format}
          value={settings.background}
          onChange={(background) => onChange({ background })}
        />
      ) : null}
    </div>
  );
}

export function ResizeOptions({ settings, onChange, reference }: PanelProps) {
  const { resize } = settings;

  const setResize = (updates: Partial<ToolSettings["resize"]>) =>
    onChange({ resize: { ...resize, ...updates } });

  /**
   * With the ratio locked we mirror the typed value onto the other axis so the
   * form shows what will actually be produced, rather than leaving a stale
   * number in the box the user did not touch.
   */
  const handleAxis = (axis: "width" | "height", raw: string) => {
    const value = raw === "" ? null : Math.max(1, Number.parseInt(raw, 10) || 0);

    if (value === null) {
      setResize(axis === "width" ? { width: null } : { height: null });
      return;
    }

    if (resize.lockAspectRatio && reference) {
      const matched = matchLockedAxis(reference, axis, value);
      setResize({ width: matched.width, height: matched.height });
      return;
    }

    setResize(axis === "width" ? { width: value } : { height: value });
  };

  return (
    <div className="flex flex-col gap-5">
      <OptionGroup label="Resize by">
        <SegmentedControl
          options={[
            { id: "pixels", label: "Pixels" },
            { id: "percentage", label: "Percentage" },
          ]}
          value={resize.mode}
          onChange={(next) =>
            setResize({ mode: next as ToolSettings["resize"]["mode"] })
          }
          ariaLabel="Resize mode"
          size="sm"
        />
      </OptionGroup>

      {resize.mode === "pixels" ? (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="resize-width" className="text-xs text-muted-foreground">
                Width (px)
              </Label>
              <Input
                id="resize-width"
                type="number"
                inputMode="numeric"
                min={1}
                value={resize.width ?? ""}
                placeholder={reference ? String(reference.width) : "auto"}
                onChange={(event) => handleAxis("width", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="resize-height" className="text-xs text-muted-foreground">
                Height (px)
              </Label>
              <Input
                id="resize-height"
                type="number"
                inputMode="numeric"
                min={1}
                value={resize.height ?? ""}
                placeholder={reference ? String(reference.height) : "auto"}
                onChange={(event) => handleAxis("height", event.target.value)}
              />
            </div>
          </div>
          <ToggleRow
            id="resize-lock"
            label="Lock aspect ratio"
            hint="Fill one box and the other follows"
            checked={resize.lockAspectRatio}
            onCheckedChange={(lockAspectRatio) => setResize({ lockAspectRatio })}
          />
        </div>
      ) : (
        <OptionGroup label="Scale">
          <Slider
            value={[resize.percentage]}
            min={5}
            max={resize.allowUpscale ? 400 : 100}
            step={1}
            onValueChange={([percentage]) => setResize({ percentage })}
            aria-label="Scale percentage"
            valueDisplay={`${resize.percentage}%`}
          />
        </OptionGroup>
      )}

      <ToggleRow
        id="resize-upscale"
        label="Allow upscaling"
        hint="Enlarging cannot add detail, so this is off by default"
        checked={resize.allowUpscale}
        onCheckedChange={(allowUpscale) =>
          setResize({
            allowUpscale,
            // Leaving a 400% scale set while upscaling is switched back off
            // would silently do nothing, so the slider is pulled back in range.
            percentage:
              !allowUpscale && resize.percentage > 100 ? 100 : resize.percentage,
          })
        }
      />
    </div>
  );
}

const ROTATIONS = [
  { id: "0", label: "0°" },
  { id: "90", label: "90°" },
  { id: "180", label: "180°" },
  { id: "270", label: "270°" },
];

export function RotateOptions({ settings, onChange }: PanelProps) {
  const { transform } = settings;

  const setTransform = (updates: Partial<ToolSettings["transform"]>) =>
    onChange({ transform: { ...transform, ...updates } });

  return (
    <div className="flex flex-col gap-5">
      <OptionGroup label="Rotate" hint="Clockwise, in quarter turns">
        <SegmentedControl
          options={ROTATIONS}
          value={String(transform.rotate)}
          onChange={(next) =>
            setTransform({
              rotate: Number(next) as ToolSettings["transform"]["rotate"],
            })
          }
          ariaLabel="Rotation"
          size="sm"
        />
      </OptionGroup>

      <ToggleRow
        id="flip-horizontal"
        label="Flip horizontally"
        hint="Mirror left to right"
        checked={transform.flipHorizontal}
        onCheckedChange={(flipHorizontal) => setTransform({ flipHorizontal })}
      />
      <ToggleRow
        id="flip-vertical"
        label="Flip vertically"
        hint="Mirror top to bottom"
        checked={transform.flipVertical}
        onCheckedChange={(flipVertical) => setTransform({ flipVertical })}
      />
    </div>
  );
}

export function ToggleRow({
  id,
  label,
  hint,
  checked,
  onCheckedChange,
  className,
}: {
  id: string;
  label: string;
  hint?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="min-w-0">
        <Label htmlFor={id} className="cursor-pointer text-sm font-medium">
          {label}
        </Label>
        {hint ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
