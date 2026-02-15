"use client";

import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
});

interface MarqueeProps {
  text?: string;
  className?: string;
}

export function Marquee({
  text = "From screenshot to showstopper.",
  className = "",
}: MarqueeProps) {
  // Create the repeated text content with decorative dots
  const repeatedContent = (
    <>
      <span className="whitespace-nowrap">{text}</span>
      <span className="mx-8 sm:mx-12 md:mx-16 text-brand" aria-hidden="true">
        •
      </span>
      <span className="whitespace-nowrap">{text}</span>
      <span className="mx-8 sm:mx-12 md:mx-16 text-brand" aria-hidden="true">
        •
      </span>
      <span className="whitespace-nowrap">{text}</span>
      <span className="mx-8 sm:mx-12 md:mx-16 text-brand" aria-hidden="true">
        •
      </span>
      <span className="whitespace-nowrap">{text}</span>
      <span className="mx-8 sm:mx-12 md:mx-16 text-brand" aria-hidden="true">
        •
      </span>
    </>
  );

  return (
    <section
      className={`py-12 sm:py-16 md:py-20 overflow-hidden bg-background ${className}`}
      aria-label="Marquee banner"
    >
      <div className="animate-marquee flex items-center">
        <div
          className={`flex items-center text-[48px] sm:text-[72px] md:text-[96px] lg:text-[120px] font-normal text-foreground ${instrumentSerif.className}`}
        >
          {repeatedContent}
          {/* Duplicate for seamless loop */}
          {repeatedContent}
        </div>
      </div>
    </section>
  );
}
