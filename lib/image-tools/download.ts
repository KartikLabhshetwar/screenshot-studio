/**
 * Download helpers for tool output: a single file, or a whole batch as a zip.
 *
 * JSZip is imported lazily so the 100KB library only loads when someone
 * actually downloads a batch.
 */

import { batchArchiveName, uniqueFilename } from "./filename";

export interface DownloadableFile {
  name: string;
  blob: Blob;
}

/** Triggers a browser download for one blob. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoking immediately can cancel the download in Safari.
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

/** Zips the given files and downloads the archive. */
export async function downloadAsZip(
  files: DownloadableFile[],
  toolSlug: string
): Promise<void> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();

  // Two source files can share a name, and duplicate zip entries overwrite
  // each other silently, so names are de-duplicated on the way in.
  const taken = new Set<string>();
  for (const file of files) {
    const name = uniqueFilename(file.name, taken);
    taken.add(name);
    zip.file(name, file.blob);
  }

  const archive = await zip.generateAsync({ type: "blob" });
  downloadBlob(archive, batchArchiveName(toolSlug));
}

/**
 * Downloads one file directly, or the whole set as a zip. Matches what people
 * expect from a batch tool: one in, one out; many in, one archive out.
 */
export async function downloadResults(
  files: DownloadableFile[],
  toolSlug: string
): Promise<void> {
  if (files.length === 0) return;
  if (files.length === 1) {
    downloadBlob(files[0].blob, files[0].name);
    return;
  }
  await downloadAsZip(files, toolSlug);
}
