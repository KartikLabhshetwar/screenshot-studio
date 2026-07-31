"use client";

import { useState, useCallback } from "react";
import JSZip from "jszip";
import { toast } from "sonner";
import { domToCanvas } from "modern-screenshot";
import { useImageStore } from "@/lib/store";

interface BulkDownloadOptions {
  format?: "png" | "jpeg" | "webp";
  quality?: number;
  scale?: number;
}

async function captureElementAsBlob(
  elementId: string,
  format: string,
  scale: number
): Promise<Blob | null> {
  const element = document.getElementById(elementId);
  if (!element) return null;

  const container = element.querySelector('[data-html-canvas="true"]') as HTMLElement;
  if (!container) return null;

  try {
    const canvas = await domToCanvas(container, {
      scale,
      backgroundColor: null,
      width: container.scrollWidth,
      height: container.scrollHeight,
    });

    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        format === "jpeg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/png",
        format === "jpeg" ? 0.92 : undefined
      );
    });
  } catch {
    return null;
  }
}

export function useBulkDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const downloadAllSlides = useCallback(
    async (options: BulkDownloadOptions = {}) => {
      const { slides, activeSlideId, setActiveSlide } = useImageStore.getState();
      if (slides.length === 0) {
        toast.error("No slides to download");
        return;
      }

      const format = options.format || "png";
      const scale = options.scale || 2;
      const savedActiveId = activeSlideId;

      setIsDownloading(true);
      setProgress(0); 

      const zip = new JSZip();
      const ext = format === "jpeg" ? "jpg" : format;

      try {
        // Capture and add each slide to the zip
        for (let i = 0; i < slides.length; i++) {
          // Switch to this slide
          setActiveSlide(slides[i].id);

          // Wait for React to re-render with the new slide
          await new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve))
          );

          const blob = await captureElementAsBlob("image-render-card", format, scale);
          if (blob) {
            const name = (slides[i].name ?? `slide-${i + 1}`).replace(/\.[^.]+$/, "");
            zip.file(`${name}.${ext}`, blob);
          }

          setProgress(Math.round(((i + 1) / slides.length) * 100));
        }

        // Generate and download zip
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `screenshot-studio-bulk-${Date.now()}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success(`Downloaded ${slides.length} images as ZIP`, {
          description: `All slides exported as ${format.toUpperCase()}`,
        });

        // Restore the original active slide
        if (savedActiveId && savedActiveId !== activeSlideId) {
          setActiveSlide(savedActiveId);
        }
      } catch (error) {
        console.error("Bulk download failed:", error);
        toast.error("Bulk download failed", {
          description: error instanceof Error ? error.message : "Please try again",
        });
      } finally {
        setIsDownloading(false);
        setProgress(0);
      }
    },
    []
  );

  return { downloadAllSlides, isDownloading, progress };
}
