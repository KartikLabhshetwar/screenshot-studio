/**
 * Format metadata for the image tools. Pure, no DOM, safe to unit test.
 */

import type { RasterFormat } from "./types";

export const MIME_BY_FORMAT: Record<RasterFormat, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
};

export const EXTENSION_BY_FORMAT: Record<RasterFormat, string> = {
  png: "png",
  jpeg: "jpg",
  webp: "webp",
  avif: "avif",
};

export const FORMAT_LABELS: Record<RasterFormat, string> = {
  png: "PNG",
  jpeg: "JPG",
  webp: "WebP",
  avif: "AVIF",
};

/** Formats that discard data to save bytes, and therefore honour a quality value. */
const LOSSY_FORMATS: ReadonlySet<RasterFormat> = new Set<RasterFormat>([
  "jpeg",
  "webp",
  "avif",
]);

/** Formats that keep an alpha channel. JPEG is the odd one out. */
const ALPHA_FORMATS: ReadonlySet<RasterFormat> = new Set<RasterFormat>([
  "png",
  "webp",
  "avif",
]);

export function isLossy(format: RasterFormat): boolean {
  return LOSSY_FORMATS.has(format);
}

export function supportsTransparency(format: RasterFormat): boolean {
  return ALPHA_FORMATS.has(format);
}

export function mimeFor(format: RasterFormat): string {
  return MIME_BY_FORMAT[format];
}

export function extensionFor(format: RasterFormat): string {
  return EXTENSION_BY_FORMAT[format];
}

const FORMAT_BY_MIME: Record<string, RasterFormat> = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpeg",
  "image/webp": "webp",
  "image/avif": "avif",
};

/** Maps a MIME type onto an output format we can encode, or null if we cannot. */
export function formatFromMime(mime: string): RasterFormat | null {
  return FORMAT_BY_MIME[mime.toLowerCase().trim()] ?? null;
}

/**
 * Clamps a quality value into the 0-1 range canvas encoders expect.
 * Lossless formats always report 1 so callers can pass the result through blindly.
 */
export function clampQuality(quality: number, format: RasterFormat): number {
  if (!isLossy(format)) return 1;
  if (!Number.isFinite(quality)) return 1;
  return Math.min(1, Math.max(0.01, quality));
}

/**
 * Quality presets, deliberately matching the server-side Sharp presets in
 * lib/export/types.ts so a compressed screenshot looks the same whichever
 * path produced it.
 */
export type CompressionLevel = "low" | "medium" | "high" | "extreme";

export const COMPRESSION_QUALITY: Record<
  CompressionLevel,
  Record<RasterFormat, number>
> = {
  // "low" compression = high quality
  low: { png: 1, jpeg: 0.92, webp: 0.9, avif: 0.8 },
  medium: { png: 1, jpeg: 0.85, webp: 0.82, avif: 0.7 },
  high: { png: 1, jpeg: 0.75, webp: 0.72, avif: 0.6 },
  extreme: { png: 1, jpeg: 0.6, webp: 0.55, avif: 0.45 },
};

export function qualityForLevel(
  level: CompressionLevel,
  format: RasterFormat
): number {
  return COMPRESSION_QUALITY[level][format];
}

/** Human-readable byte size, e.g. 1.4 MB. */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "-";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value >= 10 ? Math.round(value) : value.toFixed(1)} ${units[unitIndex]}`;
}

/** Percentage saved going from `before` to `after`. Negative means it grew. */
export function savingsPercent(before: number, after: number): number {
  if (before <= 0) return 0;
  return Math.round(((before - after) / before) * 100);
}
