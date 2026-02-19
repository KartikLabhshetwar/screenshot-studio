/**
 * Video Encoder using MediaRecorder API
 * Supports MP4 (Safari) and WebM (Chrome/Firefox) with automatic fallback
 * Optimized for UI responsiveness during encoding
 */

export type VideoFormat = "mp4" | "webm"
export type VideoQuality = "high" | "medium" | "low"

/**
 * Yield to the main thread to keep UI responsive
 */
function yieldToMain(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => resolve(), { timeout: 16 });
    } else {
      setTimeout(resolve, 0);
    }
  });
}

export interface VideoEncoderOptions {
  width: number
  height: number
  fps: number
  format: VideoFormat
  quality: VideoQuality
  onProgress?: (progress: number) => void
}

const QUALITY_BITRATES: Record<VideoQuality, number> = {
  high: 25_000_000,   // 25 Mbps
  medium: 10_000_000, // 10 Mbps
  low: 5_000_000,     // 5 Mbps
}

/**
 * Check if MP4 recording is supported (Safari only currently)
 */
export function isMp4Supported(): boolean {
  if (typeof MediaRecorder === "undefined") return false
  return MediaRecorder.isTypeSupported("video/mp4; codecs=avc1")
}

/**
 * Get the best supported video codec
 */
function getBestCodec(preferMp4: boolean): { mimeType: string; format: VideoFormat } {
  if (preferMp4 && MediaRecorder.isTypeSupported("video/mp4; codecs=avc1")) {
    return { mimeType: "video/mp4; codecs=avc1", format: "mp4" }
  }
  if (MediaRecorder.isTypeSupported("video/webm; codecs=vp9")) {
    return { mimeType: "video/webm; codecs=vp9", format: "webm" }
  }
  return { mimeType: "video/webm; codecs=vp8", format: "webm" }
}

/**
 * Record frames to video using MediaRecorder
 */
async function recordFrames(
  frames: { img: HTMLImageElement; duration: number }[],
  options: VideoEncoderOptions,
  mimeType: string
): Promise<Blob> {
  const { width, height, fps, quality, onProgress } = options
  const bitrate = QUALITY_BITRATES[quality]

  // Create offscreen canvas
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  canvas.style.cssText = "position:fixed;left:-99999px;top:0;pointer-events:none;"
  document.body.appendChild(canvas)

  try {
    const ctx = canvas.getContext("2d", { alpha: false })!
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    // Setup MediaRecorder
    const stream = canvas.captureStream(fps)
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: bitrate,
    })

    const chunks: BlobPart[] = []
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data)
    }

    recorder.start()

    // Calculate total duration for progress
    const totalDuration = frames.reduce((sum, f) => sum + f.duration, 0)
    let elapsed = 0
    const frameInterval = 1000 / fps

    // Render each frame with optimized timing for UI responsiveness
    let frameCounter = 0
    const YIELD_INTERVAL = 10 // Yield to UI every N frames

    for (const frame of frames) {
      const frameCount = Math.round(frame.duration * fps)

      for (let i = 0; i < frameCount; i++) {
        ctx.drawImage(frame.img, 0, 0, width, height)

        // Use shorter delay for rendering (MediaRecorder captures at its own rate)
        await new Promise((r) => setTimeout(r, Math.min(frameInterval, 16)))

        elapsed += 1 / fps
        onProgress?.(Math.min(99, (elapsed / totalDuration) * 100))

        // Periodically yield to main thread to keep UI responsive
        frameCounter++
        if (frameCounter % YIELD_INTERVAL === 0) {
          await yieldToMain()
        }
      }
    }

    // Finalize recording
    await new Promise((r) => setTimeout(r, 200))
    recorder.stop()
    await new Promise<void>((r) => { recorder.onstop = () => r() })

    // Cleanup stream
    stream.getTracks().forEach((t) => t.stop())

    onProgress?.(100)

    const format = mimeType.includes("mp4") ? "video/mp4" : "video/webm"
    return new Blob(chunks, { type: format })
  } finally {
    // Always remove canvas from DOM, even on error
    canvas.remove()
  }
}

/**
 * Export frames to video with automatic format selection
 */
export async function exportVideo(
  frames: { img: HTMLImageElement; duration: number }[],
  options: Omit<VideoEncoderOptions, "format"> & { format?: VideoFormat }
): Promise<{ blob: Blob; format: VideoFormat }> {
  const preferMp4 = options.format === "mp4" || options.format === undefined
  const { mimeType, format } = getBestCodec(preferMp4)

  if (format !== options.format && options.format) {
    console.info(`${options.format.toUpperCase()} not supported, using ${format.toUpperCase()}`)
  }

  const blob = await recordFrames(frames, { ...options, format }, mimeType)
  return { blob, format }
}

/**
 * Export to MP4 (with WebM fallback)
 */
export async function exportToMP4(
  frames: { img: HTMLImageElement; duration: number }[],
  options: VideoEncoderOptions
): Promise<Blob> {
  const { blob } = await exportVideo(frames, { ...options, format: "mp4" })
  return blob
}

/**
 * Export to WebM
 */
export async function exportToWebM(
  frames: { img: HTMLImageElement; duration: number }[],
  options: VideoEncoderOptions
): Promise<Blob> {
  const { blob } = await exportVideo(frames, { ...options, format: "webm" })
  return blob
}

// Legacy export for backwards compatibility
export const isWebCodecsSupported = isMp4Supported
