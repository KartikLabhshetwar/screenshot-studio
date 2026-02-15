// Draft storage using IndexedDB for large data support

import { EditorState, ImageState, OmitFunctions } from './store';

const DB_NAME = 'screenshotstudio-db';
const DB_VERSION = 1;
const STORE_NAME = 'drafts';
const DRAFT_KEY = 'screenshotstudio-draft';

// Storage limits
const MAX_STORAGE_MB = 50; // Max storage in MB before cleanup
const MAX_STORAGE_BYTES = MAX_STORAGE_MB * 1024 * 1024;

export interface DraftStorage {
  id: string;
  editorState: OmitFunctions<EditorState>;
  imageState: OmitFunctions<ImageState>;
  timestamp: number;
}

// Helper to convert blob URL to base64
export const blobUrlToBase64 = async (blobUrl: string): Promise<string> => {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting blob URL to base64:', error);
    throw error;
  }
};

// Open IndexedDB connection
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Failed to open IndexedDB:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

// Save draft to IndexedDB
export async function saveDraft(
  editorState: OmitFunctions<EditorState>,
  imageState: OmitFunctions<ImageState>,
): Promise<void> {
  try {
    const db = await openDB();
    const draft: DraftStorage = {
      id: DRAFT_KEY,
      editorState,
      imageState,
      timestamp: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(draft);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        console.error('Failed to save draft to IndexedDB:', request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Failed to save draft:', error);
    // Silently fail - don't throw to prevent app crashes
  }
}

// Get draft from IndexedDB
export async function getDraft(): Promise<DraftStorage | null> {
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(DRAFT_KEY);

      request.onsuccess = () => {
        resolve(request.result as DraftStorage | null);
      };

      request.onerror = () => {
        console.error('Failed to get draft from IndexedDB:', request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Failed to get draft:', error);
    return null;
  }
}

// Delete draft from IndexedDB
export async function deleteDraft(): Promise<void> {
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(DRAFT_KEY);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        console.error('Failed to delete draft from IndexedDB:', request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Failed to delete draft:', error);
    // Don't throw - allow the operation to continue
  }
}

// Clear all data from IndexedDB (useful for debugging)
export async function clearAllDrafts(): Promise<void> {
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        console.error('Failed to clear drafts from IndexedDB:', request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Failed to clear drafts:', error);
  }
}

// Migrate from localStorage to IndexedDB (one-time migration)
export async function migrateFromLocalStorage(): Promise<void> {
  try {
    const oldData = localStorage.getItem('stage-draft');
    if (oldData) {
      const draft = JSON.parse(oldData) as DraftStorage;
      await saveDraft(draft.editorState, draft.imageState);
      localStorage.removeItem('stage-draft');
      console.log('Migrated draft from localStorage to IndexedDB');
    }
  } catch (error) {
    console.error('Failed to migrate from localStorage:', error);
    // Clear the old localStorage data to prevent future errors
    try {
      localStorage.removeItem('stage-draft');
    } catch {
      // Ignore
    }
  }
}

// Get current IndexedDB storage usage estimate
export async function getStorageUsage(): Promise<{ used: number; quota: number; percentage: number }> {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentage = quota > 0 ? Math.round((used / quota) * 100) : 0;
      return { used, quota, percentage };
    }
  } catch (error) {
    console.error('Failed to estimate storage:', error);
  }
  return { used: 0, quota: 0, percentage: 0 };
}

// Check if storage exceeds limit and needs cleanup
export async function checkStorageAndCleanup(): Promise<boolean> {
  try {
    const { used, percentage } = await getStorageUsage();

    // Clean up if storage exceeds limit or usage is above 80%
    if (used > MAX_STORAGE_BYTES || percentage > 80) {
      console.warn(`Storage limit reached (${Math.round(used / 1024 / 1024)}MB / ${MAX_STORAGE_MB}MB). Cleaning up...`);
      await clearAllDrafts();
      return true; // Cleanup performed
    }

    return false; // No cleanup needed
  } catch (error) {
    console.error('Failed to check storage:', error);
    return false;
  }
}

// Get size of stored draft in bytes
export async function getDraftSize(): Promise<number> {
  try {
    const draft = await getDraft();
    if (draft) {
      const jsonString = JSON.stringify(draft);
      return new Blob([jsonString]).size;
    }
  } catch (error) {
    console.error('Failed to get draft size:', error);
  }
  return 0;
}

// Format bytes to human readable string
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Storage info for debugging
export async function getStorageInfo(): Promise<{
  draftSize: string;
  totalUsed: string;
  quota: string;
  percentage: number;
}> {
  const [draftSize, storage] = await Promise.all([
    getDraftSize(),
    getStorageUsage(),
  ]);

  return {
    draftSize: formatBytes(draftSize),
    totalUsed: formatBytes(storage.used),
    quota: formatBytes(storage.quota),
    percentage: storage.percentage,
  };
}
