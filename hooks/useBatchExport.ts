/**
 * Hook for exporting every slide (with the current shared style) as a single zip download
 */

import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { getAspectRatioPreset } from '@/lib/aspect-ratio-utils';
import { exportElement, type ExportOptions } from '@/lib/export/export-service';
import { switchToSlideAndWait } from '@/lib/render-slideFrame';
import { useImageStore, useEditorStore } from '@/lib/store';
import { getCanvasContainer } from '@/components/canvas/ClientCanvas';
import { trackExportStart, trackExportComplete, trackExportError } from '@/lib/analytics';
import type { ExportSettings } from '@/hooks/useExport';

export interface BatchProgress {
  current: number;
  total: number;
}

function extensionFor(format: ExportSettings['format']): string {
  return format === 'jpeg' ? 'jpg' : format === 'webp' ? 'webp' : 'png';
}

export function useBatchExport(selectedAspectRatio: string, exportSettings: ExportSettings) {
  const [isBatchExporting, setIsBatchExporting] = useState(false);
  const [batchProgress, setBatchProgress] = useState<BatchProgress>({ current: 0, total: 0 });

  const { backgroundConfig, backgroundBorderRadius, backgroundBlur, backgroundNoise, textOverlays, imageOverlays, perspective3D } = useImageStore();
  const backgroundOpacity = backgroundConfig?.opacity !== undefined ? backgroundConfig.opacity : 1;
  const { screenshot } = useEditorStore();

  const exportAllSlides = useCallback(async (): Promise<void> => {
    const { slides, activeSlideId, setActiveSlide } = useImageStore.getState();
    if (slides.length < 2) return;

    const originalActiveId = activeSlideId;
    setIsBatchExporting(true);
    setBatchProgress({ current: 0, total: slides.length });
    const startTime = Date.now();

    trackExportStart(exportSettings.format, exportSettings.qualityPreset, exportSettings.scale);

    try {
      const preset = getAspectRatioPreset(selectedAspectRatio);
      if (!preset) {
        throw new Error('Invalid aspect ratio selected');
      }

      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      const usedNames = new Set<string>();
      const failed: string[] = [];
      const fileExtension = extensionFor(exportSettings.format);
      let totalBytes = 0;

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        try {
          await switchToSlideAndWait(slide.id, slide.src, 100);

          const canvasContainer = getCanvasContainer();
          const exportOptions: ExportOptions = {
            format: exportSettings.format,
            qualityPreset: exportSettings.qualityPreset,
            scale: exportSettings.scale,
            exportWidth: preset.width,
            exportHeight: preset.height,
          };

          const result = await exportElement(
            'image-render-card',
            exportOptions,
            canvasContainer,
            backgroundConfig,
            backgroundBorderRadius,
            textOverlays,
            imageOverlays,
            perspective3D,
            slide.src,
            screenshot.radius,
            backgroundBlur,
            backgroundNoise,
            backgroundOpacity
          );

          if (!result.blob || result.blob.size === 0) {
            throw new Error('Invalid image data generated');
          }

          const baseName = (slide.name || `slide-${i + 1}`).replace(/\.[^./\\]+$/, '');
          let fileName = `${baseName}.${fileExtension}`;
          if (usedNames.has(fileName)) {
            fileName = `${baseName} (${i + 1}).${fileExtension}`;
          }
          usedNames.add(fileName);

          zip.file(fileName, result.blob);
          totalBytes += result.blob.size;
        } catch (error) {
          console.error(`Failed to export slide ${i + 1}:`, error);
          failed.push(slide.name || `slide-${i + 1}`);
        }

        setBatchProgress({ current: i + 1, total: slides.length });
      }

      if (usedNames.size === 0) {
        throw new Error('Failed to export any slides');
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipFileName = `screenshot-studio-batch-${Date.now()}.zip`;

      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.download = zipFileName;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

      const durationMs = Date.now() - startTime;
      trackExportComplete(
        exportSettings.format,
        exportSettings.qualityPreset,
        exportSettings.scale,
        Math.round(totalBytes / 1024),
        durationMs
      );

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      if (failed.length > 0) {
        toast.warning(`Exported ${usedNames.size} of ${slides.length} slides`, {
          description: `Could not export: ${failed.join(', ')}`,
        });
      } else {
        toast.success(`${usedNames.size} slides exported!`, {
          description: `Saved as ${zipFileName}`,
        });
      }
    } catch (error) {
      console.error('Batch export failed:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to export slides. Please try again.';

      trackExportError(exportSettings.format, errorMessage);

      toast.error('Batch export failed', {
        description: errorMessage,
      });
    } finally {
      if (originalActiveId) {
        setActiveSlide(originalActiveId);
      }
      setIsBatchExporting(false);
    }
  }, [selectedAspectRatio, exportSettings, backgroundConfig, backgroundBorderRadius, backgroundBlur, backgroundNoise, backgroundOpacity, textOverlays, imageOverlays, perspective3D, screenshot.radius]);

  return {
    isBatchExporting,
    batchProgress,
    exportAllSlides,
  };
}
