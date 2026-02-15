import { useImageStore } from "@/lib/store";
import { exportSlideFrame } from "./export-slideFrame";
import { getClipInterpolatedProperties } from "@/lib/animation/interpolation";
import { DEFAULT_ANIMATABLE_PROPERTIES } from "@/types/animation";

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Yield to the main thread to keep UI responsive
 * Uses requestIdleCallback if available, otherwise setTimeout
 */
function yieldToMain(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => resolve(), { timeout: 50 });
    } else {
      setTimeout(resolve, 0);
    }
  });
}

export async function renderSlidesToFrames() {
  const store = useImageStore.getState();
  const { slides, setActiveSlide, slideshow, uploadedImageUrl } = store;

  const frames: { img: HTMLImageElement; duration: number }[] = [];

  // If no slides but has an uploaded image, create a single frame from it
  if (slides.length === 0 && uploadedImageUrl) {
    const img = await exportSlideFrame();
    frames.push({
      img,
      duration: slideshow.defaultDuration || 2,
    });
    return frames;
  }

  for (const slide of slides) {
    setActiveSlide(slide.id);

    // let React + Konva flush
    await wait(120);

    const img = await exportSlideFrame();

    // Use individual slide duration, fallback to default
    frames.push({
      img,
      duration: slide.duration || slideshow.defaultDuration || 2,
    });
  }

  return frames;
}

/**
 * Render animation timeline to frames at specified fps
 * Uses batched processing with UI yields to keep the interface responsive
 */
export async function renderAnimationToFrames(
  fps: number = 60,
  onProgress?: (progress: number) => void
) {
  const store = useImageStore.getState();
  const { timeline, animationClips, setPerspective3D, setImageOpacity } = store;
  const { duration, tracks } = timeline;

  if (tracks.length === 0) {
    throw new Error("No animation tracks to render");
  }

  const frames: { img: HTMLImageElement; duration: number }[] = [];
  const frameIntervalMs = 1000 / fps;
  const totalFrames = Math.ceil(duration / frameIntervalMs);
  const frameDuration = 1 / fps; // Duration each frame should display (in seconds)

  // Process frames in batches to keep UI responsive
  const BATCH_SIZE = 5; // Process 5 frames before yielding

  for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
    const time = frameIndex * frameIntervalMs;

    // Calculate interpolated properties at this time using clip-aware interpolation
    const interpolated = getClipInterpolatedProperties(
      animationClips,
      tracks,
      time,
      DEFAULT_ANIMATABLE_PROPERTIES
    );

    // Apply interpolated properties to store
    setPerspective3D({
      perspective: interpolated.perspective,
      rotateX: interpolated.rotateX,
      rotateY: interpolated.rotateY,
      rotateZ: interpolated.rotateZ,
      translateX: interpolated.translateX,
      translateY: interpolated.translateY,
      scale: interpolated.scale,
    });

    if (interpolated.imageOpacity !== undefined) {
      setImageOpacity(interpolated.imageOpacity);
    }

    // Let React + Konva flush the changes (minimal wait)
    await wait(8);

    // Capture the frame
    const img = await exportSlideFrame();

    frames.push({
      img,
      duration: frameDuration,
    });

    // Report progress
    if (onProgress) {
      onProgress((frameIndex + 1) / totalFrames * 100);
    }

    // Yield to main thread every BATCH_SIZE frames to keep UI responsive
    if ((frameIndex + 1) % BATCH_SIZE === 0) {
      await yieldToMain();
    }
  }

  return frames;
}
