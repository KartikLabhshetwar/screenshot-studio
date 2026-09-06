/**
 * Output filename helpers. Pure, no DOM, safe to unit test.
 */

import type { RasterFormat } from "./types";
import { extensionFor } from "./format";

/** Characters that break downloads or zip entries on common filesystems. */
const UNSAFE_CHARS = /[\\/:*?"<>|]/g;

export function sanitizeFilename(name: string): string {
  const cleaned = name
    .replace(UNSAFE_CHARS, "-")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length > 0 ? cleaned : "image";
}

/** "shot.final.png" -> "shot.final" */
export function baseName(name: string): string {
  const sanitized = sanitizeFilename(name);
  const dot = sanitized.lastIndexOf(".");
  // A leading dot is part of the name (".gitignore"), not an extension.
  return dot > 0 ? sanitized.slice(0, dot) : sanitized;
}

/** "shot.png" + "webp" -> "shot.webp" */
export function swapExtension(name: string, format: RasterFormat): string {
  return `${baseName(name)}.${extensionFor(format)}`;
}

/**
 * Builds the download name for a processed file, optionally tagged so the
 * result does not silently overwrite the original in the downloads folder.
 */
export function outputFilename(
  name: string,
  format: RasterFormat,
  suffix?: string
): string {
  const base = baseName(name);
  const tag = suffix ? `-${sanitizeFilename(suffix)}` : "";
  return `${base}${tag}.${extensionFor(format)}`;
}

/**
 * Returns a name not already in `taken`, appending " (2)", " (3)" and so on.
 * Zip entries with duplicate names silently overwrite each other, so batch
 * output has to be de-duplicated before it is zipped.
 */
export function uniqueFilename(name: string, taken: Set<string>): string {
  if (!taken.has(name)) return name;

  const dot = name.lastIndexOf(".");
  const stem = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";

  let counter = 2;
  let candidate = `${stem} (${counter})${ext}`;
  while (taken.has(candidate)) {
    counter += 1;
    candidate = `${stem} (${counter})${ext}`;
  }
  return candidate;
}

/** Name for the zip a batch run produces. */
export function batchArchiveName(toolSlug: string): string {
  return `screenshot-studio-${sanitizeFilename(toolSlug)}.zip`;
}
