import { useExportProgress } from "@/hooks/useExportProgress";
import { streamSlidesToEncoder, streamAnimationToEncoder, switchToSlideAndWait, throwIfAborted } from "./render-slideFrame";
import { exportSlideFrameAsCanvas } from "./export-slideFrame";
import {
  type VideoFormat,
  type VideoQuality,
  isMp4Supported,
} from "./export/video-encoder";
import {
  WebCodecsVideoEncoder,
  isWebCodecsSupported,
  isH264Supported,
  isVpxSupported,
} from "./export/webcodecs-encoder";
import {
  FFmpegVideoEncoder,
  loadFFmpeg,
  terminateFFmpeg,
  type FFmpegFormat,
} from "./export/ffmpeg-encoder";
import { useImageStore } from "@/lib/store";

/**
 * True when an error was raised because the user cancelled the export.
 * Callers use this to skip "export failed" messaging.
 */
export function isExportAborted(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

const ANIMATION_FPS = 60;
const SLIDESHOW_FPS = 30; // Static frames don't need 60fps — halves all frame work

// Bitrates for different quality levels (for WebCodecs)
const QUALITY_BITRATES: Record<VideoQuality, number> = {
  high: 25_000_000,   // 25 Mbps
  medium: 10_000_000, // 10 Mbps
  low: 5_000_000,     // 5 Mbps
};

// Encoder types
export type EncoderType = 'auto' | 'ffmpeg' | 'webcodecs' | 'mediarecorder';

// Extended format type that includes GIF (FFmpeg only)
export type ExtendedVideoFormat = VideoFormat | 'gif';

export interface VideoExportOptions {
  format?: ExtendedVideoFormat;
  quality?: VideoQuality;
  encoder?: EncoderType; // Which encoder to use (default: 'auto')
}

/**
 * Check available encoders and their capabilities
 */
export async function checkEncoderSupport(): Promise<{
  ffmpeg: boolean;
  webcodecs: boolean;
  mediarecorder: boolean;
  recommended: EncoderType;
}> {
  const webcodecs = isWebCodecsSupported() && await isH264Supported();

  return {
    ffmpeg: true, // Always available (WASM)
    webcodecs,
    mediarecorder: true, // Always available
    recommended: 'ffmpeg', // FFmpeg is most reliable
  };
}

/**
 * Pre-load FFmpeg for faster exports
 * Call this early (e.g., when user opens export dialog)
 */
export async function preloadFFmpeg(
  onProgress?: (progress: number) => void
): Promise<void> {
  await loadFFmpeg(onProgress);
}

/**
 * Save current store state for rollback on error
 */
function saveStoreState() {
  const store = useImageStore.getState();
  return {
    perspective3D: { ...store.perspective3D },
    imageOpacity: store.imageOpacity,
    activeSlideId: store.activeSlideId,
  };
}

/**
 * Restore store state (used on export error)
 */
function restoreStoreState(saved: ReturnType<typeof saveStoreState>) {
  const store = useImageStore.getState();
  store.setPerspective3D(saved.perspective3D);
  store.setImageOpacity(saved.imageOpacity);
  if (saved.activeSlideId) {
    store.setActiveSlide(saved.activeSlideId);
  }
}

/**
 * Trigger file download from blob
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Mark the export done, trigger the file download, and return the result —
 * the common tail shared by every encoder path.
 */
function finishExport<F extends string>(
  progress: ReturnType<typeof useExportProgress.getState>,
  blob: Blob,
  namePrefix: "video" | "animation",
  format: F
): { format: F } {
  progress.done();
  downloadBlob(blob, `screenshotstudio-${namePrefix}-${Date.now()}.${format}`);
  return { format };
}

function getMediaRecorderCodec(preferFormat: VideoFormat): { mimeType: string; format: VideoFormat } {
  if (typeof MediaRecorder === "undefined") {
    throw new Error("MediaRecorder is not supported in this browser");
  }

  if (preferFormat === "mp4" && isMp4Supported()) {
    return { mimeType: "video/mp4; codecs=avc1", format: "mp4" };
  }
  if (MediaRecorder.isTypeSupported("video/webm; codecs=vp9")) {
    return { mimeType: "video/webm; codecs=vp9", format: "webm" };
  }
  return { mimeType: "video/webm; codecs=vp8", format: "webm" };
}

function yieldToMain(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestIdleCallback !== "undefined") {
      requestIdleCallback(() => resolve(), { timeout: 16 });
    } else {
      setTimeout(resolve, 0);
    }
  });
}

/**
 * Export slideshow as video — routes to appropriate encoder based on format
 */
export async function exportSlideshowVideo(options: VideoExportOptions = {}) {
  const { format = "mp4", quality = "high" } = options;
  const progress = useExportProgress.getState();
  const savedState = saveStoreState();

  const signal = progress.start();

  try {
    let result;

    if (format === "webm") {
      result = isWebCodecsSupported() && await isVpxSupported()
        ? await exportSlideshowWithWebCodecs("webm", quality, progress, signal)
        : await exportSlideshowWithFFmpeg("webm", quality, progress, signal);
    } else if (format === "gif") {
      result = await exportSlideshowWithFFmpeg("gif", quality, progress, signal);
    } else if (isWebCodecsSupported() && await isH264Supported()) {
      result = await exportSlideshowWithWebCodecs("mp4", quality, progress, signal);
    } else {
      result = await exportSlideshowWithFFmpeg("mp4", quality, progress, signal);
    }

    restoreStoreState(savedState);
    return result;
  } catch (error) {
    progress.done();
    restoreStoreState(savedState);
    throw error;
  }
}

/**
 * Export slideshow using WebCodecs (H.264/MP4 or VP9-VP8/WebM, hardware-accelerated where available)
 */
async function exportSlideshowWithWebCodecs(
  format: "mp4" | "webm",
  quality: VideoQuality,
  progress: ReturnType<typeof useExportProgress.getState>,
  signal?: AbortSignal
) {
  const state: { encoder: WebCodecsVideoEncoder | null; frameIndex: number } = {
    encoder: null,
    frameIndex: 0,
  };

  try {
    await streamSlidesToEncoder(
      SLIDESHOW_FPS,
      async (canvas, idx) => {
        if (!state.encoder) {
          state.encoder = new WebCodecsVideoEncoder({
            width: canvas.width,
            height: canvas.height,
            fps: SLIDESHOW_FPS,
            bitrate: QUALITY_BITRATES[quality],
            container: format,
          });
          await state.encoder.initialize();
        }

        await state.encoder.encodeFromCanvas(canvas, idx);
        state.frameIndex++;

        if (idx % 10 === 0) {
          await new Promise((r) => setTimeout(r, 0));
        }
      },

      (p) => progress.set(p * 0.9),
      signal
    );

    if (!state.encoder) {
      throw new Error("No frames to export");
    }

    const blob = await state.encoder.finalize();
    return finishExport(progress, blob, "video", format);
  } catch (error) {
    state.encoder?.dispose();
    throw error;
  }
}

/**
 * Export slideshow using FFmpeg concat demuxer.
 * Writes 1 JPEG per unique slide + duration script — no duplicate frame files.
 */
async function exportSlideshowWithFFmpeg(
  format: FFmpegFormat,
  quality: VideoQuality,
  progress: ReturnType<typeof useExportProgress.getState>,
  signal?: AbortSignal
) {
  const { slides, slideshow, uploadedImageUrl } = useImageStore.getState();

  // Build ordered slide list
  const orderedSlides = [...slides];
  const slideList: (typeof orderedSlides[number] | null)[] =
    orderedSlides.length > 0 ? orderedSlides : uploadedImageUrl ? [null] : [];

  if (slideList.length === 0) {
    throw new Error("No frames to export");
  }

  let encoder: FFmpegVideoEncoder | null = null;

  // Kill the WASM worker if the user cancels mid-encode (FFmpeg.exec can't be
  // interrupted otherwise). The next export reloads the core from cache.
  const onAbort = () => terminateFFmpeg();
  signal?.addEventListener("abort", onAbort, { once: true });

  try {
    for (let si = 0; si < slideList.length; si++) {
      throwIfAborted(signal);
      const slide = slideList[si];

      if (slide) {
        await switchToSlideAndWait(slide.id, slide.src, 50);
      }

      const canvas = await exportSlideFrameAsCanvas();

      if (!encoder) {
        encoder = new FFmpegVideoEncoder({
          width: canvas.width,
          height: canvas.height,
          fps: SLIDESHOW_FPS,
          format,
          quality,
          onProgress: (p) => progress.set(40 + p * 0.6),
          onLog: () => {},
        });
        encoder.enableConcatMode();
        await encoder.initialize();
      }

      const duration = slide
        ? (slide.duration || slideshow.defaultDuration || 2)
        : (slideshow.defaultDuration || 2);

      await encoder.addSlide(canvas, duration);
      progress.set((si + 1) / slideList.length * 40);
    }

    if (!encoder) {
      throw new Error("No frames to export");
    }

    throwIfAborted(signal);
    const blob = await encoder.encode();
    return finishExport(progress, blob, "video", format);
  } catch (error) {
    // encode() cleans up on its own; this covers bailing out before encode().
    await encoder?.dispose();
    // terminateFFmpeg() rejects a mid-encode exec() with its own error — surface
    // it as a cancellation so callers don't treat it as a failure.
    if (signal?.aborted) throw new DOMException("Export cancelled", "AbortError");
    throw error;
  } finally {
    signal?.removeEventListener("abort", onAbort);
  }
}

/**
 * Export slideshow using MediaRecorder (native WebM support in browsers)
 */
async function exportSlideshowWithMediaRecorder(
  format: VideoFormat,
  quality: VideoQuality,
  progress: ReturnType<typeof useExportProgress.getState>
) {
  const bitrate = QUALITY_BITRATES[quality];
  const { mimeType, format: actualFormat } = getMediaRecorderCodec(format);

  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;left:-99999px;top:0;pointer-events:none;";
  document.body.appendChild(canvas);

  let stream: MediaStream | null = null;

  try {
    stream = canvas.captureStream(SLIDESHOW_FPS);
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: bitrate,
    });
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.start();

    let frameCount = 0;
    const frameInterval = 1000 / SLIDESHOW_FPS;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Failed to initialize canvas context for recording");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    await streamSlidesToEncoder(
      SLIDESHOW_FPS,
      async (sourceCanvas) => {
        if (canvas.width !== sourceCanvas.width || canvas.height !== sourceCanvas.height) {
          canvas.width = sourceCanvas.width;
          canvas.height = sourceCanvas.height;
        }

        ctx.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);
        await new Promise((r) => setTimeout(r, Math.min(frameInterval, 16)));

        frameCount++;
        if (frameCount % 10 === 0) {
          await yieldToMain();
        }
      },
      (p) => progress.set(p * 0.95)
    );

    await new Promise((r) => setTimeout(r, 200));
    recorder.stop();
    await new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
    });

    const blobType = actualFormat === "mp4" ? "video/mp4" : "video/webm";
    const blob = new Blob(chunks, { type: blobType });
    return finishExport(progress, blob, "video", actualFormat);
  } finally {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    canvas.remove();
  }
}

/**
 * Export animation as video
 *
 * Encoder options:
 * - 'ffmpeg': Best quality, supports MP4/WebM/GIF, runs in browser via WASM
 * - 'webcodecs': Fast, hardware-accelerated, MP4 only, Chrome/Edge/Safari
 * - 'mediarecorder': Fallback, WebM only in most browsers
 * - 'auto': Automatically picks the best available encoder (default)
 */
export async function exportAnimationVideo(options: VideoExportOptions = {}) {
  const { format = "mp4", quality = "high", encoder = "auto" } = options;
  const progress = useExportProgress.getState();
  const savedState = saveStoreState();

  const signal = progress.start();

  try {
    // Determine which encoder to use
    let selectedEncoder = encoder;

    if (encoder === "auto") {
      // Auto-select based on format and availability
      if (format === "gif") {
        selectedEncoder = "ffmpeg"; // Only FFmpeg supports GIF
      } else if ((format === "mp4" || format === "webm") && isWebCodecsSupported()) {
        selectedEncoder = "webcodecs"; // Prefer WebCodecs: hardware-accelerated, no WASM loading.
        // Precise codec availability (H.264/VP9/VP8) is checked below, with an FFmpeg fallback.
      } else {
        selectedEncoder = "ffmpeg";
      }
    }

    // Route to appropriate encoder
    let result;
    switch (selectedEncoder) {
      case "ffmpeg":
        result = await exportAnimationWithFFmpeg(format as FFmpegFormat, quality, progress, signal);
        break;

      case "webcodecs": {
        const webCodecsFormat = format === "webm" ? "webm" : "mp4";
        const codecSupported = webCodecsFormat === "webm" ? await isVpxSupported() : await isH264Supported();
        if (isWebCodecsSupported() && codecSupported) {
          result = await exportAnimationWithWebCodecs(webCodecsFormat, quality, progress, signal);
          break;
        }
        // Fall through to FFmpeg if WebCodecs unavailable
        console.warn("WebCodecs not available, falling back to FFmpeg");
        result = await exportAnimationWithFFmpeg(format as FFmpegFormat, quality, progress, signal);
        break;
      }

      case "mediarecorder":
        result = await exportAnimationWithMediaRecorder(format as VideoFormat, quality, progress, signal);
        break;

      default:
        result = await exportAnimationWithFFmpeg(format as FFmpegFormat, quality, progress, signal);
        break;
    }

    restoreStoreState(savedState);
    return result;
  } catch (error) {
    progress.done();
    restoreStoreState(savedState);
    throw error;
  }
}

/**
 * Export animation using FFmpeg WASM — streams frames directly to encoder
 */
async function exportAnimationWithFFmpeg(
  format: FFmpegFormat,
  quality: VideoQuality,
  progress: ReturnType<typeof useExportProgress.getState>,
  signal?: AbortSignal
) {
  const state: { encoder: FFmpegVideoEncoder | null } = { encoder: null };

  // Kill the WASM worker if the user cancels mid-encode (FFmpeg.exec can't be
  // interrupted otherwise). The next export reloads the core from cache.
  const onAbort = () => terminateFFmpeg();
  signal?.addEventListener("abort", onAbort, { once: true });

  try {
    await streamAnimationToEncoder(
      ANIMATION_FPS,
      async (canvas) => {
        // Initialize encoder on first frame
        if (!state.encoder) {
          state.encoder = new FFmpegVideoEncoder({
            width: canvas.width,
            height: canvas.height,
            fps: ANIMATION_FPS,
            format,
            quality,
            onProgress: (p) => progress.set(40 + p * 0.6),
            onLog: () => {},
          });
          await state.encoder.initialize();
        }

        await state.encoder.addFrame(canvas);
      },
      (p) => progress.set(p * 0.4),
      signal
    );

    if (!state.encoder) {
      throw new Error("No frames to export");
    }

    throwIfAborted(signal);
    const blob = await state.encoder.encode();
    return finishExport(progress, blob, "animation", format);
  } catch (error) {
    // encode() cleans up on its own; this covers bailing out before encode().
    await state.encoder?.dispose();
    // terminateFFmpeg() rejects a mid-encode exec() with its own error — surface
    // it as a cancellation so callers don't treat it as a failure.
    if (signal?.aborted) throw new DOMException("Export cancelled", "AbortError");
    throw error;
  } finally {
    signal?.removeEventListener("abort", onAbort);
  }
}

/**
 * Export animation using WebCodecs + mp4-muxer/webm-muxer — streams frames directly
 */
async function exportAnimationWithWebCodecs(
  format: "mp4" | "webm",
  quality: VideoQuality,
  progress: ReturnType<typeof useExportProgress.getState>,
  signal?: AbortSignal
) {
  const state: { encoder: WebCodecsVideoEncoder | null; frameCount: number } = {
    encoder: null,
    frameCount: 0,
  };

  try {
    await streamAnimationToEncoder(
      ANIMATION_FPS,
      async (canvas, frameIndex) => {
        // Initialize encoder on first frame
        if (!state.encoder) {
          state.encoder = new WebCodecsVideoEncoder({
            width: canvas.width,
            height: canvas.height,
            fps: ANIMATION_FPS,
            bitrate: QUALITY_BITRATES[quality],
            container: format,
          });
          await state.encoder.initialize();
        }

        await state.encoder.encodeFromCanvas(canvas, frameIndex);
        state.frameCount++;

        if (frameIndex % 10 === 0) {
          await new Promise((r) => setTimeout(r, 0));
        }
      },
      (p) => progress.set(p * 0.9),
      signal
    );

    if (!state.encoder) {
      throw new Error("No frames to export");
    }

    const blob = await state.encoder.finalize();
    return finishExport(progress, blob, "animation", format);
  } catch (error) {
    state.encoder?.dispose();
    throw error;
  }
}

/**
 * Export animation using MediaRecorder (fallback)
 */
async function exportAnimationWithMediaRecorder(
  format: VideoFormat,
  quality: VideoQuality,
  progress: ReturnType<typeof useExportProgress.getState>,
  signal?: AbortSignal
) {
  const bitrate = QUALITY_BITRATES[quality];
  const { mimeType, format: actualFormat } = getMediaRecorderCodec(format);

  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;left:-99999px;top:0;pointer-events:none;";
  document.body.appendChild(canvas);

  let stream: MediaStream | null = null;

  try {
    stream = canvas.captureStream(ANIMATION_FPS);
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: bitrate,
    });
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.start();

    let frameCount = 0;
    const frameInterval = 1000 / ANIMATION_FPS;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Failed to initialize canvas context for recording");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    await streamAnimationToEncoder(
      ANIMATION_FPS,
      async (sourceCanvas) => {
        if (canvas.width !== sourceCanvas.width || canvas.height !== sourceCanvas.height) {
          canvas.width = sourceCanvas.width;
          canvas.height = sourceCanvas.height;
        }

        ctx.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);
        await new Promise((r) => setTimeout(r, Math.min(frameInterval, 16)));

        frameCount++;
        if (frameCount % 10 === 0) {
          await yieldToMain();
        }
      },
      (p) => progress.set(p * 0.95),
      signal
    );

    await new Promise((r) => setTimeout(r, 200));
    recorder.stop();
    await new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
    });

    const blobType = actualFormat === "mp4" ? "video/mp4" : "video/webm";
    const blob = new Blob(chunks, { type: blobType });
    return finishExport(progress, blob, "animation", actualFormat);
  } finally {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    canvas.remove();
  }
}
