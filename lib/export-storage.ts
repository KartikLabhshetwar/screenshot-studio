/**
 * Simple localStorage utility for export preferences
 */

import type { ExportFormat, QualityPreset } from './export/types';

const PREFS_KEY = 'screenshotstudio-export-preferences';

interface ExportPreferences {
  format: ExportFormat;
  qualityPreset: QualityPreset;
  scale: number;
}

/**
 * Save export preferences to localStorage
 */
export async function saveExportPreferences(prefs: ExportPreferences): Promise<void> {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch (error) {
    console.error('Failed to save export preferences:', error);
  }
}

/**
 * Get export preferences from localStorage
 */
export async function getExportPreferences(): Promise<ExportPreferences | null> {
  try {
    const data = localStorage.getItem(PREFS_KEY);
    if (!data) return null;
    return JSON.parse(data) as ExportPreferences;
  } catch (error) {
    console.error('Failed to get export preferences:', error);
    return null;
  }
}

/**
 * Save exported image - simplified to just return success
 * (No longer storing in IndexedDB, images are downloaded directly)
 */
export async function saveExportedImage(
  _blob: Blob,
  _format: ExportFormat,
  _qualityPreset: QualityPreset,
  _scale: number,
  _fileName: string
): Promise<string> {
  // No-op: we no longer store exports, just download directly
  return `export-${Date.now()}`;
}
