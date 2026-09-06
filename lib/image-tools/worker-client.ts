/**
 * Main-thread client for the image tools worker.
 *
 * Mirrors the lifecycle of lib/workers/export-worker-service.ts: lazy boot, a
 * readiness handshake, per-request timeouts, and a main-thread fallback so the
 * tools still work where workers or module workers are unavailable.
 */

import { processFile } from "./ops";
import type { ProcessOptions, ProcessResult } from "./types";
import type {
  ImageToolsWorkerRequest,
  ImageToolsWorkerResponse,
} from "./image-tools.worker";

const READY_TIMEOUT_MS = 5_000;
const REQUEST_TIMEOUT_MS = 120_000;

interface PendingRequest {
  resolve: (result: ProcessResult) => void;
  reject: (error: Error) => void;
}

class ImageToolsWorkerClient {
  private worker: Worker | null = null;
  private pending = new Map<string, PendingRequest>();
  private ready = false;
  private bootPromise: Promise<void> | null = null;
  private requestCounter = 0;

  private isSupported(): boolean {
    return typeof window !== "undefined" && typeof Worker !== "undefined";
  }

  private boot(): Promise<void> {
    if (this.bootPromise) return this.bootPromise;

    this.bootPromise = new Promise<void>((resolve) => {
      if (!this.isSupported()) {
        this.ready = false;
        resolve();
        return;
      }

      try {
        this.worker = new Worker(
          new URL("./image-tools.worker.ts", import.meta.url),
          { type: "module" }
        );

        const timeout = setTimeout(() => {
          this.ready = false;
          resolve();
        }, READY_TIMEOUT_MS);

        this.worker.onmessage = (event: MessageEvent) => {
          const data = event.data;

          if (data?.type === "ready") {
            clearTimeout(timeout);
            this.ready = true;
            resolve();
            return;
          }

          const response = data as ImageToolsWorkerResponse;
          const request = this.pending.get(response.id);
          if (!request) return;

          this.pending.delete(response.id);
          if (response.success && response.result) {
            request.resolve(response.result);
          } else {
            request.reject(new Error(response.error ?? "Image processing failed"));
          }
        };

        this.worker.onerror = () => {
          clearTimeout(timeout);
          this.ready = false;
          this.failAllPending(new Error("Image worker crashed"));
          resolve();
        };
      } catch {
        this.ready = false;
        resolve();
      }
    });

    return this.bootPromise;
  }

  private failAllPending(error: Error): void {
    for (const [id, request] of this.pending) {
      request.reject(error);
      this.pending.delete(id);
    }
  }

  private nextId(): string {
    this.requestCounter += 1;
    return `img_${this.requestCounter}_${Date.now()}`;
  }

  /**
   * Processes one file, in the worker when available and on the main thread
   * otherwise. A worker failure falls back rather than surfacing to the user.
   */
  async process(file: Blob, options: ProcessOptions): Promise<ProcessResult> {
    await this.boot();

    if (!this.ready || !this.worker) {
      return processFile(file, options);
    }

    try {
      return await this.send(file, options);
    } catch (error) {
      // A per-file failure inside the worker is worth one main-thread retry:
      // the common cause is an OffscreenCanvas size limit, not a bad file.
      if (error instanceof Error && error.message === "Image worker crashed") {
        return processFile(file, options);
      }
      throw error;
    }
  }

  private send(file: Blob, options: ProcessOptions): Promise<ProcessResult> {
    const id = this.nextId();
    const request: ImageToolsWorkerRequest = { id, file, options };

    return new Promise<ProcessResult>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error("Image processing timed out"));
      }, REQUEST_TIMEOUT_MS);

      this.pending.set(id, {
        resolve: (result) => {
          clearTimeout(timeout);
          resolve(result);
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        },
      });

      this.worker!.postMessage(request);
    });
  }

  terminate(): void {
    if (!this.worker) return;
    this.worker.terminate();
    this.worker = null;
    this.ready = false;
    this.bootPromise = null;
    this.failAllPending(new Error("Image worker terminated"));
  }
}

export const imageToolsWorker = new ImageToolsWorkerClient();
export { ImageToolsWorkerClient };
