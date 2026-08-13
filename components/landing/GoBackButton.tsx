"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const PATH_KEY = "ss-path";
const PREV_PATH_KEY = "ss-prev-path";

/** Tracks the previous in-tab path so 404 Go back works (history.back is unreliable from root not-found). */
export function PathTracker(): null {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const current = `${pathname}${window.location.search}`;
      const previous = sessionStorage.getItem(PATH_KEY);
      if (previous && previous !== current) {
        sessionStorage.setItem(PREV_PATH_KEY, previous);
      }
      sessionStorage.setItem(PATH_KEY, current);
    } catch {
      // ignore quota / private mode
    }
  }, [pathname]);

  return null;
}

function getPreviousPath(): string | null {
  try {
    return sessionStorage.getItem(PREV_PATH_KEY);
  } catch {
    return null;
  }
}

export function GoBackButton(): React.JSX.Element {
  const handleClick = (): void => {
    const previous = getPreviousPath();
    const current = `${window.location.pathname}${window.location.search}`;

    if (previous && previous !== current) {
      window.location.assign(previous);
      return;
    }

    window.location.assign("/landing");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground active:scale-[0.99]"
    >
      Go back
    </button>
  );
}
