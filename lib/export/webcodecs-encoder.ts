/**
 * WebCodecs + MP4 Muxer Video Encoder
 *
 * High-quality video encoding using:
 * - WebCodecs API for H.264 encoding (hardware accelerated)
 * - mp4-muxer for MP4 container packaging
 *
 * Runs entirely in the browser with WASM - no server needed.
 */

import { Muxer, ArrayBufferTarget } from 'mp4-muxer';

export interface WebCodecsEncoderOptions {
  width: number;
  height: number;
  fps: number;
  bitrate?: number; // bits per second, default 10Mbps
  onProgress?: (progress: number) => void;
}

export interface FrameData {
  imageData: ImageData;
  timestamp: number; // in microseconds
}

/**
 * Check if WebCodecs is supported in this browser
 */
export function isWebCodecsSupported(): boolean {
  return (
    typeof VideoEncoder !== 'undefined' &&
    typeof VideoFrame !== 'undefined' &&
    typeof EncodedVideoChunk !== 'undefined'
  );
}

/**
 * Check if H.264 encoding is supported (cached after first call)
 */
let h264SupportCache: boolean | null = null;
let h264SupportPromise: Promise<boolean> | null = null;

export async function isH264Supported(): Promise<boolean> {
  if (h264SupportCache !== null) return h264SupportCache;
  if (h264SupportPromise) return h264SupportPromise;

  h264SupportPromise = (async () => {
    if (!isWebCodecsSupported()) {
      h264SupportCache = false;
      return false;
    }

    try {
      const codecs = ['avc1.640032', 'avc1.64002A', 'avc1.4d0028', 'avc1.42001E'];
      for (const codec of codecs) {
        const support = await VideoEncoder.isConfigSupported({
          codec,
          width: 1920,
          height: 1080,
          bitrate: 10_000_000,
          framerate: 60,
        });
        if (support.supported) {
          h264SupportCache = true;
          return true;
        }
      }
      h264SupportCache = false;
      return false;
    } catch {
      h264SupportCache = false;
      return false;
    }
  })();

  return h264SupportPromise;
}

/**
 * WebCodecs-based video encoder class
 */
// Module-level cache for supported codec per resolution
const codecCache = new Map<string, string>();

export class WebCodecsVideoEncoder {
  private muxer: Muxer<ArrayBufferTarget> | null = null;
  private encoder: VideoEncoder | null = null;
  private options: Required<WebCodecsEncoderOptions>;
  private frameCount = 0;
  private isInitialized = false;
  private encoderError: Error | null = null;
  private evenWidth = 0;
  private evenHeight = 0;

  constructor(options: WebCodecsEncoderOptions) {
    this.options = {
      ...options,
      bitrate: options.bitrate ?? 10_000_000, // 10 Mbps default
      onProgress: options.onProgress ?? (() => {}),
    };
  }

  /**
   * Initialize the encoder and muxer
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    const { width, height, fps, bitrate } = this.options;

    // Ensure dimensions are even (required for H.264)
    this.evenWidth = width % 2 === 0 ? width : width + 1;
    this.evenHeight = height % 2 === 0 ? height : height + 1;

    // Try H.264 codecs from highest to lowest profile/level
    // Higher levels support larger resolutions
    const codecs = [
      'avc1.640032', // High Profile, Level 5.0 — up to 4K
      'avc1.64002A', // High Profile, Level 4.2 — up to 1080p
      'avc1.640028', // High Profile, Level 4.0
      'avc1.4d0032', // Main Profile, Level 5.0
      'avc1.4d0028', // Main Profile, Level 4.0
      'avc1.42001E', // Baseline Profile, Level 3.0
    ];

    // Check cache first for this resolution
    const cacheKey = `${this.evenWidth}x${this.evenHeight}@${fps}`;
    let supportedCodec: string | null = codecCache.get(cacheKey) || null;

    if (!supportedCodec) {
      for (const codec of codecs) {
        const result = await VideoEncoder.isConfigSupported({
          codec,
          width: this.evenWidth,
          height: this.evenHeight,
          bitrate: 1_000_000,
          framerate: fps,
        });
        if (result.supported) {
          supportedCodec = codec;
          codecCache.set(cacheKey, codec);
          break;
        }
      }
    }

    if (!supportedCodec) {
      throw new Error(`VideoEncoder config not supported: ${this.evenWidth}x${this.evenHeight}`);
    }

    // Now build the actual config with the desired bitrate
    const finalConfig: VideoEncoderConfig = {
      codec: supportedCodec,
      width: this.evenWidth,
      height: this.evenHeight,
      bitrate,
      framerate: fps,
    };

    // Create MP4 muxer
    this.muxer = new Muxer({
      target: new ArrayBufferTarget(),
      video: {
        codec: 'avc',
        width: this.evenWidth,
        height: this.evenHeight,
      },
      fastStart: 'in-memory',
    });

    // Create video encoder
    this.encoder = new VideoEncoder({
      output: (chunk, meta) => {
        this.muxer?.addVideoChunk(chunk, meta);
      },
      error: (error) => {
        console.error('VideoEncoder error:', error);
        this.encoderError = error;
      },
    });

    // Configure encoder with desired bitrate
    this.encoder.configure(finalConfig);

    this.isInitialized = true;
  }

  /**
   * Encode a single frame from ImageData
   */
  async encodeFrame(imageData: ImageData, frameIndex: number): Promise<void> {
    if (!this.encoder || !this.isInitialized) {
      throw new Error('Encoder not initialized');
    }
    if (this.encoderError) {
      throw this.encoderError;
    }

    const { fps } = this.options;
    const timestamp = Math.round((frameIndex / fps) * 1_000_000);
    const duration = Math.round(1_000_000 / fps);

    // Convert ImageData to canvas, resizing to even dimensions if needed
    const canvas = new OffscreenCanvas(this.evenWidth, this.evenHeight);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    ctx.putImageData(imageData, 0, 0);

    const frame = new VideoFrame(canvas, {
      timestamp,
      duration,
    });

    const isKeyFrame = frameIndex % (fps * 2) === 0;
    this.encoder.encode(frame, { keyFrame: isKeyFrame });

    frame.close();
    this.frameCount++;
  }

  /**
   * Encode a frame from a canvas element
   */
  async encodeFromCanvas(
    canvas: HTMLCanvasElement | OffscreenCanvas,
    frameIndex: number
  ): Promise<void> {
    if (!this.encoder || !this.isInitialized) {
      throw new Error('Encoder not initialized');
    }
    if (this.encoderError) {
      throw this.encoderError;
    }

    const { fps } = this.options;
    const timestamp = Math.round((frameIndex / fps) * 1_000_000);
    const duration = Math.round(1_000_000 / fps);

    // Ensure canvas matches encoder dimensions (even width/height)
    let source: HTMLCanvasElement | OffscreenCanvas = canvas;
    if (canvas.width !== this.evenWidth || canvas.height !== this.evenHeight) {
      const resized = new OffscreenCanvas(this.evenWidth, this.evenHeight);
      const ctx = resized.getContext('2d');
      if (ctx) {
        ctx.drawImage(canvas, 0, 0, this.evenWidth, this.evenHeight);
      }
      source = resized;
    }

    // Create VideoFrame directly from canvas
    const frame = new VideoFrame(source, {
      timestamp,
      duration,
    });

    const isKeyFrame = frameIndex % (fps * 2) === 0;
    this.encoder.encode(frame, { keyFrame: isKeyFrame });

    frame.close();
    this.frameCount++;

    // Backpressure: if encoder queue is building up, yield to the browser.
    if (this.encoder.encodeQueueSize > 8) {
      while (this.encoder && this.encoder.encodeQueueSize > 2) {
        await new Promise<void>((resolve) => {
          if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(() => resolve());
          } else {
            setTimeout(resolve, 8);
          }
        });
      }
    }
  }

  /**
   * Finalize encoding and return the MP4 blob
   */
  async finalize(): Promise<Blob> {
    if (!this.encoder || !this.muxer) {
      throw new Error('Encoder not initialized');
    }

    // Flush remaining frames
    await this.encoder.flush();

    // Finalize the muxer
    this.muxer.finalize();

    // Get the MP4 data
    const { buffer } = this.muxer.target;

    // Cleanup
    this.encoder.close();
    this.encoder = null;
    this.muxer = null;
    this.isInitialized = false;

    return new Blob([buffer], { type: 'video/mp4' });
  }

  /**
   * Get the current frame count
   */
  getFrameCount(): number {
    return this.frameCount;
  }
}

/**
 * High-level function to encode frames to MP4
 */
export async function encodeFramesToMP4(
  frames: { canvas: HTMLCanvasElement; duration?: number }[],
  options: WebCodecsEncoderOptions
): Promise<Blob> {
  const encoder = new WebCodecsVideoEncoder(options);
  await encoder.initialize();

  const totalFrames = frames.length;

  for (let i = 0; i < frames.length; i++) {
    await encoder.encodeFromCanvas(frames[i].canvas, i);

    // Report progress
    options.onProgress?.((i + 1) / totalFrames * 100);

    // Yield to main thread periodically
    if (i % 10 === 0) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  return encoder.finalize();
}

/**
 * Encode ImageData frames to MP4
 */
export async function encodeImageDataToMP4(
  frames: ImageData[],
  options: WebCodecsEncoderOptions
): Promise<Blob> {
  const encoder = new WebCodecsVideoEncoder(options);
  await encoder.initialize();

  const totalFrames = frames.length;

  for (let i = 0; i < frames.length; i++) {
    await encoder.encodeFrame(frames[i], i);

    options.onProgress?.((i + 1) / totalFrames * 100);

    // Yield to main thread periodically
    if (i % 10 === 0) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  return encoder.finalize();
}
