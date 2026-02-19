import { useExportProgress } from "@/hooks/useExportProgress";
import { streamSlidesToEncoder, renderSlidesToFrames, renderAnimationToFrames, streamAnimationToEncoder } from "./render-slideFrame";
import {
  exportVideo,
  type VideoFormat,
  type VideoQuality,
} from "./export/video-encoder";
import {
  WebCodecsVideoEncoder,
  isWebCodecsSupported,
  isH264Supported,
} from "./export/webcodecs-encoder";
import {
  FFmpegVideoEncoder,
  loadFFmpeg,
  isFFmpegLoaded,
  type FFmpegFormat,
} from "./export/ffmpeg-encoder";
import { useImageStore } from "@/lib/store";

const FPS = 60;

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
 * Export slideshow as video — routes to appropriate encoder based on format
 */
export async function exportSlideshowVideo(options: VideoExportOptions = {}) {
  const { format = "mp4", quality = "high" } = options;
  const progress = useExportProgress.getState();
  const savedState = saveStoreState();

  progress.start();

  try {
    let result;

    if (format === "webm") {
      result = await exportSlideshowWithMediaRecorder("webm", quality, progress);
    } else if (format === "gif") {
      result = await exportSlideshowWithFFmpeg("gif", quality, progress);
    } else if (isWebCodecsSupported() && await isH264Supported()) {
      result = await exportSlideshowWithWebCodecs(quality, progress);
    } else {
      result = await exportSlideshowWithFFmpeg("mp4", quality, progress);
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
 * Export slideshow using WebCodecs (MP4 only)
 */
async function exportSlideshowWithWebCodecs(
  quality: VideoQuality,
  progress: ReturnType<typeof useExportProgress.getState>
) {
  const state: { encoder: WebCodecsVideoEncoder | null; frameIndex: number } = {
    encoder: null,
    frameIndex: 0,
  };

  await streamSlidesToEncoder(
    FPS,
    async (canvas, idx) => {
      if (!state.encoder) {
        state.encoder = new WebCodecsVideoEncoder({
          width: canvas.width,
          height: canvas.height,
          fps: FPS,
          bitrate: QUALITY_BITRATES[quality],
        });
        await state.encoder.initialize();
      }

      await state.encoder.encodeFromCanvas(canvas, idx);
      state.frameIndex++;

      if (idx % 10 === 0) {
        await new Promise((r) => setTimeout(r, 0));
      }
    },
    (p) => progress.set(40 + p * 0.55)
  );

  if (!state.encoder) {
    throw new Error("No frames to export");
  }

  const blob = await state.encoder.finalize();
  progress.done();
  downloadBlob(blob, `screenshotstudio-video-${Date.now()}.mp4`);
  return { format: "mp4" as const };
}

/**
 * Export slideshow using FFmpeg (supports MP4, WebM, GIF)
 */
async function exportSlideshowWithFFmpeg(
  format: FFmpegFormat,
  quality: VideoQuality,
  progress: ReturnType<typeof useExportProgress.getState>
) {
  const state: { encoder: FFmpegVideoEncoder | null } = { encoder: null };

  await streamSlidesToEncoder(
    FPS,
    async (canvas) => {
      if (!state.encoder) {
        state.encoder = new FFmpegVideoEncoder({
          width: canvas.width,
          height: canvas.height,
          fps: FPS,
          format,
          quality,
          onProgress: (p) => progress.set(40 + p * 0.6),
          onLog: (msg) => console.debug('[FFmpeg]', msg),
        });
        await state.encoder.initialize();
      }

      await state.encoder.addFrame(canvas);
    },
    (p) => progress.set(p * 0.4)
  );

  if (!state.encoder) {
    throw new Error("No frames to export");
  }

  const blob = await state.encoder.encode();
  progress.done();
  downloadBlob(blob, `screenshotstudio-video-${Date.now()}.${format}`);
  return { format };
}

/**
 * Export slideshow using MediaRecorder (native WebM support in browsers)
 */
async function exportSlideshowWithMediaRecorder(
  format: VideoFormat,
  quality: VideoQuality,
  progress: ReturnType<typeof useExportProgress.getState>
) {
  const frames = await renderSlidesToFrames();

  if (!frames.length) {
    throw new Error("No frames to export");
  }

  const width = frames[0].img.width;
  const height = frames[0].img.height;

  const { blob, format: actualFormat } = await exportVideo(frames, {
    width,
    height,
    fps: FPS,
    format,
    quality,
    onProgress: (p) => progress.set(50 + p * 0.5),
  });

  progress.done();
  downloadBlob(blob, `screenshotstudio-video-${Date.now()}.${actualFormat}`);
  return { format: actualFormat };
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

  progress.start();

  try {
    // Determine which encoder to use
    let selectedEncoder = encoder;

    if (encoder === "auto") {
      // Auto-select based on format and availability
      if (format === "gif") {
        selectedEncoder = "ffmpeg"; // Only FFmpeg supports GIF
      } else if (format === "webm") {
        selectedEncoder = "mediarecorder"; // MediaRecorder natively supports WebM
      } else if (format === "mp4" && isWebCodecsSupported()) {
        selectedEncoder = "webcodecs"; // Prefer WebCodecs: browser-native, no WASM loading
      } else {
        selectedEncoder = "ffmpeg";
      }
    }

    // Route to appropriate encoder
    let result;
    switch (selectedEncoder) {
      case "ffmpeg":
        result = await exportAnimationWithFFmpeg(format as FFmpegFormat, quality, progress);
        break;

      case "webcodecs":
        if (format === "mp4" && isWebCodecsSupported() && await isH264Supported()) {
          result = await exportAnimationWithWebCodecs(quality, progress);
          break;
        }
        // Fall through to FFmpeg if WebCodecs unavailable
        console.warn("WebCodecs not available, falling back to FFmpeg");
        result = await exportAnimationWithFFmpeg(format as FFmpegFormat, quality, progress);
        break;

      case "mediarecorder":
        result = await exportAnimationWithMediaRecorder(format as VideoFormat, quality, progress);
        break;

      default:
        result = await exportAnimationWithFFmpeg(format as FFmpegFormat, quality, progress);
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
  progress: ReturnType<typeof useExportProgress.getState>
) {
  const state: { encoder: FFmpegVideoEncoder | null } = { encoder: null };

  await streamAnimationToEncoder(
    FPS,
    async (canvas) => {
      // Initialize encoder on first frame
      if (!state.encoder) {
        state.encoder = new FFmpegVideoEncoder({
          width: canvas.width,
          height: canvas.height,
          fps: FPS,
          format,
          quality,
          onProgress: (p) => progress.set(40 + p * 0.6),
          onLog: (msg) => console.debug('[FFmpeg]', msg),
        });
        await state.encoder.initialize();
      }

      await state.encoder.addFrame(canvas);
    },
    (p) => progress.set(p * 0.4)
  );

  if (!state.encoder) {
    throw new Error("No frames to export");
  }

  const blob = await state.encoder.encode();

  progress.done();

  downloadBlob(blob, `screenshotstudio-animation-${Date.now()}.${format}`);

  return { format };
}

/**
 * Export animation using WebCodecs + mp4-muxer — streams frames directly
 */
async function exportAnimationWithWebCodecs(
  quality: VideoQuality,
  progress: ReturnType<typeof useExportProgress.getState>
) {
  const state: { encoder: WebCodecsVideoEncoder | null; frameCount: number } = {
    encoder: null,
    frameCount: 0,
  };

  await streamAnimationToEncoder(
    FPS,
    async (canvas, frameIndex) => {
      // Initialize encoder on first frame
      if (!state.encoder) {
        state.encoder = new WebCodecsVideoEncoder({
          width: canvas.width,
          height: canvas.height,
          fps: FPS,
          bitrate: QUALITY_BITRATES[quality],
        });
        await state.encoder.initialize();
      }

      await state.encoder.encodeFromCanvas(canvas, frameIndex);
      state.frameCount++;

      if (frameIndex % 10 === 0) {
        await new Promise((r) => setTimeout(r, 0));
      }
    },
    (p) => progress.set(50 + p * 0.5)
  );

  if (!state.encoder) {
    throw new Error("No frames to export");
  }

  const blob = await state.encoder.finalize();

  progress.done();

  downloadBlob(blob, `screenshotstudio-animation-${Date.now()}.mp4`);

  return { format: "mp4" as const };
}

/**
 * Export animation using MediaRecorder (fallback)
 */
async function exportAnimationWithMediaRecorder(
  format: VideoFormat,
  quality: VideoQuality,
  progress: ReturnType<typeof useExportProgress.getState>
) {
  const frames = await renderAnimationToFrames(FPS, (p) => {
    // Rendering is ~60% of the work
    progress.set(p * 0.6);
  });

  if (!frames.length) {
    throw new Error("No frames to export");
  }

  const width = frames[0].img.width;
  const height = frames[0].img.height;

  const { blob, format: actualFormat } = await exportVideo(frames, {
    width,
    height,
    fps: FPS,
    format,
    quality,
    onProgress: (p) => progress.set(60 + p * 0.4), // Encoding is ~40% of work
  });

  progress.done();

  downloadBlob(blob, `screenshotstudio-animation-${Date.now()}.${actualFormat}`);

  return { format: actualFormat };
}
