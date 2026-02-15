/**
 * Simple localStorage utility for storing small image blobs as base64
 * For larger images, the blob URL will be used directly (not persisted across sessions)
 */

const STORAGE_KEY_PREFIX = 'screenshotstudio-img-';
const MAX_IMAGE_SIZE = 500 * 1024; // 500KB limit per image to avoid quota issues

/**
 * Convert blob to base64 string
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Save an image blob to localStorage (if small enough)
 * Returns the imageId for retrieval
 */
export async function saveImageBlob(
  blob: Blob,
  imageId: string
): Promise<string> {
  // Only persist small images to avoid localStorage quota issues
  if (blob.size > MAX_IMAGE_SIZE) {
    console.warn(`Image ${imageId} too large for localStorage (${blob.size} bytes), skipping persistence`);
    return imageId;
  }

  try {
    const base64 = await blobToBase64(blob);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${imageId}`, base64);
    return imageId;
  } catch (error) {
    console.warn('Failed to save image to localStorage:', error);
    return imageId;
  }
}

/**
 * Retrieve an image blob from localStorage
 */
export async function getImageBlob(imageId: string): Promise<Blob | null> {
  try {
    const base64 = localStorage.getItem(`${STORAGE_KEY_PREFIX}${imageId}`);
    if (!base64) return null;

    // Convert base64 back to blob
    const response = await fetch(base64);
    return response.blob();
  } catch (error) {
    console.warn('Failed to get image from localStorage:', error);
    return null;
  }
}

/**
 * Delete an image blob from localStorage
 */
export async function deleteImageBlob(imageId: string): Promise<void> {
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${imageId}`);
  } catch (error) {
    console.warn('Failed to delete image from localStorage:', error);
  }
}

/**
 * Check if an image exists in localStorage
 */
export async function hasImageBlob(imageId: string): Promise<boolean> {
  return localStorage.getItem(`${STORAGE_KEY_PREFIX}${imageId}`) !== null;
}

/**
 * Generate a blob URL from a stored image ID
 */
export async function getBlobUrlFromStored(
  imageId: string
): Promise<string | null> {
  const blob = await getImageBlob(imageId);
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

/**
 * Get all stored image IDs
 */
export async function getAllImageIds(): Promise<string[]> {
  const ids: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_KEY_PREFIX)) {
      ids.push(key.replace(STORAGE_KEY_PREFIX, ''));
    }
  }
  return ids;
}
