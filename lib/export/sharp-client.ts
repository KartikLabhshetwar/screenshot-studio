/**
 * Client helper for Sharp-based image processing via API route
 */

import type { ExportFormat, QualityPreset, ExportApiRequest, ExportApiResponse } from './types';

export interface SharpProcessingResult {
  blob: Blob;
  dataURL: string;
  fileSize: number;
}

/**
 * Process canvas data through Sharp API for format conversion and quality optimization
 *
 * @param canvas - The source canvas element
 * @param format - Target format ('png' or 'jpeg')
 * @param qualityPreset - Quality preset ('high', 'medium', 'low')
 * @returns Processed image as Blob and dataURL
 */
export async function processWithSharp(
  canvas: HTMLCanvasElement,
  format: ExportFormat,
  qualityPreset: QualityPreset
): Promise<SharpProcessingResult> {
  // Get canvas as PNG data URL (lossless input for maximum quality)
  const pngDataURL = canvas.toDataURL('image/png');

  // Extract base64 data without prefix
  const base64Data = pngDataURL.replace(/^data:image\/png;base64,/, '');

  const requestBody: ExportApiRequest = {
    imageData: base64Data,
    format,
    qualityPreset,
  };

  // Send to API for Sharp processing
  const response = await fetch('/api/export', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Export API failed with status ${response.status}`);
  }

  const data: ExportApiResponse = await response.json();

  // Convert base64 back to Blob
  const binaryString = atob(data.imageData);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: data.mimeType });

  // Create data URL from processed image
  const dataURL = `data:${data.mimeType};base64,${data.imageData}`;

  return {
    blob,
    dataURL,
    fileSize: data.fileSize,
  };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}
