/**
 * Cloudflare R2 Storage Utilities
 *
 * R2 is S3-compatible object storage. For serving static assets,
 * we use public bucket URLs. For uploads, we use the S3 SDK.
 */

// Environment variables for R2
// R2_PUBLIC_URL - The public URL for your R2 bucket (e.g., https://assets.yourdomain.com or https://pub-xxx.r2.dev)
// R2_ACCOUNT_ID - Your Cloudflare account ID (for S3 API access)
// R2_ACCESS_KEY_ID - R2 API token access key
// R2_SECRET_ACCESS_KEY - R2 API token secret key
// R2_BUCKET_NAME - Your R2 bucket name

/**
 * Map R2 paths to local public/ directory paths.
 * R2 uses paths like "backgrounds/mac/file.jpg" but local files are at "mac/file.jpg"
 */
function mapR2PathToLocal(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Map R2 paths to local public/ paths
  const mappings: Record<string, string> = {
    'backgrounds/': '',
    'overlays/shadow/': 'overlay-shadow/',
    'overlays/arrow/': 'overlay/',
  };
  
  for (const [r2Prefix, localPrefix] of Object.entries(mappings)) {
    if (cleanPath.startsWith(r2Prefix)) {
      return `/${localPrefix}${cleanPath.slice(r2Prefix.length)}`;
    }
  }
  
  // For paths that don't need mapping (e.g., "assets/...")
  return `/${cleanPath}`;
}

/**
 * Get the public URL for an R2 object.
 * Uses a same-origin proxy path (/r2-assets/...) to avoid CORS issues
 * during canvas capture (e.g. video export with domToCanvas).
 * The Next.js rewrite in next.config.ts proxies these to the actual R2 URL.
 *
 * If R2 is not configured, falls back to serving assets from local public/ directory.
 *
 * @param path - The object path/key in the bucket (e.g., "backgrounds/image.jpg")
 * @returns The proxied URL path or local public path
 */
export function getR2PublicUrl(path: string): string {
  const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

  if (!publicUrl) {
    // Fall back to local public/ directory with path mapping
    return mapR2PathToLocal(path);
  }

  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Use same-origin proxy to avoid CORS issues with canvas capture
  return `/r2-assets/${cleanPath}`;
}

/**
 * Get an optimized image URL from R2
 * Since R2 doesn't have built-in image transformations like Cloudinary,
 * we return the original image URL. For optimization, consider using
 * Cloudflare Images or a custom Worker with image resizing.
 *
 * @param options - Image options
 * @returns The image URL
 */
export function getR2ImageUrl(options: {
  src: string;
  width?: number;
  height?: number;
  quality?: number | 'auto';
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
}): string {
  const { src } = options;

  // If it's already a full URL, return as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // If it's a blob URL or data URL, return as-is
  if (src.startsWith('blob:') || src.startsWith('data:')) {
    return src;
  }

  // Otherwise, construct the R2 public URL
  return getR2PublicUrl(src);
}

/**
 * R2 configuration type
 */
export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
}

/**
 * Get R2 configuration from environment variables
 */
export function getR2Config(): R2Config {
  return {
    accountId: process.env.R2_ACCOUNT_ID || '',
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    bucketName: process.env.R2_BUCKET_NAME || '',
    publicUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '',
  };
}

/**
 * Check if R2 is properly configured
 */
export function isR2Configured(): boolean {
  return !!process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
}
