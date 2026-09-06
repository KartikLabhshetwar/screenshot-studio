/**
 * Turns a tool's UI settings into the options the pipeline runs and the name
 * the result downloads as. Pure, no DOM, safe to unit test.
 */

import { formatFromMime, qualityForLevel, type CompressionLevel } from "./format";
import { outputFilename, sanitizeFilename } from "./filename";
import { IDENTITY_TRANSFORM } from "./types";
import type {
  CropRect,
  ProcessOptions,
  RasterFormat,
  ResizeOptions,
  TransformOptions,
} from "./types";

/** Every tool that produces a downloadable file, including the interactive one. */
export type ToolEngineName = "compress" | "convert" | "resize" | "crop" | "rotate";

/**
 * The tools driven by a shared settings panel over a batch queue.
 *
 * Crop is deliberately absent: it is a single-image, interactive tool with its
 * own drag state, and it builds its ProcessOptions directly rather than from a
 * ToolSettings object whose other six fields it would never use.
 */
export type BatchToolEngine = Exclude<ToolEngineName, "crop">;

/**
 * Quality used when re-encoding is incidental to the operation (a resize, a
 * rotate, or a crop) rather than the point of it. High enough that the tool
 * does not quietly degrade an image the user only meant to reshape.
 */
export const DEFAULT_REENCODE_QUALITY = 0.92;

/** "auto" keeps whatever format the source file already is. */
export type OutputFormatChoice = RasterFormat | "auto";

export interface ToolSettings {
  /** Compress: preset strength. */
  level: CompressionLevel;
  /** Convert / compress: target format. */
  format: OutputFormatChoice;
  /** Convert: manual quality, 0-1, used when useCustomQuality is on. */
  quality: number;
  useCustomQuality: boolean;
  /** Colour painted behind transparency when the target has no alpha channel. */
  background: string;
  resize: ResizeOptions;
  transform: TransformOptions;
  crop: CropRect | null;
}

export const DEFAULT_RESIZE: ResizeOptions = {
  mode: "pixels",
  width: null,
  height: null,
  percentage: 100,
  lockAspectRatio: true,
  allowUpscale: false,
};

export const DEFAULT_TOOL_SETTINGS: ToolSettings = {
  level: "medium",
  format: "auto",
  quality: 0.85,
  useCustomQuality: false,
  background: "#ffffff",
  resize: DEFAULT_RESIZE,
  transform: IDENTITY_TRANSFORM,
  crop: null,
};

/** Suffix appended only when the output would otherwise overwrite the input. */
const ENGINE_SUFFIX: Record<ToolEngineName, string> = {
  compress: "compressed",
  convert: "converted",
  resize: "resized",
  crop: "cropped",
  rotate: "rotated",
};

/**
 * Resolves the encoding format. "auto" keeps the source format, falling back to
 * PNG for sources we can decode but not encode (GIF, BMP).
 */
export function resolveOutputFormat(
  choice: OutputFormatChoice,
  sourceMime: string
): RasterFormat {
  if (choice !== "auto") return choice;
  return formatFromMime(sourceMime) ?? "png";
}

function resolveQuality(
  engine: BatchToolEngine,
  settings: ToolSettings,
  format: RasterFormat
): number {
  if (engine === "compress") return qualityForLevel(settings.level, format);
  if (settings.useCustomQuality) return settings.quality;
  // Only compress and convert are about file size; resize and rotate re-encode
  // incidentally and should not lose quality doing it.
  return engine === "convert" ? settings.quality : DEFAULT_REENCODE_QUALITY;
}

/**
 * Builds the pipeline options for one batch engine, ignoring the settings it
 * does not use. Crop is not routed through here; see BatchToolEngine.
 */
export function buildProcessOptions(
  engine: BatchToolEngine,
  settings: ToolSettings,
  sourceMime: string
): ProcessOptions {
  const format = resolveOutputFormat(settings.format, sourceMime);

  return {
    crop: null,
    transform: engine === "rotate" ? settings.transform : null,
    resize: engine === "resize" ? settings.resize : null,
    encode: {
      format,
      quality: resolveQuality(engine, settings, format),
      background: settings.background,
    },
  };
}

/**
 * Download name for a result. The engine suffix is added only when the name
 * would collide with the source file, so /png-to-jpg produces "shot.jpg"
 * rather than "shot-converted.jpg".
 */
export function buildOutputName(
  engine: ToolEngineName,
  sourceName: string,
  format: RasterFormat
): string {
  const plain = outputFilename(sourceName, format);
  const collides =
    plain.toLowerCase() === sanitizeFilename(sourceName).toLowerCase();
  return collides
    ? outputFilename(sourceName, format, ENGINE_SUFFIX[engine])
    : plain;
}
