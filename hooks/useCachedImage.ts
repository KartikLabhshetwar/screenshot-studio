import { useQuery } from '@tanstack/react-query';

/**
 * Hook to cache images in memory using TanStack Query.
 * Images are fetched once and stored as blob URLs for instant access.
 */
export function useCachedImage(imageUrl: string | null | undefined) {
  return useQuery({
    queryKey: ['image', imageUrl],
    queryFn: async () => {
      if (!imageUrl) return null;

      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    },
    enabled: !!imageUrl,
    // Images are static - cache for a long time
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

/**
 * Prefetch multiple images into the cache.
 * Useful for preloading thumbnails.
 */
export function usePrefetchImages(imageUrls: string[]) {
  // This hook doesn't return anything, it just triggers prefetching
  imageUrls.forEach((url) => {
    useCachedImage(url);
  });
}
