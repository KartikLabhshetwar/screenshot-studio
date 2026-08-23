/**
 * API route for server-side image compression with Sharp
 * Accepts FormData with raw image blob, returns optimized image blob.
 *
 * Sharp produces significantly smaller files than browser canvas.toBlob():
 * - JPEG: MozJPEG encoder (10-15% smaller than browser JPEG at same quality)
 * - WebP: libwebp encoder (better than browser WebP)
 * - PNG: zlib + adaptive filtering (optimal lossless compression)
 */

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { QUALITY_PRESETS, type ExportFormat, type QualityPreset } from '@/lib/export/types';
import { apiError, methodNotAllowed } from '@/lib/api/errors';

function isValidFormat(format: string): format is ExportFormat {
  return format === 'png' || format === 'jpeg' || format === 'webp';
}

function isValidQualityPreset(preset: string): preset is QualityPreset {
  return preset === 'high' || preset === 'medium' || preset === 'low';
}

export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return apiError(
      400,
      'invalid_request',
      'Request body must be multipart/form-data',
      'Send multipart/form-data with "image", "format", and "qualityPreset" parts.'
    );
  }

  try {
    const imageFile = formData.get('image') as File | null;
    const format = formData.get('format') as string | null;
    const qualityPreset = formData.get('qualityPreset') as string | null;

    if (!imageFile) {
      return apiError(
        400,
        'invalid_request',
        'Missing image file',
        'Send multipart/form-data with an "image" file part, for example -F "image=@shot.png".'
      );
    }

    if (!format || !isValidFormat(format)) {
      return apiError(
        400,
        'unsupported_value',
        'Invalid format. Must be "png", "jpeg", or "webp"',
        'Set the "format" form field to one of: png, jpeg, webp.'
      );
    }

    if (!qualityPreset || !isValidQualityPreset(qualityPreset)) {
      return apiError(
        400,
        'unsupported_value',
        'Invalid qualityPreset. Must be "high", "medium", or "low"',
        'Set the "qualityPreset" form field to one of: high, medium, low.'
      );
    }

    const inputBuffer = Buffer.from(await imageFile.arrayBuffer());
    const qualitySettings = QUALITY_PRESETS[qualityPreset];

    const sharpInstance = sharp(inputBuffer);
    let outputBuffer: Buffer;
    let mimeType: string;

    if (format === 'jpeg') {
      outputBuffer = await sharpInstance
        .flatten({ background: { r: 255, g: 255, b: 255 } }) // Flatten alpha to white (JPEG has no transparency)
        .jpeg({
          quality: qualitySettings.jpeg,
          mozjpeg: true, // MozJPEG produces ~10-15% smaller files than standard JPEG
        })
        .toBuffer();
      mimeType = 'image/jpeg';
    } else if (format === 'webp') {
      outputBuffer = await sharpInstance
        .webp({
          quality: qualitySettings.webp,
          effort: 4, // balanced speed vs compression (0=fastest, 6=slowest)
        })
        .toBuffer();
      mimeType = 'image/webp';
    } else {
      outputBuffer = await sharpInstance
        .png({
          compressionLevel: qualitySettings.pngCompression,
          adaptiveFiltering: true,
        })
        .toBuffer();
      mimeType = 'image/png';
    }

    return new NextResponse(new Uint8Array(outputBuffer), {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': outputBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Export API error:', error);
    return apiError(
      500,
      'internal_error',
      error instanceof Error ? error.message : 'Failed to process image',
      'Check that the uploaded file is a decodable PNG, JPEG, or WebP image, then retry.'
    );
  }
}

export async function GET() {
  return methodNotAllowed(['POST']);
}
