/**
 * R2 Background Assets Configuration
 *
 * These are the paths to background images stored in Cloudflare R2.
 * The paths are relative to the R2 bucket root.
 */

import { getR2PublicUrl } from './r2';

export interface BackgroundCategory {
  [category: string]: string[];
}

// Background image paths in R2 (with actual file extensions)
export const backgroundCategories: BackgroundCategory = {
  "assets": [
    "backgrounds/assets/asset-2.jpg",
    "backgrounds/assets/asset-12.jpg",
    "backgrounds/assets/asset-13.jpg",
    "backgrounds/assets/asset-18.jpg",
    "backgrounds/assets/asset-19.jpg",
    "backgrounds/assets/asset-25.jpg",
    "backgrounds/assets/asset-26.jpeg",
    "backgrounds/assets/asset-27.jpeg",
    "backgrounds/assets/asset-28.jpeg",
    "backgrounds/assets/asset-29.jpeg",
    "backgrounds/assets/asset-30.jpeg",
  ],
  "mac": [
    "backgrounds/mac/mac-asset-1.jpeg",
    "backgrounds/mac/mac-asset-2.jpg",
    "backgrounds/mac/mac-asset-3.jpg",
    "backgrounds/mac/mac-asset-4.jpg",
    "backgrounds/mac/mac-asset-5.jpg",
    "backgrounds/mac/mac-asset-6.jpeg",
    "backgrounds/mac/mac-asset-7.png",
    "backgrounds/mac/mac-asset-8.jpg",
    "backgrounds/mac/mac-asset-9.jpg",
    "backgrounds/mac/mac-asset-10.jpg",
  ],
  "radiant": [
    "backgrounds/radiant/radiant1.jpg",
    "backgrounds/radiant/radiant2.jpg",
    "backgrounds/radiant/radiant3.jpg",
    "backgrounds/radiant/radiant4.jpg",
    "backgrounds/radiant/radiant5.jpg",
    "backgrounds/radiant/radiant6.jpg",
    "backgrounds/radiant/radiant8.jpg",
    "backgrounds/radiant/radiant9.jpg",
    "backgrounds/radiant/radiant10.jpg",
  ],
  "mesh": [
    "backgrounds/mesh/mesh1.webp",
    "backgrounds/mesh/mesh2.webp",
    "backgrounds/mesh/mesh3.webp",
    "backgrounds/mesh/mesh4.webp",
    "backgrounds/mesh/mesh5.webp",
    "backgrounds/mesh/mesh6.webp",
    "backgrounds/mesh/mesh7.webp",
    "backgrounds/mesh/mesh8.webp",
    "backgrounds/mesh/Astra.webp",
    "backgrounds/mesh/Bliss.webp",
    "backgrounds/mesh/Burst.webp",
    "backgrounds/mesh/Dusk.webp",
    "backgrounds/mesh/Flash.webp",
    "backgrounds/mesh/Ghost.webp",
    "backgrounds/mesh/Helix.webp",
    "backgrounds/mesh/Horizon.webp",
    "backgrounds/mesh/Peak.webp",
  ],
  "demo": [
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
    "backgrounds/demo/demo-11.png",
    "backgrounds/demo/demo-12.png",
    "backgrounds/demo/demo-13.png",
    "backgrounds/demo/demo-14.png",
    "backgrounds/demo/demo-15.png",
  ],
  "silk": [
    "backgrounds/silk/amber.png",
    "backgrounds/silk/dark.png",
    "backgrounds/silk/monochrome.png",
    "backgrounds/silk/silver.png",
    "backgrounds/silk/sky.png",
  ],
  "paper": [
    "backgrounds/paper/01.webp",
    "backgrounds/paper/02.webp",
    "backgrounds/paper/03.webp",
    "backgrounds/paper/21.webp",
    "backgrounds/paper/26.webp",
    "backgrounds/paper/27.webp",
    "backgrounds/paper/31.webp",
    "backgrounds/paper/47.webp",
  ],
  "raycast": [
    "backgrounds/raycast/autumnal-peach.webp",
    "backgrounds/raycast/blob-red.webp",
    "backgrounds/raycast/blob.webp",
    "backgrounds/raycast/blossom-2.webp",
    "backgrounds/raycast/blue_distortion_1.webp",
    "backgrounds/raycast/blue_distortion_2.webp",
    "backgrounds/raycast/blushing-fire.webp",
    "backgrounds/raycast/bright-rain.webp",
    "backgrounds/raycast/chromatic_dark_1.webp",
    "backgrounds/raycast/chromatic_dark_2.webp",
    "backgrounds/raycast/chromatic_light_1.webp",
    "backgrounds/raycast/chromatic_light_2.webp",
    "backgrounds/raycast/cube_mono.webp",
    "backgrounds/raycast/cube_prod.webp",
    "backgrounds/raycast/floss.webp",
    "backgrounds/raycast/glass-rainbow.webp",
    "backgrounds/raycast/good-vibes.webp",
    "backgrounds/raycast/loupe-mono-light.webp",
    "backgrounds/raycast/loupe.webp",
    "backgrounds/raycast/mono_dark_distortion_1.webp",
    "backgrounds/raycast/mono_dark_distortion_2.webp",
    "backgrounds/raycast/mono_light_distortion_1.webp",
    "backgrounds/raycast/moonrise.webp",
    "backgrounds/raycast/red_distortion_2.webp",
    "backgrounds/raycast/red_distortion_4.webp",
    "backgrounds/raycast/rose-thorn.webp",
  ],
  "pattern": [
    "backgrounds/pattern/1.webp",
    "backgrounds/pattern/2.webp",
    "backgrounds/pattern/3.webp",
    "backgrounds/pattern/4.webp",
    "backgrounds/pattern/5.webp",
    "backgrounds/pattern/6.webp",
    "backgrounds/pattern/7.webp",
    "backgrounds/pattern/8.webp",
    "backgrounds/pattern/9.webp",
    "backgrounds/pattern/10.webp",
    "backgrounds/pattern/11.webp",
  ],
};

// Flatten all background paths for easy lookup
export const backgroundPaths: string[] = Object.values(backgroundCategories).flat();

// Background paths for auth pages
export const SIGN_IN_BACKGROUND_PATH = 'backgrounds/mac/mac-asset-7.png';
export const SIGN_UP_BACKGROUND_PATH = 'backgrounds/mac/mac-asset-2.jpg';

/**
 * Get full R2 URL for a background image
 */
export function getBackgroundUrl(path: string): string {
  return getR2PublicUrl(path);
}

/**
 * Get thumbnail URL for a background image
 * Note: R2 doesn't support on-the-fly image transformations.
 * Consider using Cloudflare Images or pre-generating thumbnails.
 */
export function getBackgroundThumbnailUrl(path: string): string {
  // For now, return the full image URL
  // TODO: Implement thumbnail support via Cloudflare Images or pre-generated thumbnails
  return getR2PublicUrl(path);
}

/**
 * Check if a path is a known background path
 */
export function isBackgroundPath(path: string): boolean {
  return backgroundPaths.includes(path);
}

/**
 * Get all backgrounds for a category
 */
export function getBackgroundsByCategory(category: string): string[] {
  return backgroundCategories[category] || [];
}

/**
 * Get all available categories
 */
export function getAvailableCategories(): string[] {
  return Object.keys(backgroundCategories);
}
