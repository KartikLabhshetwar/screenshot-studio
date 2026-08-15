// Draft storage using IndexedDB with connection pooling

import { EditorState, ImageState, OmitFunctions } from './store';

const DB_NAME = 'screenshotstudio-db';
const DB_VERSION = 1;
const STORE_NAME = 'drafts';
const DRAFT_KEY = 'screenshotstudio-draft';

// Auto cleanup configuration
const MAX_DRAFT_AGE_DAYS = 7;
const MAX_DRAFT_AGE_MS = MAX_DRAFT_AGE_DAYS * 24 * 60 * 60 * 1000;

export interface DraftStorage {
  id: string;
  editorState: OmitFunctions<EditorState>;
  imageState: OmitFunctions<ImageState>;
  timestamp: number;
}

/**
 * Outcome of a save attempt. Callers must not treat a failed save as a no-op —
 * the copy on disk is now older than the in-memory state.
 */
export type SaveDraftResult =
  | { ok: true }
  | { ok: false; reason: 'quota' | 'error'; error?: unknown };

function isQuotaExceeded(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === 'QuotaExceededError' ||
      // Firefox
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  );
}

// Helper to convert blob URL to base64
export const blobUrlToBase64 = async (blobUrl: string): Promise<string> => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// ── Connection Pool (singleton) ──────────────────────────────────────────────

let dbInstance: IDBDatabase | null = null;
let dbOpenPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  // Return existing connection if still open
  if (dbInstance) {
    try {
      // Test if the connection is still alive by starting a dummy transaction
      dbInstance.transaction([STORE_NAME], 'readonly');
      return Promise.resolve(dbInstance);
    } catch {
      // Connection was closed / invalidated — reopen
      dbInstance = null;
    }
  }

  // If already opening, wait for that promise
  if (dbOpenPromise) return dbOpenPromise;

  dbOpenPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      dbOpenPromise = null;
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;

      // Handle unexpected close (e.g. browser GC)
      dbInstance.onclose = () => {
        dbInstance = null;
        dbOpenPromise = null;
      };

      dbOpenPromise = null;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });

  return dbOpenPromise;
}

// ── CRUD Operations ──────────────────────────────────────────────────────────

export async function saveDraft(
  editorState: OmitFunctions<EditorState>,
  imageState: OmitFunctions<ImageState>,
): Promise<SaveDraftResult> {
  let db: IDBDatabase;
  try {
    db = await getDB();
  } catch (error) {
    return { ok: false, reason: 'error', error };
  }

  const draft: DraftStorage = {
    id: DRAFT_KEY,
    editorState,
    imageState,
    timestamp: Date.now(),
  };

  return new Promise<SaveDraftResult>((resolve) => {
    let settled = false;
    const finish = (result: SaveDraftResult) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    let tx: IDBTransaction;
    try {
      tx = db.transaction([STORE_NAME], 'readwrite');
    } catch (error) {
      finish({ ok: false, reason: 'error', error });
      return;
    }

    // Resolve on `complete`, not on the request's `success`: only a committed
    // transaction means the draft actually reached disk. Running out of quota
    // surfaces here as an abort rather than a thrown error.
    const fail = () =>
      finish({
        ok: false,
        reason: isQuotaExceeded(tx.error) ? 'quota' : 'error',
        error: tx.error,
      });

    tx.oncomplete = () => finish({ ok: true });
    tx.onabort = fail;
    tx.onerror = fail;

    try {
      tx.objectStore(STORE_NAME).put(draft);
    } catch (error) {
      finish({ ok: false, reason: 'error', error });
    }
  });
}

export async function getDraft(): Promise<DraftStorage | null> {
  try {
    const db = await getDB();

    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(DRAFT_KEY);

      request.onsuccess = () => resolve(request.result as DraftStorage | null);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
}

export async function deleteDraft(): Promise<void> {
  try {
    const db = await getDB();

    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(DRAFT_KEY);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    // Don't throw — allow the operation to continue
  }
}

export async function clearAllDrafts(): Promise<void> {
  try {
    const db = await getDB();

    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    // Silently fail
  }
}

// ── Migration ────────────────────────────────────────────────────────────────

export async function migrateFromLocalStorage(): Promise<void> {
  try {
    const oldData = localStorage.getItem('stage-draft');
    if (oldData) {
      const draft = JSON.parse(oldData) as DraftStorage;
      await saveDraft(draft.editorState, draft.imageState);
      localStorage.removeItem('stage-draft');
    }
  } catch {
    try { localStorage.removeItem('stage-draft'); } catch { /* ignore */ }
  }
}

// ── Storage Utilities ────────────────────────────────────────────────────────

export async function getStorageUsage(): Promise<{ used: number; quota: number; percentage: number }> {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentage = quota > 0 ? Math.round((used / quota) * 100) : 0;
      return { used, quota, percentage };
    }
  } catch { /* ignore */ }
  return { used: 0, quota: 0, percentage: 0 };
}

export async function getDraftSize(): Promise<number> {
  try {
    const draft = await getDraft();
    if (draft) {
      return new Blob([JSON.stringify(draft)]).size;
    }
  } catch { /* ignore */ }
  return 0;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

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

// ── Auto-Cleanup ─────────────────────────────────────────────────────────────

export async function autoCleanIndexedDB(): Promise<{
  cleaned: boolean;
  reason?: string;
}> {
  try {
    const draft = await getDraft();
    if (!draft) {
      return { cleaned: false };
    }

    // 1. Drop drafts the user has clearly abandoned.
    const draftAge = Date.now() - draft.timestamp;
    if (draftAge > MAX_DRAFT_AGE_MS) {
      await deleteDraft();
      return { cleaned: true, reason: 'Draft expired' };
    }

    // 2. Drop drafts that could not be restored anyway.
    if (!validateDraftIntegrity(draft)) {
      await deleteDraft();
      return { cleaned: true, reason: 'Corrupted data' };
    }

    // Deliberately no size-based cleanup here. This runs on the load path,
    // before the draft is restored, so discarding a *valid* draft for being
    // large destroys exactly the work of the users who load big images.
    // Being over quota is handled where it actually happens — the write in
    // saveDraft(), which reports a 'quota' failure instead of pre-guessing.
    return { cleaned: false };
  } catch (error) {
    // Never destroy the draft to recover from a transient read failure:
    // a read that fails now may well succeed on the next reload.
    console.warn('[draft] auto-clean skipped after error:', error);
    return { cleaned: false };
  }
}

function validateDraftIntegrity(draft: DraftStorage): boolean {
  try {
    if (!draft.id || !draft.timestamp) return false;
    if (!draft.editorState || !draft.imageState) return false;
    if (isNaN(draft.timestamp) || draft.timestamp < 0) return false;

    const imageUrl = draft.imageState.uploadedImageUrl;
    if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('data:')) {
      const parts = imageUrl.split(',');
      if (parts.length !== 2 || !parts[1] || parts[1].length === 0) return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function forceCleanAllIndexedDB(): Promise<void> {
  try {
    await clearAllDrafts();

    // Close pooled connection before deleting
    if (dbInstance) {
      dbInstance.close();
      dbInstance = null;
      dbOpenPromise = null;
    }

    return new Promise((resolve) => {
      const deleteRequest = indexedDB.deleteDatabase(DB_NAME);
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => resolve();
      deleteRequest.onblocked = () => resolve();
    });
  } catch {
    // ignore
  }
}
