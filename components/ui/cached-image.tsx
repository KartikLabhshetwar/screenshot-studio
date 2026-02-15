'use client';

import { useState } from 'react';
import Image from 'next/image';
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
 * CachedImage component - uses Next.js Image for optimized loading and caching.
 * Handles external images with proper error states.
 */
export function CachedImage({
  src,
  alt,
  className,
  loading = 'lazy',
  onLoad,
  onError,
}: CachedImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
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
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 20vw, 10vw"
      className={cn('object-cover', className)}
      loading={loading}
      onLoad={onLoad}
      onError={() => {
        setHasError(true);
        onError?.();
      }}
    />
  );
}
