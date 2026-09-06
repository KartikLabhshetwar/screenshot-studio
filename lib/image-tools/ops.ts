/**
 * The pixel work behind every image tool.
 *
 * Runs unchanged on the main thread and inside a worker: both get an
 * OffscreenCanvas when the browser has one, and a DOM canvas otherwise. No
 * request is ever made from this file, so a user's image never leaves the tab.
 *
 * Pipeline: decode -> crop -> transform -> resize -> encode
 */

import {
  clampCropRect,
  computeResizeDimensions,
  dimensionsAfterRotation,
} from "./geometry";
import { clampQuality, mimeFor, supportsTransparency } from "./format";
import type {
  CropRect,
  Dimensions,
  ProcessOptions,
  ProcessResult,
  RasterFormat,
  TransformOptions,
} from "./types";

type AnyCanvas = OffscreenCanvas | HTMLCanvasElement;
type AnyContext = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;

const hasOffscreenCanvas = (): boolean =>
  typeof OffscreenCanvas !== "undefined";

function createCanvas(width: number, height: number): AnyCanvas {
  if (hasOffscreenCanvas()) {
    return new OffscreenCanvas(width, height);
  }
  if (typeof document === "undefined") {
    throw new Error("No canvas implementation available in this environment");
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function get2dContext(canvas: AnyCanvas): AnyContext {
  const context = canvas.getContext("2d") as AnyContext | null;
  if (!context) {
    throw new Error("Failed to acquire a 2D canvas context");
  }
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  return context;
}

/**
 * Decodes a file to an ImageBitmap, honouring the EXIF orientation flag so a
 * phone photo does not come out sideways.
 */
export async function decodeImage(source: Blob): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(source, { imageOrientation: "from-image" });
  } catch {
    // Safari has historically rejected the options bag rather than ignoring it.
    return await createImageBitmap(source);
  }
}

/** Reads a file's intrinsic size without keeping the decoded bitmap around. */
export async function readImageSize(source: Blob): Promise<Dimensions> {
  const bitmap = await decodeImage(source);
  const size = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return size;
}

async function canvasToBlob(
  canvas: AnyCanvas,
  mime: string,
  quality: number
): Promise<Blob> {
  if ("convertToBlob" in canvas) {
    return canvas.convertToBlob({ type: mime, quality });
  }
  return new Promise<Blob>((resolve, reject) => {
    (canvas as HTMLCanvasElement).toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Canvas encoding returned no data")),
      mime,
      quality
    );
  });
}

let encodeSupportPromise: Promise<Set<RasterFormat>> | null = null;

/**
 * Which formats this browser can actually *encode*.
 *
 * Canvas encoders fall back to PNG silently when asked for a type they do not
 * support, so the only reliable check is to encode a pixel and read the MIME
 * type back. Notably no shipping browser encodes AVIF from a canvas today.
 */
export function detectEncodeSupport(): Promise<Set<RasterFormat>> {
  if (encodeSupportPromise) return encodeSupportPromise;

  encodeSupportPromise = (async () => {
    const supported = new Set<RasterFormat>(["png", "jpeg"]);
    const candidates: RasterFormat[] = ["webp", "avif"];

    try {
      const canvas = createCanvas(1, 1);
      get2dContext(canvas);
      for (const format of candidates) {
        try {
          const blob = await canvasToBlob(canvas, mimeFor(format), 0.8);
          if (blob.type === mimeFor(format)) supported.add(format);
        } catch {
          // Unsupported format, so leave it out of the set.
        }
      }
    } catch {
      // No canvas at all; the PNG/JPEG baseline is the safest answer.
    }

    return supported;
  })();

  return encodeSupportPromise;
}

/**
 * Halves the image repeatedly until one more halving would overshoot the
 * target, then does the final step.
 *
 * A single large downscale in one drawImage call drops detail badly; stepping
 * down keeps text in screenshots legible.
 */
function downscaleInSteps(
  source: AnyCanvas,
  target: Dimensions
): AnyCanvas {
  let current = source;
  let width = (source as { width: number }).width;
  let height = (source as { height: number }).height;

  while (width > target.width * 2 && height > target.height * 2) {
    width = Math.max(target.width, Math.floor(width / 2));
    height = Math.max(target.height, Math.floor(height / 2));

    const stepCanvas = createCanvas(width, height);
    const stepContext = get2dContext(stepCanvas);
    stepContext.drawImage(current as CanvasImageSource, 0, 0, width, height);
    current = stepCanvas;
  }

  if (width === target.width && height === target.height) {
    return current;
  }

  const finalCanvas = createCanvas(target.width, target.height);
  const finalContext = get2dContext(finalCanvas);
  finalContext.drawImage(
    current as CanvasImageSource,
    0,
    0,
    target.width,
    target.height
  );
  return finalCanvas;
}

/**
 * Draws the cropped region onto a canvas, applying flips first and then the
 * rotation, the order a user expects from "flip it, then turn it".
 */
function renderCropAndTransform(
  bitmap: ImageBitmap,
  crop: CropRect,
  transform: TransformOptions
): AnyCanvas {
  const rotated = dimensionsAfterRotation(
    { width: crop.width, height: crop.height },
    transform.rotate
  );

  const canvas = createCanvas(rotated.width, rotated.height);
  const context = get2dContext(canvas);

  const quarterTurn = transform.rotate === 90 || transform.rotate === 270;
  const drawWidth = quarterTurn ? rotated.height : rotated.width;
  const drawHeight = quarterTurn ? rotated.width : rotated.height;

  context.save();
  context.translate(rotated.width / 2, rotated.height / 2);
  if (transform.rotate !== 0) {
    context.rotate((transform.rotate * Math.PI) / 180);
  }
  if (transform.flipHorizontal || transform.flipVertical) {
    context.scale(
      transform.flipHorizontal ? -1 : 1,
      transform.flipVertical ? -1 : 1
    );
  }
  context.drawImage(
    bitmap,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    -drawWidth / 2,
    -drawHeight / 2,
    drawWidth,
    drawHeight
  );
  context.restore();

  return canvas;
}

/** Paints a solid colour behind the image for formats with no alpha channel. */
function flattenOnto(canvas: AnyCanvas, background: string): AnyCanvas {
  const width = (canvas as { width: number }).width;
  const height = (canvas as { height: number }).height;

  const flattened = createCanvas(width, height);
  const context = get2dContext(flattened);
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);
  context.drawImage(canvas as CanvasImageSource, 0, 0);
  return flattened;
}

/**
 * Runs the full pipeline over an already-decoded bitmap.
 *
 * The caller owns the bitmap and is responsible for closing it: batch runs
 * decode once and process repeatedly as the user changes settings.
 */
export async function processBitmap(
  bitmap: ImageBitmap,
  options: ProcessOptions
): Promise<ProcessResult> {
  const source: Dimensions = { width: bitmap.width, height: bitmap.height };

  const crop = options.crop
    ? clampCropRect(options.crop, source)
    : { x: 0, y: 0, width: source.width, height: source.height };

  const transform = options.transform ?? {
    rotate: 0 as const,
    flipHorizontal: false,
    flipVertical: false,
  };

  let canvas = renderCropAndTransform(bitmap, crop, transform);

  const rotated: Dimensions = {
    width: (canvas as { width: number }).width,
    height: (canvas as { height: number }).height,
  };
  const target = options.resize
    ? computeResizeDimensions(rotated, options.resize)
    : rotated;

  if (target.width !== rotated.width || target.height !== rotated.height) {
    canvas = downscaleInSteps(canvas, target);
  }

  const { format, quality, background } = options.encode;
  if (!supportsTransparency(format)) {
    canvas = flattenOnto(canvas, background ?? "#ffffff");
  }

  const blob = await canvasToBlob(
    canvas,
    mimeFor(format),
    clampQuality(quality, format)
  );

  return {
    blob,
    width: target.width,
    height: target.height,
    bytes: blob.size,
  };
}

/** Convenience wrapper: decode a file, run the pipeline, release the bitmap. */
export async function processFile(
  source: Blob,
  options: ProcessOptions
): Promise<ProcessResult> {
  const bitmap = await decodeImage(source);
  try {
    return await processBitmap(bitmap, options);
  } finally {
    bitmap.close();
  }
}
