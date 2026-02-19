/**
 * Export service for handling image exports (fully in-browser)
 *
 * HTML/CSS Canvas Architecture:
 * - Uses pure HTML/CSS for ALL rendering (background, patterns, noise, images, text, overlays)
 * - Uses html2canvas for capturing the canvas container
 * - Uses modern-screenshot for 3D perspective transforms (HTML fallback)
 * - Uses Web Workers for heavy image processing to prevent UI blocking
 *
 * All export operations run client-side without external services.
 * Cloudinary is optional and only used for image optimization when configured.
 */

import { domToCanvas } from 'modern-screenshot';
import { generateNoiseTextureAsync } from './export-utils';
import { getBackgroundCSS } from '@/lib/constants/backgrounds';
import { getFontCSS } from '@/lib/constants/fonts';
import { exportWorkerService } from '@/lib/workers/export-worker-service';
import { processWithSharp } from './sharp-client';
import type { ExportFormat, QualityPreset } from './types';

export interface ExportOptions {
  format: ExportFormat;
  qualityPreset: QualityPreset;
  scale: number;
  exportWidth: number;
  exportHeight: number;
}

export interface ExportResult {
  dataURL: string;
  blob: Blob;
}

/**
 * Convert oklch color to RGB (memoized to avoid repeated DOM mutations)
 */
const oklchCache = new Map<string, string>();

function convertOklchToRGB(oklchColor: string): string {
  // If it's not oklch, return as-is
  if (!oklchColor.includes('oklch')) {
    return oklchColor;
  }

  const cached = oklchCache.get(oklchColor);
  if (cached) return cached;

  // Extract oklch values using regex
  const oklchMatch = oklchColor.match(/oklch\(([^)]+)\)/);
  if (!oklchMatch) {
    return oklchColor;
  }

  const values = oklchMatch[1].split(/\s+/).map(v => parseFloat(v.trim()));
  if (values.length < 3) {
    return oklchColor;
  }

  // Convert oklch to RGB using browser's computed style
  const tempEl = document.createElement('div');
  tempEl.style.color = oklchColor;
  document.body.appendChild(tempEl);
  const computed = window.getComputedStyle(tempEl).color;
  document.body.removeChild(tempEl);

  const result = computed || oklchColor;
  oklchCache.set(oklchColor, result);
  return result;
}

/**
 * Apply blur effect to a canvas using Canvas 2D context filter (sync version)
 */
function applyBlurToCanvasSync(
  canvas: HTMLCanvasElement,
  blurAmount: number
): HTMLCanvasElement {
  if (blurAmount <= 0) {
    return canvas;
  }

  const blurredCanvas = document.createElement('canvas');
  blurredCanvas.width = canvas.width;
  blurredCanvas.height = canvas.height;
  const ctx = blurredCanvas.getContext('2d');

  if (!ctx) {
    return canvas;
  }

  ctx.filter = `blur(${blurAmount}px)`;
  ctx.drawImage(canvas, 0, 0);
  ctx.filter = 'none';

  return blurredCanvas;
}

/**
 * Apply blur effect to a canvas using Web Worker for heavy computation
 */
async function applyBlurToCanvas(
  canvas: HTMLCanvasElement,
  blurAmount: number
): Promise<HTMLCanvasElement> {
  if (blurAmount <= 0) {
    return canvas;
  }

  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return canvas;
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const blurredImageData = await exportWorkerService.applyBlur(imageData, blurAmount);

    const blurredCanvas = document.createElement('canvas');
    blurredCanvas.width = canvas.width;
    blurredCanvas.height = canvas.height;
    const blurredCtx = blurredCanvas.getContext('2d');

    if (!blurredCtx) {
      return applyBlurToCanvasSync(canvas, blurAmount);
    }

    blurredCtx.putImageData(blurredImageData, 0, 0);
    return blurredCanvas;
  } catch (error) {
    console.warn('Worker blur failed, using sync fallback:', error);
    return applyBlurToCanvasSync(canvas, blurAmount);
  }
}

/**
 * Apply opacity to a canvas (sync version for fallback)
 */
function applyOpacityToCanvasSync(
  canvas: HTMLCanvasElement,
  opacity: number
): HTMLCanvasElement {
  if (opacity >= 1) {
    return canvas;
  }

  if (opacity <= 0) {
    const transparentCanvas = document.createElement('canvas');
    transparentCanvas.width = canvas.width;
    transparentCanvas.height = canvas.height;
    return transparentCanvas;
  }

  const opacityCanvas = document.createElement('canvas');
  opacityCanvas.width = canvas.width;
  opacityCanvas.height = canvas.height;
  const ctx = opacityCanvas.getContext('2d', { willReadFrequently: false });

  if (!ctx) {
    return canvas;
  }

  ctx.globalAlpha = opacity;
  ctx.drawImage(canvas, 0, 0);
  ctx.globalAlpha = 1;

  return opacityCanvas;
}

/**
 * Apply opacity to a canvas using Web Worker
 */
async function applyOpacityToCanvas(
  canvas: HTMLCanvasElement,
  opacity: number
): Promise<HTMLCanvasElement> {
  if (opacity >= 1) {
    return canvas;
  }

  if (opacity <= 0) {
    const transparentCanvas = document.createElement('canvas');
    transparentCanvas.width = canvas.width;
    transparentCanvas.height = canvas.height;
    return transparentCanvas;
  }

  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return canvas;
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const resultImageData = await exportWorkerService.applyOpacity(imageData, opacity);

    const resultCanvas = document.createElement('canvas');
    resultCanvas.width = canvas.width;
    resultCanvas.height = canvas.height;
    const resultCtx = resultCanvas.getContext('2d');

    if (!resultCtx) {
      return applyOpacityToCanvasSync(canvas, opacity);
    }

    resultCtx.putImageData(resultImageData, 0, 0);
    return resultCanvas;
  } catch (error) {
    console.warn('Worker opacity failed, using sync fallback:', error);
    return applyOpacityToCanvasSync(canvas, opacity);
  }
}

/**
 * Extract noise texture from preview element
 */
async function getNoiseTextureFromPreview(): Promise<HTMLCanvasElement | null> {
  let noiseOverlay = document.getElementById('canvas-noise-overlay') as HTMLElement | null;

  if (!noiseOverlay) {
    const canvasBackground = document.getElementById('canvas-background');
    if (!canvasBackground) return null;

    const parent = canvasBackground.parentElement;
    if (!parent) return null;

    const found = Array.from(parent.children).find((child) => {
      if (child instanceof HTMLElement) {
        const style = window.getComputedStyle(child);
        const bgImage = style.backgroundImage;
        const mixBlendMode = style.mixBlendMode;
        const pointerEvents = style.pointerEvents;

        return bgImage &&
          bgImage.includes('data:image') &&
          bgImage.includes('base64') &&
          mixBlendMode === 'overlay' &&
          pointerEvents === 'none';
      }
      return false;
    }) as HTMLElement | undefined;

    if (!found) return null;
    noiseOverlay = found;
  }

  if (!noiseOverlay) return null;

  const style = window.getComputedStyle(noiseOverlay);
  const bgImage = style.backgroundImage;
  const urlMatch = bgImage.match(/url\(['"]?(.+?)['"]?\)/);

  if (!urlMatch || !urlMatch[1]) return null;

  const dataURL = urlMatch[1];

  return new Promise<HTMLCanvasElement | null>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      } else {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = dataURL;
  });
}

/**
 * Apply noise overlay to a canvas
 */
async function applyNoiseToCanvas(
  canvas: HTMLCanvasElement,
  noiseIntensity: number,
  width: number,
  height: number,
  scale: number
): Promise<HTMLCanvasElement> {
  if (noiseIntensity <= 0) {
    return canvas;
  }

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = canvasWidth;
  finalCanvas.height = canvasHeight;
  const ctx = finalCanvas.getContext('2d');

  if (!ctx) {
    return canvas;
  }

  ctx.drawImage(canvas, 0, 0);

  let noiseCanvas: HTMLCanvasElement | null = null;

  const previewNoiseTexture = await getNoiseTextureFromPreview();
  if (previewNoiseTexture) {
    noiseCanvas = previewNoiseTexture;
  } else {
    noiseCanvas = await generateNoiseTextureAsync(200, 200, noiseIntensity);
  }

  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = noiseIntensity;

  ctx.imageSmoothingEnabled = false;
  const pattern = ctx.createPattern(noiseCanvas, 'repeat');
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }
  ctx.imageSmoothingEnabled = true;

  ctx.restore();

  return finalCanvas;
}

/**
 * Capture 3D transformed element using modern-screenshot
 */
async function capture3DTransformWithModernScreenshot(
  element: HTMLElement,
  scale: number,
  skipDelay: boolean = false
): Promise<HTMLCanvasElement> {
  const overlayElement = element.querySelector('[data-3d-overlay="true"]') as HTMLElement;
  if (!overlayElement) {
    throw new Error('3D overlay element not found');
  }

  const rect = overlayElement.getBoundingClientRect();

  if (!skipDelay) {
    // Wait for styles to apply (only needed for first/single exports, not video frames)
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const canvas = await domToCanvas(element, {
    scale: scale,
    backgroundColor: null,
  });

  return canvas;
}

/**
 * Export HTML canvas container using modern-screenshot (domToCanvas)
 * This provides better CSS fidelity than html2canvas, especially for:
 * - Box shadows
 * - CSS filters
 * - Border radius
 * - Transforms
 */

// Reusable output canvas to avoid GC pressure from repeated allocations
let reusableCanvas: HTMLCanvasElement | null = null;
let reusableCtx: CanvasRenderingContext2D | null = null;

async function exportHTMLCanvas(
  container: HTMLElement,
  targetWidth: number,
  targetHeight: number,
  scale: number,
  borderRadius: number = 0,
  skipDelay: boolean = false
): Promise<HTMLCanvasElement> {
  // Get current container dimensions
  const containerRect = container.getBoundingClientRect();
  const originalWidth = containerRect.width;
  const originalHeight = containerRect.height;

  // Calculate scale factor to match export dimensions
  const scaleX = targetWidth / originalWidth;
  const scaleY = targetHeight / originalHeight;
  const exportScale = scale * Math.max(scaleX, scaleY);

  if (!skipDelay) {
    // Wait for any pending renders (only needed for first/single exports, not video frames)
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  // Use modern-screenshot for better CSS fidelity
  const canvas = await domToCanvas(container, {
    scale: exportScale,
    backgroundColor: null,
    width: originalWidth,
    height: originalHeight,
  });

  // Scale the canvas to match export dimensions
  const finalWidth = targetWidth * scale;
  const finalHeight = targetHeight * scale;

  // Reuse canvas when dimensions match (common for video frame sequences)
  if (skipDelay && reusableCanvas && reusableCtx &&
      reusableCanvas.width === finalWidth && reusableCanvas.height === finalHeight) {
    reusableCtx.clearRect(0, 0, finalWidth, finalHeight);
    reusableCtx.imageSmoothingEnabled = true;
    reusableCtx.imageSmoothingQuality = 'high';
    reusableCtx.drawImage(
      canvas,
      0, 0, canvas.width, canvas.height,
      0, 0, finalWidth, finalHeight
    );
    return reusableCanvas;
  }

  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = finalWidth;
  finalCanvas.height = finalHeight;
  const ctx = finalCanvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    canvas,
    0, 0, canvas.width, canvas.height,
    0, 0, finalWidth, finalHeight
  );

  // Cache for video frame reuse
  if (skipDelay) {
    reusableCanvas = finalCanvas;
    reusableCtx = ctx;
  }

  return finalCanvas;
}

/**
 * Export element using HTML/CSS canvas with html2canvas
 */
export async function exportElement(
  elementId: string,
  options: ExportOptions,
  canvasContainer: HTMLElement | null,
  backgroundConfig: any,
  backgroundBorderRadius: number,
  textOverlays: any[] = [],
  imageOverlays: any[] = [],
  perspective3D?: any,
  imageSrc?: string,
  screenshotRadius?: number,
  backgroundBlur: number = 0,
  backgroundNoise: number = 0,
  backgroundOpacity: number = 1
): Promise<ExportResult> {
  // Wait a bit to ensure DOM is ready
  await new Promise(resolve => setTimeout(resolve, 200));

  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Image render card not found. Please ensure an image is uploaded.');
  }

  // Find the canvas container within the element
  const container = element.querySelector('[data-html-canvas="true"]') as HTMLElement;
  if (!container) {
    throw new Error('HTML canvas container not found');
  }

  try {
    // Check if 3D transforms are active
    const has3DTransform = perspective3D && imageSrc && (
      perspective3D.rotateX !== 0 ||
      perspective3D.rotateY !== 0 ||
      perspective3D.rotateZ !== 0 ||
      perspective3D.translateX !== 0 ||
      perspective3D.translateY !== 0 ||
      perspective3D.scale !== 1
    );

    let finalCanvas: HTMLCanvasElement;

    if (has3DTransform) {
      // Use modern-screenshot for 3D transforms
      try {
        finalCanvas = await capture3DTransformWithModernScreenshot(
          container,
          options.scale * Math.max(
            options.exportWidth / container.clientWidth,
            options.exportHeight / container.clientHeight
          )
        );

        // Resize to match export dimensions
        if (finalCanvas.width !== options.exportWidth * options.scale ||
            finalCanvas.height !== options.exportHeight * options.scale) {
          const resizedCanvas = document.createElement('canvas');
          resizedCanvas.width = options.exportWidth * options.scale;
          resizedCanvas.height = options.exportHeight * options.scale;
          const ctx = resizedCanvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(
              finalCanvas,
              0, 0, finalCanvas.width, finalCanvas.height,
              0, 0, resizedCanvas.width, resizedCanvas.height
            );
            finalCanvas = resizedCanvas;
          }
        }
      } catch (error) {
        console.warn('Failed to capture 3D transform, falling back to html2canvas:', error);
        finalCanvas = await exportHTMLCanvas(
          container,
          options.exportWidth,
          options.exportHeight,
          options.scale,
          backgroundBorderRadius
        );
      }
    } else {
      // Use html2canvas for standard exports
      finalCanvas = await exportHTMLCanvas(
        container,
        options.exportWidth,
        options.exportHeight,
        options.scale,
        backgroundBorderRadius
      );
    }

    // Process with Sharp for format conversion and quality optimization
    const sharpResult = await processWithSharp(
      finalCanvas,
      options.format,
      options.qualityPreset
    );

    if (!sharpResult.dataURL || sharpResult.dataURL === 'data:,') {
      throw new Error('Failed to generate image data URL');
    }

    return { dataURL: sharpResult.dataURL, blob: sharpResult.blob };
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}

/**
 * Export element as raw canvas (no Sharp processing).
 * Used for video frame capture where FFmpeg handles final encoding.
 */
export async function exportElementAsCanvas(
  elementId: string,
  options: ExportOptions,
  canvasContainer: HTMLElement | null,
  backgroundBorderRadius: number,
  perspective3D?: any,
  imageSrc?: string,
): Promise<HTMLCanvasElement> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Image render card not found. Please ensure an image is uploaded.');
  }

  const container = element.querySelector('[data-html-canvas="true"]') as HTMLElement;
  if (!container) {
    throw new Error('HTML canvas container not found');
  }

  const has3DTransform = perspective3D && imageSrc && (
    perspective3D.rotateX !== 0 ||
    perspective3D.rotateY !== 0 ||
    perspective3D.rotateZ !== 0 ||
    perspective3D.translateX !== 0 ||
    perspective3D.translateY !== 0 ||
    perspective3D.scale !== 1
  );

  let finalCanvas: HTMLCanvasElement;

  if (has3DTransform) {
    try {
      finalCanvas = await capture3DTransformWithModernScreenshot(
        container,
        options.scale * Math.max(
          options.exportWidth / container.clientWidth,
          options.exportHeight / container.clientHeight
        ),
        true // skipDelay — video frames don't need style-settle waits
      );

      if (finalCanvas.width !== options.exportWidth * options.scale ||
          finalCanvas.height !== options.exportHeight * options.scale) {
        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = options.exportWidth * options.scale;
        resizedCanvas.height = options.exportHeight * options.scale;
        const ctx = resizedCanvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(
            finalCanvas,
            0, 0, finalCanvas.width, finalCanvas.height,
            0, 0, resizedCanvas.width, resizedCanvas.height
          );
          finalCanvas = resizedCanvas;
        }
      }
    } catch (error) {
      console.warn('Failed to capture 3D transform, falling back to html2canvas:', error);
      finalCanvas = await exportHTMLCanvas(
        container,
        options.exportWidth,
        options.exportHeight,
        options.scale,
        backgroundBorderRadius,
        true // skipDelay
      );
    }
  } else {
    finalCanvas = await exportHTMLCanvas(
      container,
      options.exportWidth,
      options.exportHeight,
      options.scale,
      backgroundBorderRadius,
      true // skipDelay
    );
  }

  return finalCanvas;
}
