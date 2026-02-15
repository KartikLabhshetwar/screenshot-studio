import { useExportProgress } from "@/hooks/useExportProgress";
import { renderSlidesToFrames, renderAnimationToFrames } from "./render-slideFrame";
import {
  exportVideo,
  type VideoFormat,
  type VideoQuality,
} from "./export/video-encoder";

const FPS = 60;

export interface VideoExportOptions {
  format?: VideoFormat;
  quality?: VideoQuality;
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

    const { blob, format: actualFormat } = await exportVideo(frames, {
      width,
      height,
      fps: FPS,
      format,
      quality,
      onProgress: (p) => progress.set(p),
    });

    progress.done();

    // Download the video
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stage-video-${Date.now()}.${actualFormat}`;
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
 * Export animation as video (MP4 or WebM)
 */
export async function exportAnimationVideo(options: VideoExportOptions = {}) {
  const { format = "mp4", quality = "high" } = options;
  const progress = useExportProgress.getState();

  progress.start();

  try {
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
    a.download = `stage-animation-${Date.now()}.${actualFormat}`;
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
