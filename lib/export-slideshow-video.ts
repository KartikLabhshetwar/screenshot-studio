import { useExportProgress } from "@/hooks/useExportProgress";
import { renderSlidesToFrames, renderAnimationToFrames, renderAnimationToCanvasFrames } from "./render-slideFrame";
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
 * Export slideshow as video (MP4 or WebM)
 */
export async function exportSlideshowVideo(options: VideoExportOptions = {}) {
  const { format = "mp4", quality = "high" } = options;
  const progress = useExportProgress.getState();

  progress.start();

  try {
    const frames = await renderSlidesToFrames();

    if (!frames.length) {
      throw new Error("No frames to export");
    }

    const width = frames[0].img.width;
    const height = frames[0].img.height;

    // For GIF, use FFmpeg; otherwise use MediaRecorder
    const videoFormat = format === 'gif' ? 'mp4' : format;

    const { blob, format: actualFormat } = await exportVideo(frames, {
      width,
      height,
      fps: FPS,
      format: videoFormat as VideoFormat,
      quality,
      onProgress: (p) => progress.set(p),
    });

    progress.done();

    // Download the video
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `screenshotstudio-video-${Date.now()}.${actualFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return { format: actualFormat };
  } catch (error) {
    progress.done();
    throw error;
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

  progress.start();

  try {
    // Determine which encoder to use
    let selectedEncoder = encoder;

    if (encoder === "auto") {
      // Auto-select based on format and availability
      if (format === "gif") {
        selectedEncoder = "ffmpeg"; // Only FFmpeg supports GIF
      } else if (format === "mp4") {
        // Prefer FFmpeg for reliability, WebCodecs for speed
        selectedEncoder = "ffmpeg";
      } else {
        selectedEncoder = "ffmpeg";
      }
    }

    // Route to appropriate encoder
    switch (selectedEncoder) {
      case "ffmpeg":
        return await exportAnimationWithFFmpeg(format as FFmpegFormat, quality, progress);

      case "webcodecs":
        if (format === "mp4" && isWebCodecsSupported() && await isH264Supported()) {
          return await exportAnimationWithWebCodecs(quality, progress);
        }
        // Fall through to FFmpeg if WebCodecs unavailable
        console.warn("WebCodecs not available, falling back to FFmpeg");
        return await exportAnimationWithFFmpeg(format as FFmpegFormat, quality, progress);

      case "mediarecorder":
        return await exportAnimationWithMediaRecorder(format as VideoFormat, quality, progress);

      default:
        return await exportAnimationWithFFmpeg(format as FFmpegFormat, quality, progress);
    }
  } catch (error) {
    progress.done();
    throw error;
  }
}

/**
 * Export animation using FFmpeg WASM (recommended)
 * Supports: MP4, WebM, GIF
 */
async function exportAnimationWithFFmpeg(
  format: FFmpegFormat,
  quality: VideoQuality,
  progress: ReturnType<typeof useExportProgress.getState>
) {
  // Render frames to canvas
  const { canvases, width, height } = await renderAnimationToCanvasFrames(FPS, (p) => {
    // Rendering is ~40% of the work
    progress.set(p * 0.4);
  });

  if (canvases.length === 0) {
    throw new Error("No frames to export");
  }

  // Initialize FFmpeg encoder
  const encoder = new FFmpegVideoEncoder({
    width,
    height,
    fps: FPS,
    format,
    quality,
    onProgress: (p) => progress.set(40 + p * 0.6), // Encoding is 60% of work
    onLog: (msg) => console.debug('[FFmpeg]', msg),
  });

  await encoder.initialize();

  // Add all frames
  for (const canvas of canvases) {
    await encoder.addFrame(canvas);
  }

  // Encode to video
  const blob = await encoder.encode();

  progress.done();

  // Download the video
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `screenshotstudio-animation-${Date.now()}.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return { format };
}

/**
 * Export animation using WebCodecs + mp4-muxer (high quality)
 */
async function exportAnimationWithWebCodecs(
  quality: VideoQuality,
  progress: ReturnType<typeof useExportProgress.getState>
) {
  // Render frames to canvas
  const { canvases, width, height } = await renderAnimationToCanvasFrames(FPS, (p) => {
    // Rendering is ~50% of the work
    progress.set(p * 0.5);
  });

  if (canvases.length === 0) {
    throw new Error("No frames to export");
  }

  // Initialize WebCodecs encoder
  const encoder = new WebCodecsVideoEncoder({
    width,
    height,
    fps: FPS,
    bitrate: QUALITY_BITRATES[quality],
    onProgress: (p) => progress.set(50 + p * 0.5),
  });

  await encoder.initialize();

  // Encode each frame
  for (let i = 0; i < canvases.length; i++) {
    await encoder.encodeFromCanvas(canvases[i], i);

    // Report progress (encoding is 50% of work)
    progress.set(50 + ((i + 1) / canvases.length) * 50);

    // Yield to main thread periodically
    if (i % 10 === 0) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  // Finalize and get the MP4 blob
  const blob = await encoder.finalize();

  progress.done();

  // Download the video
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `screenshotstudio-animation-${Date.now()}.mp4`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

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

  // Download the video
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `screenshotstudio-animation-${Date.now()}.${actualFormat}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return { format: actualFormat };
}
