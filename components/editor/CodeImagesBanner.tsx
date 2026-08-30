"use client";

import * as React from "react";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowRight01Icon, Cancel01Icon, SourceCodeIcon } from "hugeicons-react";

const DISMISSED_KEY = "screenshotstudio-code-images-banner-dismissed";

export function CodeImagesBanner() {
  const isMobile = useIsMobile();
  const [isDismissed, setIsDismissed] = React.useState(true);

  React.useEffect(() => {
    setIsDismissed(localStorage.getItem(DISMISSED_KEY) === "true");
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setIsDismissed(true);
  };

  if (isMobile || isDismissed) return null;

  return (
    <div className="relative z-50 w-full border-b border-foreground/10 bg-card px-4 py-2">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="inline-flex h-6 items-center rounded-full bg-foreground px-2 text-[10px] font-semibold uppercase tracking-wide text-background">
            New
          </span>
          <SourceCodeIcon size={16} className="shrink-0 text-foreground" />
          <p className="truncate text-sm text-foreground">
            <span className="font-medium">Code Images</span>
            <span className="text-muted-foreground">
              {" "}turns any snippet into a beautiful shareable image with 14 themes and 150+ backgrounds.
            </span>
          </p>
          <Link
            href="/code"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            Try it
            <ArrowRight01Icon size={14} />
          </Link>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Cancel01Icon size={14} />
        </button>
      </div>
    </div>
  );
}
