'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Images are static, cache for 1 hour in memory
            staleTime: 60 * 60 * 1000,
            // Keep in memory for 24 hours
            gcTime: 24 * 60 * 60 * 1000,
            // Don't refetch on window focus for images
            refetchOnWindowFocus: false,
            // Retry failed image loads 2 times
            retry: 2,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
