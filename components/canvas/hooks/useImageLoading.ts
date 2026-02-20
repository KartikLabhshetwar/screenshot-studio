import { useState, useEffect } from 'react';
import { getR2ImageUrl } from '@/lib/r2';
import { isOverlayPath } from '@/lib/r2-overlays';
import { backgroundPaths } from '@/lib/r2-backgrounds';
import type { BackgroundConfig } from '@/lib/constants/backgrounds';
import type { ImageOverlay } from '@/lib/store';

const MAX_RETRIES = 2;
const RETRY_DELAY = 800; // ms

function loadImageWithRetry(
  url: string,
  retries: number = 0,
  signal?: AbortSignal
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      if (signal?.aborted) {
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }
      if (retries < MAX_RETRIES) {
        // Retry with cache-busting param to bypass cached 404 responses
        setTimeout(() => {
          const bustUrl = url.includes('?')
            ? `${url}&_r=${Date.now()}`
            : `${url}?_r=${Date.now()}`;
          loadImageWithRetry(bustUrl, retries + 1, signal)
            .then(resolve)
            .catch(reject);
        }, RETRY_DELAY);
      } else {
        reject(new Error(`Failed to load image after ${MAX_RETRIES + 1} attempts: ${url}`));
      }
    };
    img.src = url;
  });
}

export function useBackgroundImage(
  backgroundConfig: BackgroundConfig,
  containerWidth: number,
  containerHeight: number
) {
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    if (backgroundConfig.type === 'image' && backgroundConfig.value) {
      const imageValue = backgroundConfig.value as string;

      const isValidImageValue =
        imageValue.startsWith('http') ||
        imageValue.startsWith('blob:') ||
        imageValue.startsWith('data:') ||
        (typeof imageValue === 'string' && !imageValue.includes('_gradient'));

      if (!isValidImageValue) {
        setBgImage(null);
        return;
      }

      let imageUrl = imageValue;
      if (
        typeof imageUrl === 'string' &&
        !imageUrl.startsWith('http') &&
        !imageUrl.startsWith('blob:') &&
        !imageUrl.startsWith('data:')
      ) {
        if (backgroundPaths.includes(imageUrl)) {
          imageUrl = getR2ImageUrl({ src: imageUrl });
        } else {
          setBgImage(null);
          return;
        }
      }

      // Determine if this is an R2 asset (eligible for retry on 404)
      const isR2Asset = imageUrl.startsWith('/r2-assets/');

      if (isR2Asset) {
        loadImageWithRetry(imageUrl, 0, abortController.signal)
          .then((img) => {
            if (!abortController.signal.aborted) setBgImage(img);
          })
          .catch((err) => {
            if (err.name !== 'AbortError') {
              console.error('Failed to load background image:', backgroundConfig.value);
              setBgImage(null);
            }
          });
      } else {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          if (!abortController.signal.aborted) setBgImage(img);
        };
        img.onerror = () => {
          console.error('Failed to load background image:', backgroundConfig.value);
          setBgImage(null);
        };
        img.src = imageUrl;
      }
    } else {
      setBgImage(null);
    }

    return () => {
      abortController.abort();
    };
  }, [backgroundConfig, containerWidth, containerHeight]);

  return bgImage;
}

export function useOverlayImages(imageOverlays: ImageOverlay[]) {
  const [loadedOverlayImages, setLoadedOverlayImages] = useState<
    Record<string, HTMLImageElement>
  >({});

  useEffect(() => {
    // Create AbortController for cleanup
    const abortController = new AbortController();

    const loadOverlays = async () => {
      const visibleOverlays = imageOverlays.filter(overlay => overlay.isVisible);

      if (visibleOverlays.length === 0) {
        setLoadedOverlayImages({});
        return;
      }

      // Create loading promises for all overlays in parallel
      const loadPromises = visibleOverlays.map(overlay => {
        return new Promise<{ id: string; img: HTMLImageElement } | null>((resolve) => {
          // Check if aborted before starting
          if (abortController.signal.aborted) {
            resolve(null);
            return;
          }

          const isR2Overlay =
            isOverlayPath(overlay.src) ||
            (typeof overlay.src === 'string' &&
              overlay.src.startsWith('overlays/'));

          const imageUrl =
            isR2Overlay && !overlay.isCustom
              ? getR2ImageUrl({ src: overlay.src })
              : overlay.src;

          const isR2Asset = imageUrl.startsWith('/r2-assets/');

          if (isR2Asset) {
            loadImageWithRetry(imageUrl, 0, abortController.signal)
              .then((img) => {
                if (!abortController.signal.aborted) {
                  resolve({ id: overlay.id, img });
                } else {
                  resolve(null);
                }
              })
              .catch((err) => {
                if (err.name !== 'AbortError') {
                  console.error(`Failed to load overlay image for ${overlay.id}`);
                }
                resolve(null);
              });
            return;
          }

          const img = new window.Image();
          img.crossOrigin = 'anonymous';

          img.onload = () => {
            if (!abortController.signal.aborted) {
              resolve({ id: overlay.id, img });
            } else {
              resolve(null);
            }
          };

          img.onerror = () => {
            console.error(`Failed to load overlay image for ${overlay.id}`);
            resolve(null);
          };

          img.src = imageUrl;
        });
      });

      // Load all overlays in parallel
      const results = await Promise.allSettled(loadPromises);

      // Check if still mounted (not aborted)
      if (abortController.signal.aborted) {
        return;
      }

      // Collect successful loads
      const loadedImages: Record<string, HTMLImageElement> = {};
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
          loadedImages[result.value.id] = result.value.img;
        }
      }

      setLoadedOverlayImages(loadedImages);
    };

    loadOverlays();

    // Cleanup: abort ongoing loads when dependencies change
    return () => {
      abortController.abort();
    };
  }, [imageOverlays]);

  return loadedOverlayImages;
}
