"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
});

interface HeroProps {
  title: string;
  subtitle?: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function Hero({
  title,
  subtitle,
  description,
  ctaLabel = "Start Creating",
  ctaHref = "/home",
}: HeroProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoEmbedUrl = "https://www.youtube.com/embed/zDux_K4SsH0";
  const videoThumbnailUrl =
    "https://img.youtube.com/vi/zDux_K4SsH0/maxresdefault.jpg";

  return (
    <main
      className="flex-1 flex items-center justify-center px-6 py-20 sm:py-28 md:py-32 lg:py-40 bg-background relative overflow-hidden"
      role="banner"
    >
      {/* Subtle gradient orb for depth */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Headline - The star of the show */}
        <h1
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] ${instrumentSerif.className}`}
        >
          {title}
          {subtitle && (
            <>
              <br />
              <span className="text-primary">{subtitle}</span>
            </>
          )}
        </h1>

        {/* Single line description */}
        <p className="mt-6 sm:mt-8 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto">
          {description}
        </p>

        {/* Single prominent CTA */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={ctaHref}>
            <Button
              variant="integration"
              size="lg"
              className="text-base sm:text-lg px-8 py-6 min-h-[56px] font-medium"
            >
              {ctaLabel}
            </Button>
          </Link>
          <button
            onClick={() => setIsVideoOpen(true)}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-2 group"
            aria-label="Watch demo video"
          >
            <span className="w-8 h-8 rounded-full border border-current flex items-center justify-center group-hover:border-primary group-hover:text-primary transition-colors">
              <svg
                className="w-3 h-3 ml-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
              </svg>
            </span>
            <span className="group-hover:text-primary transition-colors">
              Watch demo
            </span>
          </button>
        </div>

        {/* Subtle trust line */}
        <p className="mt-6 text-xs text-muted-foreground/60">
          Free forever · No signup required
        </p>
      </div>

      {/* Video Dialog */}
      <HeroVideoDialog
        videoSrc={videoEmbedUrl}
        thumbnailSrc={videoThumbnailUrl}
        thumbnailAlt="Stage editor demo"
        open={isVideoOpen}
        onOpenChange={setIsVideoOpen}
        showThumbnail={false}
        animationStyle="from-center"
      />
    </main>
  );
}
