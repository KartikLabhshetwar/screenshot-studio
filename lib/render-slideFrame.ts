import { useImageStore } from "@/lib/store";
import { exportSlideFrame, exportSlideFrameAsCanvas } from "./export-slideFrame";
import { getClipInterpolatedProperties } from "@/lib/animation/interpolation";
import { DEFAULT_ANIMATABLE_PROPERTIES } from "@/types/animation";

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Force a DOM reflow/repaint to ensure CSS changes are applied
 */
function forceReflow(): void {
  // Reading offsetHeight forces a synchronous reflow
  document.body.offsetHeight;
}

/**
 * Wait for an image URL to be preloaded
 * This ensures the browser has the image cached before we try to render
 */
async function waitForImageLoad(src: string, maxWaitMs: number = 3000): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    const timeout = setTimeout(() => {
      console.warn('Image preload timeout, proceeding anyway');
      resolve();
    }, maxWaitMs);

    img.onload = () => {
      clearTimeout(timeout);
      resolve();
    };

    img.onerror = () => {
      clearTimeout(timeout);
      console.warn('Image preload error, proceeding anyway');
      resolve();
    };

    img.src = src;
  });
}

/**
 * Wait for the DOM to reflect the current slide's image.
 * Polls until the <img> inside the canvas container matches the expected src,
 * ensuring React has re-rendered after setActiveSlide.
 */
async function waitForDOMImageUpdate(expectedSrc: string, maxWaitMs: number = 3000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const container = document.querySelector('[data-html-canvas="true"]');
    if (container) {
      const img = container.querySelector('img[alt="Main image"]') as HTMLImageElement | null;
      if (img && img.complete && img.naturalWidth > 0) {
        // Compare src — handle both exact match and resolved URL match
        if (img.src === expectedSrc || img.src.endsWith(expectedSrc) || expectedSrc.endsWith(img.src)) {
          return;
        }
        // Also try matching by creating a resolved URL
        try {
          const resolved = new URL(expectedSrc, window.location.href).href;
          if (img.src === resolved) {
            return;
          }
        } catch {
          // Invalid URL, fall through to exact match
        }
      }
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  console.warn('DOM image update timeout, proceeding anyway');
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

/**
 * Calculate which slide should be active at a given time
 * Returns the slide ID or null if no slides
 */
function getActiveSlideAtTime(
  slides: { id: string; duration: number }[],
  timeMs: number,
  defaultDuration: number
): string | null {
  if (slides.length === 0) return null;
  if (slides.length === 1) return slides[0].id;

  let cumulativeTime = 0;

  for (const slide of slides) {
    const slideDurationMs = (slide.duration || defaultDuration) * 1000;
    if (timeMs < cumulativeTime + slideDurationMs) {
      return slide.id;
    }
    cumulativeTime += slideDurationMs;
  }

  // If past all slides, return the last one
  return slides[slides.length - 1].id;
}

export async function renderSlidesToFrames() {
  const { slides, setActiveSlide, slideshow, uploadedImageUrl } = useImageStore.getState();

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

    // Force DOM reflow to ensure slide change is rendered
    forceReflow();

    // Wait for image to load - this is critical for slide stitching
    await waitForImageLoad(slide.src, 3000);
    await waitForDOMImageUpdate(slide.src, 3000);
    await wait(100);

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
 * Stream slide frames to a callback for encoding (no memory accumulation).
 * Each slide is captured once and the callback is invoked for each frame.
 */
export async function streamSlidesToEncoder(
  fps: number,
  onFrame: (canvas: HTMLCanvasElement, frameIndex: number) => Promise<void>,
  onProgress?: (progress: number) => void
): Promise<{ width: number; height: number; totalFrames: number }> {
  // Read a fresh snapshot of the store each time
  const { slides, setActiveSlide, slideshow, uploadedImageUrl } = useImageStore.getState();

  // Make an ordered copy so iteration order is deterministic
  const orderedSlides = [...slides];

  let width = 0;
  let height = 0;
  let globalFrameIndex = 0;

  const slideList: (typeof orderedSlides[number] | null)[] =
    orderedSlides.length > 0 ? orderedSlides : uploadedImageUrl ? [null] : [];

  // Calculate total frames up front for progress reporting
  let totalFrames = 0;
  for (const slide of slideList) {
    const duration = slide ? (slide.duration || slideshow.defaultDuration || 2) : (slideshow.defaultDuration || 2);
    totalFrames += Math.max(1, Math.round(duration * fps));
  }

  for (let si = 0; si < slideList.length; si++) {
    const slide = slideList[si];

    if (slide) {
      // Always force-switch to this slide, even if it appears to be active already.
      // This ensures a clean state between repeated exports.
      setActiveSlide(slide.id);
      forceReflow();
      await waitForImageLoad(slide.src, 3000);
      await waitForDOMImageUpdate(slide.src, 3000);
      await wait(150);
      forceReflow();
    }

    const canvas = await exportSlideFrameAsCanvas();

    if (si === 0) {
      width = canvas.width;
      height = canvas.height;
    }

    const duration = slide ? (slide.duration || slideshow.defaultDuration || 2) : (slideshow.defaultDuration || 2);
    const frameCount = Math.max(1, Math.round(duration * fps));

    // Stream the same canvas for the duration of this slide
    for (let i = 0; i < frameCount; i++) {
      await onFrame(canvas, globalFrameIndex);
      globalFrameIndex++;

      // Yield periodically
      if (globalFrameIndex % 30 === 0) {
        await new Promise((r) => setTimeout(r, 0));
      }
    }

    onProgress?.((si + 1) / slideList.length * 100);
  }

  return { width, height, totalFrames: globalFrameIndex };
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
  const { timeline, animationClips, slides, slideshow, setActiveSlide, setPerspective3D, setImageOpacity } = store;
  const { duration, tracks } = timeline;

  if (tracks.length === 0 && slides.length <= 1) {
    throw new Error("No animation tracks to render");
  }

  const frames: { img: HTMLImageElement; duration: number }[] = [];
  const frameIntervalMs = 1000 / fps;
  const totalFrames = Math.ceil(duration / frameIntervalMs);
  const frameDuration = 1 / fps; // Duration each frame should display (in seconds)

  // Process frames in batches to keep UI responsive
  const BATCH_SIZE = 5; // Process 5 frames before yielding

  let lastSlideId: string | null = null;

  for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
    const time = frameIndex * frameIntervalMs;

    // Switch to the correct slide based on time (for multi-slide animations)
    if (slides.length > 1) {
      const targetSlideId = getActiveSlideAtTime(slides, time, slideshow.defaultDuration);
      if (targetSlideId && targetSlideId !== lastSlideId) {
        setActiveSlide(targetSlideId);
        lastSlideId = targetSlideId;
        forceReflow();

        // Wait for slide image to load and DOM to update
        const slide = slides.find(s => s.id === targetSlideId);
        if (slide) {
          await waitForImageLoad(slide.src, 3000);
          await waitForDOMImageUpdate(slide.src, 3000);
        }
      }
    }

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

    // Force DOM reflow to ensure CSS transforms are applied
    forceReflow();

    // Let React flush the changes - longer wait for transforms to render
    await wait(50);

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

/**
 * Stream animation frames to encoder callback (no memory accumulation).
 * Captures each frame and immediately passes it to onFrame for encoding.
 */
export async function streamAnimationToEncoder(
  fps: number,
  onFrame: (canvas: HTMLCanvasElement, frameIndex: number) => Promise<void>,
  onProgress?: (progress: number) => void
): Promise<{ width: number; height: number; totalFrames: number }> {
  const store = useImageStore.getState();
  const { timeline, animationClips, slides, slideshow, setActiveSlide, setPerspective3D, setImageOpacity } = store;
  const { duration, tracks } = timeline;

  if (tracks.length === 0 && slides.length <= 1) {
    throw new Error("No animation tracks to render");
  }

  const frameIntervalMs = 1000 / fps;
  const totalFrames = Math.ceil(duration / frameIntervalMs);
  const BATCH_SIZE = 5;

  let width = 0;
  let height = 0;
  let lastSlideId: string | null = null;

  for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
    const time = frameIndex * frameIntervalMs;

    // Switch to the correct slide based on time (for multi-slide animations)
    if (slides.length > 1) {
      const targetSlideId = getActiveSlideAtTime(slides, time, slideshow.defaultDuration);
      if (targetSlideId && targetSlideId !== lastSlideId) {
        setActiveSlide(targetSlideId);
        lastSlideId = targetSlideId;
        forceReflow();

        // Wait for slide image to load and DOM to update
        const slide = slides.find(s => s.id === targetSlideId);
        if (slide) {
          await waitForImageLoad(slide.src, 3000);
          await waitForDOMImageUpdate(slide.src, 3000);
        }
      }
    }

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

    // Force DOM reflow to ensure CSS transforms are applied
    forceReflow();

    // Let React flush the changes
    await wait(50);

    // Capture and immediately stream to encoder
    const canvas = await exportSlideFrameAsCanvas();

    if (frameIndex === 0) {
      width = canvas.width;
      height = canvas.height;
    }

    await onFrame(canvas, frameIndex);

    // Report progress
    if (onProgress) {
      onProgress((frameIndex + 1) / totalFrames * 100);
    }

    // Yield to main thread every BATCH_SIZE frames
    if ((frameIndex + 1) % BATCH_SIZE === 0) {
      await yieldToMain();
    }
  }

  return { width, height, totalFrames };
}
