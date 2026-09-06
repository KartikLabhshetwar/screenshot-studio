"use client";

import * as React from "react";
import { toast } from "sonner";
import { MAX_IMAGE_SIZE } from "@/lib/constants";
import {
  imageToolsWorker,
  readImageSize,
  downloadResults,
  formatBytes,
  type Dimensions,
  type DownloadableFile,
  type ProcessOptions,
  type ProcessResult,
} from "@/lib/image-tools";

/** MIME types createImageBitmap can decode in every browser we target. */
const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/avif",
];

export const TOOL_DROPZONE_ACCEPT: Record<string, string[]> = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "image/bmp": [".bmp"],
  "image/avif": [".avif"],
};

export type QueueItemStatus = "pending" | "processing" | "done" | "error";

export interface QueueItem {
  id: string;
  file: File;
  name: string;
  bytes: number;
  previewUrl: string;
  source: Dimensions | null;
  status: QueueItemStatus;
  result: ProcessResult | null;
  outputName: string | null;
  error: string | null;
  /** True when re-encoding made the file bigger and the original was kept. */
  keptOriginal: boolean;
}

/** Per-item options plus the download name the tool wants for it. */
export interface ItemPlan {
  options: ProcessOptions;
  outputName: string;
  /**
   * Keep the original file when re-encoding it did not make it smaller.
   *
   * Browsers expose no PNG compression level, so canvas output is often larger
   * than a file written by a tuned encoder. A tool that promises a smaller file
   * must never hand back a bigger one. Only set this when the output format
   * matches the source format, otherwise the user asked for the conversion and
   * should get it whatever the size.
   */
  preferSmaller?: boolean;
}

export type PlanBuilder = (item: QueueItem) => ItemPlan;

let itemCounter = 0;
function nextItemId(): string {
  itemCounter += 1;
  return `queue_${itemCounter}_${Date.now()}`;
}

export function useToolQueue(toolSlug: string) {
  const [items, setItems] = React.useState<QueueItem[]>([]);
  const [isRunning, setIsRunning] = React.useState(false);
  const [completed, setCompleted] = React.useState(0);

  // Object URLs are revoked explicitly; a ref keeps the cleanup effect from
  // re-running (and revoking live previews) every time the list changes.
  const itemsRef = React.useRef<QueueItem[]>([]);
  itemsRef.current = items;

  const cancelRef = React.useRef(false);

  React.useEffect(() => {
    return () => {
      for (const item of itemsRef.current) URL.revokeObjectURL(item.previewUrl);
    };
  }, []);

  const addFiles = React.useCallback((files: File[]) => {
    const accepted: QueueItem[] = [];
    let rejectedType = 0;
    let rejectedSize = 0;

    for (const file of files) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        rejectedType += 1;
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        rejectedSize += 1;
        continue;
      }
      accepted.push({
        id: nextItemId(),
        file,
        name: file.name,
        bytes: file.size,
        previewUrl: URL.createObjectURL(file),
        source: null,
        status: "pending",
        result: null,
        outputName: null,
        error: null,
        keptOriginal: false,
      });
    }

    if (rejectedType > 0) {
      toast.error(
        `${rejectedType} file${rejectedType === 1 ? "" : "s"} skipped`,
        { description: "Supported formats: PNG, JPG, WebP, GIF, BMP, AVIF." }
      );
    }
    if (rejectedSize > 0) {
      toast.error(`${rejectedSize} file${rejectedSize === 1 ? "" : "s"} too large`, {
        description: `Maximum size is ${formatBytes(MAX_IMAGE_SIZE)} per image.`,
      });
    }
    if (accepted.length === 0) return;

    setItems((previous) => [...previous, ...accepted]);

    // Intrinsic sizes drive the resize and crop forms, so read them eagerly
    // and patch each row in as it resolves.
    for (const item of accepted) {
      readImageSize(item.file)
        .then((size) => {
          setItems((previous) =>
            previous.map((row) =>
              row.id === item.id ? { ...row, source: size } : row
            )
          );
        })
        .catch(() => {
          setItems((previous) =>
            previous.map((row) =>
              row.id === item.id
                ? { ...row, status: "error", error: "Could not read this image" }
                : row
            )
          );
        });
    }
  }, []);

  const removeItem = React.useCallback((id: string) => {
    setItems((previous) => {
      const target = previous.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return previous.filter((item) => item.id !== id);
    });
  }, []);

  const clear = React.useCallback(() => {
    setItems((previous) => {
      for (const item of previous) URL.revokeObjectURL(item.previewUrl);
      return [];
    });
    setCompleted(0);
  }, []);

  /** Drops results so changed settings cannot be downloaded as stale output. */
  const resetResults = React.useCallback(() => {
    setCompleted(0);
    setItems((previous) =>
      previous.some((item) => item.status === "done" || item.status === "error")
        ? previous.map((item) =>
            item.status === "done" || item.status === "error"
              ? {
                  ...item,
                  status: "pending",
                  result: null,
                  error: null,
                  keptOriginal: false,
                }
              : item
          )
        : previous
    );
  }, []);

  const cancel = React.useCallback(() => {
    cancelRef.current = true;
  }, []);

  /**
   * Processes the queue one file at a time. Sequential on purpose: a parallel
   * batch of large images decodes several full bitmaps at once and can push a
   * tab past its memory limit.
   */
  const run = React.useCallback(
    async (buildPlan: PlanBuilder) => {
      const queued = itemsRef.current;
      if (queued.length === 0 || isRunning) return;

      cancelRef.current = false;
      setIsRunning(true);
      setCompleted(0);

      let succeeded = 0;
      let failed = 0;

      for (const item of queued) {
        if (cancelRef.current) break;

        setItems((previous) =>
          previous.map((row) =>
            row.id === item.id
              ? { ...row, status: "processing", error: null }
              : row
          )
        );

        try {
          const plan = buildPlan(item);
          const processed = await imageToolsWorker.process(item.file, plan.options);

          // Re-encoding is not guaranteed to help. When it did not, and the
          // format is unchanged, the original file is the better answer.
          const keptOriginal =
            Boolean(plan.preferSmaller) && processed.bytes >= item.bytes;
          const result: ProcessResult = keptOriginal
            ? {
                blob: item.file,
                bytes: item.bytes,
                width: item.source?.width ?? processed.width,
                height: item.source?.height ?? processed.height,
              }
            : processed;

          succeeded += 1;
          setItems((previous) =>
            previous.map((row) =>
              row.id === item.id
                ? {
                    ...row,
                    status: "done",
                    result,
                    outputName: plan.outputName,
                    error: null,
                    keptOriginal,
                  }
                : row
            )
          );
        } catch (error) {
          failed += 1;
          setItems((previous) =>
            previous.map((row) =>
              row.id === item.id
                ? {
                    ...row,
                    status: "error",
                    result: null,
                    error:
                      error instanceof Error
                        ? error.message
                        : "Processing failed",
                  }
                : row
            )
          );
        }

        setCompleted((count) => count + 1);
      }

      setIsRunning(false);

      if (cancelRef.current) {
        toast.info("Stopped", {
          description: `${succeeded} image${succeeded === 1 ? "" : "s"} finished before you stopped.`,
        });
      } else if (failed > 0 && succeeded > 0) {
        toast.warning(`${succeeded} done, ${failed} failed`);
      } else if (failed > 0) {
        toast.error("Processing failed", {
          description: "None of the images could be processed.",
        });
      }
    },
    [isRunning]
  );

  const download = React.useCallback(async () => {
    const files: DownloadableFile[] = itemsRef.current
      .filter((item) => item.status === "done" && item.result)
      .map((item) => ({
        name: item.outputName ?? item.name,
        blob: item.result!.blob,
      }));

    if (files.length === 0) {
      toast.error("Nothing to download yet");
      return;
    }

    try {
      await downloadResults(files, toolSlug);
    } catch {
      toast.error("Download failed", {
        description: "Your browser blocked the download. Try again.",
      });
    }
  }, [toolSlug]);

  const doneItems = items.filter((item) => item.status === "done");
  const totalInputBytes = items.reduce((sum, item) => sum + item.bytes, 0);
  const totalOutputBytes = doneItems.reduce(
    (sum, item) => sum + (item.result?.bytes ?? 0),
    0
  );

  return {
    items,
    isRunning,
    completed,
    hasResults: doneItems.length > 0,
    doneCount: doneItems.length,
    totalInputBytes,
    totalOutputBytes,
    addFiles,
    removeItem,
    clear,
    resetResults,
    run,
    cancel,
    download,
  };
}
