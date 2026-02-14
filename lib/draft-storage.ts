// Simplified draft storage using localStorage

import { EditorState, ImageState, OmitFunctions } from './store';

const DRAFT_KEY = 'stage-draft';

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

// Save draft to localStorage
export async function saveDraft(
  editorState: OmitFunctions<EditorState>,
  imageState: OmitFunctions<ImageState>,
): Promise<void> {
  try {
    const draft: DraftStorage = {
      id: 'draft',
      editorState,
      imageState,
      timestamp: Date.now(),
    };

    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (error) {
    console.error('Failed to save draft:', error);
    // If localStorage is full, try to clear old data
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded, clearing draft');
      localStorage.removeItem(DRAFT_KEY);
    }
    throw error;
  }
}

// Get draft from localStorage
export async function getDraft(): Promise<DraftStorage | null> {
  try {
    const data = localStorage.getItem(DRAFT_KEY);
    if (!data) return null;
    return JSON.parse(data) as DraftStorage;
  } catch (error) {
    console.error('Failed to get draft:', error);
    return null;
  }
}

// Delete draft from localStorage
export async function deleteDraft(): Promise<void> {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    console.error('Failed to delete draft:', error);
    throw error;
  }
}
