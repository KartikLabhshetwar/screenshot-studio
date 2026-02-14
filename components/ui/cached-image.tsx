'use client';

import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface CachedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * CachedImage component that uses TanStack Query for in-memory caching.
 * Images are fetched once and stored as blob URLs for instant re-renders.
 */
export function CachedImage({
  src,
  alt,
  className,
  loading = 'lazy',
  onLoad,
  onError,
}: CachedImageProps) {
  const { data: cachedSrc, isLoading, isError } = useQuery({
    queryKey: ['image', src],
    queryFn: async () => {
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    },
    enabled: !!src,
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  if (isLoading) {
    return (
      <div
        className={cn(
          'animate-pulse bg-surface-2',
          className
        )}
      />
    );
  }

  if (isError) {
    return (
      <div
        className={cn(
          'bg-surface-2 flex items-center justify-center text-text-tertiary text-xs',
          className
        )}
      >
        Failed
      </div>
    );
  }

  return (
    <img
      src={cachedSrc || src}
      alt={alt}
      className={className}
      loading={loading}
      onLoad={onLoad}
      onError={onError}
    />
  );
}
