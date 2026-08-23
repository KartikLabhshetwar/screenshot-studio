"use client";

import { useEffect, useRef, useState } from "react";
import {
  useEditorStore,
  useImageStore,
  OmitFunctions,
  EditorState,
  ImageState,
} from "@/lib/store";
import { toast } from "sonner";
import {
  saveDraft,
  getDraft,
  blobUrlToBase64,
  deleteDraft,
  migrateFromLocalStorage,
  autoCleanIndexedDB,
} from "@/lib/draft-storage";

const AUTOSAVE_DELAY = 1000;

/**
 * Live session state. It is written to the draft so the persisted shape stays
 * complete, but always at its idle value — a restored draft should open with
 * nothing playing and no tool armed, whatever the user was doing when they left.
 */
const IDLE_SESSION_STATE = {
  isPreviewing: false,
  previewIndex: 0,
  previewStartedAt: null,
  activeAnnotationTool: null,
  selectedAnnotationId: null,
  showTemplates: false,
} satisfies Partial<OmitFunctions<ImageState>>;

/**
 * Blob URLs die with the page, so anything blob-backed must be inlined as a
 * data URL to survive a reload. Re-encoding a 4K image on every autosave tick
 * is far too slow, so conversions are cached by blob URL.
 */
const MAX_CACHED_BLOBS = 24;
const blobToDataUrlCache = new Map<string, string>();

async function toPersistableSrc(src: string): Promise<string> {
  if (!src.startsWith("blob:")) return src;

  const cached = blobToDataUrlCache.get(src);
  if (cached) return cached;

  const dataUrl = await blobUrlToBase64(src);
  if (blobToDataUrlCache.size >= MAX_CACHED_BLOBS) {
    const oldest = blobToDataUrlCache.keys().next().value;
    if (oldest !== undefined) blobToDataUrlCache.delete(oldest);
  }
  blobToDataUrlCache.set(src, dataUrl);
  return dataUrl;
}

/**
 * Derive the persisted image state from the store rather than listing fields by
 * hand. Hand-listing is what silently dropped annotations, blur regions, slides
 * and timeline data: anything a developer forgot to add was written as an empty
 * default. Deriving inverts that — new state is persisted unless explicitly
 * normalized above.
 */
function toPersistedImageState(state: ImageState): OmitFunctions<ImageState> {
  const persisted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(state)) {
    if (typeof value === "function") continue;
    persisted[key] = value;
  }

  return {
    ...(persisted as OmitFunctions<ImageState>),
    ...IDLE_SESSION_STATE,
    timeline: { ...state.timeline, isPlaying: false, playhead: 0 },
  };
}

/**
 * Long strings in the fingerprint are base64 image payloads; comparing them in
 * full would stringify tens of MB on every keystroke. Length plus a prefix is
 * enough to notice the image being swapped.
 */
function fingerprintReplacer(_key: string, value: unknown) {
  if (typeof value === "string" && value.length > 256) {
    return `${value.length}:${value.slice(0, 64)}`;
  }
  return value;
}

/** Drop undefined keys so an older draft falls back to store defaults instead of
 * overwriting them with undefined. */
function definedOnly<T extends object>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) out[key] = value;
  }
  return out as Partial<T>;
}

export function useAutosaveDraft() {
  const editorStore = useEditorStore();
  const imageStore = useImageStore();
  const saveTimeoutRef = useRef<NodeJS.Timeout>(null);
  const hasLoadedRef = useRef(false);
  const lastSnapshotRef = useRef<string>('');
  // Warn about a full quota once per session, not once per autosave tick.
  const hasWarnedQuotaRef = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load draft on mount
  useEffect(() => {
    const loadDraft = async () => {
      if (hasLoadedRef.current) return;

      try {
        // Migrate from localStorage to IndexedDB (one-time)
        await migrateFromLocalStorage();

        // Auto-clean IndexedDB on startup (removes old/corrupted data)
        const cleanResult = await autoCleanIndexedDB();
        if (cleanResult.cleaned) {
          console.warn('[draft] autoCleanIndexedDB wiped the draft:', cleanResult.reason);
        }

        const draft = await getDraft();
        if (!draft) {
          hasLoadedRef.current = true;
          return;
        }

        // Restore the whole image state in one shot. Restoring field-by-field
        // is what lost annotations, blur regions and slides: any field without
        // an explicit line here silently stayed at its default.
        const img = draft.imageState;
        if (img) {
          const { timeline, browserUrl, ...rest } = img;
          useImageStore.setState({
            ...definedOnly(rest),
            ...IDLE_SESSION_STATE,
            ...(timeline
              ? { timeline: { ...timeline, isPlaying: false, playhead: 0 } }
              : {}),
            // Drafts written before browserUrl existed fall back to the frame title.
            ...(browserUrl !== undefined
              ? { browserUrl }
              : img.imageBorder?.title
                ? { browserUrl: img.imageBorder.title }
                : {}),
          });
        }

        // Then restore editor state
        if (draft.editorState?.screenshot) {
          editorStore.setScreenshot(draft.editorState.screenshot);
        }
        if (draft.editorState?.background) {
          editorStore.setBackground(draft.editorState.background);
        }
        if (draft.editorState?.shadow) {
          editorStore.setShadow(draft.editorState.shadow);
        }
        if (draft.editorState?.pattern) {
          editorStore.setPattern(draft.editorState.pattern);
        }
        if (draft.editorState?.frame) {
          editorStore.setFrame(draft.editorState.frame);
        }
        if (draft.editorState?.canvas) {
          editorStore.setCanvas(draft.editorState.canvas);
        }
        if (draft.editorState?.noise) {
          editorStore.setNoise(draft.editorState.noise);
        }

        setLastSaved(new Date(draft.timestamp));
        hasLoadedRef.current = true;
      } catch (error) {
        console.error("Failed to load draft:", error);
        hasLoadedRef.current = true;
      }
    };

    loadDraft();
  }, [editorStore, imageStore]);

  // Auto-save on state changes
  useEffect(() => {
    if (!hasLoadedRef.current) {
      return;
    }

    const debouncedSave = async () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const {
            screenshot,
            background,
            shadow,
            pattern,
            frame,
            canvas,
            noise,
          } = editorStore;

          const persistedImage = toPersistedImageState(useImageStore.getState());

          // The dirty check covers everything that actually gets persisted, so
          // editing any feature — including ones added later — marks the draft
          // dirty. Previously it tracked a hand-picked subset, so changes to
          // untracked state were skipped as "nothing changed".
          const snapshot = JSON.stringify(
            {
              e: { screenshot, background, shadow, pattern, frame, canvas, noise },
              i: persistedImage,
            },
            fingerprintReplacer
          );

          if (snapshot === lastSnapshotRef.current) {
            return; // Nothing changed — skip save
          }

          setIsSaving(true);

          // Inline every blob-backed source as a data URL — blob: references are
          // dead on the next page load.
          const processedScreenshotSrc = screenshot.src
            ? await toPersistableSrc(screenshot.src)
            : screenshot.src;

          // Prefer the store's own value over the editor screenshot: with slides,
          // uploadedImageUrl tracks the *active* slide, so aliasing it to
          // screenshot.src would restore a deck pointing at the wrong image.
          const rawUploadedImageUrl =
            persistedImage.uploadedImageUrl ?? screenshot.src;
          const processedUploadedImageUrl = rawUploadedImageUrl
            ? await toPersistableSrc(rawUploadedImageUrl)
            : null;

          const processedBackgroundConfig = { ...persistedImage.backgroundConfig };
          if (
            processedBackgroundConfig.type === "image" &&
            typeof processedBackgroundConfig.value === "string"
          ) {
            processedBackgroundConfig.value = await toPersistableSrc(
              processedBackgroundConfig.value
            );
          }

          const processedImageOverlays = await Promise.all(
            persistedImage.imageOverlays.map(async (overlay) =>
              overlay.isCustom
                ? { ...overlay, src: await toPersistableSrc(overlay.src) }
                : overlay
            )
          );

          // Slides hold blob URLs created from the uploaded File objects. Without
          // this they restore as dead references and the deck renders empty —
          // which also silently removes batch export, since it needs 2+ slides.
          const processedSlides = await Promise.all(
            persistedImage.slides.map(async (slide) => ({
              ...slide,
              src: await toPersistableSrc(slide.src),
            }))
          );

          const editorState: OmitFunctions<EditorState> = {
            screenshot: {
              ...screenshot,
              src: processedScreenshotSrc,
            },
            background,
            shadow,
            pattern,
            frame,
            canvas,
            noise,
          };

          // Spread the derived state, then override only the fields whose blob
          // sources had to be inlined above.
          const imageState: OmitFunctions<ImageState> = {
            ...persistedImage,
            uploadedImageUrl: processedUploadedImageUrl,
            backgroundConfig: processedBackgroundConfig,
            imageOverlays: processedImageOverlays,
            slides: processedSlides,
          };

          const result = await saveDraft(editorState, imageState);

          if (!result.ok) {
            // Leave lastSnapshotRef untouched so the next change retries this
            // save instead of treating the failed write as already persisted.
            console.warn("[draft] autosave failed:", result.reason, result.error);
            if (result.reason === "quota" && !hasWarnedQuotaRef.current) {
              hasWarnedQuotaRef.current = true;
              toast.error("Couldn't save your draft", {
                description:
                  "Browser storage is full. Export your work — recent changes may not survive a reload.",
                duration: 10000,
              });
            }
            return;
          }

          lastSnapshotRef.current = snapshot;
          setLastSaved(new Date());
        } catch (error) {
          console.warn("[draft] autosave threw:", error);
        } finally {
          setIsSaving(false);
        }
      }, AUTOSAVE_DELAY);
    };

    debouncedSave();

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  // Both stores are consumed without a selector, so their identity changes on
  // any state update — that is enough to re-run this effect for every field.
  // The previous hand-listed dependency array had the same drift problem as the
  // hand-listed snapshot: new state was simply not watched.
  }, [editorStore, imageStore]);

  // Warn before closing if saving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isSaving) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isSaving]);

  const clearDraft = async () => {
    try {
      await deleteDraft();
      imageStore.resetSlideshow();
      // Clear all stores
      editorStore.setScreenshot({
        src: null,
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        radius: 10,
      });

      imageStore.clearImage();
      imageStore.clearTextOverlays();
      imageStore.clearImageOverlays();
      imageStore.clearMockups();

      setLastSaved(null);
    } catch (error) {
      console.error("Failed to clear draft:", error);
      throw error;
    }
  };

  return { isSaving, lastSaved, clearDraft };
}
