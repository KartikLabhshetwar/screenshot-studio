"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { trackCTAClick } from "@/lib/analytics";

interface FinalCTAProps {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export function FinalCTA({
  title,
  description,
  ctaLabel,
  ctaHref,
}: FinalCTAProps) {
  return (
    <section className="py-16 sm:py-24 px-6 bg-background">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
          {title}
        </h2>
        <p className="text-muted-foreground mb-8">{description}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={ctaHref}
            onClick={() => trackCTAClick("final_cta", ctaLabel)}
          >
            <Button
              size="lg"
              className="text-base px-8 py-5 font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
            >
              {ctaLabel}
            </Button>
          </Link>
          <Link href="https://github.com/opennookorg/screenshot-studio" target="_blank">
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 py-5 font-medium rounded-lg"
            >
              View on GitHub
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-sm text-muted-foreground/60">
          Free forever · No signup required
        </p>
      </div>
    </section>
  );
}
