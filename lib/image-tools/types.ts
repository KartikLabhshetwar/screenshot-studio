/**
 * Shared types for the client-side image tools engine.
 *
 * Every tool (compress, convert, resize, crop, rotate) is the same pipeline
 * with a different subset of options filled in:
 *
 *   decode -> crop -> transform -> resize -> encode
 *
 * Nothing here touches the network. Files never leave the browser.
 */

export type RasterFormat = "png" | "jpeg" | "webp" | "avif";

/** Formats we can always decode via createImageBitmap in every target browser. */
export const DECODABLE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/avif",
] as const;

export interface Dimensions {
  width: number;
  height: number;
}

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Quarter-turn rotation, clockwise, in degrees. */
export type RotateAngle = 0 | 90 | 180 | 270;

export interface TransformOptions {
  rotate: RotateAngle;
  flipHorizontal: boolean;
  flipVertical: boolean;
}

export type ResizeMode = "pixels" | "percentage";

export interface ResizeOptions {
  mode: ResizeMode;
  /** Target width in px. Null means "derive from height". Used when mode is "pixels". */
  width: number | null;
  /** Target height in px. Null means "derive from width". Used when mode is "pixels". */
  height: number | null;
  /** 1-400. Used when mode is "percentage". */
  percentage: number;
  lockAspectRatio: boolean;
  /** When false, a target larger than the source is clamped to the source size. */
  allowUpscale: boolean;
}

export interface EncodeOptions {
  format: RasterFormat;
  /** 0-1. Ignored for png. */
  quality: number;
  /**
   * Solid colour painted behind the image before encoding. Required for formats
   * without an alpha channel (jpeg) so transparency does not turn black.
   */
  background?: string;
}

export interface ProcessOptions {
  crop?: CropRect | null;
  transform?: TransformOptions | null;
  resize?: ResizeOptions | null;
  encode: EncodeOptions;
}

export interface ProcessResult {
  blob: Blob;
  width: number;
  height: number;
  bytes: number;
}

export interface SourceImageInfo extends Dimensions {
  bytes: number;
  type: string;
}

export const IDENTITY_TRANSFORM: TransformOptions = {
  rotate: 0,
  flipHorizontal: false,
  flipVertical: false,
};
