/**
 * Image tools Web Worker.
 *
 * Keeps decode/resize/encode off the main thread so a 30-file batch does not
 * freeze the page. Blobs are structured-cloneable, so files cross the worker
 * boundary without any base64 round trip.
 */

import { processFile } from "./ops";
import type { ProcessOptions, ProcessResult } from "./types";

export interface ImageToolsWorkerRequest {
  id: string;
  file: Blob;
  options: ProcessOptions;
}

export interface ImageToolsWorkerResponse {
  id: string;
  success: boolean;
  result?: Omit<ProcessResult, "blob"> & { blob: Blob };
  error?: string;
}

const ctx: Worker = self as unknown as Worker;

ctx.onmessage = async (event: MessageEvent<ImageToolsWorkerRequest>) => {
  const { id, file, options } = event.data;

  try {
    const result = await processFile(file, options);
    const response: ImageToolsWorkerResponse = { id, success: true, result };
    ctx.postMessage(response);
  } catch (error) {
    const response: ImageToolsWorkerResponse = {
      id,
      success: false,
      error: error instanceof Error ? error.message : "Image processing failed",
    };
    ctx.postMessage(response);
  }
};

// Signal readiness so the client knows the worker booted rather than timing out.
ctx.postMessage({ type: "ready" });

export {};
