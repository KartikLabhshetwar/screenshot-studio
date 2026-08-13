"use client";

import { useEffect } from "react";
import Link from "next/link";

const INTER =
  'Inter, "Inter Fallback", Arial, Helvetica, sans-serif';

const primaryCtaClassName =
  "inline-flex h-10 cursor-pointer items-center justify-center rounded-md border-0 bg-[var(--nav-cta-bg)] px-5 text-sm font-medium text-[var(--nav-cta-fg)] shadow-none transition-[transform,box-shadow] duration-150 ease-out [text-shadow:var(--nav-cta-text-shadow)] hover:shadow-[var(--nav-cta-hover-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.97]";

const secondaryCtaClassName =
  "inline-flex h-10 cursor-pointer items-center justify-center rounded-md px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground active:scale-[0.99]";

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
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-col items-center text-center">
        <p
          className="landing-heading text-[72px] leading-none font-semibold tracking-[-0.04em] text-foreground sm:text-[96px]"
          style={{ fontFamily: INTER }}
        >
          500
        </p>

        <h1
          className="mt-5 text-[22px] font-semibold tracking-[-0.03em] text-foreground sm:text-[28px]"
          style={{ fontFamily: INTER }}
        >
          Something went wrong
        </h1>

        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground md:text-base">
          An unexpected error occurred while rendering this page. Try again, or
          open the editor to keep creating.
        </p>

        {error.digest ? (
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <button type="button" onClick={() => reset()} className={primaryCtaClassName}>
            Try again
          </button>
          <Link href="/" className={secondaryCtaClassName}>
            Open editor
          </Link>
          <Link href="/landing" className={secondaryCtaClassName}>
            Homepage
          </Link>
        </div>
      </main>
    </div>
  );
}
