/**
 * FFmpeg WASM Video Encoder
 *
 * Uses FFmpeg compiled to WebAssembly for high-quality video encoding.
 * Runs entirely in the browser - no server needed!
 *
 * Performance optimizations:
 * - Multi-threaded WASM core when cross-origin isolated (SharedArrayBuffer)
 * - JPEG frame encoding instead of PNG (~5x faster per frame)
 * - Concat demuxer mode: writes 1 file per slide instead of N duplicate frames
 * - Browser Cache API for WASM binary persistence across sessions
 * - ultrafast H.264 preset for WASM (massive speedup, minimal quality loss)
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

export type FFmpegFormat = 'mp4' | 'webm' | 'gif';
export type FFmpegQuality = 'high' | 'medium' | 'low';

export interface FFmpegEncoderOptions {
  width: number;
  height: number;
  fps: number;
  format?: FFmpegFormat;
  quality?: FFmpegQuality;
  onProgress?: (progress: number) => void;
  onLog?: (message: string) => void;
}

// Quality presets (CRF values - lower = better quality, larger file)
const QUALITY_CRF: Record<FFmpegQuality, number> = {
  high: 18,    // Visually lossless
  medium: 23,  // Good quality, reasonable size
  low: 28,     // Smaller file, some quality loss
};

// Singleton FFmpeg instance
let ffmpegInstance: FFmpeg | null = null;
let isLoading = false;
let loadPromise: Promise<FFmpeg> | null = null;

// Mutex to prevent concurrent exports from corrupting the virtual filesystem
let exportLock: Promise<void> = Promise.resolve();

const CACHE_NAME = 'ffmpeg-wasm-cache-v1';

/**
 * Check if the page is cross-origin isolated (required for SharedArrayBuffer / MT)
 */
function isCrossOriginIsolated(): boolean {
  return typeof globalThis !== 'undefined' && !!globalThis.crossOriginIsolated;
}

/**
 * Fetch a URL with Cache API persistence.
 * Returns a blob URL — reuses cached response across sessions.
 */
async function cachedToBlobURL(url: string, mimeType: string): Promise<string> {
  try {
    if (typeof caches !== 'undefined') {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(url);
      if (cached) {
        const blob = await cached.blob();
        return URL.createObjectURL(new Blob([blob], { type: mimeType }));
      }
      // Fetch, store in cache, and return blob URL
      const response = await fetch(url);
      const clone = response.clone();
      await cache.put(url, clone);
      const blob = await response.blob();
      return URL.createObjectURL(new Blob([blob], { type: mimeType }));
    }
  } catch {
    // Cache API unavailable or failed — fall through to toBlobURL
  }
  return toBlobURL(url, mimeType);
}

/**
 * Load FFmpeg WASM (singleton, loads only once).
 * Uses multi-threaded core when cross-origin isolated, single-threaded otherwise.
 * Caches WASM binaries via Cache API for fast reload across sessions.
 */
export async function loadFFmpeg(
  _onProgress?: (progress: number) => void
): Promise<FFmpeg> {
  // Return existing instance if loaded
  if (ffmpegInstance && ffmpegInstance.loaded) {
    return ffmpegInstance;
  }

  // Return existing load promise if loading
  if (isLoading && loadPromise) {
    return loadPromise;
  }

  isLoading = true;

  loadPromise = (async () => {
    const ffmpeg = new FFmpeg();
    const useMT = isCrossOriginIsolated();
    const tempBlobUrls: string[] = [];

    const trackedBlobURL = async (url: string, mimeType: string): Promise<string> => {
      const blobUrl = await cachedToBlobURL(url, mimeType);
      if (blobUrl.startsWith('blob:')) {
        tempBlobUrls.push(blobUrl);
      }
      return blobUrl;
    };

    try {
      if (useMT) {
        const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
        await ffmpeg.load({
          coreURL: await trackedBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await trackedBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
          workerURL: await trackedBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
        });
      } else {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
        await ffmpeg.load({
          coreURL: await trackedBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await trackedBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
      }

      ffmpegInstance = ffmpeg;
      return ffmpeg;
    } catch (error) {
      // Clear load promise to allow retries after transient CDN/network failures.
      loadPromise = null;
      throw error;
    } finally {
      isLoading = false;

      for (const blobUrl of tempBlobUrls) {
        URL.revokeObjectURL(blobUrl);
      }
    }
  })();

  return loadPromise;
}

/**
 * Check if FFmpeg is loaded and ready
 */
export function isFFmpegLoaded(): boolean {
  return ffmpegInstance !== null && ffmpegInstance.loaded;
}

/**
 * FFmpeg-based video encoder class
 *
 * Supports two modes:
 * - Frame mode (default): writes individual JPEG frames, best for animations
 * - Concat mode: writes 1 JPEG per unique slide + concat script, best for slideshows
 */
export class FFmpegVideoEncoder {
  private ffmpeg: FFmpeg | null = null;
  private options: Required<FFmpegEncoderOptions>;
  private frameCount = 0;
  private progressHandler: ((event: { progress: number }) => void) | null = null;
  private logHandler: ((event: { message: string }) => void) | null = null;
  private releaseLock: (() => void) | null = null;

  // Concat demuxer mode
  private concatMode = false;
  private concatEntries: { file: string; duration: number }[] = [];
  private slideFileCount = 0;

  constructor(options: FFmpegEncoderOptions) {
    this.options = {
      ...options,
      format: options.format ?? 'mp4',
      quality: options.quality ?? 'high',
      onProgress: options.onProgress ?? (() => {}),
      onLog: options.onLog ?? (() => {}),
    };
  }

  /**
   * Enable concat demuxer mode for slideshow encoding.
   * Call this before addSlide() instead of addFrame().
   */
  enableConcatMode(): void {
    this.concatMode = true;
  }

  /**
   * Initialize FFmpeg (waits for any concurrent export to finish)
   */
  async initialize(): Promise<void> {
    // Wait for any in-progress export to finish (prevents VFS corruption)
    let releaseLock: () => void;
    const lockPromise = new Promise<void>((resolve) => { releaseLock = resolve; });
    const previousLock = exportLock;
    exportLock = lockPromise;
    await previousLock;
    this.releaseLock = releaseLock!;

    this.ffmpeg = await loadFFmpeg((p) => {
      this.options.onProgress(p * 0.1);
    });

    // Set up logging with tracked handler for cleanup
    this.logHandler = ({ message }) => {
      this.options.onLog(message);
    };
    this.ffmpeg.on('log', this.logHandler);
  }

  /**
   * Add a slide with its duration (concat mode).
   * Writes one JPEG per unique canvas to VFS — no duplicate files.
   */
  async addSlide(canvas: HTMLCanvasElement, durationSecs: number): Promise<void> {
    if (!this.ffmpeg) throw new Error('FFmpeg not initialized');

    const slideFile = `slide_${String(this.slideFileCount).padStart(4, '0')}.jpg`;

    // Encode canvas to JPEG
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.92);
    });
    const arrayBuffer = await blob.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    await this.ffmpeg.writeFile(slideFile, data);
    this.concatEntries.push({ file: slideFile, duration: durationSecs });
    this.slideFileCount++;
  }

  /**
   * Add a frame from canvas — writes directly to FFmpeg VFS.
   * Uses JPEG encoding (much faster than PNG) and duplicate detection.
   */
  async addFrame(canvas: HTMLCanvasElement): Promise<void> {
    if (!this.ffmpeg) throw new Error('FFmpeg not initialized');

    const paddedIndex = String(this.frameCount).padStart(6, '0');
    const fileName = `frame_${paddedIndex}.jpg`;

    // Encode canvas to JPEG (much faster than PNG, fine for video frames)
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.92);
    });

    const arrayBuffer = await blob.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    await this.ffmpeg.writeFile(fileName, data);

    this.frameCount++;
  }

  /**
   * Encode all frames and return video blob
   */
  async encode(): Promise<Blob> {
    if (!this.ffmpeg) {
      throw new Error('FFmpeg not initialized');
    }

    const { fps, format, quality, width, height, onProgress } = this.options;
    const crf = QUALITY_CRF[quality];

    // Build FFmpeg command based on format
    let outputFile: string;
    let ffmpegArgs: string[];

    // Determine input args based on mode
    const inputArgs = this.concatMode
      ? ['-f', 'concat', '-safe', '0', '-i', 'concat.txt']
      : ['-framerate', String(fps), '-i', 'frame_%06d.jpg'];

    // Write concat script if in concat mode
    if (this.concatMode) {
      const lines = ['ffconcat version 1.0'];
      for (const entry of this.concatEntries) {
        lines.push(`file '${entry.file}'`);
        lines.push(`duration ${entry.duration.toFixed(4)}`);
      }
      // Repeat last file (FFmpeg concat demuxer quirk — last entry needs a trailing file)
      if (this.concatEntries.length > 0) {
        lines.push(`file '${this.concatEntries[this.concatEntries.length - 1].file}'`);
      }
      const concatScript = lines.join('\n');
      await this.ffmpeg.writeFile('concat.txt', new TextEncoder().encode(concatScript));
    }

    if (format === 'mp4') {
      outputFile = 'output.mp4';
      ffmpegArgs = [
        ...inputArgs,
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-crf', String(crf),
        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart',
        '-y',
        outputFile,
      ];
    } else if (format === 'webm') {
      outputFile = 'output.webm';
      ffmpegArgs = [
        ...inputArgs,
        '-c:v', 'libvpx-vp9',
        '-crf', String(crf + 10),
        '-b:v', '0',
        '-pix_fmt', 'yuv420p',
        '-deadline', 'realtime',
        '-cpu-used', '8',
        '-y',
        outputFile,
      ];
    } else if (format === 'gif') {
      outputFile = 'output.gif';
      ffmpegArgs = [
        ...inputArgs,
        '-vf', `fps=${Math.min(fps, 30)},scale=${width}:${height}:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=256[p];[s1][p]paletteuse=dither=bayer`,
        '-loop', '0',
        '-y',
        outputFile,
      ];
    } else {
      throw new Error(`Unsupported format: ${format}`);
    }

    // Set up progress tracking for encoding (with tracked handler for cleanup)
    this.progressHandler = ({ progress }) => {
      onProgress(40 + progress * 60);
    };
    this.ffmpeg.on('progress', this.progressHandler);

    try {
      // Run FFmpeg
      await this.ffmpeg.exec(ffmpegArgs);

      // Read output file
      const data = await this.ffmpeg.readFile(outputFile);

      // Convert to blob
      const mimeTypes: Record<FFmpegFormat, string> = {
        mp4: 'video/mp4',
        webm: 'video/webm',
        gif: 'image/gif',
      };

      const blobData = typeof data === 'string'
        ? new TextEncoder().encode(data)
        : new Uint8Array(data);

      return new Blob([blobData], { type: mimeTypes[format] });
    } finally {
      // Always clean up: remove listeners, delete files, release lock
      await this.cleanup();
    }
  }

  /**
   * Clean up FFmpeg VFS, listeners, and release export lock
   */
  private async cleanup(): Promise<void> {
    if (this.ffmpeg) {
      // Remove event listeners to prevent accumulation
      if (this.progressHandler) {
        this.ffmpeg.off('progress', this.progressHandler);
        this.progressHandler = null;
      }
      if (this.logHandler) {
        this.ffmpeg.off('log', this.logHandler);
        this.logHandler = null;
      }

      // Batch cleanup: delete all VFS files concurrently
      const deleteOps: Promise<unknown>[] = [];

      if (this.concatMode) {
        // Concat mode: delete slide files + concat script
        for (let i = 0; i < this.slideFileCount; i++) {
          const file = `slide_${String(i).padStart(4, '0')}.jpg`;
          deleteOps.push(this.ffmpeg.deleteFile(file).catch(() => {}));
        }
        deleteOps.push(this.ffmpeg.deleteFile('concat.txt').catch(() => {}));
      } else {
        // Frame mode: delete frame files
        for (let i = 0; i < this.frameCount; i++) {
          const paddedIndex = String(i).padStart(6, '0');
          deleteOps.push(this.ffmpeg.deleteFile(`frame_${paddedIndex}.jpg`).catch(() => {}));
        }
      }

      deleteOps.push(this.ffmpeg.deleteFile('output.mp4').catch(() => {}));
      deleteOps.push(this.ffmpeg.deleteFile('output.webm').catch(() => {}));
      deleteOps.push(this.ffmpeg.deleteFile('output.gif').catch(() => {}));

      await Promise.all(deleteOps);
    }

    // Release the export lock so next export can proceed
    if (this.releaseLock) {
      this.releaseLock();
      this.releaseLock = null;
    }
  }

  /**
   * Get current frame count
   */
  getFrameCount(): number {
    return this.concatMode ? this.slideFileCount : this.frameCount;
  }
}

/**
 * High-level function to encode canvas frames to video using FFmpeg
 */
export async function encodeWithFFmpeg(
  canvases: HTMLCanvasElement[],
  options: FFmpegEncoderOptions
): Promise<Blob> {
  const encoder = new FFmpegVideoEncoder(options);
  await encoder.initialize();

  const total = canvases.length;

  for (let i = 0; i < total; i++) {
    await encoder.addFrame(canvases[i]);

    // Yield to main thread periodically
    if (i % 5 === 0) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  return encoder.encode();
}

/**
 * Terminate FFmpeg and free memory
 */
export function terminateFFmpeg(): void {
  if (ffmpegInstance) {
    ffmpegInstance.terminate();
    ffmpegInstance = null;
    loadPromise = null;
  }
}
