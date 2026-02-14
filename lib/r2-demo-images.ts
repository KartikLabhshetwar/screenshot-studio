/**
 * R2 Demo Images Configuration
 *
 * These are the paths to demo images stored in Cloudflare R2.
 */

import { getR2PublicUrl } from './r2';

export const demoImagePaths: string[] = [
  "backgrounds/demo/demo-1.png",
  "backgrounds/demo/demo-2.png",
  "backgrounds/demo/demo-3.png",
  "backgrounds/demo/demo-4.png",
  "backgrounds/demo/demo-5.png",
  "backgrounds/demo/demo-6.png",
  "backgrounds/demo/demo-7.png",
  "backgrounds/demo/demo-8.png",
  "backgrounds/demo/demo-9.png",
  "backgrounds/demo/demo-10.png",
];

/**
 * Get full R2 URL for a demo image
 */
export function getDemoImageUrl(path: string): string {
  return getR2PublicUrl(path);
}
