/**
 * API route for server-side image processing with Sharp
 * Handles format conversion (PNG/JPEG) and quality optimization
 */

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { QUALITY_PRESETS, type ExportApiRequest, type ExportApiResponse, type ExportFormat, type QualityPreset } from '@/lib/export/types';

function isValidFormat(format: string): format is ExportFormat {
  return format === 'png' || format === 'jpeg';
}

function isValidQualityPreset(preset: string): preset is QualityPreset {
  return preset === 'high' || preset === 'medium' || preset === 'low';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ExportApiRequest;
    const { imageData, format, qualityPreset } = body;

    // Validate required fields
    if (!imageData || typeof imageData !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid imageData' },
        { status: 400 }
      );
    }

    if (!format || !isValidFormat(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Must be "png" or "jpeg"' },
        { status: 400 }
      );
    }

    if (!qualityPreset || !isValidQualityPreset(qualityPreset)) {
      return NextResponse.json(
        { error: 'Invalid qualityPreset. Must be "high", "medium", or "low"' },
        { status: 400 }
      );
    }

    // Convert base64 to buffer
    const inputBuffer = Buffer.from(imageData, 'base64');
    const qualitySettings = QUALITY_PRESETS[qualityPreset];

    let sharpInstance = sharp(inputBuffer);
    let outputBuffer: Buffer;
    let mimeType: string;

    if (format === 'jpeg') {
      // Convert to JPEG with quality setting
      outputBuffer = await sharpInstance
        .jpeg({
          quality: qualitySettings.jpeg,
          mozjpeg: true, // Use mozjpeg for better compression
        })
        .toBuffer();
      mimeType = 'image/jpeg';
    } else {
      // PNG with compression level
      outputBuffer = await sharpInstance
        .png({
          compressionLevel: qualitySettings.pngCompression,
          adaptiveFiltering: true,
        })
        .toBuffer();
      mimeType = 'image/png';
    }

    // Convert output buffer to base64
    const outputBase64 = outputBuffer.toString('base64');

    const response: ExportApiResponse = {
      imageData: outputBase64,
      mimeType,
      fileSize: outputBuffer.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Export API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process image' },
      { status: 500 }
    );
  }
}
