"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full bg-destructive/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-destructive/3 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-xl w-full text-center space-y-8">
        <div className="relative inline-block">
          <div className="w-48 h-32 mx-auto rounded-xl border-2 border-dashed border-destructive/30 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                className="text-destructive/40"
              >
                <path
                  d="M12 9v4m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2 border-destructive/50 rounded-tl-lg" />
            <div className="absolute -top-px -right-px w-3 h-3 border-t-2 border-r-2 border-destructive/50 rounded-tr-lg" />
            <div className="absolute -bottom-px -left-px w-3 h-3 border-b-2 border-l-2 border-destructive/50 rounded-bl-lg" />
            <div className="absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2 border-destructive/50 rounded-br-lg" />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-8xl font-bold tracking-tighter text-foreground">
            5<span className="text-destructive">0</span>0
          </p>
          <h1 className="text-xl font-medium text-foreground">
            Something went wrong
          </h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
            An unexpected error occurred while rendering this page. You can try
            again or head back to the editor.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground/60 font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-2.5 rounded-lg border border-border text-foreground text-sm hover:bg-muted transition-colors"
          >
            Open Editor
          </a>
          <a
            href="/landing"
            className="px-6 py-2.5 rounded-lg border border-border text-foreground text-sm hover:bg-muted transition-colors"
          >
            Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
